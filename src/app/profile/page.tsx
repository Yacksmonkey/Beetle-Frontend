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

type FriendItem = {
    friendUserId: number
    username: string
    picture: string | null
}

export default function ProfilePage() {
    const [me, setMe] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [editOpen, setEditOpen] = useState(false)

    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [picture, setPicture] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")
    const [bio, setBio] = useState("")
    const [publicProfile, setPublicProfile] = useState(false)

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadMsg, setUploadMsg] = useState<string | null>(null)

    const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

    const [friends, setFriends] = useState<FriendItem[]>([])
    const [friendsLoading, setFriendsLoading] = useState(true)

    useEffect(() => {
        loadMe()
        loadFriends()
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

    const loadFriends = async () => {
        try {
            setFriendsLoading(true)

            const res = await fetch(`${API_BASE}/api/friends`, {
                method: "GET",
                credentials: "include",
            })

            if (!res.ok) {
                throw new Error("Failed to load friends")
            }

            const data = await res.json()
            setFriends(data)
        } catch (e) {
            console.error(e)
            setFriends([])
        } finally {
            setFriendsLoading(false)
        }
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

    const uploadProfilePicture = async () => {
        if (!selectedFile) {
            setUploadMsg("Please select an image first.")
            return
        }

        setIsUploading(true)
        setUploadMsg(null)

        try {
            const formData = new FormData()
            formData.append("file", selectedFile)

            const res = await fetch("http://localhost:8080/api/uploads/profile-picture", {
                method: "POST",
                credentials: "include",
                body: formData,
            })

            if (!res.ok) {
                const text = await res.text().catch(() => "")
                setUploadMsg(text || "Upload failed.")
                return
            }

            const data = await res.json()
            setPicture(data.url)
            setUploadMsg("Profile picture uploaded successfully.")
            setSelectedFile(null)
        } catch {
            setUploadMsg("Network error. Is the backend running?")
        } finally {
            setIsUploading(false)
        }
    }

    if (loading) return <p className="p-8">Loading profile...</p>
    if (!me) return <p className="p-8">Not authenticated</p>

    return (
        <div className="min-h-screen bg-background py-8 px-4 mt-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-1/3 space-y-6">
                        <div className="relative w-full h-[320px] rounded-lg overflow-hidden bg-muted">
                            <img
                                src={me.picture || "/bettle insect.jpg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <Button onClick={() => setEditOpen(true)} className="w-full">
                            Edit profile
                        </Button>
                    </div>

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

                                    <div className="pt-4">
                                        <p><b>Friends:</b></p>

                                        {friendsLoading && (
                                            <p className="text-sm text-muted-foreground">Loading friends...</p>
                                        )}

                                        {!friendsLoading && friends.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No friends yet.</p>
                                        )}

                                        {!friendsLoading && friends.length > 0 && (
                                            <div className="space-y-3 pt-2">
                                                {friends.map((friend) => (
                                                    <div
                                                        key={friend.friendUserId}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <img
                                                            src={friend.picture || "/bettle insect.jpg"}
                                                            alt={friend.username}
                                                            className="w-10 h-10 rounded-full object-cover border"
                                                        />

                                                        <div className="flex flex-col">
                                                            <p className="text-sm font-medium">
                                                                @{friend.username}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Friend
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

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

                        <div className="space-y-2">
                            <Label>Upload picture</Label>
                            <Input
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                disabled={isUploading}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                            />
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={uploadProfilePicture}
                                    disabled={isUploading || !selectedFile}
                                >
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>

                                {uploadMsg && (
                                    <p className="text-sm text-muted-foreground">{uploadMsg}</p>
                                )}
                            </div>
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