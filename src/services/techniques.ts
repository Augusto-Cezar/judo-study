import { supabase } from '../lib/supabase'
import { type Technique } from '../types/index'
import { getCategoryById, getGoKyoById, getParentCategory } from './categories'

/**
 * Retorna todas as técnicas disponíveis, consultando o Supabase.
 * Não há cache aqui — cada chamada busca o estado atual da tabela.
 * Lança (throw) se a consulta falhar; erros de rede/banco nunca viram
 * silenciosamente uma lista vazia.
 */
export async function getTechniques(): Promise<Technique[]> {
  const { data, error } = await supabase
    .from('techniques')
    .select('*')
    .order('romaji_name', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

/**
 * Retorna uma técnica pelo seu slug, ou undefined se não encontrada.
 * undefined significa exclusivamente "técnica inexistente" — qualquer
 * outro problema (rede, banco) lança (throw) em vez de retornar
 * undefined, para que os dois casos nunca sejam confundidos pelo
 * consumidor. .maybeSingle() é o que permite essa distinção: erro real
 * vem em `error`, zero linhas encontradas vem como `data: null` sem erro.
 */
export async function getTechniqueBySlug(slug: string): Promise<Technique | undefined> {
  const { data, error } = await supabase
    .from('techniques')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data ?? undefined
}

/**
 * Resolve as relações de taxonomia de uma técnica: sua subcategoria
 * (category), o grupo raiz dessa subcategoria (parent) e o grupo do
 * Go-kyō, quando existir. Continua 100% síncrona: opera sobre o cache
 * em memória de services/categories.ts, que precisa já estar carregado
 * (getCategories()/getGoKyo() já terem sido aguardadas por algum
 * ancestral) antes desta função ser chamada. Retorna apenas os objetos
 * de dados — nenhuma formatação de apresentação pertence aqui.
 */
export function resolveTechniqueDisplay(technique: Technique) {
  const category = getCategoryById(technique.category_id)
  const parent = getParentCategory(technique.category_id)
  const gokyo = technique.go_kyo_id ? getGoKyoById(technique.go_kyo_id) : null

  return { category, parent, gokyo }
}
