import { BrowserRouter as Router, useLocation } from 'react-router-dom'
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@yamada-ui/react"
import './App.css'
import { FiLink, FiUser } from 'react-icons/fi'
import UrlPlaylist from './pages/UrlPlaylist'
import ArtistPlaylist from './pages/ArtistPlaylist'
import { useState } from 'react'

function App() {
  return (
    <Router basename="/setlistconverter">
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const [tabIndex, setTabIndex] = useState(location.pathname === "/url" ? 1 : 0);

  return (
    <Box className="fixed inset-0 w-full min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-auto">
      <div className="container mx-auto py-8 px-4 max-w-6xl">


        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <Tabs variant="enclosed" colorScheme="purple" index={tabIndex} onChange={(index) => setTabIndex(index)}>
            <TabList className="px-4 py-3 bg-gray-50">
              <Tab
                className={`flex items-center px-6 py-3 font-medium rounded-t-lg transition-colors ${tabIndex === 0 ? 'text-purple-600 bg-white border-t border-l border-r border-gray-200' : 'text-gray-600 hover:text-purple-500'}`}
              >
                <FiUser className="mr-2" />
                アーティスト名から検索
              </Tab>
              <Tab
                className={`flex items-center px-6 py-3 font-medium rounded-t-lg transition-colors ${tabIndex === 1 ? 'text-purple-600 bg-white border-t border-l border-r border-gray-200' : 'text-gray-600 hover:text-purple-500'}`}
              >
                <FiLink className="mr-2" />
                URLから作成
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel padding={0}>
                <div className="p-0">
                  <ArtistPlaylist />
                </div>
              </TabPanel>
              <TabPanel padding={0}>
                <div className="p-0">
                  <UrlPlaylist />
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </Box>
  )
}

export default App