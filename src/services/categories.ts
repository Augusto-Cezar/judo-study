import { supabase } from '../lib/supabase'
import { type Category, type GoKyo } from '../types/index'

// Cache em memória, preenchido pela primeira chamada bem-sucedida de
// getCategories()/getGoKyo(). Os helpers de lookup abaixo operam sobre
// esse cache — nunca disparam uma query própria (evita N+1). Por isso,
// getCategories()/getGoKyo() precisam ter sido chamadas (e aguardadas)
// por algum ancestral antes de qualquer helper síncrono ser usado.
// Hoje isso é garantido por TechniqueExplorer, Home e TecnicaDetalhe,
// que aguardam as duas antes de renderizar qualquer filho que dependa
// de resolveTechniqueDisplay/TechniqueFilters.
let categoriesCache: Category[] = []
let categoriesPromise: Promise<Category[]> | null = null

let goKyoCache: GoKyo[] = []
let goKyoPromise: Promise<GoKyo[]> | null = null

/**
 * Busca todas as categorias (grupos raiz + subcategorias) no Supabase.
 * A primeira chamada dispara a query; chamadas subsequentes — de
 * qualquer página, durante a mesma sessão — reaproveitam a mesma
 * promise/array em cache, sem nova requisição.
 */
export function getCategories(): Promise<Category[]> {
  if (!categoriesPromise) {
    categoriesPromise = supabase
      .from('categories')
      .select('*')
      .then(({ data, error }) => {
        if (error) {
          categoriesPromise = null
          throw error
        }
        categoriesCache = data ?? []
        return categoriesCache
      })
  }
  return categoriesPromise
}

/**
 * Busca os grupos do Go-kyō no Supabase, ordenados por order_index.
 * Mesmo padrão de cache de getCategories().
 */
export function getGoKyo(): Promise<GoKyo[]> {
  if (!goKyoPromise) {
    goKyoPromise = supabase
      .from('go_kyo')
      .select('*')
      .order('order_index', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          goKyoPromise = null
          throw error
        }
        goKyoCache = data ?? []
        return goKyoCache
      })
  }
  return goKyoPromise
}

/**
 * Retorna apenas as categorias raiz (parent_id null): Nage-waza e
 * Katame-waza. Opera sobre o cache em memória.
 */
export function getRootCategories(): Category[] {
  return categoriesCache.filter((c) => c.parent_id === null)
}

/**
 * Retorna as subcategorias de um grupo raiz específico (pelo parentId),
 * ou todas as subcategorias se nenhum parentId for informado. Opera
 * sobre o cache em memória.
 */
export function getSubcategories(parentId?: string): Category[] {
  const subs = categoriesCache.filter((c) => c.parent_id !== null)
  if (parentId === undefined) return subs
  return subs.filter((c) => c.parent_id === parentId)
}

/**
 * Retorna uma categoria pelo seu id (uuid), ou undefined se não
 * encontrada. Opera sobre o cache em memória.
 */
export function getCategoryById(id: string): Category | undefined {
  return categoriesCache.find((c) => c.id === id)
}

/**
 * Retorna um grupo do Go-kyō pelo seu id (uuid), ou undefined se não
 * encontrado. Opera sobre o cache em memória.
 */
export function getGoKyoById(id: string): GoKyo | undefined {
  return goKyoCache.find((g) => g.id === id)
}

/**
 * Retorna a categoria pai de uma subcategoria pelo seu id, ou undefined
 * se a categoria não tiver pai (já for raiz). Opera sobre o cache em
 * memória.
 */
export function getParentCategory(categoryId: string): Category | undefined {
  const cat = getCategoryById(categoryId)
  if (!cat?.parent_id) return undefined
  return getCategoryById(cat.parent_id)
}
