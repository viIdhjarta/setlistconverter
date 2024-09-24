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
    Label,
    IconButton 
} from '@yamada-ui/react'
import { FiRefreshCcw } from 'react-icons/fi' // 追加
import { Track } from '../types/Track'

type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    editingTrack: Track | null
    setTracks: React.Dispatch<React.SetStateAction<Track[]>>
    setIsReplaced: React.Dispatch<React.SetStateAction<boolean>>
    onSave: () => void
    modSongs: Track[]
}



export default function EditTrackModal({ isOpen, onClose, editingTrack, setTracks, setIsReplaced,  onSave, modSongs }: EditTrackModalProps) {

    const handleReplace = (song: Track) => {
        setTracks(prevTracks => prevTracks.map(track =>
            track.id === editingTrack?.id ? { ...song, isReplaced: true } : track
        ))
        setIsReplaced(true)
        onClose()
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
            <ModalOverlay />
            <ModalHeader>曲を置き換え</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {editingTrack && (
                    <VStack>
                        {modSongs.map((song) => (
                            <VStack key={song.id} border="1px" borderColor="gray.200" p={4} borderRadius="md" width="100%" align="start">
                                <img src={song.imageUrl} alt={song.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                <Label>Track Name: {song.name}</Label>
                                <Label>Artists: {song.artists}</Label>
                                <IconButton // 追加
                                    aria-label="Replace track" // 追加
                                    icon={<FiRefreshCcw />} // 追加
                                    onClick={() => handleReplace(song)} // 追加
                                    variant="ghost" // 追加
                                    colorScheme="green" // 追加
                                />
                            </VStack>
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