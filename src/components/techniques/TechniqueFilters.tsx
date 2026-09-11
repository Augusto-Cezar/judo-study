import { type Category, type GoKyo } from '../../types/index'

interface TechniqueFiltersProps {
  categories: Category[]
  rootCategories: Category[]
  goKyo: GoKyo[]
  activeCategoryId: string | null
  activeGoKyoId: string | null
  onCategoryChange: (id: string | null) => void
  onGoKyoChange: (id: string | null) => void
}

export default function TechniqueFilters({
  categories,
  rootCategories,
  goKyo,
  activeCategoryId,
  activeGoKyoId,
  onCategoryChange,
  onGoKyoChange,
}: TechniqueFiltersProps) {
  const subcategories = categories.filter((c) => c.parent_id !== null)

  const activeRoot = rootCategories.find((r) =>
    activeCategoryId === r.id ||
    subcategories.some((s) => s.id === activeCategoryId && s.parent_id === r.id),
  )

  const visibleSubcategories = activeRoot
    ? categories.filter((c) => c.parent_id === activeRoot.id)
    : []

  return (
    <div className="tc-filters" role="group" aria-label="Filtros de técnicas">
      {/* Category row */}
      <div className="tc-filter-row">
        <button
          className={`tc-chip${!activeCategoryId ? ' tc-chip--active' : ''}`}
          onClick={() => onCategoryChange(null)}
          aria-pressed={!activeCategoryId}
        >
          Todos
        </button>

        {rootCategories.map((cat) => (
          <button
            key={cat.id}
            className={`tc-chip${activeCategoryId === cat.id ? ' tc-chip--active' : ''}`}
            onClick={() => {
              if (activeCategoryId === cat.id) {
                onCategoryChange(null)
              } else {
                onCategoryChange(cat.id)
              }
            }}
            aria-pressed={activeCategoryId === cat.id}
          >
            {cat.name}
          </button>
        ))}

        {visibleSubcategories.length > 0 && (
          <>
            <span className="tc-filter-divider" aria-hidden="true" />
            {visibleSubcategories.map((sub) => (
              <button
                key={sub.id}
                className={`tc-chip tc-chip--sub${activeCategoryId === sub.id ? ' tc-chip--active' : ''}`}
                onClick={() => {
                  if (activeCategoryId === sub.id) {
                    onCategoryChange(activeRoot?.id ?? null)
                  } else {
                    onCategoryChange(sub.id)
                  }
                }}
                aria-pressed={activeCategoryId === sub.id}
              >
                {sub.name}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Go-kyō row */}
      <div className="tc-filter-row tc-filter-row--gokyo">
        <span className="tc-filter-group-label" aria-hidden="true">
          Go-kyō
        </span>
        {goKyo.map((g) => (
          <button
            key={g.id}
            className={`tc-chip tc-chip--gokyo${activeGoKyoId === g.id ? ' tc-chip--active' : ''}`}
            onClick={() => onGoKyoChange(activeGoKyoId === g.id ? null : g.id)}
            aria-pressed={activeGoKyoId === g.id}
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  )
}
