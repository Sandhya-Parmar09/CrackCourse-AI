import {auth, currentUser } from '@clerk/nextjs/server';
// import {
//   GoogleGenAI,
// } from '@google/genai';
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { ai } from "@/lib/ai";
import { v2 as cloudinary } from 'cloudinary';



const PROMPT=`Generate Learning Course depends on following details. In which make sure to add Course Name, Description, Chapter Name, Image Prompt (Create a modern, flat-style 2D digital illustration representing user Topic. Include UI/UX elements such as mockup screens, text blocks, icons, buttons, and creative workspace tools. Add symbolic elements related to user Course, like sticky notes, design components, and visual aids. Use a vibrant color palette (blues, purples, oranges) with a clean, professional look. The illustration should feel creative, tech-savvy, and educational, ideal for visualizing concepts in user Course) for Course Banner in 3D format, Topic under each chapters, Duration for each chapters etc, in JSON format only


Schema:

{
  "course": {
    "name": "string",
    "description": "string",
"category": "string",
"level": "string",
    "includeVideo": "boolean",
    "noOfChapters": "number",
    "bannerImagePrompt": "string",
    "chapters": [
      {
        "chapterName": "string",
        "duration": "string",
        "topics": [
          "string"
        ],
        "imagePrompt": "string"
      }
    ]
  }
}
  
User Input: ` 

const FREEPIK_BASE_URL = 'https://api.freepik.com/v1/ai/mystic';
const DEFAULT_IMAGE_PROMPT = 'Modern educational course banner, clean and professional';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getCloudinaryUploadSource = (imageValue) => {
  if (!imageValue) return null;

  if (typeof imageValue !== 'string') return null;
  if (imageValue.startsWith('data:image')) return imageValue;
  if (imageValue.startsWith('http://') || imageValue.startsWith('https://')) return imageValue;

  // API can return raw base64. Convert to data-uri before uploading.
  return `data:image/png;base64,${imageValue}`;
};

const uploadToCloudinary = async (imageValue) => {
  const uploadSource = getCloudinaryUploadSource(imageValue);
  if (!uploadSource) return null;

  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.log('Cloudinary env vars missing. Skipping upload.');
    return null;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(uploadSource, {
      folder: 'crackcourse/banners',
      resource_type: 'image',
    });
    return uploadResponse?.secure_url || null;
  } catch (error) {
    console.log('Cloudinary upload failed:', error?.message);
    return null;
  }
};

  // export const ai = new GoogleGenAI({
  //   apiKey: process.env.GEMINI_API_KEY,
  // });
  
export async function POST(req){
    const {courseId, ...formData }= await req.json();
    const user = await currentUser();

//  const { has } = await auth()

  // const hasStarterAccess = has({ plan: 'starter' })


  // if(!hasStarterAccess){
  //   const result=await db.select().from(coursesTable)
  //   .where(eq(coursesTable.userEmail,user?.primaryEmailAddress.emailAddress));
  //   if(result?.length>=2){
  //     return NextResponse.json({'resp': 'limit exceed'});
  //   }
  // }


   


 
    // To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node



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
          text: PROMPT + JSON.stringify(formData),
        },
      ],
    },
  ];

  const response = await ai.models.generateContent({
    model,
    config,
    contents,
  });
 
  console.log(response.candidates[0].content.parts[0].text);
const RawResp = response.candidates[0].content.parts[0].text;
const RawJson = RawResp.replace('```json','').replace('```', '');
const JSONResp = JSON.parse(RawJson);


//generate Images
const ImagePrompt=JSONResp.course?.bannerImagePrompt;
const bannerImageURL= await GenerateImage(ImagePrompt);


  // Save to Database
  const result = await db.insert(coursesTable).values({
    ...formData,
    courseJson: JSONResp,
    userEmail: user?.primaryEmailAddress?.emailAddress,
    cid:courseId,
    bannerImageURL: bannerImageURL
  });
 
  return NextResponse.json({ courseId: courseId });
}


const GenerateImage=async(imagePrompt)=>{
const fallbackImage = '/online_education.png';
const freepikApiKey = process?.env?.FREEPIK_API_KEY;

if (!freepikApiKey) {
  console.log('FREEPIK_API_KEY missing. Falling back to local banner.');
  return fallbackImage;
}

try {
  // AI Guru Lab flow intentionally disabled. Using Freepik only.
  const createResponse = await fetch(FREEPIK_BASE_URL, {
    method: 'POST',
    headers: {
      'x-freepik-api-key': freepikApiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: imagePrompt || DEFAULT_IMAGE_PROMPT,
      resolution: '2k',
      aspect_ratio: 'square_1_1',
      model: 'realism',
      creative_detailing: 33,
      engine: 'automatic',
      fixed_generation: false,
      filter_nsfw: true,
    }),
  });

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    console.log('Freepik create task failed:', errorText);
    return fallbackImage;
  }

  const createData = await createResponse.json();
  const taskId = createData?.data?.task_id;
  if (!taskId) {
    console.log('Freepik task_id missing:', createData);
    return fallbackImage;
  }

  const maxAttempts = 20;
  const pollIntervalMs = 2500;

  for (let i = 0; i < maxAttempts; i++) {
    const statusResponse = await fetch(`${FREEPIK_BASE_URL}/${taskId}`, {
      method: 'GET',
      headers: {
        'x-freepik-api-key': freepikApiKey,
      },
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      console.log('Freepik status check failed:', errorText);
      return fallbackImage;
    }

    const statusData = await statusResponse.json();
    const status = statusData?.data?.status;
    const generatedImage = statusData?.data?.generated?.[0];

    if (status === 'COMPLETED' && generatedImage) {
      const cloudinaryImage = await uploadToCloudinary(generatedImage);
      if (cloudinaryImage) {
        return cloudinaryImage;
      }
      return generatedImage;
    }

    if (status === 'FAILED' || status === 'CANCELED') {
      console.log('Freepik task failed:', statusData);
      return fallbackImage;
    }

    await sleep(pollIntervalMs);
  }

  console.log('Freepik task timed out');
  return fallbackImage;
} catch (error) {
  console.log('Freepik image generation error:', error?.message);
  return fallbackImage;
}
}









 