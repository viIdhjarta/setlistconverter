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
    IconButton,
    Divider,
    useLoading,
    Text,
    Box,
    Image,
    Flex,
    GridItem,
    SimpleGrid,
    useDisclosure,
    Accordion,
    AccordionItem,
    AccordionLabel,
    AccordionPanel,
    useNotice
} from '@yamada-ui/react'
import { FiPlus, FiCheck } from 'react-icons/fi'
import ConfirmModal from './ConfirmModal'



type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    artistName: string
    data: any
    selectedSite: string
}

type Setlist = {
    concert_name: string
    date: string
    venue: string
    concert_id: string,
    song: []
}

export default function SearchModal({ isOpen, onClose, artistName, data, selectedSite }: EditTrackModalProps) {
    const { page } = useLoading()

    const notice = useNotice()

    const [setlists, setSetlists] = useState<Setlist[]>([])
    const [selectedSetlist, setSelectedSetlist] = useState<Setlist | null>(null)


    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()


    const handleClick = async (artist: any) => {

        try {
            if (selectedSite === "setlistfm") {

                onClose()
                page.start()

                const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/fetch-html/${selectedSite}?artist=${encodeURIComponent(artist.name)}`)
                const data = await response.json()

                console.log(response.status)
                let fetchedSetlists: Setlist[] = []

                if (data.setlist && Array.isArray(data.setlist)) {
                    data.setlist.map((item: any) => {
                        if (item.sets && item.sets.set && item.sets.set.length > 0) {
                            fetchedSetlists.push({
                                concert_name: item.tour?.name || item.artist.name,
                                date: item.eventDate,
                                venue: item.venue.name + '  (' + item.venue.city.country.name + ')',
                                concert_id: item.id,
                                song: item.sets.set[0].song
                            })
                        }
                    })
                }

                setSetlists(fetchedSetlists)
                page.finish()
            } else if (selectedSite === "livefans") {
                onClose()
                page.start()

                const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/fetch-html/${selectedSite}?artist=${encodeURIComponent(artist.name)}`)
                const fetchedSetlists: Setlist[] = await response.json()

                setSetlists(fetchedSetlists)


                page.finish()

            }
        } catch (error) {
            console.error('エラー:', error);
            page.finish()
            notice({
                title: 'エラー',
                description: 'もう一度お試しください',
                status: 'error',
            })
        } finally {
            page.finish()
        }

    }

    const handleSetlistSelect = (setlist: Setlist) => {
        setSelectedSetlist(setlist)
        console.log(setlist.concert_id)
        onConfirmOpen()
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
                <ModalOverlay />
                <ModalHeader>{artistName} の検索結果</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {data && data.artists && (
                        <VStack align="stretch" divider={<Divider />}>
                            {data.artists.items.filter((artist: any) => artist.images && artist.images[0]).map((artist: any) => (
                                <Flex key={artist.id} alignItems="center" justifyContent="space-between">
                                    <Box display="flex" alignItems="center" gap="20px">
                                        <Image src={artist.images[0].url} alt={artist.name} boxSize="70px" objectFit="cover" />
                                        <Text fontWeight="bold">{artist.name}</Text>

                                    </Box>
                                    <IconButton
                                        aria-label="Replace track"
                                        icon={<FiPlus />}
                                        onClick={() => handleClick(artist)}
                                        variant="ghost"
                                        colorScheme="green"
                                    />
                                </Flex>
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
            {setlists.length > 0 && (
                <Box mt={6}>
                    <Text fontWeight="bold" mb={4}>セットリストを選択してください：</Text>
                    <SimpleGrid gap="md">
                        {/* <SimpleGrid columns={2}> */}
                        {setlists.map((setlist) => (

                            <Accordion isToggle key={setlist.concert_id}>
                                <AccordionItem>
                                    <AccordionLabel>
                                        <SimpleGrid w="full" gap="md">
                                            <GridItem>
                                                <Text fontWeight="bold">{setlist.concert_name}</Text>
                                                <Text>日付: {setlist.date}</Text>
                                                <Text>会場: {setlist.venue}</Text>
                                                <GridItem textAlign="right">
                                                    <Button
                                                        colorScheme={selectedSetlist?.concert_id === setlist.concert_id ? "green" : "gray"}
                                                        onClick={() => handleSetlistSelect(setlist)}
                                                        leftIcon={selectedSetlist?.concert_id === setlist.concert_id ? <FiCheck /> : undefined}
                                                    >
                                                        {selectedSetlist?.concert_id === setlist.concert_id ? "選択中" : "選択"}
                                                    </Button>
                                                </GridItem>
                                            </GridItem>
                                        </SimpleGrid>
                                    </AccordionLabel>
                                    <AccordionPanel>
                                        {setlist.song?.map((song: any, index: number) => (
                                            <div key={`${setlist.concert_id}-${index}`}>{song.name}</div>
                                        ))}
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>


                        ))}
                    </SimpleGrid>
                </Box>
            )}
            {selectedSetlist && (
                <ConfirmModal isOpen={isConfirmOpen} onClose={onConfirmClose} setlist_id={selectedSetlist.concert_id} selectedSite={selectedSite} />
            )}
        </>
    )
}