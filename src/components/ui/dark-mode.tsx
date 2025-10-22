"use client"
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";
import {useTheme} from "next-themes";


export const DarkMode = () => {
	const {setTheme, theme} = useTheme()
	return (
		<>
			{
				theme === "dark" ? (
					<Button onClick={() => setTheme("light")}>
						<Sun/>
					</Button>
				) : (
					<Button onClick={() => setTheme("dark")}>
						<Moon/>
					</Button>
				)
			}
		</>
	)

}