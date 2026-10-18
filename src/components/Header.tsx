'use client'


import { useEffect, useState } from "react";


const Header = () => {

  const [time, setTime] = useState<string>('')
  const [viewport, setViewport] = useState<string>('')

  // get current time
  const currentTime = () => {
    setTime( new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }))
  }

  // Get vieport width 
  const windowDimmensions = () => {
    setViewport(
      `${window.innerWidth}*${window.innerHeight}`
    )
  }

  useEffect(()=> {
    currentTime()
    const interval = setInterval(currentTime, 1000)
    return () => clearInterval(interval)
  },[])

  useEffect(()=>{
    windowDimmensions()
    window.addEventListener('resize', windowDimmensions)
    return () => window.removeEventListener('resize', windowDimmensions)
  },[])

  return (
    <>
      <header>
        <div>{time}</div>
        <div>{viewport}</div>
      </header>
    </>
  );
};

export default Header;
