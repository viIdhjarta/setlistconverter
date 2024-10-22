import { Link, useLocation } from 'react-router-dom'
import {
    Button,
    VStack,
    Drawer,
    DrawerBody,
    DrawerHeader,
    DrawerOverlay,
    useDisclosure,
    IconButton,
} from "@yamada-ui/react"
import { Menu } from "@yamada-ui/lucide"

function Sidebar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const location = useLocation()

    return (
        <>
            <IconButton
                icon={<Menu />}
                onClick={onOpen}
                position="fixed"
                top={4}
                left={4}
                zIndex={2}
            />
            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />

                <DrawerHeader borderBottomWidth="1px">プレイリスト作成</DrawerHeader>
                <DrawerBody>
                    <VStack align="stretch">
                        <Button
                            as={Link}
                            to="/artist"
                            variant={location.pathname === "/artist" ? "solid" : "ghost"}
                            justifyContent="flex-start"
                            onClick={onClose}
                        >
                            アーティスト名から検索
                        </Button>
                        <Button
                            as={Link}
                            to="/url"
                            variant={location.pathname === "/url" ? "solid" : "ghost"}
                            justifyContent="flex-start"
                            onClick={onClose}
                        >
                            URLから作成
                        </Button>

                    </VStack>
                </DrawerBody>

            </Drawer>
        </>
    )
}

export default Sidebar