import React, { useRef, useEffect } from 'react'

type Props = {
  title: string
  subtitle?: string
  period?: string
  location?: string
  bullets?: string[]
  logo?: string // optional data-url or path
  logoLink?: string
  
}

export default function TimelineItem({ title, subtitle, period, location, bullets = [], logo, logoLink }: Props) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ticking = false
    function update() {
      const current = el
      if (!current) return
      const rect = current.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const offset = (center - window.innerHeight / 2) / window.innerHeight
      current.style.setProperty('--parallax', String(offset))
      ticking = false
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="timeline-item" ref={ref}>
      <div className="timeline-marker">
        {logo ? (
          logoLink ? (
            <a href={logoLink} target="_blank" rel="noreferrer">
              <img src={logo} alt={subtitle || title} className="logo" />
            </a>
          ) : (
            <img src={logo} alt={subtitle || title} className="logo" />
          )
        ) : (
          <div className="logo placeholder">{(subtitle || title).slice(0,2).toUpperCase()}</div>
        )}
      </div>

      <div className="timeline-card card">
        <header className="card-header">
          <div>
            <h3 className="card-title">{title}</h3>
            {subtitle && <p className="card-sub">{subtitle}</p>}
          </div>
          <div className="card-meta">
            {period && <div className="muted">{period}</div>}
            {location && <div className="muted">{location}</div>}
          </div>
        </header>
        <ul className="card-bullets">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
