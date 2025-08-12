import { PrivateRoute } from '../guards'
import { MainLayout } from '@/layout'
import { RouteConfig } from '../types'
import { Navigate } from 'react-router-dom'
import { AppRoute } from '../paths'

import HomePage from '@/pages/home'
import SearchPage from '@/pages/search'
import WritePage from '@/pages/write'
import ToolPage from '@/pages/tool'
import PricePage from '@/pages/price'
import DiscoverPage from '@/pages/discover'
import UserPage from '@/pages/user'

export const appRoutes: RouteConfig[] = [
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/search" replace />,
        index: true,
      },
      {
        path: AppRoute.Home,
        element: <HomePage />,
        index: false,
      },
      {
        path: AppRoute.Search,
        element: <SearchPage />,
        index: false,
      },
      {
        path: AppRoute.Write,
        element: <WritePage />,
        index: false,
      },
      {
        path: AppRoute.Tool,
        element: <ToolPage />,
        index: false,
      },
      {
        path: AppRoute.Price,
        element: <PricePage />,
        index: false,
      },
      {
        path: AppRoute.Discover,
        element: <DiscoverPage />,
        index: false,
      },
      {
        path: AppRoute.User,
        element: <UserPage />,
        index: false,
      },
    ],
    protected: true,
  },
]
