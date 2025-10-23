"use client"
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

export const DarkMode = () => {
	const {setTheme, theme} = useTheme()
	const [mounted, setMounted] = useState(false)

	// Espera a que el componente se monte en el cliente
	useEffect(() => {
		setMounted(true)
	}, [])

	// Mientras no esté montado, renderiza un placeholder consistente
	if (!mounted) {
		return (
			<Button variant="ghost" size="icon" disabled>
				<Sun className="h-5 w-5"/>
			</Button>
		)
	}

	// Una vez montado, renderiza basado en el tema real
	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			{theme === "dark" ? (
				<Sun className="h-5 w-5"/>
			) : (
				<Moon className="h-5 w-5"/>
			)}
		</Button>
	)
}