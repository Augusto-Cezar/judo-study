import { type Technique } from '../../types/index'
import TechniqueCard from './TechniqueCard'
import TechniqueEmptyState from './TechniqueEmptyState'

interface TechniqueListProps {
  techniques: Technique[]
  totalCount: number
  isFiltered: boolean
  onClearFilters: () => void
}

export default function TechniqueList({
  techniques,
  totalCount,
  isFiltered,
  onClearFilters,
}: TechniqueListProps) {
  return (
    <div className="tc-list-section">
      <div className="tc-result-bar" role="status" aria-live="polite">
        <span className="tc-result-count">
          {techniques.length === totalCount
            ? `${totalCount} técnicas`
            : `${techniques.length} ${techniques.length === 1 ? 'técnica encontrada' : 'técnicas encontradas'}`}
        </span>
        {isFiltered && techniques.length > 0 && (
          <button
            className="tc-result-clear btn-secondary"
            onClick={onClearFilters}
            type="button"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {techniques.length === 0 ? (
        <TechniqueEmptyState onClear={onClearFilters} />
      ) : (
        <ul className="tc-list" role="list">
          {techniques.map((t) => (
            <li key={t.id}>
              <TechniqueCard technique={t} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
