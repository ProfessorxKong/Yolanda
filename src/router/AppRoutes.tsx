import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/layout/MainLayout'
import HomePage from '@/pages/home'
import SearchPage from '@/pages/search'
import WritePage from '@/pages/write'
import ToolPage from '@/pages/tool'
import PricePage from '@/pages/price'
import DiscoverPage from '@/pages/discover'
import UserPage from '@/pages/user'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/search" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="tool" element={<ToolPage />} />
        <Route path="price" element={<PricePage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="user" element={<UserPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
