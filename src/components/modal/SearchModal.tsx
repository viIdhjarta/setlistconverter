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
    artistName: string
    data: any
}



export default function SearchModal({ isOpen, onClose, artistName, data }: EditTrackModalProps) {



    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>{artistName}  の検索結果</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {data && data.artists && (
                    <VStack align="stretch" >
                        {data.artists.items.map((artist: any) => (
                            <Box key={artist.id}>
                                <Text fontWeight="bold">{artist.name}</Text>
                                {artist.images && artist.images[0] && (
                                    <Image src={artist.images[0].url} alt={artist.name} boxSize="100px" objectFit="cover" />
                                )}
                            </Box>
                        ))}
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} >
                    Save
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}