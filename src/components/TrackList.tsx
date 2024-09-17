import { VStack } from '@yamada-ui/react'
import TrackItem from './TrackItem'
import { Track } from '../types/Track'

type TrackListProps = {
    tracks: Track[]
    onDelete: (id: string) => void
    onEdit: (track: Track) => void
}

export default function TrackList({ tracks, onDelete, onEdit }: TrackListProps) {
    return (
        <VStack align="stretch">
            {tracks.map((track) => (
                <TrackItem key={track.id} track={track}  onDelete={onDelete} onEdit={onEdit} />
            ))}
        </VStack>
    )
}