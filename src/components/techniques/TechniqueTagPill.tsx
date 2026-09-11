interface TechniqueTagPillProps {
  label: string
  variant?: 'category' | 'gokyo'
  modifier?: 'detail'
}

/**
 * Renderiza uma tag de taxonomia no formato [ LABEL ].
 * Usada para subcategoria (variant="category") e Go-kyō (variant="gokyo").
 * O modifier "detail" aplica as classes --detail existentes no CSS.
 */
export default function TechniqueTagPill({
  label,
  variant = 'category',
  modifier,
}: TechniqueTagPillProps) {
  const base = variant === 'gokyo' ? 'tc-gokyo-tag' : 'tc-cat-tag'
  const className = modifier ? `${base} ${base}--${modifier}` : base

  return (
    <span className={className}>
      <span className="tc-tag-bracket" aria-hidden="true">[</span>
      {' '}{label}{' '}
      <span className="tc-tag-bracket" aria-hidden="true">]</span>
    </span>
  )
}
