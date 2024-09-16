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
    FormControl,
    Label,
    Input,
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
}

export default function EditTrackModal({ isOpen, onClose, editingTrack, setEditingTrack, onSave }: EditTrackModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
            <ModalOverlay />
            <ModalHeader>Edit Track</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {editingTrack && (
                    <VStack>
                        <FormControl>
                            <Label>Track Name</Label>
                            <Input
                                value={editingTrack.name}
                                onChange={(e) => setEditingTrack({ ...editingTrack, name: e.target.value })}
                            />
                        </FormControl>
                        <FormControl>
                            <Label>Artists</Label>
                            <Input
                                value={editingTrack.artists}
                                onChange={(e) => setEditingTrack({ ...editingTrack, artists: e.target.value })}
                            />
                        </FormControl>
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