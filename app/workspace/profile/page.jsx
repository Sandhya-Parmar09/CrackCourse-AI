import React from 'react'
import {UserProfile} from '@clerk/nextjs'
function Profile() {
  return (
    <div>
      <h2 className='font-bold text-3xl mb-7'>Manage Your Profile</h2>
      <UserProfile routing="hash"/>
    </div>
  )
}

export default Profile
