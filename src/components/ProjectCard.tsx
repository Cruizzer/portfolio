import React from 'react'

type Props = {
  title: string
  description?: string
  link?: string
  tags?: string[]
}

export default function ProjectCard({ title, description, link, tags = [] }: Props) {
  return (
    <article className="card project-card">
      <div className="card-header">
        <div>
          <h3 className="card-title">{title}</h3>
        </div>
        <div className="card-meta">
          {link && (
            <a className="small-link" href={link} target="_blank" rel="noreferrer">
              View
            </a>
          )}
        </div>
      </div>
      <p className="muted">{description}</p>
      <div className="tags">
        {tags.map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
    </article>
  )
}
