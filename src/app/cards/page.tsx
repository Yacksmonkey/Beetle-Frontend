"use client"

import {useState} from "react"
import {motion, useAnimation, useMotionValue, useTransform} from "framer-motion"
import Navbar from "@/components/core/navbar";

const cards = [
	{
		id: 1,
		text: "Acción",
		emoji: "💥",
		value: "accion",
		relation: "Peliculas",
		img: null,
		color: "text-orange-600",
		bg: "from-orange-50"
	},
	{
		id: 2,
		text: "Drama",
		emoji: "🎭",
		value: "drama",
		relation: "Peliculas",
		img: null,
		color: "text-purple-600",
		bg: "from-purple-50"
	},
	{
		id: 3,
		text: "Comedia",
		emoji: "😂",
		value: "comedia",
		relation: "Peliculas",
		img: null,
		color: "text-yellow-600",
		bg: "from-yellow-50"
	},
	{
		id: 4,
		text: "Ciencia Ficción",
		emoji: "🚀",
		value: "scifi",
		relation: "Peliculas",
		img: null,
		color: "text-blue-600",
		bg: "from-blue-50"
	},
	{
		id: 5,
		text: "Terror",
		emoji: "👻",
		value: "terror",
		relation: "Peliculas",
		img: null,
		color: "text-gray-900",
		bg: "from-gray-50"
	},
	{
		id: 6,
		text: "Animación",
		emoji: "🎨",
		value: "animacion",
		relation: "Peliculas",
		img: null,
		color: "text-pink-600",
		bg: "from-pink-50"
	},
]

export default function Page() {
	const [currentCards, setCurrentCards] = useState(cards)

	const removeCard = (id: number) => {
		setCurrentCards((prev) => prev.filter((card) => card.id !== id))
	}

	return (
		<main
			className="min-h-screen bg-gradient-to-br from-secondary via-card to-background flex items-center justify-center p-4 overflow-hidden">
			<Navbar></Navbar>
			<div className="relative w-80 h-[500px]">
				{currentCards.map((card, index) => (
					<Card
						key={card.id}
						card={card}
						index={index}
						totalCards={currentCards.length}
						onRemove={() => removeCard(card.id)}
					/>
				))}

				{currentCards.length === 0 && (
					<div className="absolute inset-0 flex items-center justify-center">
						<div className="text-white text-2xl font-bold text-center">No hay más cartas</div>
					</div>
				)}
			</div>
		</main>
	)
}

function Card({
				  card,
				  index,
				  totalCards,
				  onRemove,
			  }: {
	card: {
		id: number;
		text: string;
		emoji: string;
		value: string;
		relation: string;
		img: null;
		color: string;
		bg: string
	}
	index: number
	totalCards: number
	onRemove: () => void
}) {
	const controls = useAnimation()
	const x = useMotionValue(0)
	const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15])

	const isTop = index === totalCards - 1
	const scale = 1 - (totalCards - 1 - index) * 0.05
	const yOffset = (totalCards - 1 - index) * 10

	const handleDragEnd = async (_: any, info: any) => {
		if (Math.abs(info.offset.x) > 80) {
			const direction = info.offset.x > 0 ? 1 : -1
			await controls.start({
				x: direction * 1000,
				rotate: direction * 45,
				opacity: 0,
				transition: {duration: 0.4, ease: "easeOut"},
			})
			onRemove()
		} else {
			await controls.start({
				x: 0,
				rotate: 0,
				transition: {type: "spring", stiffness: 300, damping: 30},
			})
		}
	}

	return (
		<motion.div
			className="absolute inset-0 cursor-grab active:cursor-grabbing"
			style={{
				x,
				rotate,
				scale,
				y: yOffset,
				zIndex: index,
			}}
			animate={controls}
			drag={isTop ? "x" : false}
			dragElastic={0.7}
			onDragEnd={handleDragEnd}
		>
			<div className="w-full h-full  rounded-2xl shadow-2xl border-2 ">
				<div
					className={`w-full h-full rounded-2xl bg-gradient-to-br ${card.bg} to-white p-8 flex flex-col items-center justify-center`}>
					<div className="text-8xl mb-4">{card.emoji}</div>
					<div className={`${card.color} font-bold text-3xl text-center`}>{card.text}</div>
					<div className="text-gray-400 text-sm mt-2">{card.relation}</div>
				</div>
			</div>
		</motion.div>
	)
}