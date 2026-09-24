export type Locale = 'az' | 'ru' | 'en'

export type LocalizedText = Record<Locale, string>

export type CategoryId =
  | 'reproductive-health'
  | 'pregnancy'
  | 'oncology'
  | 'exome'
  | 'neurology'
  | 'hla'
  | 'monogenic'
  | 'kinship'
  | 'cardiology'
  | 'dermatology'
  | 'ent'
  | 'endocrinology'
  | 'gastroenterology'
  | 'hematology'
  | 'hereditary-cancer'
  | 'immunology'
  | 'malformations'
  | 'metabolic'
  | 'nephrology'
  | 'ophthalmology'
  | 'pulmonology'
  | 'mitochondrial'
  | 'reproductive-genetics'

/** Oncology subcategory ids; also used as tags on oncology analyses. */
export type OncologySubcategoryId =
  | 'hereditary-onco-panel'
  | 'liquid-biopsy-ctdna'
  | 'solid-tumour-ffpe'
  | 'onco-panel'
  | 'onko-single-genes'
  | 'onko-real-time-pcr-tests'
  | 'hematological-malignancies'

export interface CatalogMeta {
  currency: 'AZN'
  usdToAzn: number
  eurToAzn: number
  version: number
}

export interface Subcategory {
  id: OncologySubcategoryId
  name: LocalizedText
}

export interface Category {
  id: CategoryId
  name: LocalizedText
  description: LocalizedText
  /** lucide-react icon name in kebab-case, e.g. "heart-pulse" */
  icon: string
  order: number
  featured: boolean
  subcategories?: Subcategory[]
}

export interface Analysis {
  id: string
  categoryId: CategoryId
  name: LocalizedText
  description: LocalizedText
  /** null when the price list has no price ("price on request") */
  priceAzn: number | null
  method: LocalizedText | null
  sampleType: LocalizedText | null
  /** e.g. "4-6 weeks", "10 days" */
  turnaround: string | null
  /** gene list, detected variants or technical scope */
  explanation: LocalizedText | null
  tags: string[]
  featured: boolean
}

export interface Catalog {
  meta: CatalogMeta
  categories: Category[]
  analyses: Analysis[]
}
