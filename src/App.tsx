import { useState } from 'react'
import axios from 'axios';
import './App.css'
import Field from './components/Field'
import Button from './components/Button'

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
}

export async function getSetlistFromSetlistFm(setlistFmId: string): Promise<Setlist> {
  const url = `http://localhost:3000/api/setlist/${setlistFmId}`;
  const headers = {
    "x-api-key": "rvH9s-nOQE4FOGgLByWj1VfmjzqIaEt5Q8wB",
    "Accept": "application/json",
    'Access-Control-Allow-Origin': '*'
  };

  const response = await axios.get(url, { headers });
  return response.data;
};

export async function getSetlistFromLiveFans(): Promise<Setlist> {

  const url = `http://localhost:3000/scrape`;

  const headers = {
    "Accept": "application/json",
    'Access-Control-Allow-Origin': '*'
  };

  const response = await axios.get(url, { headers });
  return response.data;
};


function App() {
  const [inputValue, setInputValue] = useState('')

  const setlistFM = async () => {
    console.log('Input value:', inputValue);

    try {
      let setlist = await getSetlistFromSetlistFm('43ab9f07');
      console.log('Setlist:', setlist.songs);
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const liveFans = async () => {
    console.log('Input value:', inputValue);

    try {
      let setlist = await getSetlistFromLiveFans();
      console.log('Setlist:', setlist);
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
        <Button onClick={liveFans}>LiveFansから作成</Button>
      </div>
    </>
  )
}

export default App





