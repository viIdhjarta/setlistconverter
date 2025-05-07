import { useState, useRef, useEffect } from 'react'
import {
    useLoading
} from '@yamada-ui/react'
import Iframe from "react-iframe";
import { FiMusic, FiX } from 'react-icons/fi';

type ConfirmModalProps = {
    isOpen: boolean
    onClose: () => void
    setlist_id: string
    selectedSite: string
}

export default function ConfirmModal({ isOpen, onClose, setlist_id, selectedSite }: ConfirmModalProps) {
    const [setlist, setSetlist] = useState<any>(null)
    const [showPlaylist, setShowPlaylist] = useState(false)
    const { page } = useLoading()
    const iframeRef = useRef<HTMLDivElement>(null)

    // モーダルがオープンしている間は背景のスクロールを禁止
    useEffect(() => {
        if (isOpen || showPlaylist) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, showPlaylist]);

    const handleClick = async () => {
        page.start()
        console.log("プレイリストを作成します")
        onClose()

        try {
            const url = `https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/api/${selectedSite}/${setlist_id}`;

            const response = await fetch(url);
            const data = await response.json()
            setSetlist(data)
            setShowPlaylist(true)
        } catch (error) {
            console.error('エラー:', error);
        } finally {
            page.finish()
        }
    }

    const handleBackToSearch = () => {
        setShowPlaylist(false)
        setSetlist(null)
    }

    useEffect(() => {
        if (setlist && iframeRef.current) {
            iframeRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }, [setlist]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 text-center">
                        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-50">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    このセットリストでプレイリストを作成しますか？
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none"
                                    onClick={onClose}
                                >
                                    キャンセル
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none"
                                    onClick={handleClick}
                                >
                                    プレイリストを作成
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showPlaylist && setlist && setlist.setlist_id && (
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 z-50 overflow-auto">
                    <div className="min-h-screen py-8 px-4">
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="bg-white rounded-xl p-6 md:p-8 shadow-lg relative"
                                ref={iframeRef}
                            >
                                <button
                                    onClick={handleBackToSearch}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>

                                <div className="flex flex-col items-center mb-6 space-y-4">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                                        <FiMusic className="w-10 h-10 text-indigo-600" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-center">
                                        プレイリストを作成しました
                                    </h2>

                                    {setlist.artist_name && (
                                        <p className="text-lg text-center">
                                            {setlist.artist_name}
                                        </p>
                                    )}

                                    {setlist.tour_name && (
                                        <p className="text-md text-center text-gray-600">
                                            {setlist.tour_name}
                                        </p>
                                    )}
                                </div>

                                <div className="w-full rounded-lg overflow-hidden shadow-md">
                                    <Iframe
                                        url={`https://open.spotify.com/embed/playlist/${setlist.setlist_id}`}
                                        width="100%"
                                        height="600px"
                                        className="border-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}