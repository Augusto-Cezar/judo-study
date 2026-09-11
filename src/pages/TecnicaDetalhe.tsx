import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { type Technique } from '../types/index'
import { getTechniqueBySlug } from '../services/techniques'
import { getCategories, getGoKyo } from '../services/categories'
import TechniqueDetail from '../components/techniques/TechniqueDetail'

// Os três estados abaixo precisam continuar distinguíveis: "carregando" não
// é "não encontrada", e nenhuma das duas é "erro". getTechniqueBySlug()
// já preserva essa distinção (undefined = não encontrada; throw = erro real);
// aqui só mapeamos isso para o estado da página.
type DetailState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'not-found' }
  | { status: 'found'; technique: Technique }

export default function TecnicaDetalhe() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  useEffect(() => {
    if (!slug) {
      setState({ status: 'not-found' })
      return
    }

    // cancelled evita: (1) setState após desmontagem do componente e
    // (2) uma resposta antiga sobrescrever o estado se o usuário navegar
    // para outro slug antes desta requisição terminar — o cleanup abaixo
    // roda antes do próximo efeito (quando slug muda), então a resposta
    // "atrasada" da rota anterior encontra cancelled=true e é ignorada.
    let cancelled = false
    setState({ status: 'loading' })

    // getCategories()/getGoKyo() garantem que o cache de taxonomia esteja
    // populado antes de TechniqueDetail chamar resolveTechniqueDisplay
    // (síncrona) durante o render.
    Promise.all([getTechniqueBySlug(slug), getCategories(), getGoKyo()])
      .then(([technique]) => {
        if (cancelled) return
        setState(technique ? { status: 'found', technique } : { status: 'not-found' })
      })
      .catch(() => {
        if (cancelled) return
        setState({ status: 'error' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  // Preservar filtros/busca ao fechar:
  // Se o usuário veio da lista (/tecnicas com ou sem search params),
  // location.key !== 'default' indica que há histórico interno do React Router.
  // Nesse caso, navigate(-1) retorna ao estado anterior preservando os search params.
  // Se acessou diretamente via URL (link externo, nova aba), key === 'default'
  // e não há histórico — navigate('/tecnicas') é o fallback seguro.
  const handleClose = () => {
    if (location.key !== 'default') {
      navigate(-1)
    } else {
      navigate('/tecnicas')
    }
  }

  if (state.status === 'found') {
    return <TechniqueDetail technique={state.technique} onClose={handleClose} />
  }

  const content = {
    loading: {
      role: 'status' as const,
      title: 'Carregando…',
      body: null as string | null,
    },
    error: {
      role: 'alert' as const,
      title: 'Erro ao carregar a técnica',
      body: 'Não foi possível consultar o banco de dados. Tente novamente em instantes.',
    },
    'not-found': {
      role: 'main' as const,
      title: 'Técnica não encontrada',
      body: `O slug "${slug}" não corresponde a nenhuma técnica cadastrada.`,
    },
  }[state.status]

  return (
    <div className="tc-detail" role={content.role} aria-live={state.status === 'loading' ? 'polite' : undefined}>
      <div className="tc-detail-nav">
        <button
          className="tc-detail-back btn-secondary"
          onClick={() => navigate('/tecnicas')}
          type="button"
          aria-label="Voltar para lista de técnicas"
        >
          ← Técnicas
        </button>
      </div>
      <div className="tc-detail-body">
        <div className="tc-detail-left">
          <div className="tc-detail-name">
            <h1 className="tc-detail-romaji">{content.title}</h1>
            {content.body && <p className="tc-detail-portuguese">{content.body}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
