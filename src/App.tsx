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

export async function getSetlist(setlistFmId: string): Promise<Setlist> {
  // const url = `https://api.setlist.fm/rest/1.0/setlist/${setlistFmId}`;
  const url = `http://localhost:3000/api/setlist/${setlistFmId}`;
  const headers = {
    "x-api-key": "rvH9s-nOQE4FOGgLByWj1VfmjzqIaEt5Q8wB",
    "Accept": "application/json",
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data;

    const artistName = data.artist.name;
    const eventDate = new Date(data.eventDate.split('-').reverse().join('-'));
    const venueData = data.venue;
    const cityData = venueData.city;
    const country = cityData.country.name;
    const city = `${cityData.name}, ${country}`;
    const venue = venueData.name;
    const tourName = data.tour?.name || "";


    const setlistSongs: Song[] = [];
    let index = 0;

    data.sets.set.forEach((setData: any) => {
      setData.song.forEach((songData: any) => {
        index++;
        const songName = songData.name;
        const isTape = songData.tape || false;
        const isCover = 'cover' in songData;
        const medleyParts = songName.split(" / ");
        const isMedleyPart = medleyParts.length > 1;

        medleyParts.forEach((medleyPart: string) => {
          const originalArtist = isCover ? songData.cover.name : artistName;
          const song: Song = {
            index,
            name: medleyPart,
            artist: artistName,
            original_artist: originalArtist,
            is_tape: isTape,
            is_cover: isCover,
            is_medley_part: isMedleyPart
          };
          setlistSongs.push(song);
        });
      });
    });

    const setlist: Setlist = {
      artist_name: artistName,
      event_date: eventDate,
      location: city,
      venue: venue,
      tour_name: tourName,
      songs: setlistSongs
    };

    return setlist;
  } catch (error) {
    console.error('Error fetching setlist:', error);
    throw error;
  }
}

function App() {
  const [inputValue, setInputValue] = useState('')

  const handleButtonClick = () => {
    console.log('Input value:', inputValue);
    // ここで入力値を使って何かを行うことができます
    let setlist = getSetlist('2b522c02')
    console.log('Setlist:', setlist)


  };

  return (
    <>
      <h1 className="text-5xl">プレイリスト作成アプリ</h1>
      <p>このアプリはsetlist.fmのURLからSpotifyのプレイリストを作成するアプリです</p>
      <div className="p-4">
        <Field value={inputValue} onChange={setInputValue} />
        <br />
        <Button onClick={handleButtonClick}>作成</Button>
      </div>
    </>
  )
}

export default App





