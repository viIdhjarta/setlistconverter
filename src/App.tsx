import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Button } from "@yamada-ui/react"
import './App.css';
import UrlPlaylist from './pages/UrlPlaylist';
import ArtistPlaylist from './pages/ArtistPlaylist';


function App() {
  return (
    <Router>
      <div>
        <h1 className="text-5xl">プレイリスト作成アプリ</h1>
        <nav>
          <Button as={Link} to="/">URLからプレイリスト作成</Button>
          <Button as={Link} to="/artist">アーティスト名からプレイリスト作成</Button>
        </nav>

        <Routes>
          <Route path="/" element={<UrlPlaylist />} />
          <Route path="/artist" element={<ArtistPlaylist />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;