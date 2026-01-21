import React, { useEffect, useRef } from 'react'

type Props = {
  children: React.ReactNode
}

export default function TimelineWrapper({ children }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const lineRef = useRef<HTMLDivElement | null>(null)
  const progressRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = rootRef.current
    const line = lineRef.current
    const progress = progressRef.current
    if (!root || !line || !progress) return

    let ticking = false

    function updateLineBounds() {
      const items = Array.from(root.querySelectorAll('.timeline-item'))
      if (!items.length) return
      const firstPoint = items[0].querySelector('.timeline-marker') as HTMLElement | null
      const lastPoint = items[items.length - 1].querySelector('.timeline-marker') as HTMLElement | null
      if (!firstPoint || !lastPoint) return

      const rootRect = root.getBoundingClientRect()
      const firstRect = firstPoint.getBoundingClientRect()
      const lastRect = lastPoint.getBoundingClientRect()

      // compute centers relative to root
      const firstCenter = firstRect.top - rootRect.top + firstRect.height / 2
      const lastCenter = lastRect.top - rootRect.top + lastRect.height / 2

      const top = Math.max(0, firstCenter)
      const height = Math.max(0, lastCenter - firstCenter)

      // set the line's top and height (avoid setting bottom which can produce large values)
      line.style.top = `${top}px`
      line.style.height = `${height}px`
    }

    function updateProgressAndActive() {
      const items = Array.from(root.querySelectorAll('.timeline-item'))
      const points = items.map((it) => it.querySelector('.timeline-marker') as HTMLElement | null)

      const lineRect = line.getBoundingClientRect()
      const progressTop = Math.max(0, window.innerHeight / 2 - lineRect.top)
      // clamp progress to the line height to avoid growing beyond the line
      const clamped = Math.max(0, Math.min(progressTop, lineRect.height || 0))
      progress.style.height = `${clamped}px`

      items.forEach((it, i) => {
        const pt = points[i]
        if (!pt) return
        const ptRect = pt.getBoundingClientRect()
        const isActive = ptRect.top < window.innerHeight / 2
        if (isActive) it.classList.add('js-ag-active')
        else it.classList.remove('js-ag-active')
      })
    }

    function onFrame() {
      updateProgressAndActive()
      ticking = false
    }

    function onScrollOrResize() {
      if (!ticking) {
        window.requestAnimationFrame(onFrame)
        ticking = true
      }
    }

    // initial
    updateLineBounds()
    updateProgressAndActive()

    const onResize = () => {
      updateLineBounds()
      onScrollOrResize()
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="timeline js-timeline" ref={rootRef}>
      <div className="js-timeline_line ag-timeline_line" ref={lineRef}>
        <div className="js-timeline_line-progress ag-timeline_line-progress" ref={progressRef} />
      </div>
      <div className="ag-timeline_list">{children}</div>
    </div>
  )
}
