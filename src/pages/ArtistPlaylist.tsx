import { useState } from 'react';
import {
    FormControl,
    Input,
    useDisclosure,
    Select,
    Option
} from "@yamada-ui/react"
import { Button } from "@yamada-ui/react"
import SearchModal from '../components/modal/SearchModal';

function ArtistPlaylist() {
    const [artistName, setArtistName] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);


    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleSiteChange = (value: string) => {
        setSelectedSite(value);
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/api/artist/search?q=${encodeURIComponent(artistName)}&site=${selectedSite}`);
            if (!response.ok) {
                throw new Error('APIリクエストに失敗しました');
            }
            const data = await response.json();
            console.log('API応答:', data);
            setData(data)
            onOpen()

        } catch (error) {
            console.error('エラー:', error);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div>
                {/* <h1>アーティスト名からプレイリスト作成</h1> */}
                <form onSubmit={handleSubmit}>
                    <Select placeholder="サイトを選択" onChange={handleSiteChange}>
                        <Option value="setlistfm">SetlistFM</Option>
                        <Option value="livefans">LiveFans (国内アーティストはこちら)</Option>
                    </Select>
                    <FormControl label="アーティスト名を入力してください">
                        <Input type="text" placeholder="アーティスト名" onChange={(e) => setArtistName(e.target.value)} />
                    </FormControl>
                    <br />
                    <Button type="submit" isDisabled={(artistName === '') || (selectedSite === '')}> {isLoading ? '検索中...' : '検索'}</Button>
                </form>

                <SearchModal isOpen={isOpen} onClose={onClose} artistName={artistName} data={data} selectedSite={selectedSite} />
            </div>
        </>
    );
}

export default ArtistPlaylist;