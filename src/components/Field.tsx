import {
    FormControl,
    Input,
    ErrorMessage
} from "@yamada-ui/react"

const Field = ({ isInvalid, value, onChange, placeholder }: { isInvalid: boolean; value: string; onChange: (value: string) => void; placeholder: string }) => {
    let url: string = '';

    if (placeholder === 'SetlistFM') {
        url = 'https://www.setlist.fm/';
    } else if (placeholder === 'LiveFans') {
        url = 'https://www.livefans.jp/';
    }

    return (
        <>
            <FormControl isInvalid={isInvalid} label="URLを入力">
                <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={url} required />
                <ErrorMessage>URLが無効です。正しいURLを入力してください。</ErrorMessage>
            </FormControl>
        </>
    )
}

export default Field