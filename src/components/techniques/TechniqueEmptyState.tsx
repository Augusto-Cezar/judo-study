interface TechniqueEmptyStateProps {
  onClear: () => void
}

export default function TechniqueEmptyState({ onClear }: TechniqueEmptyStateProps) {
  return (
    <div className="tc-empty" role="status" aria-live="polite">
      <p className="tc-empty-title">Nenhuma técnica encontrada.</p>
      <p className="tc-empty-sub">Tente outro nome ou remova alguns filtros.</p>
      <button className="tc-empty-clear btn-secondary" onClick={onClear} type="button">
        Limpar filtros
      </button>
    </div>
  )
}
