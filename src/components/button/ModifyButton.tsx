import React, { useState } from 'react'
import axios from 'axios'
import { Button, VStack, Container, useDisclosure } from '@yamada-ui/react'
import TrackList from '../TrackList'
import EditTrackModal from '../EditTrackModal'
import ReplaceButton from './ReplaceButton'

type Track = {
    id: string
    name: string
    imageUrl: string
    artists: string
    isReplaced?: boolean
}

export default function ModifyButton({ setlistId, children }: { setlistId: string; children: React.ReactNode }) {

    const [tracks, setTracks] = useState<Track[]>([])
    const [editingTrack, setEditingTrack] = useState<Track | null>(null)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isReplaced, setIsReplaced] = useState<boolean>(false)

    const [modSongs, setModSongs] = useState<Track[]>([])

    const handleClick = async () => {
        const url = `http://localhost:3000/api/modify/${setlistId}`
        const response = await axios.get(url)

        const length: number = response.data.body.tracks.items.length
        const newTracks: Track[] = []

        for (let i = 0; i < length; i++) {
            const track = response.data.body.tracks.items[i].track
            const artistNames: string = track.artists
                .map((artist: { name: string }) => artist.name)
                .join(', ')

            newTracks.push({
                id: track.id,
                name: track.name,
                imageUrl: track.album.images[1].url,
                artists: artistNames,
                isReplaced: false
            })
        }
        setTracks(newTracks)
        return response
    }

    const handleDelete = (id: string) => {
        setTracks(tracks.filter(track => track.id !== id))
        console.log(tracks)
    }

    const handleEdit = async (track: Track) => {
        const url = `http://localhost:3000/api/song/search/${track.artists}/${track.name}`
        const response = await axios.get(url)
        // modSongsにresponse.data.tracksの各種情報を追加
        const length: number = response.data.tracks.items.length

        const newModSongs: Track[] = [];

        for (let i = 0; i < length; i++) {
            const track = response.data.tracks.items[i]
            const artistNames: string = track.artists
                .map((artist: { name: string }) => artist.name)
                .join(', ')

            newModSongs.push({
                id: track.id,
                name: track.name,
                imageUrl: track.album.images[1].url,
                artists: artistNames,
                isReplaced: false
            })
        }
        setModSongs(newModSongs)

        setEditingTrack(track)
        onOpen()
    }

    const handleSaveEdit = () => {
        if (editingTrack) {
            setTracks(tracks.map(track =>
                track.id === editingTrack.id ? editingTrack : track
            ))
            onClose()
        }
    }

    const handleReplace = (song: Track) => {
        setTracks(prevTracks => prevTracks.map(track =>
            track.id === editingTrack?.id ? { ...song, isReplaced: true } : track
        ))
        setIsReplaced(true)
        onClose()
    }

    // const playlistRecreate = async () => {

    return (
        <VStack align="center" width="full">
            <Button onClick={handleClick} colorScheme="primary" size="md">
                {children}
            </Button>
            {tracks.length > 0 && (
                <Container maxW="container.md">
                    <TrackList tracks={tracks} onDelete={handleDelete} onEdit={handleEdit} />
                </Container>
            )}
            <EditTrackModal
                isOpen={isOpen}
                onClose={onClose}
                editingTrack={editingTrack}
                setEditingTrack={setEditingTrack}
                onSave={handleSaveEdit}
                modSongs={modSongs}
                onReplace={handleReplace}
            />
            <ReplaceButton setlistId={setlistId} tracks={tracks} isReplaced={isReplaced}>{'プレイリストの再作成'} </ReplaceButton>
        </VStack>
    )
}