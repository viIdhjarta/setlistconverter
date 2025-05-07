import { useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    VStack,
    useLoading,
    Text,
    Box,
    Image,
    Flex,
    HStack,
    SimpleGrid,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionLabel,
    AccordionPanel,
    Card,
    useNotice,
    Container,
    Center
} from '@yamada-ui/react'
import { FiCheck } from 'react-icons/fi'
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

export default function SearchModal({ isOpen, onClose, artistName, data, selectedSite }: EditTrackModalProps) {
    const { page } = useLoading()

    const notice = useNotice()

    const [setlists, setSetlists] = useState<Setlist[]>([])
    const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null)
    const [showSetlistSelection, setShowSetlistSelection] = useState(false)

    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()


    const handleClick = async (artist: any) => {
        try {
            setShowSetlistSelection(true)
            onClose()
            page.start()

            if (selectedSite === "setlistfm") {
                const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/fetch-html/${selectedSite}?artist=${encodeURIComponent(artist.name)}`)
                const data = await response.json()
                console.log(response)

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

            page.finish()
        } catch (error) {
            console.error('エラー:', error);
            page.finish()
            notice({
                title: 'エラー',
                description: 'もう一度お試しください',
                status: 'error',
            })
        }
    }

    const handleSetlistSelect = (setlist: Setlist) => {
        setSelectedSetlist(setlist)
        console.log(setlist.concert_id)
        onConfirmOpen()
    }

    const resetSelection = () => {
        setShowSetlistSelection(false)
        setSetlists([])
        setSelectedSetlist(null)
    }

    return (
        <>
            {/* アーティスト選択のモーダル */}
            <Modal isOpen={isOpen} onClose={onClose} size='xl'>
                <ModalOverlay />
                <ModalHeader>{artistName} の検索結果</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {data && data.artists && (
                        <VStack align="stretch">
                            {data.artists.items.filter((artist: any) => artist.images && artist.images[0]).map((artist: any) => (
                                <Card key={artist.id} flex="1" onClick={() => handleClick(artist)} _hover={{ bg: "gray.200" }}>
                                    <Flex>
                                        <HStack>
                                            <Image src={artist.images[0].url} alt={artist.name} boxSize="70px" objectFit="cover" borderRadius="lg" />
                                            <Text fontWeight="bold">{artist.name}</Text>
                                        </HStack>
                                    </Flex>
                                </Card>
                            ))}
                        </VStack>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="yellow" variant="ghost" onClick={onClose} mr={3}>
                        キャンセル
                    </Button>
                </ModalFooter>
            </Modal>

            {/* セットリスト選択表示 */}
            {showSetlistSelection && setlists.length > 0 && (
                <Center className="fixed inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-auto z-40">
                    <Container maxW="6xl" py={8}>
                        <Box
                            bg="white"
                            shadow="lg"
                            rounded="xl"
                            p={8}
                            mb={8}
                            className="relative"
                        >
                            <Button
                                position="absolute"
                                top={4}
                                right={4}
                                colorScheme="gray"
                                variant="ghost"
                                onClick={resetSelection}
                            >
                                戻る
                            </Button>

                            <Text fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
                                セットリストを選択してください
                            </Text>

                            <SimpleGrid gap="md" columns={{ base: 1, md: 2 }}>
                                {setlists.map((setlist) => (
                                    <Accordion isToggle key={setlist.concert_id} variant="card">
                                        <AccordionItem>
                                            <AccordionLabel>
                                                <Box w="full">
                                                    <Text fontWeight="bold">{setlist.concert_name}</Text>
                                                    <HStack justifyContent="space-between" mt={2}>
                                                        <VStack alignItems="flex-start">
                                                            <Text>日付: {setlist.date}</Text>
                                                            <Text>会場: {setlist.venue}</Text>
                                                        </VStack>
                                                        <Button
                                                            colorScheme={selectedSetlist?.concert_id === setlist.concert_id ? "green" : "purple"}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSetlistSelect(setlist);
                                                            }}
                                                            leftIcon={selectedSetlist?.concert_id === setlist.concert_id ? <FiCheck /> : undefined}
                                                            size="sm"
                                                        >
                                                            {selectedSetlist?.concert_id === setlist.concert_id ? "選択中" : "選択"}
                                                        </Button>
                                                    </HStack>
                                                </Box>
                                            </AccordionLabel>
                                            <AccordionPanel bg="gray.50">
                                                {setlist.song?.length > 0 ? (
                                                    <VStack alignItems="flex-start">
                                                        {setlist.song.map((song: any, index: number) => (
                                                            <Text key={`${setlist.concert_id}-${index}`}>
                                                                {index + 1}. {song.name}
                                                            </Text>
                                                        ))}
                                                    </VStack>
                                                ) : (
                                                    <Text>曲情報がありません</Text>
                                                )}
                                            </AccordionPanel>
                                        </AccordionItem>
                                    </Accordion>
                                ))}
                            </SimpleGrid>
                        </Box>
                    </Container>
                </Center>
            )}

            {/* 確認モーダル */}
            {selectedSetlist && (
                <ConfirmModal isOpen={isConfirmOpen} onClose={onConfirmClose} setlist_id={selectedSetlist.concert_id} selectedSite={selectedSite} />
            )}
        </>
    )
}