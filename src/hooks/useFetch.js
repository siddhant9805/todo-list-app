import { useEffect, useState } from "react";
import { api } from "../api";

// path example: "/tasks"
export function useFetch(path, setData) {
    const [isloading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [trigger, setTrigger] = useState(0)

    const refetch = () => {
        setTrigger(prev => prev + 1)
    }

    useEffect(() => {
        async function api_call() {
            setLoading(true)
            try {
                const { data } = await api.get(path)
                setData(data)
                setError(null)
            } catch (err) {
                setError(err.message)
            }
            setLoading(false)
        }
        api_call()
    }, [path, trigger])

    return [isloading, error, refetch]
}