import React, { useState } from 'react';


function ArtistPlaylist() {
    const [artistName, setArtistName] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // ここでアーティスト名を使用した処理を追加します
        console.log('検索されたアーティスト名:', artistName);
    };

    return (
        <div>
            <h1>アーティスト名からプレイリスト作成</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    placeholder="アーティスト名を入力"
                    required
                />
                <button type="submit">検索</button>
            </form>
        </div>
    );
}

export default ArtistPlaylist;