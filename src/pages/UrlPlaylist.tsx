import { useState } from 'react'
import axios from 'axios';
import Field from '../components/Field'
import ModifyButton from '../components/button/ModifyButton';
import Iframe from "react-iframe";
import { Checkbox, CheckboxGroup, Select, Option, useLoading, useBoolean, Button, Text, Box, VStack, HStack, Divider } from "@yamada-ui/react"
import { FiLink, FiMusic, FiEdit2 } from 'react-icons/fi';
import { API_ENDPOINTS } from '../config';
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

function UrlPlaylist() {
    const { page } = useLoading();

    const [urlValue, setUrlValue] = useState('')

    const [selectedSite, setSelectedSite] = useState('');

    const [setlist, setSetlist] = useState<Setlist | null>(null); // setlistの状態を追加

    const [isCoverChecked, { toggle: toggleCover }] = useBoolean(false)

    const [errorMessage, setErrorMessage] = useState<boolean | null>(null);

    const [showIframe, setShowIframe] = useState<boolean>(true);


    const getSetlist = async (setlistId: string, isCover: boolean, selectSite: string): Promise<Setlist> => {
        if (selectSite === "SetlistFM") {
            const url = API_ENDPOINTS.SETLISTFM(setlistId);

            const headers = {
                "Accept": "application/json",
                'Access-Control-Allow-Origin': '*'
            };

            const response = await axios.get(url, { headers, params: { isCover } }); // クエリパラメータでisCoverとisTapeを送信

            return response.data;
        } else if (selectSite === "LiveFans") {

            const url = API_ENDPOINTS.LIVEFANS(setlistId);


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
        <div className="p-6">
            {!setlist ? (
                <Box
                    bg="white"
                    shadow="sm"
                    rounded="md"
                    p={6}
                    className="transform transition-all duration-500 hover:scale-100 hover:shadow-lg"
                >
                    <VStack gap="6" alignItems="center">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                            <FiLink className="w-10 h-10 text-indigo-600" />
                        </div>

                        <Text fontSize="3xl" fontWeight="bold" className="text-gray-800">
                            プレイリスト作成アプリ
                        </Text>

                        <Text fontSize="md" className="text-center text-gray-500">
                            セットリスト投稿サイトのURLからSpotifyプレイリストを作成
                        </Text>

                        <Divider />

                        <VStack gap="4" className="w-full">
                            <Select
                                placeholder="サイトを選択"
                                onChange={handleSiteChange}
                                variant="filled"
                                className="shadow-sm"
                                size="lg"
                            >
                                <Option value="SetlistFM">SetlistFM</Option>
                                <Option value="LiveFans">LiveFans</Option>
                            </Select>

                            {selectedSite && (
                                <Box className="w-full bg-gray-50 p-3 rounded-md">
                                    <CheckboxGroup>
                                        <Checkbox
                                            defaultChecked={true}
                                            isChecked={isCoverChecked}
                                            onChange={toggleCover}
                                            colorScheme="purple"
                                        >
                                            カバー曲を除外
                                        </Checkbox>
                                    </CheckboxGroup>
                                </Box>
                            )}

                            <Field
                                isInvalid={errorMessage !== null}
                                value={urlValue}
                                onChange={setUrlValue}
                                placeholder={selectedSite ? `${selectedSite}のURLを入力` : "URLを入力"}
                                label="URLを入力"
                            />

                            <Button
                                onClick={handleButtonClick}
                                isDisabled={(selectedSite === "") || (urlValue === "")}
                                colorScheme="primary"
                                size="lg"
                                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
                                leftIcon={<FiMusic />}
                            >
                                プレイリストを作成
                            </Button>
                        </VStack>
                    </VStack>
                </Box>
            ) : (
                <Box
                    bg="white"
                    shadow="sm"
                    rounded="md"
                    p={6}
                >
                    <VStack gap="6">
                        {setlist && (
                            <div className="text-center w-full">
                                <Text fontSize="2xl" fontWeight="bold" className="text-gray-800">
                                    {setlist.artist_name}
                                </Text>
                                <Text fontSize="md" className="text-gray-600">
                                    {setlist.venue} - {new Date(setlist.event_date).toLocaleDateString('ja-JP')}
                                </Text>
                                {setlist.tour_name && (
                                    <Text fontSize="sm" className="text-gray-500 mt-1">
                                        {setlist.tour_name}
                                    </Text>
                                )}
                            </div>
                        )}

                        {showIframe && setlist && (
                            <Box className="w-full rounded-lg overflow-hidden shadow-md">
                                <Iframe
                                    url={`https://open.spotify.com/embed/playlist/${setlist.setlist_id}`}
                                    width="100%"
                                    height="450px"
                                    className="border-0"
                                />
                            </Box>
                        )}

                        {setlist && (
                            <HStack gap="4" className="mt-4 justify-center">
                                <ModifyButton
                                    setlistId={setlist.setlist_id}
                                    setShowIframe={setShowIframe}
                                >
                                    <HStack>
                                        <FiEdit2 />
                                        <Text>プレイリストを修正</Text>
                                    </HStack>
                                </ModifyButton>

                                <Button
                                    colorScheme="gray"
                                    variant="outline"
                                    onClick={() => {
                                        setSetlist(null);
                                        setUrlValue('');
                                        setShowIframe(true);
                                        setErrorMessage(null);
                                    }}
                                >
                                    新しいプレイリストを作成
                                </Button>
                            </HStack>
                        )}
                    </VStack>
                </Box>
            )}
        </div>
    )
}

export default UrlPlaylist





