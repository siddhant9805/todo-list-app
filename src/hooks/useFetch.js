import { useEffect, useState } from "react";

export function useFetch(url, setData) {
    const [isloading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [trigger, setTrigger] = useState(0)

    // Function to manually trigger a re-fetch
    const refetch = () => {
        setTrigger(prev => prev + 1)
    }

    useEffect(() => {
        async function api_call() {
            setLoading(true)
            try {
                const rep = await fetch(url)
                const data = await rep.json()
                setData(data)
                setError(null)
            } catch (err) {
                setError(err.message)
            }
            setLoading(false)
        }
        api_call()
    }, [url, trigger])
        
    return [isloading, error, refetch]
}