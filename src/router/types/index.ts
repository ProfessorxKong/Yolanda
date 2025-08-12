import { ReactNode } from 'react'

export interface RouteConfig {
  path: string
  element: ReactNode
  children?: RouteConfig[]
  index?: boolean
  protected?: boolean
  public?: boolean
  layout?: 'main' | 'auth' | 'none'
  showNavigationTabs?: boolean
  backgroundColor?: string
}
