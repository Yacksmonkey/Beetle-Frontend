"use client"

import { useEffect, useState } from "react"
import { Check, Eye, User, X } from "lucide-react"
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
import { getCurrentUser } from "@/services/auth"
import { api } from "@/services/api";

type FriendItem = {
    friendUserId: number
    username: string
    picture: string | null
}

type IncomingRequest = {
    id: number
    senderUserId: number
    username: string
    picture: string | null
}

type UserProfile = {
    id?: number
    name?: string
    username?: string
    email?: string
    picture?: string
    phone?: string
    address?: string
    bio?: string
    publicProfile?: boolean
}

export default function ProfilePage() {
    const [me, setMe] = useState<UserProfile | null>(null)
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

    const [friends, setFriends] = useState<FriendItem[]>([])
    const [friendsLoading, setFriendsLoading] = useState(true)
    const [friendsError, setFriendsError] = useState<string | null>(null)

    const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([])
    const [requestsLoading, setRequestsLoading] = useState(false)
    const [requestsError, setRequestsError] = useState<string | null>(null)
    const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

    useEffect(() => {
        loadMe()
        loadFriends()
        loadIncomingRequests()
    }, [])

    const loadMe = async () => {
        const data = await getCurrentUser()
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
            setFriendsError(null)
            const data = await api.get<FriendItem[]>("/api/friends")
            setFriends(data)
        } catch {
            setFriendsError("Could not load friends")
            setFriends([])
        } finally {
            setFriendsLoading(false)
        }
    }

    const loadIncomingRequests = async () => {
        try {
            setRequestsLoading(true)
            setRequestsError(null)
            const data = await api.get<IncomingRequest[]>("/api/friends/requests/incoming")
            setIncomingRequests(data)
        } catch {
            setRequestsError("Could not load requests")
            setIncomingRequests([])
        } finally {
            setRequestsLoading(false)
        }
    }

    const acceptRequest = async (requestId: number) => {
        setActionLoadingId(requestId)
        try {
            await api.post("/api/friends/accept", { requestId })
            await loadIncomingRequests()
            await loadFriends()
        } catch {
            // silent
        } finally {
            setActionLoadingId(null)
        }
    }

    const rejectRequest = async (requestId: number) => {
        setActionLoadingId(requestId)
        try {
            await api.del(`/api/friends/request/${requestId}`)
            await loadIncomingRequests()
        } catch {
            // silent
        } finally {
            setActionLoadingId(null)
        }
    }

    const saveProfile = async () => {
        try {
            await api.put("/api/auth/me", {
                name,
                username,
                picture,
                phone,
                address,
                bio,
                publicProfile,
            })
            setEditOpen(false)
            await loadMe()
        } catch {
            alert("Error saving profile")
        }
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

            const res = await api.upload("/api/uploads/profile-picture", formData)

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

    if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Loading profile...</p></div>
    if (!me) return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Not authenticated</p></div>

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-64 shrink-0 space-y-4">
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-accent border">
                            <img
                                src={me.picture || "/beetle insect.jpg"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <Button onClick={() => setEditOpen(true)} className="w-full">
                            Edit profile
                        </Button>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-3xl font-bold tracking-tight">{me.name}</h1>
                                {me.publicProfile && <Eye className="size-5 text-muted-foreground" />}
                            </div>
                            <p className="text-lg text-muted-foreground">@{me.username}</p>
                            <p className="text-muted-foreground">{me.email}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-card border border-border rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold">{friends.length}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Friends</p>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold">{incomingRequests.length}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Requests</p>
                            </div>
                            <div className="bg-card border border-border rounded-xl p-4 text-center">
                                <p className="text-2xl font-bold">{me.publicProfile ? "Yes" : "No"}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">Public</p>
                            </div>
                        </div>

                        <Tabs defaultValue="about">
                            <TabsList>
                                <TabsTrigger value="about">
                                    <User className="size-4 mr-1.5" /> About
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="mt-6">
                                <Card>
                                    <div className="p-6 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Phone</p>
                                                <p className="text-sm mt-1">{me.phone || "-"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Address</p>
                                                <p className="text-sm mt-1">{me.address || "-"}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Bio</p>
                                                <p className="text-sm mt-1">{me.bio || "No bio yet."}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {requestsError && (
                                    <p className="text-sm text-destructive mt-4">{requestsError}</p>
                                )}

                                {!requestsLoading && incomingRequests.length > 0 && (
                                    <Card className="mt-4">
                                        <div className="p-6 space-y-4">
                                            <h3 className="font-semibold">Friend Requests ({incomingRequests.length})</h3>
                                            <div className="space-y-3">
                                                {incomingRequests.map((req) => (
                                                    <div key={req.id} className="flex items-center gap-3">
                                                        <img
                                                            src={req.picture || "/beetle insect.jpg"}
                                                            alt={req.username}
                                                            className="size-10 rounded-full object-cover border"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium">@{req.username}</p>
                                                            <p className="text-xs text-muted-foreground">Wants to be friends</p>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => acceptRequest(req.id)}
                                                                disabled={actionLoadingId === req.id}
                                                            >
                                                                {actionLoadingId === req.id ? <span className="animate-pulse">...</span> : <Check className="size-4" />}
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => rejectRequest(req.id)}
                                                                disabled={actionLoadingId === req.id}
                                                            >
                                                                <X className="size-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                <Card className="mt-4">
                                    <div className="p-6 space-y-4">
                                        <h3 className="font-semibold">Friends</h3>

                                        {friendsError && (
                                            <p className="text-sm text-destructive">{friendsError}</p>
                                        )}

                                        {friendsLoading && !friendsError && (
                                            <p className="text-sm text-muted-foreground">Loading friends...</p>
                                        )}

                                        {!friendsLoading && !friendsError && friends.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No friends yet.</p>
                                        )}

                                        {!friendsLoading && !friendsError && friends.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {friends.map((friend) => (
                                                    <div key={friend.friendUserId} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
                                                        <img
                                                            src={friend.picture || "/beetle insect.jpg"}
                                                            alt={friend.username}
                                                            className="size-10 rounded-full object-cover border"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium">@{friend.username}</p>
                                                            <p className="text-xs text-muted-foreground">Friend</p>
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
                                <Button type="button" variant="secondary" onClick={uploadProfilePicture} disabled={isUploading || !selectedFile}>
                                    {isUploading ? "Uploading..." : "Upload"}
                                </Button>
                                {uploadMsg && <p className="text-sm text-muted-foreground">{uploadMsg}</p>}
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
                        <div>
                            <Label>Bio</Label>
                            <Input value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} />
                            <Label>Public profile</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button onClick={saveProfile}>Save</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
