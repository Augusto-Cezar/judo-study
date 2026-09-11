interface TechniqueSearchProps {
  value: string
  onChange: (v: string) => void
}

export default function TechniqueSearch({ value, onChange }: TechniqueSearchProps) {
  return (
    <div className="tc-search-wrapper">
      <label htmlFor="technique-search" className="sr-only">
        Buscar técnica por nome em romaji, português ou japonês
      </label>
      <input
        id="technique-search"
        type="search"
        className="tc-search-input"
        placeholder="Buscar uma técnica..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-label="Buscar técnica"
      />
      {value && (
        <button
          className="tc-search-clear"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}
