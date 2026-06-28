"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
    getCurrentUser,
    login as authLogin,
    logout as authLogout,
    register as authRegister,
    type UserProfile,
} from "@/services/auth"

export function useAuth() {
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const userRef = useRef(user)
    userRef.current = user

    const refreshUser = useCallback(async () => {
        try {
            const u = await getCurrentUser()
            if (u === null && userRef.current !== null) {
                // 500/network error - keep existing user
                return
            }
            setUser(u)
        } catch {
            // keep current user on unexpected errors
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        refreshUser()
    }, [refreshUser])

    const login = useCallback(async (email: string, password: string) => {
        await authLogin(email, password)
        await refreshUser()
    }, [refreshUser])

    const register = useCallback(async (name: string, email: string, password: string) => {
        return authRegister(name, email, password)
    }, [])

    const logout = useCallback(async () => {
        await authLogout()
        setUser(null)
    }, [])

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    }
}
