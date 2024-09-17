import React, { useState } from 'react'
import { Button } from '@yamada-ui/react'
import axios from 'axios'
import Iframe from "react-iframe";
import { Track } from '../../types/Track'


const ReplaceButton: React.FC<{ setlistId: string; tracks: Track[]; children: React.ReactNode; isReplaced: boolean }> = ({ setlistId, tracks, children, isReplaced }) => {
    const [isClick, setIsClick] = useState<boolean>(false)

    const [playlistId, setPlaylistId] = useState<string | null>(null) // playlistId の状態を追加

    const handleClick = async () => {
        const trackIds = tracks.map(track => track.id)
        console.log(trackIds)
        const url = `http://localhost:3000/api/recreate/playlist/${setlistId}`
        const response = await axios.post(url, trackIds)

        const playlistId = response.data

        setPlaylistId(playlistId) // playlistId を状態に設定
        setIsClick(true)

        console.log(response.data)

        return response


    }
    return (
        <>
            {isReplaced && <Button
                onClick={handleClick}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {children}
            </Button>
            }
            {isClick && <Iframe
                url={setlistId ? `https://open.spotify.com/embed/playlist/${playlistId} ` : []}
                width="100%"
                height="600px"
            />}


        </>

    )

}


export default ReplaceButton