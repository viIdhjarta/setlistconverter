// TrackItem.tsx
import { Card, CardBody, HStack, Heading, Image, Text, Box, IconButton } from '@yamada-ui/react'
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
            <CardBody bg={track.isReplaced ? 'yellow.100' : 'white'}>
                <HStack justifyContent="space-between">
                    <HStack >
                        <Image
                            src={track.imageUrl}
                            alt={track.name}
                            objectFit="cover"
                            boxSize="100px"
                            borderRadius="md"
                        />
                        <Box>
                            <Heading size="md" >{track.name}</Heading>
                            <Text fontSize="sm" color="muted">{track.artists}</Text>
                        </Box>
                    </HStack>
                    <HStack>
                        <IconButton
                            aria-label="Edit track"
                            icon={<FiEdit />}
                            onClick={() => onEdit(track)}
                            variant="ghost"
                            colorScheme="blue"
                        />
                        <IconButton
                            aria-label="Delete track"
                            icon={<FiTrash2 />}
                            onClick={() => onDelete(track.id)}
                            variant="ghost"
                            colorScheme="red"
                        />
                    </HStack>
                </HStack>
            </CardBody>
        </Card>
    )
}
