import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'
import { Box, Heading } from "@yamada-ui/react"
import './App.css'
import Sidebar from './components/Sidebar'
import UrlPlaylist from './pages/UrlPlaylist'
import ArtistPlaylist from './pages/ArtistPlaylist'

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {



  const location = useLocation()
  const isHomePage = location.pathname === "/"



  return (
    <Box minHeight="100vh" p={8}>
      <Sidebar />
      {isHomePage && (
        <Heading as="h1" size="2xl" mb={8} textAlign="center">
          プレイリスト作成アプリ
        </Heading>
      )}
      <Routes>
        <Route path="/url" element={<UrlPlaylist />} />
        <Route path="/artist" element={<ArtistPlaylist />} />
      </Routes>
    </Box>
  )
}

export default App