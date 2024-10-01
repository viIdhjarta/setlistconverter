// TrackItem.tsx
import { Card, HStack,　Image, Text, Box, IconButton, Divider, Flex } from '@yamada-ui/react'
import { FiTrash2, FiEdit } from 'react-icons/fi'
import { Track } from '../types/Track'

type TrackItemProps = {
    track: Track
    onDelete: (id: string) => void
    onEdit: (track: Track) => void
}

export default function TrackItem({ track, onDelete, onEdit }: TrackItemProps) {
    return (
        <Card variant="elevated">
            <Flex borderWidth="1px" borderRadius="lg" overflow="hidden" alignItems="center" bg={track.isReplaced ? 'yellow.100' : 'white'}>
                <Image src={track.imageUrl} alt={track.name} width="50px" height="50px" objectFit="cover" />
                <Box ml="4" flex='1'>
                    <Text fontWeight="bold" fontSize="lg">
                        {track.name}
                    </Text>
                    <Text color="gray.500">{track.artists}</Text>
                </Box>
                <Divider orientation="vertical" height="50px" mx="1" />
                <HStack>
                    <IconButton
                        aria-label="Edit track"
                        icon={<FiEdit />}
                        onClick={() => onEdit(track)}
                        variant="ghost"
                        colorScheme="blue"
                    />
                    {/* <Divider orientation="vertical" height="50px" mx="1" /> */}
                    <IconButton
                        aria-label="Delete track"
                        icon={<FiTrash2 />}
                        onClick={() => onDelete(track.id)}
                        variant="ghost"
                        colorScheme="red"
                    />
                </HStack>
            </Flex>

        </Card>
    )
}
