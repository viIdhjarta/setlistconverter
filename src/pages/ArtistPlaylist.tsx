import { useState } from 'react';
import {
    FormControl,
    Input,
    useDisclosure,
    Select,
    Option,
    Text,
    VStack,
    Box
} from "@yamada-ui/react"
import { Button } from "@yamada-ui/react"
import SearchModal from '../components/modal/SearchModal';
import { FiMusic, FiSearch } from 'react-icons/fi';
import { API_ENDPOINTS } from '../config';

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
            const response = await fetch(`${API_ENDPOINTS.ARTIST_SEARCH}?q=${encodeURIComponent(artistName)}&site=${selectedSite}`);
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
        <div className="p-6">
            <Box
                bg="white"
                shadow="sm"
                rounded="md"
                p={6}
                className="transform transition-all duration-500 hover:scale-100 hover:shadow-lg"
            >
                <VStack gap="6" alignItems="center">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                        <FiMusic className="w-10 h-10 text-indigo-600" />
                    </div>

                    <Text fontSize="2xl" fontWeight="bold" className="text-gray-800">
                        アーティストからプレイリストを作成
                    </Text>

                    <Text fontSize="md" className="text-center text-gray-500">
                        アーティスト名から過去のセットリストを検索し、Spotifyプレイリストを作成します
                    </Text>

                    <form onSubmit={handleSubmit} className="w-full space-y-4">
                        <Select
                            placeholder="サイトを選択"
                            onChange={handleSiteChange}
                            variant="filled"
                            className="shadow-sm"
                            size="lg"
                        >
                            <Option value="setlistfm">SetlistFM</Option>
                            <Option value="livefans">LiveFans (国内アーティストはこちら)</Option>
                        </Select>

                        <FormControl label="アーティスト名を入力してください">
                            <Input
                                type="text"
                                placeholder="アーティスト名"
                                onChange={(e) => setArtistName(e.target.value)}
                                size="lg"
                                variant="filled"
                                className="shadow-sm"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            isDisabled={(artistName === '') || (selectedSite === '')}
                            colorScheme="primary"
                            size="lg"
                            className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                            leftIcon={<FiSearch />}
                        >
                            {isLoading ? '検索中...' : '検索'}
                        </Button>
                    </form>
                </VStack>
            </Box>

            <SearchModal isOpen={isOpen} onClose={onClose} artistName={artistName} data={data} selectedSite={selectedSite} />
        </div>
    );
}

export default ArtistPlaylist;