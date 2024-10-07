import React from 'react'
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

    Text,
    Box,
    Image,
    Flex
} from '@yamada-ui/react'
import { FiRefreshCcw } from 'react-icons/fi' // 追加
import { Track } from '../../types/Track'

type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    editingTrack: Track | null
    setTracks: React.Dispatch<React.SetStateAction<Track[]>>
    setIsReplaced: React.Dispatch<React.SetStateAction<boolean>>
    onSave: () => void
    modSongs: Track[]
}



export default function EditTrackModal({ isOpen, onClose, editingTrack, setTracks, setIsReplaced, onSave, modSongs }: EditTrackModalProps) {

    const handleReplace = (song: Track) => {
        setTracks(prevTracks => prevTracks.map(track =>
            track.id === editingTrack?.id ? { ...song, isReplaced: true } : track
        ))
        setIsReplaced(true)
        onClose()
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>曲を置き換え</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {editingTrack && (
                    <VStack divider={<Divider />}>
                        {modSongs.map((song) => (
                            <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" alignItems="center">
                                <Image src={song.imageUrl} alt={song.name} width="50px" height="50px" objectFit="cover" />
                                <Box ml="4" flex='1'>
                                    <Text fontWeight="bold" fontSize="lg">
                                        {song.name}
                                    </Text>
                                    <Text color="gray.500">{song.artists}</Text>
                                </Box>
                                <Divider orientation="vertical" height="50px" mx="1" />
                                <IconButton // 追加
                                    aria-label="Replace track" // 追加
                                    icon={<FiRefreshCcw />} // 追加
                                    onClick={() => handleReplace(song)} // 追加
                                    variant="ghost" // 追加
                                    colorScheme="green" // 追加
                                />
                            </Flex>
                        ))}
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onSave}>
                    Save
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}