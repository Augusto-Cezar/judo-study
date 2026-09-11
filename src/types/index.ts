export interface Category {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

export interface GoKyo {
  id: string
  name: string
  order_index: number
}

export interface Technique {
  id: string
  japanese_name: string
  romaji_name: string
  portuguese_name: string
  slug: string
  description: string | null
  category_id: string
  go_kyo_id: string | null
  image_url: string | null
  video_url: string | null
}
