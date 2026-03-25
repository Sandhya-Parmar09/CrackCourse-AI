"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Sidebar, 
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LayoutDashboard, BookOpen, BookCopy, FileText, FileStack, User } from "lucide-react"
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddNewCourseDialog from "./AddNewCourseDialog";

// Sidebar options array
const SideBarOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace',
  },
  {
    title: 'My Learning',
    icon: BookOpen,
    path: '/workspace/my-learning',
  },
  {
    title: 'Explore Courses',
    icon: BookCopy,
    path: '/workspace/explore',
  },

 {
    title: 'Billing',
    icon: User,
    path: '/workspace/billing',
  },
  {
    title: 'Profile',
    icon: User,
    path: '/workspace/profile',
  },
];

function AppSidebar() {
  const path = usePathname();

  return (
   <Sidebar>
      <SidebarHeader>
        <div className="flex flex-col justify-center items-center py-3">
          <Image
            src={'/bg_logo.png'}
            alt='CrackCourse AI Logo'
            width={100}
            height={50}
            className="mb-1"
            style={{ objectFit: 'contain', height: 'auto' }}
            priority
          />
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
            CrackCourse AI
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AddNewCourseDialog>
            <Button>Create New Course</Button> 
          </AddNewCourseDialog>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SideBarOptions.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild className="p-5">
                    <Link
                      href={item.path}
                      className={`text-[17px] flex items-center gap-3 ${
    (item.path === '/workspace'
      ? path === '/workspace'
      : path.startsWith(item.path)
    ) && 'text-primary bg-purple-100'
  }`}
                    >
                      <item.icon className="h-7 w-7" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default AppSidebar

