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
} from '@yamada-ui/react'

type Track = {
    id: string
    name: string
    imageUrl: string
    artists: string
}

type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    editingTrack: Track | null
    setEditingTrack: React.Dispatch<React.SetStateAction<Track | null>>
    onSave: () => void
    modSongs: Track[]
}

export default function EditTrackModal({ isOpen, onClose, editingTrack, setEditingTrack, onSave, modSongs }: EditTrackModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
            <ModalOverlay />
            <ModalHeader>Edit Track</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {editingTrack && (
                    <VStack>
                        {modSongs.map((song) => (
                            <VStack key={song.id} border="1px" borderColor="gray.200" p={4} borderRadius="md" width="100%" align="start">
                                <img src={song.imageUrl} alt={song.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                <Label>Track Name: {song.name}</Label>
                                <Label>Artists: {song.artists}</Label>
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