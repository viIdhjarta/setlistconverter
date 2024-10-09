import { useState } from 'react'
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
} from '@yamada-ui/react'
import Iframe from "react-iframe";

type ConfirmModalProps = {
    isOpen: boolean
    onClose: () => void
    setlist_id: string
    selectedSite: string
}


export default function ConfirmModal({ isOpen, onClose, setlist_id, selectedSite }: ConfirmModalProps) {

    const [setlist, setSetlist] = useState<any>(null)

    const handleClick = async () => {
        console.log("プレイリストを作成します")
        console.log(setlist_id)
        onClose()
        const url = `https://0gri69uq0g.execute-api.ap-northeast-1.amazonaws.com/prod/api/${selectedSite}/${setlist_id}`;
        console.log(url)

        const response = await fetch(url);
        const data = await response.json()
        setSetlist(data)
        console.log(data)
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size='3xl'>
                <ModalOverlay />
                <ModalHeader>このセットリストでプレイリストを作成しますか？</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="yellow" variant="ghost" onClick={onClose} mr={3}>
                        キャンセル
                    </Button>
                    <Button colorScheme="green" variant="ghost" onClick={handleClick} mr={3} >
                        プレイリストを作成
                    </Button>
                </ModalFooter>
            </Modal>

            {setlist && (
                <>
                    <br />
                    <br />
                    <Iframe
                        url={`https://open.spotify.com/embed/playlist/${setlist.setlist_id}`}
                        width="100%"
                        height="600px"
                    />
                </>
            )}
        </>
    )
}