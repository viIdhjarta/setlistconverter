import { useState, useEffect } from 'react'
import { useDisclosure, useNotice, } from '@yamada-ui/react'
import { FiCheck, FiX, FiChevronDown, FiChevronUp, FiUser } from 'react-icons/fi'
import ConfirmModal from './ConfirmModal'

type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    artistName: string
    data: any
    selectedSite: string
}

type Song = {
    name: string
}

type Setlist = {
    concert_name: string
    date: string
    venue: string
    concert_id: string,
    song: Song[]
}

// アーティストカードコンポーネント
const ArtistCard = ({ artist, onClick }: { artist: any, onClick: () => void }) => {
    return (
        <div
            className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={onClick}
        >
            {artist.images && artist.images[0] ? (
                <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-16 h-16 rounded-lg object-cover mr-4"
                />
            ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mr-4">
                    <FiUser className="w-8 h-8 text-gray-400" />
                </div>
            )}
            <span className="font-bold text-lg">{artist.name}</span>
        </div>
    );
};

// セットリストカードコンポーネント
const SetlistCard = ({
    setlist,
    isExpanded,
    onToggle,
    isSelected,
    onSelect
}: {
    setlist: Setlist,
    isExpanded: boolean,
    onToggle: () => void,
    isSelected: boolean,
    onSelect: () => void
}) => {
    return (
        <div className="border border-gray-200 rounded-lg shadow-sm overflow-hidden h-auto">
            <div className="p-4 bg-white">
                <div className="font-bold text-lg mb-3 text-center">{setlist.concert_name}</div>

                <div className="flex justify-between items-center mb-4">
                    <div className="space-y-2 text-left">
                        <p className="text-sm text-gray-600">日付: {setlist.date}</p>
                        <p className="text-sm text-gray-600">会場: {setlist.venue}</p>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        className={`inline-flex items-center px-4 py-2 rounded-md text-sm ${isSelected
                            ? 'bg-green-500 text-white'
                            : 'bg-purple-500 text-white hover:bg-purple-600'
                            } transition-colors`}
                    >
                        {isSelected && (
                            <FiCheck className="mr-1" />
                        )}
                        {isSelected ? '選択中' : '選択'}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="bg-gray-50 p-4 border-t border-gray-200">
                    {setlist.song?.length > 0 ? (
                        <div className="space-y-1">
                            {setlist.song.map((song, index) => (
                                <p key={`${setlist.concert_id}-${index}`} className="text-sm">
                                    {index + 1}. {song.name}
                                </p>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">曲情報がありません</p>
                    )}
                </div>
            )}

            <button
                onClick={onToggle}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center border-t border-gray-200"
            >
                <span className="mr-2 text-sm font-medium text-gray-700">
                    {isExpanded ? 'セットリストを閉じる' : 'セットリストを表示'}
                </span>
                {isExpanded ? (
                    <FiChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                    <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
            </button>
        </div>
    );
};

export default function SearchModal({ isOpen, onClose, artistName, data, selectedSite }: EditTrackModalProps) {
    const notice = useNotice()

    const [setlists, setSetlists] = useState<Setlist[]>([])
    const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null)
    const [showSetlistSelection, setShowSetlistSelection] = useState(false)
    const [expandedSetlist, setExpandedSetlist] = useState<string | null>(null)

    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()

    // スクロール禁止/許可の制御
    useEffect(() => {
        if (showSetlistSelection) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [showSetlistSelection]);

    const handleClick = async (artist: any) => {
        try {
            setShowSetlistSelection(true)
            onClose()

            if (selectedSite === "setlistfm") {
                const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/fetch-html/${selectedSite}?artist=${encodeURIComponent(artist.name)}`)
                const data = await response.json()

                let fetchedSetlists: Setlist[] = []

                if (data.setlist && Array.isArray(data.setlist)) {
                    data.setlist.map((item: any) => {
                        if (item.sets && item.sets.set && item.sets.set.length > 0) {
                            fetchedSetlists.push({
                                concert_name: item.tour?.name || item.artist.name,
                                date: item.eventDate,
                                venue: item.venue.name + '  (' + item.venue.city.country.name + ')',
                                concert_id: item.id,
                                song: []
                            })
                            item.sets.set.forEach((set: any) => {
                                if (Array.isArray(set.song)) {
                                    fetchedSetlists[fetchedSetlists.length - 1].song.push(...set.song);
                                }
                            });
                        }
                    })
                }

                setSetlists(fetchedSetlists)
            } else if (selectedSite === "livefans") {
                const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/fetch-html/${selectedSite}?artist=${encodeURIComponent(artist.name)}`)
                const fetchedSetlists: Setlist[] = await response.json()
                setSetlists(fetchedSetlists)
            }

        } catch (error) {
            console.error('エラー:', error);
            notice({
                title: 'エラー',
                description: 'もう一度お試しください',
                status: 'error',
            })
        }
    }

    const handleSetlistSelect = (setlist: Setlist) => {
        setSelectedSetlist(setlist)
        onConfirmOpen()
    }

    const resetSelection = () => {
        setShowSetlistSelection(false)
        setSetlists([])
        setSelectedSetlist(null)
    }

    const toggleSetlistExpansion = (id: string) => {
        if (expandedSetlist === id) {
            setExpandedSetlist(null);
        } else {
            setExpandedSetlist(id);
        }
    };

    const ArtistSelectionModal = () => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 text-center">
                    <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

                    <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl z-50">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold leading-6 text-gray-900">
                                {artistName} の検索結果
                            </h3>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto mt-4">
                            {data && data.artists && data.artists.items && data.artists.items.length > 0 ? (
                                <div className="space-y-3">
                                    {data.artists.items
                                        .filter((artist: any) => artist.name)
                                        .map((artist: any) => (
                                            <ArtistCard
                                                key={artist.id}
                                                artist={artist}
                                                onClick={() => handleClick(artist)}
                                            />
                                        ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    アーティストが見つかりませんでした
                                </p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md focus:outline-none"
                                onClick={onClose}
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* アーティスト選択のモーダル (Tailwind版) */}
            <ArtistSelectionModal />

            {/* セットリスト選択画面 */}
            {showSetlistSelection && (
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 z-50 overflow-auto">
                    <div className="min-h-screen py-8 px-4">
                        <div className="max-w-6xl mx-auto">
                            {setlists.length === 0 ? (
                                <div className="flex items-center justify-center h-screen">
                                    <div className="bg-white rounded-xl p-8 shadow-lg">
                                        <p className="text-xl font-bold text-center mb-4">セットリストを取得中...</p>
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg relative">
                                    <button
                                        onClick={resetSelection}
                                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        <FiX className="w-5 h-5" />
                                    </button>

                                    <h2 className="text-2xl font-bold text-center mb-8">セットリストを選択してください</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {setlists.map((setlist) => (
                                            <SetlistCard
                                                key={setlist.concert_id}
                                                setlist={setlist}
                                                isExpanded={expandedSetlist === setlist.concert_id}
                                                onToggle={() => toggleSetlistExpansion(setlist.concert_id)}
                                                isSelected={selectedSetlist?.concert_id === setlist.concert_id}
                                                onSelect={() => handleSetlistSelect(setlist)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 確認モーダル */}
            {selectedSetlist && (
                <ConfirmModal isOpen={isConfirmOpen} onClose={onConfirmClose} setlist_id={selectedSetlist.concert_id} selectedSite={selectedSite} />
            )}
        </>
    )
}