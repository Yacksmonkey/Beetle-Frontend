import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import Navbar from "@/components/core/navbar"
import Footer from "@/components/core/footer"
import { GoogleOAuthProvider } from "@react-oauth/google"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Beetle — Discover your perfect journey",
    description: "Build your perfect plan by selecting cards. Your journey starts here.",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>

        <GoogleOAuthProvider clientId={"911683984183-dvd6d20059jceqmooeqrh7u08l1ob76r.apps.googleusercontent.com"}>

            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <Navbar />
                <main className="min-h-screen">
                    {children}
                </main>
                <Footer />
            </ThemeProvider>

        </GoogleOAuthProvider>

        </body>
        </html>
    )
}
