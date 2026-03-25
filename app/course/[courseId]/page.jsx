"use client"
import React , {useEffect, useState} from 'react'
import AppHeader from '@/app/workspace/_components/AppHeader'
import ChapterListSidebar from '../_components/ChapterListSidebar'
import ChapterContent from '../_components/ChapterContent'
import {useParams} from 'next/navigation'
import axios from 'axios';

function Course() {
const {courseId}= useParams();

const [courseInfo, setCourseInfo] = useState();

  useEffect(() => {
    GetEnrolledCourseById();
  }, []);

  const GetEnrolledCourseById = async () => {
    const result = await axios.get('/api/enroll-course?courseId=' + courseId);
    console.log(result);
    setCourseInfo(result.data);
  }
  return (
    <div>
      <AppHeader hideSidebar={true} />
      <div className='flex gap-10 h-[calc(100vh-64px)]'> {/* 64px is example header height */}
        <ChapterListSidebar courseInfo={courseInfo} />
        <div className="flex-1 overflow-y-auto">
          <ChapterContent courseInfo={courseInfo} refreshData={()=>GetEnrolledCourseById()} />
        </div>
      </div>
    </div>
  )
}

export default Course
