import React from 'react'
import axios from 'axios'

const ModifyButton: React.FC<{ setlistId: string , children: React.ReactNode }> = ({  setlistId, children }) => {
    const handleClick = async () => {
        console.log(setlistId)

        const url = `http://localhost:3000/api/modify/${setlistId}`;

        const response = await axios.get(url);
        console.log(response.data.body.name)
        return response;
    }

    return (
        <button
            onClick={handleClick}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            {children}
        </button>
    )

}


export default ModifyButton