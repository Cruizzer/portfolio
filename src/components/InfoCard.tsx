import React from 'react'

type Props = {
  title: string
  subtitle?: string
  period?: string
  location?: string
  bullets?: string[]
  logo?: string
  logoLink?: string
  accent?: 'trimble' | 'siemens' | 'acts' | 'default'
}

export default function InfoCard({ title, subtitle, period, location, bullets = [], logo, logoLink, accent = 'default' }: Props) {
  // join bullets into a single paragraph
  const paragraph = bullets.join(' ')

  // basic tag extraction from known keywords for visual chips
  const knownTags: { [k: string]: string } = {
    docker: 'Docker',
    powershell: 'PowerShell',
    mstest: 'MSTest',
    dockerized: 'Dockerized',
    django: 'Django',
    postgresql: 'PostgreSQL',
    python: 'Python',
    cpp: 'C++',
    'c++': 'C++',
    csharp: 'C#',
    'c#': 'C#',
    git: 'Git',
    redis: 'Redis',
    mcp: 'MCP',
    assembly: 'Assembly'
  }

  const foundTags: string[] = []
  const lower = paragraph.toLowerCase()
  Object.keys(knownTags).forEach((k) => {
    if (lower.includes(k) && !foundTags.includes(knownTags[k])) foundTags.push(knownTags[k])
  })

  return (
    <article className={`card ${accent ? 'accent-' + accent : ''}`}>
      <div className="card-row">
        {logo && (
          <div className="logo">
            {logoLink ? (
              <a className="logo-link" href={logoLink} target="_blank" rel="noreferrer" title={`Visit ${subtitle || title}`}>
                <img src={logo} alt={`${title} logo`} />
              </a>
            ) : (
              <img src={logo} alt={`${title} logo`} />
            )}
          </div>
        )}

        <div className="card-inner">
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

          {paragraph ? (
            <p className="card-paragraph">{paragraph}</p>
          ) : null}

          {foundTags.length > 0 && (
            <div className="chips" aria-hidden>
              {foundTags.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
