import { useState, useRef, useEffect } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    useLoading,
    Box,
    Container,
    Center,
    Text,
    VStack
} from '@yamada-ui/react'
import Iframe from "react-iframe";
import { FiMusic } from 'react-icons/fi';

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

    const handleClick = async () => {
        page.start()
        console.log("プレイリストを作成します")
        console.log(setlist_id)
        onClose()

        try {
            const url = `https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/api/${selectedSite}/${setlist_id}`;
            console.log(url)

            const response = await fetch(url);
            const data = await response.json()
            setSetlist(data)
            setShowPlaylist(true)

            console.log(response)
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
    }, [setlist])

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
                <ModalOverlay />
                <ModalHeader>このセットリストでプレイリストを作成しますか？</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="yellow" variant="ghost" onClick={onClose} mr={3}>
                        キャンセル
                    </Button>
                    <Button colorScheme="green" variant="ghost" onClick={handleClick} mr={3} >
                        プレイリストを作成
                    </Button>
                </ModalFooter>
            </Modal>

            {showPlaylist && setlist && setlist.setlist_id && (
                <Center className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-auto z-40">
                    <Container maxW="4xl" py={8}>
                        <Box
                            bg="white"
                            shadow="lg"
                            rounded="xl"
                            p={8}
                            mb={8}
                            className="relative"
                            ref={iframeRef}
                        >
                            <Button
                                position="absolute"
                                top={4}
                                right={4}
                                colorScheme="gray"
                                variant="ghost"
                                onClick={handleBackToSearch}
                            >
                                戻る
                            </Button>

                            <VStack mb={6}>
                                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100">
                                    <FiMusic className="w-10 h-10 text-indigo-600" />
                                </div>

                                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                                    プレイリストを作成しました
                                </Text>

                                {setlist.artist_name && (
                                    <Text fontSize="lg" textAlign="center">
                                        {setlist.artist_name}
                                    </Text>
                                )}

                                {setlist.tour_name && (
                                    <Text fontSize="md" textAlign="center" className="text-gray-600">
                                        {setlist.tour_name}
                                    </Text>
                                )}
                            </VStack>

                            <Box className="w-full rounded-lg overflow-hidden shadow-md">
                                <Iframe
                                    url={`https://open.spotify.com/embed/playlist/${setlist.setlist_id}`}
                                    width="100%"
                                    height="600px"
                                    className="border-0"
                                />
                            </Box>
                        </Box>
                    </Container>
                </Center>
            )}
        </>
    )
}