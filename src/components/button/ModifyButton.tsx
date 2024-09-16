import React from 'react'
import axios from 'axios'

const ModifyButton: React.FC<{ setlistId: string, children: React.ReactNode }> = ({ setlistId, children }) => {
    const handleClick = async () => {

        const url = `http://localhost:3000/api/modify/${setlistId}`;

        const response = await axios.get(url);
        const length: number = response.data.body.tracks.items.length;
        for (let i = 0; i < length; i++) {
            const artistLength: number = response.data.body.tracks.items[i].track.artists.length;
            console.log(response.data.body.tracks.items[i].track.album.images[1].url);
            console.log(response.data.body.tracks.items[i].track.name);
            // アーティスト名を取得
            let artistNames: string = '';
            for (let j = 0; j < artistLength; j++) {
                artistNames += (response.data.body.tracks.items[i].track.artists[j].name + (j < artistLength - 1 ? ', ' : '')); 
            }
            console.log(artistNames);
        }

        console.log(response.data.body.tracks.items[6].track);
        return response;
    }

    return (
        <button
            onClick={handleClick}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {children}
        </button>
    )

}


export default ModifyButton