import {NextResponse} from "next/server";
import axios from "axios";
import { coursesTable } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";
import { ai } from "@/lib/ai";



const PROMPT=`Depends on Chapter name and Topic Generate content for each topic in HTML and give response in JSON format.
Return ONLY valid JSON. Do not include markdown, code fences, comments, or extra text.
Schema:{
    chapterName:<>,
    {
    topic:<>,
    content:<>
    }
}

User Input:`

const parseModelJson = (rawText) => {
  if (!rawText) {
    throw new Error('Empty model response');
  }

  const cleaned = rawText
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    // Fallback: extract the largest JSON object from mixed/plain text responses.
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No valid JSON object found in model response');
    }

    const jsonSlice = cleaned.slice(start, end + 1);
    return JSON.parse(jsonSlice);
  }
};


const GetYoutubeVideo1 = async (topic) => {
  const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
  const youtubeVideoList = [];

  let nextPageToken = "";
  let done = false;

  while (!done) {
    const params = {
      channelId: 'UCI5p4SKQ5Hh6v9UwMh86s2Q',
      part: 'snippet',
      type: 'video',
      key: process.env.YOUTUBE_API_KEY,
      q: topic,
      maxResults: 50,
      pageToken: nextPageToken
    };

    const resp = await axios.get(YOUTUBE_BASE_URL, { params });
    const items = resp.data.items;

    items.forEach(item => {
      const title = item.snippet?.title?.toLowerCase();
      const videoId = item.id?.videoId;

      if (title && videoId && title.includes(topic.toLowerCase())) {
        youtubeVideoList.push({
          videoId: videoId,
          title: item.snippet?.title
        });
      }
    });

    nextPageToken = resp.data.nextPageToken || null;
    if (!nextPageToken) done = true;
  }

  console.log("youtubeVideoList", youtubeVideoList);
  return youtubeVideoList;
};




const GetYoutubeVideo = async (topic) => {
  const params = {
    part:'snippet',
    type: 'video',
    key: process.env.YOUTUBE_API_KEY,
    q: topic,
    maxResults:4
  };
  const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";
  const resp = await axios.get(YOUTUBE_BASE_URL, { params });
  const youtubeVideoListResp = resp.data.items;

  const youtubeVideoList = [];
  youtubeVideoListResp.forEach(item => {
    const data = {
      videoId: item.id?.videoId,
      title: item.snippet?.title
    };
    youtubeVideoList.push(data);
  });

  console.log("youtubeVideoList", youtubeVideoList);
  return youtubeVideoList;
};


export async function POST(req){
  const {courseJson,courseTitle,courseId}=await req.json();

  const promises = courseJson?.chapters?.map(async (chapter) => {
    try {
      const config = {
        responseMimeType: 'text/plain',
      };
      // const model = 'gemini-2.0-flash';
      const model = 'gemma-3-27b-it';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: PROMPT + JSON.stringify(chapter),
            },
          ],
        },
      ];

      const response = await ai.models.generateContent({
        model,
        config,
        contents,
      });

      const RawResp = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const JSONResp = parseModelJson(RawResp);

      //Get Youtube Videos
      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
      console.log({
        youtubeVideo: youtubeData,
        courseData: JSONResp
      });
      return {
        youtubeVideo: youtubeData,
        courseData: JSONResp
      };
    } catch (error) {
      console.error('Chapter content generation failed:', chapter?.chapterName, error);

      const youtubeData = await GetYoutubeVideo(chapter?.chapterName);
      const fallbackTopics = (chapter?.topics || []).map((topic) => ({
        topic,
        content: '<p>Content temporarily unavailable for this topic.</p>'
      }));

      return {
        youtubeVideo: youtubeData,
        courseData: {
          chapterName: chapter?.chapterName,
          topics: fallbackTopics,
        }
      };
    }
  });

  const CourseContent = await Promise.all(promises);

  //save to DB
  const dbResp = await db.update(coursesTable).set({
    courseContent: CourseContent
  }).where(eq(coursesTable.cid, courseId));

  return NextResponse.json({
    courseName: courseTitle,
    CourseContent: CourseContent
  });
}


