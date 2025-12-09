"use client"

import {Eye, MapPin, User} from "lucide-react"
import {Card} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import Image from "next/image"

export default function ProfilePage() {
	return (
		<div className="min-h-screen bg-background py-8 px-4 mt-12">
			<div className="max-w-6xl mx-auto">
				<div className="flex flex-col lg:flex-row gap-8">
					<div className="lg:w-1/3 space-y-8">
						{/* Profile Image */}
						<div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
							<Image src="https://indiehoy.com/wp-content/uploads/2020/07/rick-morty.jpg"
								   alt="Jeremy Rose profile picture" fill
								   className="object-cover" priority/>
						</div>


					</div>

					{/* Right Column - Main Profile Info */}
					<div className="lg:w-2/3 space-y-6">
						{/* Profile Header */}
						<div className="space-y-4">
							<div className="flex items-start justify-between">
								<div>
									<div className="flex items-center gap-2">
										<h1 className="text-4xl font-bold text-foreground">Jeremy Rose</h1>
										<MapPin className="w-5 h-5 text-muted-foreground"/>
										<span className="text-muted-foreground">New York, NY</span>
									</div>
								</div>

							</div>
						</div>

						{/* Tabs Section */}
						<Tabs defaultValue="about" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="timeline" className="gap-2">
									<Eye className="w-4 h-4"/>
									Timeline
								</TabsTrigger>
								<TabsTrigger value="about" className="gap-2">
									<User className="w-4 h-4"/>
									About
								</TabsTrigger>
							</TabsList>

							<TabsContent value="timeline" className="mt-6">
								<Card className="p-6">
									<p className="text-muted-foreground">Timeline content goes here</p>
								</Card>
							</TabsContent>

							<TabsContent value="about" className="mt-6">
								<div className="space-y-6">
									{/* Contact Information */}
									<Card className="p-6">
										<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
											Contact Information
										</h3>
										<div className="space-y-4">
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">Phone:</span>
												<a href="tel:+11234567890"
												   className="text-sm text-primary hover:underline">
													+1 123 456 7890
												</a>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">Address:</span>
												<p className="text-sm text-muted-foreground">
													525 E 68th Street, New York, NY 10651-78 156-187-60
												</p>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">E-mail:</span>
												<a href="mailto:hello@jeremyrose.com"
												   className="text-sm text-primary hover:underline">
													hello@jeremyrose.com
												</a>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">Site:</span>
												<a href="https://www.jeremyrose.com"
												   className="text-sm text-primary hover:underline">
													www.jeremyrose.com
												</a>
											</div>
										</div>
									</Card>

									{/* Basic Information */}
									<Card className="p-6">
										<h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
											Basic Information
										</h3>
										<div className="space-y-4">
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">Birthday:</span>
												<p className="text-sm text-muted-foreground">June 5, 1992</p>
											</div>
											<div className="flex flex-col sm:flex-row sm:items-center gap-2">
												<span
													className="text-sm font-medium text-foreground min-w-24">Gender:</span>
												<p className="text-sm text-muted-foreground">Male</p>
											</div>
										</div>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</div>
	)
}
