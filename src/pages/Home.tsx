import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import OrbVisual from '../components/OrbVisual'
import { type Technique } from '../types/index'
import { getTechniqueBySlug, resolveTechniqueDisplay } from '../services/techniques'
import { getCategories, getGoKyo } from '../services/categories'

const PREVIEW_SLUGS = ['o-soto-gari', 'o-goshi', 'uchi-mata', 'seoi-nage'] as const

type PreviewItem = { technique: Technique; categoryLabel: string }
type PreviewState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; items: PreviewItem[] }

const metadata = [
  { number: '100', label: 'Técnicas' },
  { number: '68', label: 'Nage-waza' },
  { number: '32', label: 'Katame-waza' },
  { number: '40', label: 'Go-kyō' },
]

export default function Home() {
  const [preview, setPreview] = useState<PreviewState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setPreview({ status: 'loading' })

    // Busca as 4 técnicas curadas em paralelo (reaproveita getTechniqueBySlug,
    // já existente, em vez de criar uma função nova só para múltiplos slugs —
    // para 4 registros específicos o custo de 4 requisições paralelas é
    // desprezível frente a buscar as ~100 técnicas só para filtrar 4).
    // getCategories()/getGoKyo() garantem que o cache de taxonomia esteja
    // populado antes de chamar resolveTechniqueDisplay (síncrona).
    Promise.all([
      Promise.all(PREVIEW_SLUGS.map((slug) => getTechniqueBySlug(slug))),
      getCategories(),
      getGoKyo(),
    ])
      .then(([techniques]) => {
        if (cancelled) return
        const items = techniques
          .filter((t): t is Technique => t !== undefined)
          .map((technique) => {
            const { category } = resolveTechniqueDisplay(technique)
            return { technique, categoryLabel: category?.name.toUpperCase() ?? '' }
          })
        setPreview({ status: 'ready', items })
      })
      .catch(() => {
        if (cancelled) return
        setPreview({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="home">
      {/* ─── 1. HERO ─── */}
      <section className="hero" aria-label="Introdução">
        <div className="hero-inner">
          <div className="hero-left">
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>
              <span className="eyebrow-bracket">[ </span>
              SHODAN / 01
              <span className="eyebrow-bracket"> ]</span>
            </p>
            <p className="hero-supertitle">Uma biblioteca para o caminho</p>
            <h1 className="hero-heading">
              <span className="hero-line">Estude.</span>
              <em className="hero-line hero-line--accent">Revise.</em>
              <span className="hero-line">Execute.</span>
            </h1>
            <p className="hero-body">
              Uma biblioteca para estudar, revisar e relembrar técnicas de
              Judô — com clareza, intenção e movimento.
            </p>
            <div className="hero-actions">
              <Link to="/tecnicas" className="btn-primary">
                Explorar técnicas
                <span aria-hidden="true">↗</span>
              </Link>
              <Link to="/estudar" className="btn-secondary">
                Começar a estudar
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="orb-anno-top" aria-hidden="true">
              <span className="orb-anno-number">01</span>
              <span className="orb-anno-text">
                CONTROLLED
                <br />
                MOVEMENT
              </span>
            </div>
            <OrbVisual />
            <div className="orb-anno-bottom" aria-hidden="true">
              <span className="orb-kanji">形</span>
              <span className="orb-anno-text">forma encontra movimento</span>
            </div>
          </div>
        </div>

        <p className="scroll-hint" aria-hidden="true">
          SCROLL TO EXPLORE ↘
        </p>
      </section>

      {/* ─── 2. EXPLORE — Category entry points ─── */}
      <section className="explore" aria-label="Categorias de técnicas">
        <div className="section-header">
          <span className="section-number">01 / 04</span>
          <p className="section-label">
            <span className="eyebrow-bracket">[ </span>
            JUDO / WAZA
            <span className="eyebrow-bracket"> ]</span>
          </p>
        </div>

        <div className="categories">
          <Link
            to="/tecnicas"
            className="category-entry"
            aria-label="Explorar Nage-waza — Técnicas de projeção"
          >
            <div className="category-inner">
              <span className="category-index" aria-hidden="true">
                01
              </span>
              <div className="category-content">
                <h2 className="category-name">NAGE-WAZA</h2>
                <p className="category-desc">Técnicas de projeção</p>
              </div>
              <span className="category-arrow" aria-hidden="true">
                →
              </span>
            </div>
          </Link>

          <Link
            to="/tecnicas"
            className="category-entry"
            aria-label="Explorar Katame-waza — Técnicas de controle"
          >
            <div className="category-inner">
              <span className="category-index" aria-hidden="true">
                02
              </span>
              <div className="category-content">
                <h2 className="category-name">KATAME-WAZA</h2>
                <p className="category-desc">Técnicas de controle</p>
              </div>
              <span className="category-arrow" aria-hidden="true">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 3. TECHNIQUE PREVIEW ─── */}
      <section className="techniques" aria-label="Técnicas em destaque">
        <div className="section-header">
          <span className="section-number">02 / 04</span>
          <p className="section-label">
            <span className="eyebrow-bracket">[ </span>
            TÉCNICAS
            <span className="eyebrow-bracket"> ]</span>
          </p>
        </div>

        {preview.status === 'loading' && (
          <p className="tc-empty-sub" role="status" aria-live="polite">
            Carregando técnicas…
          </p>
        )}

        {preview.status === 'error' && (
          <p className="tc-empty-sub" role="alert">
            Não foi possível carregar as técnicas em destaque.
          </p>
        )}

        {preview.status === 'ready' && (
          <ul className="technique-list" role="list">
            {preview.items.map(({ technique, categoryLabel }, i) => (
              <li key={technique.slug}>
                <Link
                  to={`/tecnicas/${technique.slug}`}
                  className="technique-row"
                  aria-label={`${technique.romaji_name} — ${categoryLabel}`}
                >
                  <span className="technique-index" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="technique-name">{technique.romaji_name}</span>
                  <span className="technique-tag">
                    <span className="eyebrow-bracket">[ </span>
                    {categoryLabel}
                    <span className="eyebrow-bracket"> ]</span>
                  </span>
                  <span className="technique-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ─── 4. KNOWLEDGE METADATA ─── */}
      <section className="knowledge" aria-label="Base de conhecimento">
        <div className="section-header">
          <span className="section-number">03 / 04</span>
          <p className="section-label">
            <span className="eyebrow-bracket">[ </span>
            KNOWLEDGE
            <span className="eyebrow-bracket"> ]</span>
          </p>
        </div>

        <dl className="metadata-grid">
          {metadata.map(({ number, label }) => (
            <div className="metadata-item" key={label}>
              <dt className="metadata-label">{label}</dt>
              <dd className="metadata-number">{number}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─── 5. STUDY ENTRY ─── */}
      <section className="study-entry" aria-label="Modo de estudo">
        <div className="study-inner">
          <p className="eyebrow" style={{ marginBottom: '1.25rem' }}>
            <span className="eyebrow-bracket">[ </span>
            04 / 04 — ESTUDO
            <span className="eyebrow-bracket"> ]</span>
          </p>
          <h2 className="study-heading">Estudar</h2>
          <p className="study-body">Revise antes do próximo treino.</p>
          <Link to="/estudar" className="btn-secondary">
            Ir para o estudo →
          </Link>
        </div>
      </section>

      {/* ─── 6. FOOTER ─── */}
      <footer className="site-footer" role="contentinfo">
        <p className="footer-copy">© 2026 Judo Study</p>
        <span className="footer-version">JDS / 01.01</span>
      </footer>
    </div>
  )
}
