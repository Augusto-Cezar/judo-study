import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { type Technique, type Category, type GoKyo } from '../../types/index'
import { getTechniques } from '../../services/techniques'
import { getCategories, getGoKyo, getCategoryById, getParentCategory } from '../../services/categories'
import TechniqueFilters from './TechniqueFilters'
import TechniqueList from './TechniqueList'
import TechniqueSearch from './TechniqueSearch'

// TechniqueExplorer é o único ponto responsável por carregar técnicas +
// categorias + Go-kyō para a página /tecnicas. Ele busca as três de uma vez
// (Promise.all) e só então renderiza filtros/lista — isso garante que,
// quando TechniqueCard chamar resolveTechniqueDisplay (síncrona) durante o
// render, o cache de categories/go_kyo já esteja populado.
type ExplorerState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; techniques: Technique[]; categories: Category[]; goKyo: GoKyo[] }

export default function TechniqueExplorer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<ExplorerState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    Promise.all([getTechniques(), getCategories(), getGoKyo()])
      .then(([techniques, categories, goKyo]) => {
        if (cancelled) return
        setState({ status: 'ready', techniques, categories, goKyo })
      })
      .catch(() => {
        if (cancelled) return
        setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const allTechniques = state.status === 'ready' ? state.techniques : []
  const categories = state.status === 'ready' ? state.categories : []
  const goKyo = state.status === 'ready' ? state.goKyo : []
  const rootCategories = useMemo(() => categories.filter((c) => c.parent_id === null), [categories])
  const subcategories = useMemo(() => categories.filter((c) => c.parent_id !== null), [categories])

  // IDs válidos para validação de parâmetros de URL — recalculado quando os dados chegam
  const validCategoryIds = useMemo(() => new Set(categories.map((c) => c.id)), [categories])
  const validGoKyoIds = useMemo(() => new Set(goKyo.map((g) => g.id)), [goKyo])

  // URL é a fonte de verdade para todos os filtros
  const searchQuery = searchParams.get('search') ?? ''

  // Parâmetros inválidos são silenciosamente ignorados (tratados como null)
  const rawCategory = searchParams.get('category')
  const activeCategoryId = rawCategory && validCategoryIds.has(rawCategory) ? rawCategory : null

  const rawGokyo = searchParams.get('gokyo')
  const activeGoKyoId = rawGokyo && validGoKyoIds.has(rawGokyo) ? rawGokyo : null

  const isFiltered = !!(searchQuery || activeCategoryId || activeGoKyoId)

  // Lógica de filtro preservada integralmente — AND entre os três critérios
  const filteredTechniques = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()

    return allTechniques.filter((t) => {
      if (q) {
        const matchesSearch =
          t.romaji_name.toLowerCase().includes(q) ||
          t.portuguese_name.toLowerCase().includes(q) ||
          t.japanese_name.includes(q)
        if (!matchesSearch) return false
      }

      if (activeCategoryId) {
        const isSub = subcategories.some((s) => s.id === activeCategoryId)
        if (isSub) {
          if (t.category_id !== activeCategoryId) return false
        } else {
          const parent = getParentCategory(t.category_id)
          const cat = getCategoryById(t.category_id)
          const belongsToParent =
            parent?.id === activeCategoryId || cat?.id === activeCategoryId
          if (!belongsToParent) return false
        }
      }

      if (activeGoKyoId && t.go_kyo_id !== activeGoKyoId) return false

      return true
    })
  }, [allTechniques, subcategories, searchQuery, activeCategoryId, activeGoKyoId])

  // Categoria e Go-kyō: push normal (preservam histórico de navegação)
  const handleCategoryChange = (id: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id) { next.set('category', id) } else { next.delete('category') }
        return next
      },
      { replace: false },
    )
  }

  const handleGoKyoChange = (id: string | null) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (id) { next.set('gokyo', id) } else { next.delete('gokyo') }
        return next
      },
      { replace: false },
    )
  }

  // Busca: replace:true — evita que cada keystroke vire uma entrada no histórico
  const handleSearchChange = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (value) { next.set('search', value) } else { next.delete('search') }
        return next
      },
      { replace: true },
    )
  }

  // clearFilters: remove todos os parâmetros, push para manter histórico
  const clearFilters = () => {
    setSearchParams({}, { replace: false })
  }

  return (
    <div className="tc-explorer">
      {/* Page header */}
      <header className="tc-header">
        <div className="tc-header-left">
          <p className="eyebrow tc-eyebrow">
            <span className="eyebrow-bracket">[ </span>
            02 / TÉCNICAS
            <span className="eyebrow-bracket"> ]</span>
          </p>
          <h1 className="tc-title">
            Conheça as{' '}
            <em className="tc-title-accent">técnicas.</em>
          </h1>
          <p className="tc-subtitle">
            Explore, revise e compreenda os movimentos que formam o Judô.
          </p>
        </div>
        <div className="tc-header-right">
          <span className="tc-catalog-count">{allTechniques.length}</span>
          <span className="tc-catalog-label">técnicas catalogadas</span>
        </div>
      </header>

      {state.status === 'loading' && (
        <div className="tc-empty" role="status" aria-live="polite">
          <p className="tc-empty-title">Carregando técnicas…</p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="tc-empty" role="alert">
          <p className="tc-empty-title">Não foi possível carregar as técnicas.</p>
          <p className="tc-empty-sub">Verifique sua conexão e tente novamente.</p>
        </div>
      )}

      {state.status === 'ready' && (
        <>
          {/* Search + Filters */}
          <div className="tc-controls">
            <TechniqueSearch value={searchQuery} onChange={handleSearchChange} />
            <TechniqueFilters
              categories={categories}
              rootCategories={rootCategories}
              goKyo={goKyo}
              activeCategoryId={activeCategoryId}
              activeGoKyoId={activeGoKyoId}
              onCategoryChange={handleCategoryChange}
              onGoKyoChange={handleGoKyoChange}
            />
          </div>

          {/* List */}
          <TechniqueList
            techniques={filteredTechniques}
            totalCount={allTechniques.length}
            isFiltered={isFiltered}
            onClearFilters={clearFilters}
          />
        </>
      )}
    </div>
  )
}
