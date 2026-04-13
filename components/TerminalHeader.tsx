'use client'

import { useState, useEffect } from 'react'

const TerminalHeader = () => {
  const [time, setTime] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div className="flex items-center justify-between px-4  py-2 bg-surface-elevated border-b border-accent/10">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-inner" />
        <div className="w-3 h-3 rounded-full bg-green-400 shadow-inner" />
      </div>

      <div className="text-ui uppercase tracking-default text-accent/60 font-bold">
        ddev — zsh — {dimensions.width}×{dimensions.height}
      </div>

      <div className="text-ui text-accent/90  text-right">
        {time}
      </div>
    </div>
  )
}

export default TerminalHeader
