// import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'
import {
  Button,
  VStack,
  Box,
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
  IconButton,
} from "@yamada-ui/react"
// import { HamburgerIcon } from "@yamada-ui/icon"
import { Menu } from "@yamada-ui/lucide"
import './App.css'
import UrlPlaylist from './pages/UrlPlaylist'
import ArtistPlaylist from './pages/ArtistPlaylist'

function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const location = useLocation()

  return (
    <>
      <IconButton
        icon={<Menu />}
        onClick={onOpen}
        position="fixed"
        top={4}
        left={4}
        zIndex={2}
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerHeader borderBottomWidth="1px">プレイリスト作成</DrawerHeader>
        <DrawerBody>
          <VStack align="stretch">
            <Button
              as={Link}
              to="/url"
              variant={location.pathname === "/" ? "solid" : "ghost"}
              justifyContent="flex-start"
              onClick={onClose}
            >
              URLから作成
            </Button>
            <Button
              as={Link}
              to="/artist"
              variant={location.pathname === "/artist" ? "solid" : "ghost"}
              justifyContent="flex-start"
              onClick={onClose}
            >
              アーティスト名から作成
            </Button>
          </VStack>
        </DrawerBody>

      </Drawer>
    </>
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App