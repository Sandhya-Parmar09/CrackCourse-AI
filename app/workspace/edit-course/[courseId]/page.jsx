"use client"
import React from 'react'
import {useParams} from "next/navigation";
import axios from "axios"
import {useState,useEffect} from 'react';
import CourseInfo from "@/app/workspace/edit-course/_components/CourseInfo";
import ChapterTopicList from "@/app/workspace/edit-course/_components/ChapterTopicList";

function EditCourse({viewCourse=false}) {

    const {courseId} = useParams();
    const [loading,setLoading]= useState(false);
    const [course, setCourse] = useState(null);

useEffect(()=>{
GetCourseInfo();
}
,[])

    const GetCourseInfo = async() => {
        setLoading(true);
const result =  await axios.get('/api/courses?courseId='+courseId);
    setLoading(false);
console.log(result.data);
setCourse(result.data);
    } 
  return (
    <div>
        <CourseInfo course={course} viewCourse={viewCourse} />
         <ChapterTopicList course={course} viewCourse={viewCourse}  />
    </div>
  )
}

export default EditCourse
