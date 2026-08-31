'use client'

import { useEffect, useState } from 'react'

const TerminalHeader = () => {
  const [time, setTime] = useState('')
  const [viewport, setViewport] = useState('')

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const measure = () => setViewport(`${window.innerWidth}×${window.innerHeight}`)

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <div className="flex items-center justify-between gap-3 border-b border-accent/10 bg-surface-elevated px-4 py-2 sm:px-6 lg:px-10">
      <div className="flex shrink-0 gap-2">
        <span className="size-3 rounded-full bg-danger/80" />
        <span className="size-3 rounded-full bg-warning/80" />
        <span className="size-3 rounded-full bg-success/80" />
      </div>

      {/* Too narrow to be useful on phones. */}
      <span className="hidden truncate text-ui font-bold uppercase tracking-default text-accent/60 md:block">
        ddev — zsh — {viewport}
      </span>

      <span className="shrink-0 text-ui tabular-nums text-accent/90">{time}</span>
    </div>
  )
}

export default TerminalHeader
