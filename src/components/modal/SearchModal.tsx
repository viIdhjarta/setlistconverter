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
    Flex
} from '@yamada-ui/react'
import { FiPlus } from 'react-icons/fi' // 追加

type EditTrackModalProps = {
    isOpen: boolean
    onClose: () => void
    artistName: string
    data: any
}



export default function SearchModal({ isOpen, onClose, artistName, data }: EditTrackModalProps) {

    const { page } = useLoading();

    const handleClick = async (id: string) => {

        page.start();

        const response = await fetch(`https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/api/musicbrainz/search?q=${encodeURIComponent(id)}`);
        const data = await response.json();

        const country: string = data.country;
        if (country === "JP") {
            // livefansでプレイリストを作成
            console.log("日本のアーティストです")
        } else {
            console.log("日本のアーティストではありません")
        }
        page.finish();
    }



    return (
        <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
            <ModalOverlay />
            <ModalHeader>{artistName}  の検索結果</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {data && data.artists && (
                    <VStack align="stretch" divider={<Divider />}>
                        {data.artists.items.map((artist: any) => (
                            <Flex key={artist.id} alignItems="center" justifyContent="space-between" >

                                <Box key={artist.id}>
                                    <Text fontWeight="bold">{artist.name}</Text>
                                    {artist.images && artist.images[0] && (
                                        <Image src={artist.images[0].url} alt={artist.name} boxSize="70px" objectFit="cover" />
                                    )}
                                </Box>

                                <IconButton
                                    aria-label="Replace track"
                                    icon={<FiPlus />}
                                    onClick={() => handleClick(artist.id)}
                                    variant="ghost"
                                    colorScheme="green"
                                />
                            </Flex>
                        ))}
                    </VStack>
                )}
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="yellow" variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}