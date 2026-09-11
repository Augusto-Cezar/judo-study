import { Link } from 'react-router-dom'
import { type Technique } from '../../types/index'
import { resolveTechniqueDisplay } from '../../services/techniques'
import TechniqueTagPill from './TechniqueTagPill'

interface TechniqueCardProps {
  technique: Technique
}

export default function TechniqueCard({ technique }: TechniqueCardProps) {
  const { category, parent, gokyo } = resolveTechniqueDisplay(technique)

  const subcategoryLabel = category?.name.toUpperCase()
  const parentLabel = parent?.name.toUpperCase()
  const categoryLabel = subcategoryLabel || parentLabel || ''

  return (
    <article className="tc-card">
      <Link
        to={`/tecnicas/${technique.slug}`}
        className="tc-card-btn"
        aria-label={`Ver detalhes de ${technique.romaji_name} — ${technique.portuguese_name}`}
      >
        <div className="tc-card-inner">
          <div className="tc-card-info">
            <div className="tc-card-top">
              <div className="tc-card-tags">
                {categoryLabel && (
                  <TechniqueTagPill label={categoryLabel} variant="category" />
                )}
                {parent && (
                  <span className="tc-parent-tag">{parent.name}</span>
                )}
              </div>
              {gokyo && (
                <TechniqueTagPill label={gokyo.name.toUpperCase()} variant="gokyo" />
              )}
            </div>

            <div className="tc-card-main">
              <h2 className="tc-romaji">{technique.romaji_name}</h2>
              <span className="tc-japanese" aria-label={`Japonês: ${technique.japanese_name}`}>
                {technique.japanese_name}
              </span>
            </div>

            <p className="tc-portuguese">{technique.portuguese_name}</p>
          </div>

          <span className="tc-card-arrow" aria-hidden="true">→</span>
        </div>
      </Link>
    </article>
  )
}
