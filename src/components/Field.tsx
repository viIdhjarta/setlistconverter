import React from 'react'

const Field = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => {
    return (
        <>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">URLを入力</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://www.setlist.fm/" required />

        </>
    )
}

export default Field