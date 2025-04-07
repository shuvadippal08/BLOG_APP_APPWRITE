import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const loading = useSelector(state => state.auth.loading)

    useEffect(() => {
        if (!loading) {
            if (authentication && !authStatus) {
                navigate("/login")
            } else if (!authentication && authStatus) {
                navigate("/")
            } else {
                setLoader(false)
            }
        }
    }, [authStatus, navigate, authentication, loading])

    return loader || loading ? <h1>Loading...</h1> : <>{children}</>
}
