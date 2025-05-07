import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Box, Heading } from "@yamada-ui/react"
import './App.css'
import Sidebar from './components/Sidebar'
import UrlPlaylist from './pages/UrlPlaylist'
import ArtistPlaylist from './pages/ArtistPlaylist'

function App() {
  return (
    <Router basename="/setlistconverter">
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <Box className="fixed inset-0 w-full min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-auto">
      <Sidebar />
      {isHomePage && (
        <Heading as="h1" size="2xl" mb={8} textAlign="center" className="text-white pt-8">
          プレイリスト作成アプリ
        </Heading>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/artist" replace />} />
        <Route path="/url" element={<UrlPlaylist />} />
        <Route path="/artist" element={<ArtistPlaylist />} />
      </Routes>
    </Box>
  )
}

export default App