import { useState } from 'react'
import axios from 'axios';
import './App.css'
import Field from './components/Field'
import Button from './components/Button'
// import Spotify from 'react-spotify-embed'
import Iframe from "react-iframe";

interface Song {
  index: number;
  name: string;
  artist: string;
  original_artist: string;
  is_tape: boolean;
  is_cover: boolean;
  is_medley_part: boolean;
}

interface Setlist {
  artist_name: string;
  event_date: Date;
  location: string;
  venue: string;
  tour_name: string;
  songs: Song[];
  setlist_id: string;
}

export async function getSetlistFromSetlistFm(setlistFmId: string): Promise<Setlist> {
  const url = `http://localhost:3000/api/setlistfm/${setlistFmId}`;
  const headers = {
    "x-api-key": "rvH9s-nOQE4FOGgLByWj1VfmjzqIaEt5Q8wB",
    "Accept": "application/json",
    'Access-Control-Allow-Origin': '*'
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

export async function getSetlistFromLiveFans(liveFansID: string): Promise<Setlist> {

  const url = `http://localhost:3000/api/livefans/${liveFansID}`;

  const response = await axios.get(url);
  return response.data;
};


function App() {
  const [inputValue, setInputValue] = useState('')

  const [setlist, setSetlist] = useState<Setlist | null>(null); // setlistの状態を追加

  const generate_url = () => {  // URLからID部分を取得　
    if (inputValue.includes("setlist.fm")) {
      const last_hyphen_index = inputValue.lastIndexOf("-")
      const dot_html_index = inputValue.lastIndexOf(".html")

      const id_part = inputValue.substring(last_hyphen_index + 1, dot_html_index);

      return id_part
    } else if (inputValue.includes("livefans.jp")) {
      const last_slash_index = inputValue.lastIndexOf("/")
      const id_part = inputValue.substring(last_slash_index + 1)
      return id_part
    }
  }

  const setlistFM = async () => {
    console.log('Input value:', inputValue);

    const id_part = generate_url();

    if (!id_part) { // id_partがundefinedの場合の処理
      console.error('ID part is undefined');
      return; // 処理を中断
    }

    try {
      let fetchedSetlist = await getSetlistFromSetlistFm(id_part);
      console.log('Setlist:', fetchedSetlist);
      setSetlist(fetchedSetlist); // 取得したsetlistを状態に保存      
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const liveFans = async () => {
    console.log('Input value:', inputValue);

    const id_part = generate_url();

    if (!id_part) { // id_partがundefinedの場合の処理
      console.error('ID part is undefined');
      return; // 処理を中断
    }

    try {
      let setlist = await getSetlistFromLiveFans(id_part);
      console.log('Setlist:', setlist);
      setSetlist(setlist); // 取得したsetlistを状態に保存
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <h1 className="text-5xl">プレイリスト作成アプリ</h1>
      <p>このアプリはsetlist.fmのURLからSpotifyのプレイリストを作成するアプリです</p>
      <div className="p-4">
        <Field value={inputValue} onChange={setInputValue} />
        <br />
        <Button onClick={setlistFM}>setlistFMから作成</Button>
        <br />
        <br />
        <Button onClick={liveFans}>LiveFansから作成</Button>
      </div>

      <Iframe
        url={setlist ? `https://open.spotify.com/embed/playlist/${setlist.setlist_id} ` : ""}
        width="100%"
        height="600px"
      />
    </>
  )
}

export default App





