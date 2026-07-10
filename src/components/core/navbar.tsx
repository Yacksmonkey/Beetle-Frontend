"use client"
import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, LogOut, Menu, Search, User, X, UserPlus, Loader2, LogIn } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AuthModal from "@/components/modal/auth";
import { DarkMode } from "@/components/ui/dark-mode";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { BeetleLogo } from "@/components/core/beetle-logo";

type SearchUser = {
	id: number
	name?: string
	username: string
	picture: string | null
}

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const [authModalOpen, setAuthModalOpen] = useState(false)
	const { user, isAuthenticated, logout, refreshUser } = useAuth()
	const router = useRouter()

	const [searchQuery, setSearchQuery] = useState("")
	const [searchResults, setSearchResults] = useState<SearchUser[]>([])
	const [searchLoading, setSearchLoading] = useState(false)
	const [searchError, setSearchError] = useState<string | null>(null)
	const [showSearchDropdown, setShowSearchDropdown] = useState(false)
	const [addingFriendId, setAddingFriendId] = useState<number | null>(null)
	const [friendIds, setFriendIds] = useState<Set<number>>(new Set())
	const [sentRequestIds, setSentRequestIds] = useState<Set<number>>(new Set())
	const searchRef = useRef<HTMLDivElement>(null)
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const openAuthModal = () => {
		setAuthModalOpen(true)
		setIsOpen(false)
	}

	const handleLogout = async () => {
		await logout()
		router.push("/")
	}

	useEffect(() => {
		if (isAuthenticated) {
			api.get<Record<string, unknown>[]>("/api/friends")
				.then((data) => {
					const ids = data
						.map((f) => f.friendUserId ?? f.id ?? f.userId ?? f.friendId)
						.filter((id): id is number => typeof id === "number" && !Number.isNaN(id))
					setFriendIds(new Set(ids))
				})
				.catch((err) => {
					if (process.env.NODE_ENV === "development") console.error("Failed to load friends:", err)
				})
		}
	}, [isAuthenticated])

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
				setShowSearchDropdown(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const doSearch = useCallback(async (q: string) => {
		if (q.length < 2) {
			setSearchResults([])
			setShowSearchDropdown(false)
			return
		}
		setSearchLoading(true)
		setSearchError(null)
		try {
			const data = await api.get<SearchUser[]>(`/api/auth/users/search?q=${encodeURIComponent(q)}`)
			setSearchResults(data)
			setShowSearchDropdown(true)
		} catch {
			setSearchError("Search failed")
			setSearchResults([])
		} finally {
			setSearchLoading(false)
		}
	}, [])

	const handleSearchChange = (value: string) => {
		setSearchQuery(value)
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => doSearch(value), 300)
	}

	const handleAddFriend = async (receiverUserId: number) => {
		setAddingFriendId(receiverUserId)
		try {
			await api.post("/api/friends/request", { receiverUserId })
			setSentRequestIds((prev) => new Set(prev).add(receiverUserId))
		} catch {
			// silent
		} finally {
			setAddingFriendId(null)
		}
	}

	const isFriend = (userId: number) => friendIds.has(userId)
	const isRequestSent = (userId: number) => sentRequestIds.has(userId)

	const allLinks = [
		{ name: 'Home', href: '/' },
		{ name: 'Cards', href: '/cards' },
		{ name: 'History', href: '/history' },
	]

	const handleNav = (href: string) => {
		setIsOpen(false)
		router.push(href)
	}

	return (
		<>
			<nav className="z-50 bg-background/80 backdrop-blur-md border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center gap-3">
							<button
								onClick={() => router.push("/")}
								className="flex items-center gap-2.5"
							>
								<BeetleLogo className="size-7 text-primary" />
								<span className="text-xl font-semibold text-foreground tracking-tight">
									Beetle
								</span>
							</button>
						</div>

						<div className="flex items-center gap-1">
							{isAuthenticated && (
								<div className="hidden md:flex md:items-center md:gap-1">
									{allLinks.map((link) => (
										<button
											key={link.name}
											onClick={() => router.push(link.href)}
											className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
										>
											{link.name}
										</button>
									))}
								</div>
							)}

							{!isAuthenticated && (
								<div className="hidden md:flex md:items-center md:gap-1">
									<button
										onClick={() => router.push("/")}
										className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
									>
										Home
									</button>
								</div>
							)}

							{isAuthenticated && (
								<div className="hidden md:block relative" ref={searchRef}>
									<div className="relative">
										<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											placeholder="Search users..."
											value={searchQuery}
											onChange={(e) => handleSearchChange(e.target.value)}
											onFocus={() => { if (searchResults.length > 0 || searchQuery.length >= 2) setShowSearchDropdown(true) }}
											className="pl-8 w-56 h-9 text-sm"
										/>
									</div>

									{showSearchDropdown && (
										<div className="absolute top-full mt-1.5 right-0 w-80 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50">
											{searchLoading && (
												<div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
													<Loader2 className="h-4 w-4 animate-spin" />
													Searching...
												</div>
											)}

											{searchError && !searchLoading && (
												<div className="p-4 text-sm text-destructive">{searchError}</div>
											)}

											{!searchLoading && !searchError && searchResults.length === 0 && searchQuery.length >= 2 && (
												<div className="p-4 text-sm text-muted-foreground">No users found.</div>
											)}

											{!searchLoading && searchResults.length > 0 && (
												<div className="max-h-64 overflow-y-auto">
													{searchResults.map((u) => (
														<div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors">
															<img
																src={u.picture || "/beetle insect.jpg"}
																alt={u.username}
																className="w-9 h-9 rounded-full object-cover border"
															/>
															<div className="flex-1 min-w-0">
																<p className="text-sm font-medium truncate">{u.name || u.username}</p>
																<p className="text-xs text-muted-foreground truncate">@{u.username}</p>
															</div>
															{u.id !== user?.id && (
																<Button
																	size="sm"
																	variant="outline"
																	onClick={() => handleAddFriend(u.id)}
																	disabled={isFriend(u.id) || isRequestSent(u.id) || addingFriendId === u.id}
																	className="shrink-0"
																>
																	{addingFriendId === u.id ? (
																		<Loader2 className="h-3 w-3 animate-spin" />
																	) : isFriend(u.id) || isRequestSent(u.id) ? (
																		<Check className="h-3 w-3" />
																	) : (
																		<UserPlus className="h-3 w-3" />
																	)}
																	<span className="ml-1.5 text-xs">{isFriend(u.id) ? "Friends" : isRequestSent(u.id) ? "Sent" : ""}</span>
																</Button>
															)}
														</div>
													))}
												</div>
											)}
										</div>
									)}
								</div>
							)}

							<div className="hidden md:flex md:items-center md:gap-1">
								<DarkMode />

								{isAuthenticated && user ? (
									<>
										<Button
											variant="ghost"
											onClick={() => router.push("/profile")}
											className="flex items-center gap-2"
										>
											{user.picture ? (
												<img
													src={user.picture}
													alt={user.name || "Profile"}
													className="w-7 h-7 rounded-full object-cover"
												/>
											) : (
												<User className="h-4 w-4" />
											)}
											<span className="text-sm font-medium">{user.name || user.username || "Profile"}</span>
										</Button>
										<Button variant="ghost" size="icon" onClick={handleLogout}>
											<LogOut className="h-4 w-4" />
										</Button>
									</>
								) : (
									<Button onClick={openAuthModal} size="sm">
										<LogIn className="h-4 w-4" />
										Sign in
									</Button>
								)}
							</div>

							<div className="md:hidden flex items-center gap-1">
								{isAuthenticated && (
									<Button variant="ghost" size="icon" onClick={() => router.push("/profile")}>
										{user?.picture ? (
											<img
												src={user.picture}
												alt="Profile"
												className="w-7 h-7 rounded-full object-cover"
											/>
										) : (
											<User className="h-5 w-5" />
										)}
									</Button>
								)}
								<DarkMode />
								<Sheet open={isOpen} onOpenChange={setIsOpen}>
									<SheetTrigger asChild>
										<Button variant="ghost" size="icon">
											{isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
										</Button>
									</SheetTrigger>
									<SheetContent side="right" className="w-[300px] sm:w-[400px]">
										<nav className="flex flex-col gap-2 mt-8 px-2">
											{isAuthenticated ? (
												allLinks.map((link) => (
													<button
														key={link.name}
														onClick={() => handleNav(link.href)}
														className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2.5 rounded-lg hover:bg-accent text-left cursor-pointer"
													>
														{link.name}
													</button>
												))
											) : (
												<button
													onClick={() => handleNav("/")}
													className="text-base font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-2.5 rounded-lg hover:bg-accent text-left cursor-pointer"
												>
													Home
												</button>
											)}

											{isAuthenticated && (
												<div className="relative mt-2 px-1">
													<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
													<Input
														placeholder="Search users..."
														value={searchQuery}
														onChange={(e) => handleSearchChange(e.target.value)}
														className="pl-8 h-9 text-sm"
													/>
												</div>
											)}

											{showSearchDropdown && searchResults.length > 0 && (
												<div className="border border-border rounded-xl overflow-hidden mx-1">
													{searchResults.map((u) => (
														<div key={u.id} className="flex items-center gap-3 px-3 py-2.5 hover:bg-accent transition-colors">
															<img
																src={u.picture || "/beetle insect.jpg"}
																alt={u.username}
																className="w-8 h-8 rounded-full object-cover border"
															/>
															<div className="flex-1 min-w-0">
																<p className="text-sm font-medium truncate">{u.name || u.username}</p>
																<p className="text-xs text-muted-foreground truncate">@{u.username}</p>
															</div>
															{u.id !== user?.id && (
																<Button
																	size="sm"
																	variant="outline"
																	onClick={() => handleAddFriend(u.id)}
																	disabled={isFriend(u.id) || isRequestSent(u.id) || addingFriendId === u.id}
																>
																	{addingFriendId === u.id ? (
																		<Loader2 className="h-3 w-3 animate-spin" />
																	) : isFriend(u.id) || isRequestSent(u.id) ? (
																		<Check className="h-3 w-3" />
																	) : (
																		<UserPlus className="h-3 w-3" />
																	)}
																	<span className="ml-1.5 text-xs">{isFriend(u.id) ? "Friends" : isRequestSent(u.id) ? "Sent" : ""}</span>
																</Button>
															)}
														</div>
													))}
												</div>
											)}

											<div className="mt-4 border-t border-border pt-4 space-y-1">
												{isAuthenticated ? (
													<>
														<Button
															onClick={() => { setIsOpen(false); router.push("/profile") }}
															className="w-full justify-start gap-3"
															variant="ghost"
														>
															{user?.picture ? (
																<img
																	src={user.picture}
																	alt={user.name || "Profile"}
																	className="w-7 h-7 rounded-full object-cover"
																/>
															) : (
																<User className="h-4 w-4" />
															)}
															{user?.name || user?.username || "Profile"}
														</Button>
														<Button
															variant="ghost"
															onClick={() => { setIsOpen(false); handleLogout() }}
															className="w-full justify-start gap-3"
														>
															<LogOut className="h-4 w-4" />
															Logout
														</Button>
													</>
												) : (
													<Button onClick={() => { openAuthModal() }} className="w-full justify-start gap-3">
														<LogIn className="h-4 w-4" />
														Sign in
													</Button>
												)}
											</div>
										</nav>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</div>
				</div>
			</nav>

			<AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen} onAuthSuccess={refreshUser} />
		</>
	)
}
