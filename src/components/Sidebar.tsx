'use client'
import React, { useState } from 'react'

export default function Sidebar({open}:{open: boolean}) {
  console.log(open);
  
  return (
    <div className='box absolute right-0 top-0 bottom-[-10] h-screen' style={{display: open ? 'none' : 'flex'}}>
      sidebar
    </div>
  )
}
