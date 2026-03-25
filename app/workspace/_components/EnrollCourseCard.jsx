import React, { useState } from 'react'
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { PlayCircle} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

function EnrollCourseCard({course,enrollCourse}) {
      const courseJson = course?.courseJson?.course;
      const [imageSrc, setImageSrc] = useState(() => {
        const url = course?.bannerImageURL;
        if (!url) {
          return '/online_education.png';
        }
        return url;
      });
      // Fix: use correct operator precedence and fallback for empty arrays
      const CalculatePerProgress = () => {
        const completed = enrollCourse?.completedChapters?.length || 0;
        const total = course?.courseContent?.length || 1;
        return Math.round((completed / total) * 100);
      }
  return (
   <div className='shadow rounded-xl'>
        {imageSrc && ( <Image
          src={imageSrc}
          alt={course?.name}
          width={400}
          height={300}
          className="w-full aspect-video rounded-t-xl object-cover"
          onError={() => setImageSrc('/online_education.png')}
        />)}
        <div className='p-3 flex flex-col gap-3'>
          <h2 className='font-bold text-lg'>{courseJson?.name}</h2>
          <p className='line-clamp-3 text-gray-400 text-sm'>{courseJson?.description}</p>
          <div className="">
            <h2 className='flex justify-between text-sm text-primary '>Progress<span>{CalculatePerProgress()}%</span></h2>
           <Progress value={CalculatePerProgress()} />
<Link href={'/workspace/view-course/'+ course?.cid}>
           <Button className={'w-full mt-3'}><PlayCircle/> Continue Learning</Button>
           </Link>
          </div>
        </div>
      </div>
 
  )
}

export default EnrollCourseCard
