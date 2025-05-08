import { useEffect, useRef, useState } from "react"
import { useLoading } from "@yamada-ui/react"
import Iframe from "react-iframe"
import { FiCheck, FiX } from "react-icons/fi"
import { API_ENDPOINTS } from "../../config"

interface ConfirmModalProps {
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
            // const siteKey = selectedSite.toLowerCase() === 'setlistfm' ? 'setlistfm' : 'livefans';
            // 適切なAPIエンドポイントを使用
            const url = selectedSite.toLowerCase() === 'setlistfm'
                ? API_ENDPOINTS.SETLISTFM(setlist_id)
                : API_ENDPOINTS.LIVEFANS(setlist_id);


            const response = await fetch(url)
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
            {/* セットリスト確認モーダル */}
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

                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none flex items-center"
                                    onClick={handleClick}
                                >
                                    <FiCheck className="mr-2" />
                                    はい、作成します
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none flex items-center"
                                    onClick={onClose}
                                >
                                    <FiX className="mr-2" />
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* プレイリスト表示モーダル */}
            {showPlaylist && setlist && (
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 z-50 overflow-auto">
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
                                    <h2 className="text-2xl font-bold text-center">
                                        プレイリストを作成しました
                                    </h2>
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