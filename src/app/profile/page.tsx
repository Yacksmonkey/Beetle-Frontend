"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Eye, MapPin, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getMe } from "@/services/auth"

export default function ProfilePage() {
    const [me, setMe] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadMe = async () => {
            const data = await getMe()
            setMe(data)
            setLoading(false)
        }

        loadMe()
    }, [])

    if (loading) return <p className="p-8">Loading profile...</p>
    if (!me) return <p className="p-8">Not authenticated</p>

    return (
        <div className="min-h-screen bg-background py-8 px-4 mt-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                            <img
                                src={me.picture || "/avatar-placeholder.png"}
                                alt="Profile picture"
                                className="w-full h-full object-cover rounded-lg"
                            />


                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:w-2/3 space-y-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-bold">{me.name}</h1>
                                {me.publicProfile && <Eye className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <p className="text-muted-foreground">@{me.username}</p>
                            <p className="text-muted-foreground">{me.email}</p>
                        </div>

                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="timeline">
                                    <Eye className="w-4 h-4 mr-2" />
                                    Timeline
                                </TabsTrigger>
                                <TabsTrigger value="about">
                                    <User className="w-4 h-4 mr-2" />
                                    About
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="timeline" className="mt-6">
                                <Card className="p-6">
                                    <p className="text-muted-foreground">Timeline próximamente</p>
                                </Card>
                            </TabsContent>

                            <TabsContent value="about" className="mt-6">
                                <Card className="p-6">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                                        Basic info
                                    </h3>
                                    <p>Public profile: {me.publicProfile ? "Yes" : "No"}</p>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}
