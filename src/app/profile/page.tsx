"use client"

import { useEffect, useState } from "react"
import { Eye, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMe } from "@/services/auth"

export default function ProfilePage() {
    const [me, setMe] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)

    // editable fields
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [picture, setPicture] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [bio, setBio] = useState("")
    const [publicProfile, setPublicProfile] = useState(false)

    useEffect(() => {
        loadMe()
    }, [])

    const loadMe = async () => {
        const data = await getMe()
        setMe(data)

        if (data) {
            setName(data.name || "")
            setUsername(data.username || "")
            setPicture(data.picture || "")
            setPhone(data.phone || "")
            setAddress(data.address || "")
            setBio(data.bio || "")
            setPublicProfile(!!data.publicProfile)
        }

        setLoading(false)
    }

    const saveProfile = async () => {
        const res = await fetch("http://localhost:8080/api/auth/me", {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                username,
                picture,
                phone,
                address,
                bio,
                publicProfile,
            }),
        })

        if (!res.ok) {
            alert("Error saving profile")
            return
        }

        setEditOpen(false)
        await loadMe()
    }

    if (loading) return <p className="p-8">Loading profile...</p>
    if (!me) return <p className="p-8">Not authenticated</p>

    return (
        <div className="min-h-screen bg-background py-8 px-4 mt-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* LEFT */}
                    <div className="lg:w-1/3 space-y-6">
                        <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-muted">
                            <img
                                src={me.picture || "/avatar-placeholder.png"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <Button onClick={() => setEditOpen(true)} className="w-full">
                            Edit profile
                        </Button>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:w-2/3 space-y-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-4xl font-bold">{me.name}</h1>
                                {me.publicProfile && <Eye className="w-5 h-5 text-muted-foreground" />}
                            </div>
                            <p className="text-muted-foreground">@{me.username}</p>
                            <p className="text-muted-foreground">{me.email}</p>
                        </div>

                        <Tabs defaultValue="about">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="timeline">
                                    <Eye className="w-4 h-4 mr-2" /> Timeline
                                </TabsTrigger>
                                <TabsTrigger value="about">
                                    <User className="w-4 h-4 mr-2" /> About
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="timeline" className="mt-6">
                                <Card className="p-6">Timeline próximamente</Card>
                            </TabsContent>

                            <TabsContent value="about" className="mt-6">
                                <Card className="p-6 space-y-2">
                                    <p><b>Phone:</b> {me.phone || "-"}</p>
                                    <p><b>Address:</b> {me.address || "-"}</p>
                                    <p><b>Bio:</b> {me.bio || "-"}</p>
                                    <p><b>Public profile:</b> {me.publicProfile ? "Yes" : "No"}</p>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* EDIT MODAL */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>Update your information</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div>
                            <Label>Username</Label>
                            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>

                        <div>
                            <Label>Picture URL</Label>
                            <Input value={picture} onChange={(e) => setPicture(e.target.value)} />
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>

                        <div>
                            <Label>Address</Label>
                            <Input value={address} onChange={(e) => setAddress(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>


                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={publicProfile}
                                onChange={(e) => setPublicProfile(e.target.checked)}
                            />
                            <Label>Public profile</Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={saveProfile}>
                                Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
