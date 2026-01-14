"use client"
import {useState} from 'react'
import {Menu, User, X} from 'lucide-react'
import {Sheet, SheetContent, SheetTrigger,} from '@/components/ui/sheet'
import {Button} from '@/components/ui/button'
import AuthModal from "@/components/modal/auth";
import {DarkMode} from "@/components/ui/dark-mode";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false)
	const [authModalOpen, setAuthModalOpen] = useState(false)


	const openAuthModal = () => {
		setAuthModalOpen(true)
		setIsOpen(false)
	}

	const navLinks = [
		{name: 'Home', href: '#'},
		{name: 'About', href: '#'},
	]

	return (
		<>
			<nav className="z-50 bg-background/80 backdrop-blur-md border-b border-border">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<div
							className="text-2xl font-bold text-primary">
							Bettle
						</div>

						{/* Desktop Navigation */}
						<div className="hidden md:flex md:items-center md:space-x-8">
							{navLinks.map((link) => (
								<a
									key={link.name}
									href={link.href}
									className="text-foreground/60 hover:text-foreground transition-colors"
								>
									{link.name}
								</a>
							))}

							<Button
								onClick={openAuthModal}
								className="flex items-center gap-2"
							>
								<User className="h-4 w-4"/>
							</Button>
							<DarkMode/>
						</div>

						{/* Mobile menu button */}
						<div className="md:hidden">
							<Sheet open={isOpen} onOpenChange={setIsOpen}>
								<SheetTrigger asChild>
									<Button variant="ghost" size="icon">
										{isOpen ? (
											<X className="h-6 w-6"/>
										) : (
											<Menu className="h-6 w-6"/>
										)}
									</Button>
								</SheetTrigger>
								<SheetContent side="right" className="w-[300px] sm:w-[400px]">
									<nav className="flex flex-col gap-4 mt-8">
										{navLinks.map((link) => (
											<a
												key={link.name}
												href={link.href}
												className="text-lg font-medium text-foreground/60 hover:text-foreground transition-colors px-2 py-2"
												onClick={() => setIsOpen(false)}
											>
												{link.name}
											</a>
										))}

										<Button
											onClick={openAuthModal}
											className="flex items-center gap-2 mt-4"
										>
											<User className="h-4 w-4"/>
											Profile
										</Button>
									</nav>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
			</nav>

			{/* Auth Modal */}
			<AuthModal authModalOpen={authModalOpen} setAuthModalOpen={setAuthModalOpen}/>
		</>
	)
}