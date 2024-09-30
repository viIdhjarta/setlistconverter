import { useState } from 'react'
import axios from 'axios';
import './App.css'
import Field from './components/Field'
// import Button from './components/Button'
// import Spotify from 'react-spotify-embed'
import ModifyButton from './components/button/ModifyButton';
import Iframe from "react-iframe";
import { Checkbox, CheckboxGroup, Select, Option, useLoading, useBoolean, Button } from "@yamada-ui/react"
import { XAPIKEY } from '../env'


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

function App() {
  const { page } = useLoading();

  const [urlValue, setUrlValue] = useState('')

  const [selectedSite, setSelectedSite] = useState('');

  const [setlist, setSetlist] = useState<Setlist | null>(null); // setlistの状態を追加

  const [isCoverChecked, { toggle: toggleCover }] = useBoolean(false)

  const [errorMessage, setErrorMessage] = useState<boolean | null>(null);

  const [showIframe, setShowIframe] = useState<boolean>(true);


  const getSetlist = async (setlistId: string, isCover: boolean, selectSite: string): Promise<Setlist> => {
    if (selectSite === "SetlistFM") {
      const url = `http://localhost:3000/api/setlistfm/${setlistId}`;
      // const url = `http://localhost:3000/api/setlistfm/73a8cef5`;
      const headers = {
        "x-api-key": XAPIKEY,
        "Accept": "application/json",
        'Access-Control-Allow-Origin': '*'
      };

      const response = await axios.get(url, { headers, params: { isCover } }); // クエリパラメータでisCoverとisTapeを送信

      return response.data;
    } else if (selectSite === "LiveFans") {
      const url = `http://localhost:3000/api/livefans/${setlistId}`;

      const response = await axios.get(url, { params: { isCover } });
      return response.data;
    }

    throw new Error("Invalid site selected");
  }


  const generate_url = () => {  // URLからID部分を取得　
    if (urlValue.includes("setlist.fm")) {
      const last_hyphen_index = urlValue.lastIndexOf("-")
      const dot_html_index = urlValue.lastIndexOf(".html")

      const id_part = urlValue.substring(last_hyphen_index + 1, dot_html_index);

      return id_part
    } else if (urlValue.includes("livefans.jp")) {
      const last_slash_index = urlValue.lastIndexOf("/")
      const id_part = urlValue.substring(last_slash_index + 1)
      return id_part
    }
  }

  const feachApi = async () => {    // 入力されたURLからID部分を取得し、APIを叩く
    const id_part = generate_url();

    if (!id_part) { // id_partがundefinedの場合の処理
      console.error('ID part is undefined');
      setErrorMessage(true);
      return; // 処理を中断
    }

    try {
      page.start();
      let fetchedSetlist = await getSetlist(id_part, isCoverChecked, selectedSite);
      console.log('Setlist:', fetchedSetlist);
      console.log('isCover:', isCoverChecked);

      setSetlist(fetchedSetlist); // 取得したsetlistを状態に保存      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(true);
    } finally {
      page.finish();
    }

  };

  const handleButtonClick = () => {
    feachApi();
  }

  const handleSiteChange = (value: string) => {
    setSelectedSite(value);
  }


  return (
    <>


      <h1 className="text-5xl">プレイリスト作成アプリ</h1>
      <p>セットリスト投稿サイトのURLからSpotifyプレイリストを作成</p>

      {!setlist && (
        <div className="p-4">
          <Select placeholder="サイトを選択" onChange={handleSiteChange}>
            <Option value="SetlistFM">SetlistFM</Option>
            <Option value="LiveFans">LiveFans</Option>
          </Select>
          <div>
            {selectedSite && (
              <CheckboxGroup>
                <Checkbox defaultChecked={true} isChecked={isCoverChecked} onChange={toggleCover}>カバー曲を除外</Checkbox>
              </CheckboxGroup>)}
          </div>
          <Field isInvalid={errorMessage !== null} value={urlValue} onChange={setUrlValue} placeholder={selectedSite} />
          <br />
          <br />
          {!setlist && (
            <Button onClick={handleButtonClick} isDisabled={(selectedSite === "") || (urlValue === "")}>プレイリストを作成</Button>
          )}

        </div>
      )}

      {showIframe && setlist && (
        <>
        <br />
        <br />  
        <Iframe
          url={`https://open.spotify.com/embed/playlist/${setlist.setlist_id}`}
          width="100%"
          height="600px"
        />
        </>
      )}

      {setlist && (
        <>
          <br />
          <div>セットリストに問題がある場合↓</div>
          {/* <ModifyButton setlistId={setlist.setlist_id}>{"プレイリストを修正"}</ModifyButton > */}
          <ModifyButton setlistId={setlist.setlist_id} setShowIframe={setShowIframe}>{"プレイリストを修正"}</ModifyButton >
        </>
      )}

    </>


  )
}

export default App





