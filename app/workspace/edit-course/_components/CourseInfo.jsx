import React, { useEffect, useState } from 'react'
import { Clock, Book, TrendingUp, Settings,Loader2Icon ,PlayCircle} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import axios from "axios"
import {useRouter} from "next/navigation";
import { toast } from "sonner"
import Link from "next/link"


function CourseInfo({ course,viewCourse }) {
  const courseLayout = course?.courseJson?.course;
  const [loading, setLoading] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => {
    const url = course?.bannerImageURL;
    if (!url) {
      return '/online_education.png';
    }
    return url;
  });

  useEffect(() => {
    const url = course?.bannerImageURL;
    setImageSrc(url || '/online_education.png');
  }, [course?.bannerImageURL]);

const router=useRouter();

  const GenerateCourseContent = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/generate-course-content', {
        courseJson: courseLayout,
        courseTitle: course?.name,
        courseId: course?.cid,
      });
      console.log(result.data);
      setLoading(false);
      router.replace('/workspace');
      toast.success('Course generated successfully')
    } catch (e) {
      console.log(e);
      setLoading(false);
         toast.error('Server Side error, Try Again!')
    }
  }

  return (
    <div className='md:flex gap-5 justify-between p-5 rounded-2xl shadow'>
      <div className='flex flex-col gap-3'>
        <h2 className='font-bold text-3xl'>{courseLayout?.name}</h2>
        <p className='line-clamp-2 text-gray-500'>{courseLayout?.description}</p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          <div className='flex gap-5 items-center item-center p-3 rounded-lg shadow '>
<Clock className='text-blue-500'/>
<section>
  <h2 className='font-bold'>Duration</h2>
    <h2>2 hours</h2>
</section> 
            </div> 
              <div className='flex gap-5 items-center item-center p-3 rounded-lg shadow '>
<Book className='text-green-500'/>
<section>
  <h2 className='font-bold'>Chapters</h2>
    <h2>2 hours</h2>
</section> 
            </div> 
              <div className='flex gap-5 items-center item-center p-3 rounded-lg shadow '>
<TrendingUp className='text-red-500'/>
<section>
  <h2 className='font-bold'>Difficulty Level</h2>
    <h2>{course?.level}</h2>
</section> 
            </div> 
        </div>
   {!viewCourse  ?   <Button className={'max-w-sm'} onClick={GenerateCourseContent} disabled={loading}>
      {loading ? <Loader2Icon className="animate-spin" /> : <Settings />}     Generate Content
        </Button>
        : <Link href={'/course/'+course?.cid}><Button> <PlayCircle/> Continue Learning </Button> </Link> }
      </div>
      {imageSrc && (
      <Image  src={imageSrc}
        alt={'banner Image'}
        width={400}
        height={400}
        className="w-full mt-5 md:mt-0 object-cover aspect-auto h-[240px] rounded-2xl"
        onError={() => setImageSrc('/online_education.png')}
      />)}
    </div>
  )
}

export default CourseInfo
