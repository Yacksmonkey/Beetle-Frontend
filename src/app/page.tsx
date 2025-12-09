"use client"

import {Canvas} from "@react-three/fiber"
import {OrbitControls, SpotLight} from "@react-three/drei"
import {Suspense, useEffect, useState} from "react"
import VWBeetle from "@/components/core/VWBeetle"
import {useTheme} from "next-themes"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {ArrowRight, Map, Sparkles, Users, Zap} from "lucide-react"

export default function Home() {
	const {theme} = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const isDark = mounted && theme === "dark"

	return (
		<div className="min-h-screen">

			<div className="relative h-screen w-full  mt-5">
				<Canvas camera={{position: [1.5, 3.5, 3], fov: 60}} shadows className="absolute inset-0">
					<Suspense fallback={null}>
						<ambientLight intensity={isDark ? 0.1 : 0.2}/>

						<SpotLight
							position={[3, 4, -2]}
							angle={1}
							penumbra={0.5}
							intensity={45}
							distance={15}
							castShadow
							color={isDark ? "#6495ED" : "#ffffff"}
							volumetric
							opacity={0.3}
						/>

						<VWBeetle/>

						<OrbitControls
							enablePan={false}
							enableZoom={false}
							enableRotate={true}
							minDistance={2}
							maxDistance={20}
							minPolarAngle={Math.PI / 3}
							maxPolarAngle={Math.PI / 3}
							enableDamping={true}
							dampingFactor={0.05}
							rotateSpeed={0.3}
						/>
						<directionalLight
							position={[5, 5, 5]}
							intensity={isDark ? 0.8 : 1.2}
							castShadow
							color={isDark ? "#6495ED" : "#ffffff"}
						/>
						<hemisphereLight
							groundColor={isDark ? "#0f0f1e" : "#8B4513"}
							intensity={0.5}
						/>
					</Suspense>
				</Canvas>

				<div
					className="absolute r-2 inset-0 flex items-center justify-center md:justify-start  pointer-events-none">
					<div className="text-center space-y-6 px-4 pointer-events-auto">
						<div className="inline-block">
							<h1 className="text-6xl md:text-8xl font-bold text-balance">
                <span
					className="text-primary"
				>
                  Welcome to
                </span>
							</h1>
							<h1 className="text-6xl md:text-8xl font-bold text-balance mt-2">
                <span className="text-primary">
                  Bettle
                </span>
							</h1>
						</div>

						<p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto text-pretty">
							{"Build your perfect plan by selecting cards. Your journey starts here."}
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
							<Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
								Start Your Journey
								<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
							</Button>
							<Button size="lg" variant="outline"
									className="border-primary/50 hover:bg-primary/10 bg-transparent">
								Explore Cards
							</Button>
						</div>
					</div>
				</div>

				{/* Scroll Indicator */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
					<div
						className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center p-2">
						<div className="w-1.5 h-3 bg-primary rounded-full animate-pulse"/>
					</div>
				</div>
			</div>

			<div className="bg-background">
				{/* Features Section */}
				<section id="features" className="py-24 px-4">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{"Plan Your Journey with Cards"}</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
								{"Select, combine, and customize cards to create the perfect plan for your needs"}
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{[
								{
									icon: Sparkles,
									title: "Smart Selection",
									description: "AI-powered card recommendations based on your goals",
								},
								{
									icon: Map,
									title: "Journey Mapping",
									description: "Visualize your plan as an interactive roadmap",
								},
								{
									icon: Zap,
									title: "Quick Setup",
									description: "Create comprehensive plans in minutes, not hours",
								},
								{
									icon: Users,
									title: "Collaborate",
									description: "Share and build plans together with your team",
								},
							].map((feature, i) => (
								<Card key={i} className="border-border hover:border-primary/50 transition-colors">
									<CardContent className="pt-6">
										<div className="mb-4 inline-flex p-3 rounded-lg bg-primary/10">
											<feature.icon className="h-6 w-6 text-primary"/>
										</div>
										<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
										<p className="text-muted-foreground text-pretty">{feature.description}</p>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				<section id="how-it-works" className="py-24 px-4 bg-muted/30">
					<div className="max-w-7xl mx-auto">
						<div className="text-center mb-16">
							<h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{"How It Works"}</h2>
							<p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
								{"Three simple steps to create your perfect plan"}
							</p>
						</div>

						<div className="grid md:grid-cols-3 gap-8">
							{[
								{
									step: "01",
									title: "Choose Your Cards",
									description: "Browse our collection of planning cards and select the ones that match your goals",
								},
								{
									step: "02",
									title: "Arrange Your Journey",
									description: "Organize cards in the order that makes sense for your unique path forward",
								},
								{
									step: "03",
									title: "Start Building",
									description: "Execute your plan with confidence, tracking progress every step of the way",
								},
							].map((item, i) => (
								<div key={i} className="relative">
									<div className="text-7xl font-bold text-primary mb-4">{item.step}</div>
									<h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
									<p className="text-muted-foreground text-pretty leading-relaxed">{item.description}</p>
									{i < 2 && (
										<div
											className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-transparent"/>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
				<section className="py-24 px-4 ">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{"Ready to Start Your Journey?"}</h2>
						<p className="text-xl text-muted-foreground mb-8 text-pretty">
							{"Join thousands of users who are planning smarter with Bettle"}
						</p>
						<Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
							Get Started Free
							<ArrowRight className="ml-2 h-5 w-5"/>
						</Button>
					</div>
				</section>


			</div>
		</div>
	)
}
