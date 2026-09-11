import { useEffect, useRef } from 'react'
import { type Technique } from '../../types/index'
import { resolveTechniqueDisplay } from '../../services/techniques'
import TechniqueMedia from './TechniqueMedia'
import TechniqueTagPill from './TechniqueTagPill'

interface TechniqueDetailProps {
  technique: Technique
  onClose: () => void
}

export default function TechniqueDetail({ technique, onClose }: TechniqueDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const { category, parent, gokyo } = resolveTechniqueDisplay(technique)

  const subcategoryLabel = category?.name.toUpperCase()

  useEffect(() => {
    closeRef.current?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div className="tc-detail" role="region" aria-label={`Detalhes: ${technique.romaji_name}`}>
      {/* Nav bar */}
      <div className="tc-detail-nav">
        <button
          className="tc-detail-back btn-secondary"
          onClick={onClose}
          type="button"
          aria-label="Voltar para lista de técnicas"
        >
          ← Técnicas
        </button>
        <button
          ref={closeRef}
          className="tc-detail-close"
          onClick={onClose}
          type="button"
          aria-label="Fechar detalhes da técnica"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="tc-detail-body">
        {/* Left column */}
        <div className="tc-detail-left">
          {/* Taxonomy tags */}
          <div className="tc-detail-tags">
            {subcategoryLabel && (
              <TechniqueTagPill label={subcategoryLabel} variant="category" modifier="detail" />
            )}
            {gokyo && (
              <TechniqueTagPill label={gokyo.name.toUpperCase()} variant="gokyo" modifier="detail" />
            )}
            {parent && (
              <span className="tc-parent-tag tc-parent-tag--detail">{parent.name}</span>
            )}
          </div>

          {/* Name hierarchy */}
          <div className="tc-detail-name">
            <h1 className="tc-detail-romaji">{technique.romaji_name}</h1>
            <p
              className="tc-detail-japanese"
              aria-label={`Nome em japonês: ${technique.japanese_name}`}
            >
              {technique.japanese_name}
            </p>
            <p className="tc-detail-portuguese">{technique.portuguese_name}</p>
          </div>

          {/* Media (mobile: shown here, desktop: right column) */}
          <div className="tc-detail-media-mobile">
            <TechniqueMedia
              imageUrl={technique.image_url}
              videoUrl={technique.video_url}
              altText={`${technique.romaji_name} — ${technique.portuguese_name}`}
            />
          </div>

          {/* Description */}
          {technique.description && (
            <div className="tc-detail-description">
              <h2 className="tc-detail-section-label">SOBRE A TÉCNICA</h2>
              <p className="tc-detail-body-text">{technique.description}</p>
            </div>
          )}

          {/* Japanese reading info */}
          <div className="tc-detail-reading">
            <h2 className="tc-detail-section-label">LEITURA</h2>
            <div className="tc-detail-reading-row">
              <span className="tc-reading-japanese">{technique.japanese_name}</span>
              <span className="tc-reading-romaji">{technique.romaji_name}</span>
            </div>
          </div>
        </div>

        {/* Right column (desktop only) */}
        <div className="tc-detail-right">
          <TechniqueMedia
            imageUrl={technique.image_url}
            videoUrl={technique.video_url}
            altText={`${technique.romaji_name} — ${technique.portuguese_name}`}
          />
        </div>
      </div>
    </div>
  )
}
