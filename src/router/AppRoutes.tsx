import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RouteConfig } from './types'

interface AppRoutesProps {
  routes: RouteConfig[]
}

const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => {
    const key = route.path || index

    if (route.children) {
      return (
        <Route key={key} path={route.path} element={route.element}>
          {route.children.map((child, childIndex) => {
            const childKey = `${key}-${child.path || childIndex}`

            if (child.index) {
              return <Route key={childKey} index element={child.element} />
            }

            return (
              <Route key={childKey} path={child.path} element={child.element}>
                {child.children && renderRoutes(child.children)}
              </Route>
            )
          })}
        </Route>
      )
    }

    return <Route key={key} path={route.path} element={route.element} />
  })
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ routes }) => {
  return <Routes>{renderRoutes(routes)}</Routes>
}
