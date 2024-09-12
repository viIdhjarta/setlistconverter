import {
    FormControl,
    Input,
} from "@yamada-ui/react"

const Field = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    return (
        <>
            <FormControl label="URLを入力">
                <Input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://www.setlist.fm/" required />
            </FormControl>
        </>
    )
}

export default Field