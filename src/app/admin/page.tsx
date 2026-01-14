"use client";

import {useMemo, useState} from "react";
import {ArrowDownAZ, ArrowUpAZ, Filter, LayoutGrid, List, Package, Pencil, Plus, Trash2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {Card, CardContent, CardFooter,} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CardItem {
	id: string;
	text: string;
	emoji: string;
	value: string;
	relation: string;
	img: string | null;
}

const initialCards: CardItem[] = [
	{
		"text": "Acción", "emoji": "💥", "value": "accion",
		"relation": "Peliculas", "img": "", "id": "1"
	},
	{
		"text": "Drama", "emoji": "🎭", "value": "drama",
		"relation": "Peliculas", "img": "", "id": "2"
	},
	{
		"text": "Comedia", "emoji": "😂", "value": "comedia",
		"relation": "Peliculas", "img": "", "id": "3"
	},
	{
		"text": "Ciencia Ficción", "emoji": "🚀",
		"value": "scifi", "relation": "Peliculas", "img": "", "id": "4"
	},
	{
		"text": "Terror", "emoji": "👻", "value": "terror",
		"relation": "Peliculas", "img": "", "id": "5"
	},
	{
		"text": "Animación", "emoji": "🎨", "value": "animacion",
		"relation": "Peliculas", "img": "", "id": "6"
	},
	{
		"text": "Ficción", "emoji": "📖", "value": "ficcion",
		"relation": "Libros", "img": "", "id": "7"
	},
	{
		"text": "Ciencia Ficción", "emoji": "🛸",
		"value": "scifi", "relation": "Libros", "img": "", "id": "8"
	},
	{
		"text": "Fantasía", "emoji": "🧙‍♂️", "value": "fantasia",
		"relation": "Libros", "img": "", "id": "9"
	},
	{
		"text": "Misterio", "emoji": "🔍", "value": "misterio",
		"relation": "Libros", "img": "", "id": "10"
	},
	{
		"text": "Romance", "emoji": "💕", "value": "romance",
		"relation": "Libros", "img": "", "id": "11"
	},
	{
		"text": "No Ficción", "emoji": "📊", "value": "noficcion",
		"relation": "Libros", "img": "", "id": "12"
	},
	{
		"text": "Drama", "emoji": "🎭", "value": "drama",
		"relation": "Series", "img": "", "id": "13"
	},
	{
		"text": "Comedia", "emoji": "😄", "value": "comedia",
		"relation": "Series", "img": "", "id": "14"
	},
	{
		"text": "Acción", "emoji": "⚔️", "value": "accion",
		"relation": "Series", "img": "", "id": "15"
	},
	{
		"text": "Ciencia Ficción", "emoji": "👽",
		"value": "scifi", "relation": "Series", "img": "", "id": "16"
	},
	{
		"text": "Crimen/Thriller", "emoji": "🕵️",
		"value": "crimen", "relation": "Series", "img": "", "id": "17"
	},
	{
		"text": "Documentales", "emoji": "🎥",
		"value": "documental", "relation": "Series", "img": "", "id": "18"
	},
	{
		"text": "Película Corta (< 90 min)", "emoji": "⏰", "value": "accion_corta",
		"relation": "accion", "img": "", "id": "19"
	},
	{
		"text": "Duración Media (90-120 min)", "emoji": "🕐", "value": "accion_media",
		"relation": "accion", "img": "", "id": "20"
	},
	{
		"text": "Película Larga (> 120 min)", "emoji": "⏳", "value": "accion_larga",
		"relation": "accion", "img": "", "id": "21"
	},
	{
		"text": "Con Tom Cruise", "emoji": "🎬", "value": "tom_cruise_accion_corta",
		"relation": "accion_corta", "img": "", "id": "22"
	},
	{
		"text": "Con Jason Statham", "emoji": "💪", "value": "jason_statham_accion_corta",
		"relation": "accion_corta", "img": "", "id": "23"
	},
	{
		"text": "Con Keanu Reeves", "emoji": "🕴️", "value": "keanu_reeves_accion_corta",
		"relation": "accion_corta", "img": "", "id": "24"
	},
	{
		"text": "Con Will Smith", "emoji": "😎", "value": "will_smith_accion_media",
		"relation": "accion_media", "img": "", "id": "25"
	},
	{
		"text": "Con Dwayne Johnson", "emoji": "🗿", "value": "dwayne_johnson_accion_media",
		"relation": "accion_media", "img": "", "id": "26"
	},
	{
		"text": "Con Chris Evans", "emoji": "🛡️", "value": "chris_evans_accion_media",
		"relation": "accion_media", "img": "", "id": "27"
	},
	{
		"text": "Dirigida por Christopher Nolan", "emoji": "🧠", "value": "christopher_nolan_accion_larga",
		"relation": "accion_larga", "img": "", "id": "28"
	},
	{
		"text": "Dirigida por Zack Snyder", "emoji": "🦸", "value": "zack_snyder_accion_larga",
		"relation": "accion_larga", "img": "", "id": "29"
	},
	{
		"text": "Dirigida por Russo Brothers", "emoji": "👥", "value": "russo_brothers_accion_larga",
		"relation": "accion_larga", "img": "", "id": "30"
	},
	{
		"text": "Películas Clásicas (antes 1990)", "emoji": "🎞️",
		"value": "drama_clasico", "relation": "drama", "img": "", "id": "31"
	},
	{
		"text": "Películas Modernas (1990-2010)", "emoji": "📼",
		"value": "drama_moderno", "relation": "drama", "img": "", "id": "32"
	},
	{
		"text": "Películas Actuales (2010+)", "emoji": "🆕", "value": "drama_actual",
		"relation": "drama", "img": "", "id": "33"
	},
	{
		"text": "Con Marlon Brando", "emoji": "👑", "value": "marlon_brando_drama_clasico",
		"relation": "drama_clasico", "img": "", "id": "34"
	},
	{
		"text": "Con Al Pacino", "emoji": "🕴️", "value": "al_pacino_drama_clasico",
		"relation": "drama_clasico", "img": "", "id": "35"
	},
	{
		"text": "Con Robert De Niro", "emoji": "🎭", "value": "robert_deniro_drama_clasico",
		"relation": "drama_clasico", "img": "", "id": "36"
	},
	{
		"text": "Con Tom Hanks", "emoji": "🏃‍♂️", "value": "tom_hanks_drama_moderno",
		"relation": "drama_moderno", "img": "", "id": "37"
	},
	{
		"text": "Con Leonardo DiCaprio", "emoji": "🌊", "value": "leonardo_dicaprio_drama_moderno",
		"relation": "drama_moderno", "img": "", "id": "38"
	},
	{
		"text": "Con Russell Crowe", "emoji": "🏛️", "value": "russell_crowe_drama_moderno",
		"relation": "drama_moderno", "img": "", "id": "39"
	},
	{
		"text": "Con Joaquin Phoenix", "emoji": "🃏", "value": "joaquin_phoenix_drama_actual",
		"relation": "drama_actual", "img": "", "id": "40"
	},
	{
		"text": "Con Ryan Gosling", "emoji": "🌙", "value": "ryan_gosling_drama_actual",
		"relation": "drama_actual", "img": "", "id": "41"
	},
	{
		"text": "Con Oscar Isaac", "emoji": "🎵", "value": "oscar_isaac_drama_actual",
		"relation": "drama_actual", "img": "", "id": "42"
	},
	{
		"text": "Comedia Romántica", "emoji": "💕", "value": "comedia_romantica",
		"relation": "comedia", "img": "", "id": "43"
	},
	{
		"text": "Comedia de Acción", "emoji": "💥", "value": "comedia_accion",
		"relation": "comedia", "img": "", "id": "44"
	},
	{
		"text": "Comedia Familiar", "emoji": "👨‍👩‍👧‍👦",
		"value": "comedia_familiar", "relation": "comedia", "img": "", "id": "45"
	},
	{
		"text": "Con Ryan Reynolds", "emoji": "😏", "value": "ryan_reynolds_comedia_romantica",
		"relation": "comedia_romantica", "img": "", "id": "46"
	},
	{
		"text": "Con Jennifer Aniston", "emoji": "💛", "value": "jennifer_aniston_comedia_romantica",
		"relation": "comedia_romantica", "img": "", "id": "47"
	},
	{
		"text": "Con Hugh Grant", "emoji": "🇬🇧", "value": "hugh_grant_comedia_romantica",
		"relation": "comedia_romantica", "img": "", "id": "48"
	},
	{
		"text": "Isaac Asimov", "emoji": "🤖", "value": "asimov",
		"relation": "scifi", "img": "", "id": "49"
	},
	{
		"text": "Philip K. Dick", "emoji": "🧠", "value": "dick",
		"relation": "scifi", "img": "", "id": "50"
	},
	{
		"text": "Ursula K. Le Guin", "emoji": "🌌", "value": "leguin",
		"relation": "scifi", "img": "", "id": "51"
	},
	{
		"text": "Ray Bradbury", "emoji": "🔥", "value": "bradbury",
		"relation": "scifi", "img": "", "id": "52"
	},
	{
		"text": "Robots y Inteligencia Artificial", "emoji": "🤖", "value": "asimov_robots",
		"relation": "asimov", "img": "", "id": "53"
	},
	{
		"text": "Imperio Galáctico", "emoji": "🌟", "value": "asimov_imperio",
		"relation": "asimov", "img": "", "id": "54"
	},
	{
		"text": "Fundación", "emoji": "🏛️", "value": "asimov_fundacion",
		"relation": "asimov", "img": "", "id": "55"
	},
	{
		"text": "Realidad Virtual", "emoji": "🕶️", "value": "dick_realidad_virtual",
		"relation": "dick", "img": "", "id": "56"
	},
	{
		"text": "Distopías Futuristas", "emoji": "🏙️", "value": "dick_distopias",
		"relation": "dick", "img": "", "id": "57"
	},
	{
		"text": "Identidad y Memoria", "emoji": "🧩", "value": "dick_identidad",
		"relation": "dick", "img": "", "id": "58"
	},
	{
		"text": "Novela Corta (< 300 páginas)", "emoji": "📖",
		"value": "fantasia_corta", "relation": "fantasia", "img": "", "id": "59"
	},
	{
		"text": "Novela Media (300-500 páginas)", "emoji": "📚",
		"value": "fantasia_media", "relation": "fantasia", "img": "", "id": "60"
	},
	{
		"text": "Saga Épica (500+ páginas)", "emoji": "📜", "value": "fantasia_epica",
		"relation": "fantasia", "img": "", "id": "61"
	},
	{
		"text": "J.R.R. Tolkien", "emoji": "🧙‍♂️", "value": "tolkien_fantasia_epica",
		"relation": "fantasia_epica", "img": "", "id": "62"
	},
	{
		"text": "George R.R. Martin", "emoji": "🗡️", "value": "martin_fantasia_epica",
		"relation": "fantasia_epica", "img": "", "id": "63"
	},
	{
		"text": "Brandon Sanderson", "emoji": "⚔️", "value": "sanderson_fantasia_epica",
		"relation": "fantasia_epica", "img": "", "id": "64"
	},
	{
		"text": "Series Cortas (1-2 temporadas)", "emoji": "⏱️",
		"value": "drama_series_corta", "relation": "drama", "img": "", "id": "65"
	},
	{
		"text": "Series Largas (3+ temporadas)", "emoji": "📺",
		"value": "drama_series_larga", "relation": "drama", "img": "", "id": "66"
	},
	{
		"text": "Miniseries (episodios limitados)", "emoji": "🎬",
		"value": "drama_miniserie", "relation": "drama", "img": "", "id": "67"
	},
	{
		"text": "Con Bryan Cranston", "emoji": "🧪", "value": "bryan_cranston_drama_series_larga",
		"relation": "drama_series_larga", "img": "", "id": "68"
	},
	{
		"text": "Con Claire Foy", "emoji": "👑", "value": "claire_foy_drama_series_larga",
		"relation": "drama_series_larga", "img": "", "id": "69"
	},
	{
		"text": "Con Kevin Spacey", "emoji": "🏛️", "value": "kevin_spacey_drama_series_larga",
		"relation": "drama_series_larga", "img": "", "id": "70"
	},
	{
		"text": "Comedia de Oficina", "emoji": "💼", "value": "comedia_oficina",
		"relation": "comedia", "img": "", "id": "71"
	},
	{
		"text": "Comedia Situacional", "emoji": "🏠",
		"value": "comedia_situacional", "relation": "comedia", "img": "", "id": "72"
	},
	{
		"text": "Comedia Absurda", "emoji": "🤪", "value": "comedia_absurda",
		"relation": "comedia", "img": "", "id": "73"
	},
	{
		"text": "Con Steve Carell", "emoji": "📎", "value": "steve_carell_comedia_oficina",
		"relation": "comedia_oficina", "img": "", "id": "74"
	},
	{
		"text": "Con Ricky Gervais", "emoji": "😏", "value": "ricky_gervais_comedia_oficina",
		"relation": "comedia_oficina", "img": "", "id": "75"
	},
	{
		"text": "Con Amy Poehler", "emoji": "🏛️", "value": "amy_poehler_comedia_oficina",
		"relation": "comedia_oficina", "img": "", "id": "76"
	},
	{
		"text": "Naturaleza", "emoji": "🌍", "value": "doc_naturaleza",
		"relation": "documental", "img": "", "id": "77"
	},
	{
		"text": "Crimen Real", "emoji": "🔍", "value": "doc_crimen",
		"relation": "documental", "img": "", "id": "78"
	},
	{
		"text": "Historia", "emoji": "🏛️", "value": "doc_historia",
		"relation": "documental", "img": "", "id": "79"
	},
	{
		"text": "Ciencia", "emoji": "🔬", "value": "doc_ciencia",
		"relation": "documental", "img": "", "id": "80"
	},
	{
		"text": "Narrado por David Attenborough", "emoji": "🎙️", "value": "attenborough_doc_naturaleza",
		"relation": "doc_naturaleza", "img": "", "id": "81"
	},
	{
		"text": "Narrado por Morgan Freeman", "emoji": "🌟", "value": "freeman_doc_naturaleza",
		"relation": "doc_naturaleza", "img": "", "id": "82"
	},
	{
		"text": "Documental National Geographic", "emoji": "📸", "value": "natgeo_doc_naturaleza",
		"relation": "doc_naturaleza", "img": "", "id": "83"
	}
];
;

const relationOptions = ["Series", "Peliculas", "Anime", "Música", "Juegos", "Libros"];

type ViewMode = "grid" | "table";
type SortField = "none" | "text" | "value";
type SortDirection = "asc" | "desc";

export default function AdminPage() {
	const [cards, setCards] = useState<CardItem[]>(initialCards);
	const [viewMode, setViewMode] = useState<ViewMode>("grid");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingCard, setEditingCard] = useState<CardItem | null>(null);
	const [formData, setFormData] = useState<Omit<CardItem, "id">>({
		text: "",
		emoji: "",
		value: "",
		relation: "Series",
		img: null,
	});

	// Filtros y ordenamiento
	const [filterRelation, setFilterRelation] = useState<string>("all");
	const [sortField, setSortField] = useState<SortField>("none");
	const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

	const resetForm = () => {
		setFormData({text: "", emoji: "", value: "", relation: "Series", img: null});
		setEditingCard(null);
	};

	const openModal = (card?: CardItem) => {
		if (card) {
			setEditingCard(card);
			setFormData({
				text: card.text,
				emoji: card.emoji,
				value: card.value,
				relation: card.relation,
				img: card.img,
			});
		} else {
			resetForm();
		}
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		resetForm();
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (editingCard) {
			setCards((prev) =>
				prev.map((card) =>
					card.id === editingCard.id ? {...card, ...formData} : card
				)
			);
		} else {
			const newCard: CardItem = {
				id: Date.now().toString(),
				...formData,
			};
			setCards((prev) => [...prev, newCard]);
		}

		closeModal();
	};

	const handleDelete = (id: string) => {
		setCards((prev) => prev.filter((card) => card.id !== id));
	};

	const handleSort = (field: SortField) => {
		if (sortField === field) {
			if (sortDirection === "asc") {
				setSortDirection("desc");
			} else {
				setSortField("none");
				setSortDirection("asc");
			}
		} else {
			setSortField(field);
			setSortDirection("asc");
		}
	};

	const clearFilters = () => {
		setFilterRelation("all");
		setSortField("none");
		setSortDirection("asc");
	};

	// Filtrar y ordenar tarjetas
	const filteredAndSortedCards = useMemo(() => {
		let result = [...cards];

		// Filtrar por relación
		if (filterRelation !== "all") {
			result = result.filter((card) => card.relation === filterRelation);
		}

		// Ordenar
		if (sortField !== "none") {
			result.sort((a, b) => {
				const aValue = a[sortField].toLowerCase();
				const bValue = b[sortField].toLowerCase();
				const comparison = aValue.localeCompare(bValue);
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return result;
	}, [cards, filterRelation, sortField, sortDirection]);

	// Agrupar tarjetas por relación (para stats)
	const groupedCards = cards.reduce((acc, card) => {
		if (!acc[card.relation]) {
			acc[card.relation] = [];
		}
		acc[card.relation].push(card);
		return acc;
	}, {} as Record<string, CardItem[]>);

	// Obtener relaciones únicas de las tarjetas existentes
	const existingRelations = useMemo(() => {
		return [...new Set(cards.map((card) => card.relation))];
	}, [cards]);

	const hasActiveFilters = filterRelation !== "all" || sortField !== "none";

	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100">
			{/* Noise overlay */}
			<div
				className="fixed inset-0 pointer-events-none opacity-[0.015]"
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
				}}
			/>

			<div className="relative max-w-6xl mx-auto px-6 py-12">
				{/* Header */}
				<header className="mb-10">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-zinc-800 rounded-lg border border-zinc-700/50">
									<Package className="w-5 h-5 text-zinc-400"/>
								</div>
								<h1 className="text-3xl font-semibold tracking-tight">
									Beetle Admin
								</h1>
							</div>

						</div>

						<Button
							onClick={() => openModal()}
							className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-all duration-200 font-medium"
						>
							<Plus className="w-4 h-4 mr-2"/>
							Nueva Tarjeta
						</Button>
					</div>

					{/* Stats */}
					<div className="mt-8 flex gap-4 flex-wrap">
						<div className="px-4 py-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
							<span className="text-zinc-500 text-sm">Total</span>
							<p className="text-2xl font-semibold">{cards.length}</p>
						</div>
						{Object.entries(groupedCards).map(([relation, items]) => (
							<div
								key={relation}
								className="px-4 py-3 bg-zinc-900/50 rounded-lg border border-zinc-800"
							>
								<span className="text-zinc-500 text-sm">{relation}</span>
								<p className="text-2xl font-semibold">{items.length}</p>
							</div>
						))}
					</div>

					{/* Filtros y controles */}
					<div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
						<div className="flex items-center gap-3">
							{/* Filtro por relación */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className={`border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 ${
											filterRelation !== "all" ? "border-zinc-500 text-zinc-100" : "text-zinc-400"
										}`}
									>
										<Filter className="w-4 h-4 mr-2"/>
										{filterRelation === "all" ? "Filtrar por relación" : filterRelation}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="bg-zinc-900 border-zinc-700">
									<DropdownMenuLabel className="text-zinc-400">Relación</DropdownMenuLabel>
									<DropdownMenuSeparator className="bg-zinc-700"/>
									<DropdownMenuRadioGroup value={filterRelation} onValueChange={setFilterRelation}>
										<DropdownMenuRadioItem
											value="all"
											className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
										>
											Todas
										</DropdownMenuRadioItem>
										{existingRelations.map((relation) => (
											<DropdownMenuRadioItem
												key={relation}
												value={relation}
												className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
											>
												{relation}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* Ordenar por nombre */}
							<Button
								variant="outline"
								onClick={() => handleSort("text")}
								className={`border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 ${
									sortField === "text" ? "border-zinc-500 text-zinc-100" : "text-zinc-400"
								}`}
							>
								{sortField === "text" && sortDirection === "desc" ? (
									<ArrowUpAZ className="w-4 h-4 mr-2"/>
								) : (
									<ArrowDownAZ className="w-4 h-4 mr-2"/>
								)}
								Nombre
								{sortField === "text" && (
									<Badge variant="secondary" className="ml-2 bg-zinc-700 text-zinc-300 text-xs">
										{sortDirection === "asc" ? "A-Z" : "Z-A"}
									</Badge>
								)}
							</Button>

							{/* Ordenar por value */}
							<Button
								variant="outline"
								onClick={() => handleSort("value")}
								className={`border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 ${
									sortField === "value" ? "border-zinc-500 text-zinc-100" : "text-zinc-400"
								}`}
							>
								{sortField === "value" && sortDirection === "desc" ? (
									<ArrowUpAZ className="w-4 h-4 mr-2"/>
								) : (
									<ArrowDownAZ className="w-4 h-4 mr-2"/>
								)}
								Value
								{sortField === "value" && (
									<Badge variant="secondary" className="ml-2 bg-zinc-700 text-zinc-300 text-xs">
										{sortDirection === "asc" ? "A-Z" : "Z-A"}
									</Badge>
								)}
							</Button>

							{/* Limpiar filtros */}
							{hasActiveFilters && (
								<Button
									variant="ghost"
									onClick={clearFilters}
									className="text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800"
								>
									<X className="w-4 h-4 mr-2"/>
									Limpiar
								</Button>
							)}
						</div>

						<div className="flex items-center gap-3">
							{/* Resultados */}
							{hasActiveFilters && (
								<span className="text-zinc-500 text-sm">
									{filteredAndSortedCards.length} de {cards.length} tarjetas
								</span>
							)}

							{/* View toggle */}
							<div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-2 rounded-md transition-all duration-200 ${
										viewMode === "grid"
											? "bg-zinc-700 text-zinc-100"
											: "text-zinc-500 hover:text-zinc-300"
									}`}
								>
									<LayoutGrid className="w-4 h-4"/>
								</button>
								<button
									onClick={() => setViewMode("table")}
									className={`p-2 rounded-md transition-all duration-200 ${
										viewMode === "table"
											? "bg-zinc-700 text-zinc-100"
											: "text-zinc-500 hover:text-zinc-300"
									}`}
								>
									<List className="w-4 h-4"/>
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* Grid View */}
				{viewMode === "grid" && (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
						{filteredAndSortedCards.map((card) => (
							<Card
								key={card.id}
								className="bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 transition-all duration-300 group overflow-hidden"
							>
								<CardContent className="p-4 text-center">
									{card.img ? (
										<img
											src={card.img}
											alt={card.text}
											className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover"
										/>
									) : (
										<div className="text-4xl mb-3">{card.emoji}</div>
									)}
									<h3 className="font-medium text-zinc-100 mb-1">{card.text}</h3>
									<Badge
										variant="outline"
										className="bg-zinc-800/50 text-zinc-400 border-zinc-700 text-xs"
									>
										{card.relation}
									</Badge>
									<p className="text-zinc-600 text-xs mt-2 font-mono">
										{card.value}
									</p>
								</CardContent>

								<CardFooter
									className="p-2 pt-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<Button
										variant="ghost"
										size="sm"
										onClick={() => openModal(card)}
										className="flex-1 h-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
									>
										<Pencil className="w-3 h-3"/>
									</Button>
									<Button
										variant="ghost"
										size="sm"
										onClick={() => handleDelete(card.id)}
										className="h-8 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
									>
										<Trash2 className="w-3 h-3"/>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}

				{/* Table View */}
				{viewMode === "table" && (
					<div className="rounded-lg border border-zinc-800 overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="border-zinc-800 hover:bg-transparent">
									<TableHead className="text-zinc-400 font-medium">Emoji</TableHead>
									<TableHead
										className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 transition-colors"
										onClick={() => handleSort("text")}
									>
										<div className="flex items-center gap-2">
											Texto
											{sortField === "text" && (
												sortDirection === "asc" ? (
													<ArrowDownAZ className="w-4 h-4"/>
												) : (
													<ArrowUpAZ className="w-4 h-4"/>
												)
											)}
										</div>
									</TableHead>
									<TableHead
										className="text-zinc-400 font-medium cursor-pointer hover:text-zinc-200 transition-colors"
										onClick={() => handleSort("value")}
									>
										<div className="flex items-center gap-2">
											Value
											{sortField === "value" && (
												sortDirection === "asc" ? (
													<ArrowDownAZ className="w-4 h-4"/>
												) : (
													<ArrowUpAZ className="w-4 h-4"/>
												)
											)}
										</div>
									</TableHead>
									<TableHead className="text-zinc-400 font-medium">Relación</TableHead>
									<TableHead className="text-zinc-400 font-medium">Imagen</TableHead>
									<TableHead className="text-zinc-400 font-medium text-right">
										Acciones
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredAndSortedCards.map((card) => (
									<TableRow
										key={card.id}
										className="border-zinc-800 hover:bg-zinc-900/50"
									>
										<TableCell className="text-2xl">{card.emoji}</TableCell>
										<TableCell className="font-medium text-zinc-100">
											{card.text}
										</TableCell>
										<TableCell>
											<code className="px-2 py-1 bg-zinc-800 rounded text-zinc-400 text-xs">
												{card.value}
											</code>
										</TableCell>
										<TableCell>
											<Badge
												variant="outline"
												className="bg-zinc-800/50 text-zinc-400 border-zinc-700"
											>
												{card.relation}
											</Badge>
										</TableCell>
										<TableCell>
											{card.img ? (
												<img
													src={card.img}
													alt=""
													className="w-8 h-8 rounded object-cover"
												/>
											) : (
												<span className="text-zinc-600 text-sm">—</span>
											)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-1">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => openModal(card)}
													className="h-8 w-8 p-0 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
												>
													<Pencil className="w-4 h-4"/>
												</Button>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDelete(card.id)}
													className="h-8 w-8 p-0 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
												>
													<Trash2 className="w-4 h-4"/>
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}

				{/* Empty state */}
				{filteredAndSortedCards.length === 0 && (
					<div className="flex flex-col items-center justify-center py-20 text-center">
						<div className="p-4 bg-zinc-900 rounded-full mb-4">
							<Package className="w-8 h-8 text-zinc-600"/>
						</div>
						{cards.length === 0 ? (
							<>
								<h3 className="text-lg font-medium text-zinc-400 mb-2">
									No hay tarjetas
								</h3>
								<p className="text-zinc-600 mb-6">Comienza creando tu primera tarjeta</p>
								<Button
									onClick={() => openModal()}
									variant="outline"
									className="border-zinc-700 hover:bg-zinc-800"
								>
									<Plus className="w-4 h-4 mr-2"/>
									Crear tarjeta
								</Button>
							</>
						) : (
							<>
								<h3 className="text-lg font-medium text-zinc-400 mb-2">
									Sin resultados
								</h3>
								<p className="text-zinc-600 mb-6">No hay tarjetas que coincidan con los filtros</p>
								<Button
									onClick={clearFilters}
									variant="outline"
									className="border-zinc-700 hover:bg-zinc-800"
								>
									<X className="w-4 h-4 mr-2"/>
									Limpiar filtros
								</Button>
							</>
						)}
					</div>
				)}

				{/* Modal */}
				<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
					<DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
						<DialogHeader>
							<DialogTitle className="text-xl font-semibold">
								{editingCard ? "Editar Tarjeta" : "Nueva Tarjeta"}
							</DialogTitle>
							<DialogDescription className="text-zinc-500">
								{editingCard
									? "Modifica los datos de la tarjeta"
									: "Completa los campos para crear una nueva tarjeta"}
							</DialogDescription>
						</DialogHeader>

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="text" className="text-zinc-300">
										Texto
									</Label>
									<Input
										id="text"
										value={formData.text}
										onChange={(e) =>
											setFormData({...formData, text: e.target.value})
										}
										placeholder="Ej: Drama"
										required
										className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="emoji" className="text-zinc-300">
										Emoji
									</Label>
									<Input
										id="emoji"
										value={formData.emoji}
										onChange={(e) =>
											setFormData({...formData, emoji: e.target.value})
										}
										placeholder="🎭"
										required
										className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 text-center text-xl"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="value" className="text-zinc-300">
										Value
									</Label>
									<Input
										id="value"
										value={formData.value}
										onChange={(e) =>
											setFormData({
												...formData,
												value: e.target.value.toLowerCase().replace(/\s+/g, "_"),
											})
										}
										placeholder="drama"
										required
										className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500 font-mono"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="relation" className="text-zinc-300">
										Relación
									</Label>
									<Select
										value={formData.relation}
										onValueChange={(value) =>
											setFormData({...formData, relation: value})
										}
									>
										<SelectTrigger
											className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:ring-zinc-500">
											<SelectValue/>
										</SelectTrigger>
										<SelectContent className="bg-zinc-800 border-zinc-700">
											{relationOptions.map((option) => (
												<SelectItem
													key={option}
													value={option}
													className="text-zinc-100 focus:bg-zinc-700 focus:text-zinc-100"
												>
													{option}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="img" className="text-zinc-300">
									URL de Imagen{" "}
									<span className="text-zinc-600 font-normal">(opcional)</span>
								</Label>
								<div className="flex gap-2">
									<Input
										id="img"
										value={formData.img || ""}
										onChange={(e) =>
											setFormData({
												...formData,
												img: e.target.value || null,
											})
										}
										placeholder="https://..."
										className="bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500"
									/>
									{formData.img && (
										<div
											className="w-10 h-10 rounded-lg overflow-hidden border border-zinc-700 flex-shrink-0">
											<img
												src={formData.img}
												alt="Preview"
												className="w-full h-full object-cover"
												onError={(e) => {
													(e.target as HTMLImageElement).style.display = "none";
												}}
											/>
										</div>
									)}
								</div>
							</div>

							{/* Preview */}
							<div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
								<p className="text-zinc-500 text-xs mb-2 uppercase tracking-wider">
									Vista previa
								</p>
								<div className="flex items-center gap-3">
									{formData.img ? (
										<img
											src={formData.img}
											alt=""
											className="w-10 h-10 rounded-lg object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).style.display = "none";
											}}
										/>
									) : (
										<span className="text-3xl">{formData.emoji || "❓"}</span>
									)}
									<div>
										<p className="font-medium text-zinc-100">
											{formData.text || "Sin título"}
										</p>
										<p className="text-xs text-zinc-500">
											{formData.relation} •{" "}
											<span className="font-mono">{formData.value || "value"}</span>
										</p>
									</div>
								</div>
							</div>

							<DialogFooter className="gap-2 sm:gap-2">
								<Button
									type="button"
									variant="ghost"
									onClick={closeModal}
									className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
								>
									Cancelar
								</Button>
								<Button
									type="submit"
									className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
								>
									{editingCard ? "Guardar cambios" : "Crear tarjeta"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}