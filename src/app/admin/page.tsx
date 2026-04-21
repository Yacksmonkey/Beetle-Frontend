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
    { "text": "Movies", "emoji": "🎬", "value": "movie", "relation": "root", "img": "" },

    { "text": "Action", "emoji": "💥", "value": "action", "relation": "movie", "img": "" },
    { "text": "Comedy", "emoji": "😂", "value": "comedy", "relation": "movie", "img": "" },
    { "text": "Drama", "emoji": "🎭", "value": "drama", "relation": "movie", "img": "" },
    { "text": "Sci-Fi", "emoji": "🚀", "value": "scifi", "relation": "movie", "img": "" },
    { "text": "Horror", "emoji": "👻", "value": "horror", "relation": "movie", "img": "" },
    { "text": "Romance", "emoji": "💕", "value": "romance", "relation": "movie", "img": "" },

    { "text": "Military", "emoji": "🪖", "value": "military", "relation": "action", "img": "" },
    { "text": "Police", "emoji": "🚔", "value": "police", "relation": "action", "img": "" },
    { "text": "Superhero", "emoji": "🦸", "value": "superhero", "relation": "action", "img": "" },
    { "text": "Adventure", "emoji": "🗺️", "value": "adventure", "relation": "action", "img": "" },

    { "text": "Romantic", "emoji": "💘", "value": "romantic", "relation": "comedy", "img": "" },
    { "text": "Family", "emoji": "👨‍👩‍👧‍👦", "value": "family", "relation": "comedy", "img": "" },
    { "text": "Dark", "emoji": "🌑", "value": "dark", "relation": "comedy", "img": "" },
    { "text": "Parody", "emoji": "🎭", "value": "parody", "relation": "comedy", "img": "" },

    { "text": "Historical", "emoji": "🏛️", "value": "historical", "relation": "drama", "img": "" },
    { "text": "Biography", "emoji": "📖", "value": "biography", "relation": "drama", "img": "" },
    { "text": "Emotional", "emoji": "😢", "value": "emotional", "relation": "drama", "img": "" },
    { "text": "Social", "emoji": "🌍", "value": "social", "relation": "drama", "img": "" },

    { "text": "Space", "emoji": "🌌", "value": "space", "relation": "scifi", "img": "" },
    { "text": "Time Travel", "emoji": "⏳", "value": "time_travel", "relation": "scifi", "img": "" },
    { "text": "AI", "emoji": "🤖", "value": "ai", "relation": "scifi", "img": "" },
    { "text": "Dystopia", "emoji": "🏙️", "value": "dystopia", "relation": "scifi", "img": "" },

    { "text": "Supernatural", "emoji": "👻", "value": "supernatural", "relation": "horror", "img": "" },
    { "text": "Slasher", "emoji": "🔪", "value": "slasher", "relation": "horror", "img": "" },
    { "text": "Psychological", "emoji": "🧠", "value": "psychological", "relation": "horror", "img": "" },
    { "text": "Monster", "emoji": "👹", "value": "monster", "relation": "horror", "img": "" },

    { "text": "Classic", "emoji": "🎞️", "value": "classic_romance", "relation": "romance", "img": "" },
    { "text": "Teen", "emoji": "🧑‍🤝‍🧑", "value": "teen", "relation": "romance", "img": "" },
    { "text": "Drama", "emoji": "🎭", "value": "romance_drama", "relation": "romance", "img": "" },
    { "text": "Comedy", "emoji": "😂", "value": "romance_comedy", "relation": "romance", "img": "" },

    { "text": "Fast", "emoji": "⚡", "value": "fast", "relation": "military", "img": "" },
    { "text": "Intense", "emoji": "🔥", "value": "intense", "relation": "military", "img": "" },

    { "text": "Light", "emoji": "☀️", "value": "light", "relation": "romantic", "img": "" },
    { "text": "Absurd", "emoji": "🤪", "value": "absurd", "relation": "parody", "img": "" },

    { "text": "Slow", "emoji": "🐢", "value": "slow", "relation": "emotional", "img": "" },
    { "text": "Realistic", "emoji": "🎥", "value": "realistic", "relation": "social", "img": "" },

    { "text": "Deep", "emoji": "🧠", "value": "deep", "relation": "time_travel", "img": "" },
    { "text": "Visual", "emoji": "🎨", "value": "visual", "relation": "space", "img": "" },

    { "text": "Dark", "emoji": "🌑", "value": "dark_horror", "relation": "psychological", "img": "" },
    { "text": "Tension", "emoji": "😨", "value": "tension", "relation": "slasher", "img": "" },

    { "text": "Sad", "emoji": "💔", "value": "sad", "relation": "romance_drama", "img": "" },
    { "text": "Happy", "emoji": "😊", "value": "happy", "relation": "romance_comedy", "img": "" },

    { "text": "Classic", "emoji": "🎞️", "value": "classic", "relation": "fast", "img": "" },
    { "text": "Modern", "emoji": "🆕", "value": "modern", "relation": "fast", "img": "" },

    { "text": "Popular", "emoji": "🔥", "value": "popular", "relation": "light", "img": "" },
    { "text": "Cult", "emoji": "🎬", "value": "cult", "relation": "absurd", "img": "" },

    { "text": "Oscar", "emoji": "🏆", "value": "oscar", "relation": "slow", "img": "" },
    { "text": "True Story", "emoji": "📜", "value": "true_story", "relation": "realistic", "img": "" },

    { "text": "Nolan Style", "emoji": "🧠", "value": "nolan", "relation": "deep", "img": "" },
    { "text": "Blockbuster", "emoji": "💥", "value": "blockbuster", "relation": "visual", "img": "" },

    { "text": "Extreme", "emoji": "☠️", "value": "extreme", "relation": "dark_horror", "img": "" },
    { "text": "Classic Horror", "emoji": "👻", "value": "classic_horror", "relation": "tension", "img": "" },

    { "text": "Classic Love", "emoji": "💞", "value": "classic_love", "relation": "sad", "img": "" },
    { "text": "Modern Love", "emoji": "❤️", "value": "modern_love", "relation": "happy", "img": "" },

    // SERIES,

    { "text": "Series", "emoji": "📺", "value": "series", "relation": "root", "img": "" },

    { "text": "Drama", "emoji": "🎭", "value": "series_drama", "relation": "series", "img": "" },
    { "text": "Comedy", "emoji": "😂", "value": "series_comedy", "relation": "series", "img": "" },
    { "text": "Crime", "emoji": "🕵️", "value": "series_crime", "relation": "series", "img": "" },
    { "text": "Sci-Fi", "emoji": "🚀", "value": "series_scifi", "relation": "series", "img": "" },
    { "text": "Fantasy", "emoji": "🧙", "value": "series_fantasy", "relation": "series", "img": "" },
    { "text": "Documentary", "emoji": "🎥", "value": "series_documentary", "relation": "series", "img": "" },

    { "text": "Historical", "emoji": "🏛️", "value": "series_historical", "relation": "series_drama", "img": "" },
    { "text": "Psychological", "emoji": "🧠", "value": "series_psychological", "relation": "series_drama", "img": "" },
    { "text": "Family", "emoji": "👨‍👩‍👧‍👦", "value": "series_family", "relation": "series_drama", "img": "" },
    { "text": "Political", "emoji": "🏛️", "value": "series_political", "relation": "series_drama", "img": "" },

    { "text": "Sitcom", "emoji": "🏠", "value": "series_sitcom", "relation": "series_comedy", "img": "" },
    { "text": "Workplace", "emoji": "💼", "value": "series_workplace", "relation": "series_comedy", "img": "" },
    { "text": "Romantic", "emoji": "💕", "value": "series_romantic", "relation": "series_comedy", "img": "" },
    { "text": "Dark", "emoji": "🌑", "value": "series_dark_comedy", "relation": "series_comedy", "img": "" },

    { "text": "Detective", "emoji": "🔍", "value": "series_detective", "relation": "series_crime", "img": "" },
    { "text": "Mafia", "emoji": "💼", "value": "series_mafia", "relation": "series_crime", "img": "" },
    { "text": "Thriller", "emoji": "⚠️", "value": "series_thriller", "relation": "series_crime", "img": "" },
    { "text": "True Crime", "emoji": "📂", "value": "series_true_crime", "relation": "series_crime", "img": "" },

    { "text": "Space", "emoji": "🌌", "value": "series_space", "relation": "series_scifi", "img": "" },
    { "text": "Time Travel", "emoji": "⏳", "value": "series_time_travel", "relation": "series_scifi", "img": "" },
    { "text": "AI", "emoji": "🤖", "value": "series_ai", "relation": "series_scifi", "img": "" },
    { "text": "Dystopia", "emoji": "🏙️", "value": "series_dystopia", "relation": "series_scifi", "img": "" },

    { "text": "Epic", "emoji": "⚔️", "value": "series_epic", "relation": "series_fantasy", "img": "" },
    { "text": "Magic", "emoji": "✨", "value": "series_magic", "relation": "series_fantasy", "img": "" },
    { "text": "Dark", "emoji": "🌑", "value": "series_dark_fantasy", "relation": "series_fantasy", "img": "" },
    { "text": "Adventure", "emoji": "🗺️", "value": "series_adventure", "relation": "series_fantasy", "img": "" },

    { "text": "Nature", "emoji": "🌍", "value": "series_nature", "relation": "series_documentary", "img": "" },
    { "text": "History", "emoji": "📜", "value": "series_history", "relation": "series_documentary", "img": "" },
    { "text": "Science", "emoji": "🔬", "value": "series_science", "relation": "series_documentary", "img": "" },
    { "text": "Crime", "emoji": "🚨", "value": "series_doc_crime", "relation": "series_documentary", "img": "" },

    { "text": "Slow", "emoji": "🐢", "value": "series_slow", "relation": "series_historical", "img": "" },
    { "text": "Intense", "emoji": "🔥", "value": "series_intense", "relation": "series_psychological", "img": "" },
    { "text": "Warm", "emoji": "☀️", "value": "series_warm", "relation": "series_family", "img": "" },
    { "text": "Smart", "emoji": "🧩", "value": "series_smart", "relation": "series_political", "img": "" },

    { "text": "Easy", "emoji": "😊", "value": "series_easy", "relation": "series_sitcom", "img": "" },
    { "text": "Popular", "emoji": "🔥", "value": "series_popular", "relation": "series_workplace", "img": "" },
    { "text": "Sweet", "emoji": "💗", "value": "series_sweet", "relation": "series_romantic", "img": "" },
    { "text": "Absurd", "emoji": "🤪", "value": "series_absurd", "relation": "series_dark_comedy", "img": "" },

    { "text": "Classic", "emoji": "🕰️", "value": "series_classic", "relation": "series_detective", "img": "" },
    { "text": "Violent", "emoji": "💣", "value": "series_violent", "relation": "series_mafia", "img": "" },
    { "text": "Dark", "emoji": "🌑", "value": "series_dark", "relation": "series_thriller", "img": "" },
    { "text": "Real", "emoji": "📌", "value": "series_real", "relation": "series_true_crime", "img": "" },

    { "text": "Deep", "emoji": "🧠", "value": "series_deep", "relation": "series_space", "img": "" },
    { "text": "Complex", "emoji": "🧩", "value": "series_complex", "relation": "series_time_travel", "img": "" },
    { "text": "Cold", "emoji": "🧊", "value": "series_cold", "relation": "series_ai", "img": "" },
    { "text": "Oppressive", "emoji": "🏢", "value": "series_oppressive", "relation": "series_dystopia", "img": "" },

    { "text": "Long", "emoji": "📚", "value": "series_long", "relation": "series_epic", "img": "" },
    { "text": "Mystical", "emoji": "🔮", "value": "series_mystical", "relation": "series_magic", "img": "" },
    { "text": "Violence", "emoji": "🩸", "value": "series_fantasy_violence", "relation": "series_dark_fantasy", "img": "" },
    { "text": "Fun", "emoji": "🎉", "value": "series_fun", "relation": "series_adventure", "img": "" },

    { "text": "Relaxing", "emoji": "🍃", "value": "series_relaxing", "relation": "series_nature", "img": "" },
    { "text": "Educational", "emoji": "📘", "value": "series_educational", "relation": "series_history", "img": "" },
    { "text": "Mindblowing", "emoji": "🤯", "value": "series_mindblowing", "relation": "series_science", "img": "" },
    { "text": "Investigative", "emoji": "🗂️", "value": "series_investigative", "relation": "series_doc_crime", "img": "" },

    { "text": "Awarded", "emoji": "🏆", "value": "series_awarded", "relation": "series_slow", "img": "" },
    { "text": "Prestige", "emoji": "👑", "value": "series_prestige", "relation": "series_intense", "img": "" },
    { "text": "Comfort", "emoji": "🫶", "value": "series_comfort", "relation": "series_warm", "img": "" },
    { "text": "Politics", "emoji": "🎩", "value": "series_politics", "relation": "series_smart", "img": "" },

    { "text": "Classic Sitcom", "emoji": "📺", "value": "series_classic_sitcom", "relation": "series_easy", "img": "" },
    { "text": "Office Hit", "emoji": "🏢", "value": "series_office_hit", "relation": "series_popular", "img": "" },
    { "text": "Modern Love", "emoji": "❤️", "value": "series_modern_love", "relation": "series_sweet", "img": "" },
    { "text": "Cult Comedy", "emoji": "🎭", "value": "series_cult_comedy", "relation": "series_absurd", "img": "" },

    { "text": "British Style", "emoji": "🇬🇧", "value": "series_british", "relation": "series_classic", "img": "" },
    { "text": "Antihero", "emoji": "🕶️", "value": "series_antihero", "relation": "series_violent", "img": "" },
    { "text": "Noir", "emoji": "🌃", "value": "series_noir", "relation": "series_dark", "img": "" },
    { "text": "Shocking", "emoji": "⚡", "value": "series_shocking", "relation": "series_real", "img": "" },

    { "text": "Space Epic", "emoji": "🪐", "value": "series_space_epic", "relation": "series_deep", "img": "" },
    { "text": "Mind-Bending", "emoji": "🌀", "value": "series_mind_bending", "relation": "series_complex", "img": "" },
    { "text": "Human vs Machine", "emoji": "⚙️", "value": "series_human_machine", "relation": "series_cold", "img": "" },
    { "text": "Rebellion", "emoji": "✊", "value": "series_rebellion", "relation": "series_oppressive", "img": "" },

    { "text": "Legendary", "emoji": "🐉", "value": "series_legendary", "relation": "series_long", "img": "" },
    { "text": "Ancient Magic", "emoji": "📜", "value": "series_ancient_magic", "relation": "series_mystical", "img": "" },
    { "text": "Brutal", "emoji": "⚔️", "value": "series_brutal", "relation": "series_fantasy_violence", "img": "" },
    { "text": "Hero Journey", "emoji": "🧭", "value": "series_hero_journey", "relation": "series_fun", "img": "" },

    { "text": "BBC Style", "emoji": "🎙️", "value": "series_bbc", "relation": "series_relaxing", "img": "" },
    { "text": "World History", "emoji": "🌐", "value": "series_world_history", "relation": "series_educational", "img": "" },
    { "text": "Big Ideas", "emoji": "💡", "value": "series_big_ideas", "relation": "series_mindblowing", "img": "" },
    { "text": "Case Files", "emoji": "📁", "value": "series_case_files", "relation": "series_investigative", "img": "" },

    //BOOKs,

    { "text": "Books", "emoji": "📚", "value": "book", "relation": "root", "img": "" },

    { "text": "Fantasy", "emoji": "🧙‍♂️", "value": "fantasy", "relation": "book", "img": "" },
    { "text": "Sci-Fi", "emoji": "🚀", "value": "book_scifi", "relation": "book", "img": "" },
    { "text": "Romance", "emoji": "💕", "value": "book_romance", "relation": "book", "img": "" },
    { "text": "Mystery", "emoji": "🔍", "value": "book_mystery", "relation": "book", "img": "" },
    { "text": "Horror", "emoji": "👻", "value": "book_horror", "relation": "book", "img": "" },

    { "text": "Short (<300 pages)", "emoji": "📖", "value": "fantasy_short", "relation": "fantasy", "img": "" },
    { "text": "Medium (300-500)", "emoji": "📘", "value": "fantasy_medium", "relation": "fantasy", "img": "" },
    { "text": "Epic (500+)", "emoji": "📜", "value": "fantasy_epic", "relation": "fantasy", "img": "" },

    { "text": "Tolkien Style", "emoji": "🧙", "value": "tolkien", "relation": "fantasy_epic", "img": "" },
    { "text": "Dark Fantasy", "emoji": "🌑", "value": "dark_fantasy", "relation": "fantasy_epic", "img": "" },
    { "text": "Magic World", "emoji": "✨", "value": "magic_world", "relation": "fantasy_medium", "img": "" },

    { "text": "Space", "emoji": "🌌", "value": "space", "relation": "book_scifi", "img": "" },
    { "text": "AI / Robots", "emoji": "🤖", "value": "ai", "relation": "book_scifi", "img": "" },
    { "text": "Time Travel", "emoji": "⏳", "value": "time_travel", "relation": "book_scifi", "img": "" },

    //MUSIC,

    { "text": "Music", "emoji": "🎵", "value": "music", "relation": "root", "img": "" },

    { "text": "Pop", "emoji": "🎤", "value": "pop", "relation": "music", "img": "" },
    { "text": "Rock", "emoji": "🎸", "value": "rock", "relation": "music", "img": "" },
    { "text": "Hip-Hop", "emoji": "🎧", "value": "hiphop", "relation": "music", "img": "" },
    { "text": "Electronic", "emoji": "🎹", "value": "electronic", "relation": "music", "img": "" },
    { "text": "Chill", "emoji": "🌙", "value": "chill", "relation": "music", "img": "" },

    { "text": "Happy Mood", "emoji": "😄", "value": "pop_happy", "relation": "pop", "img": "" },
    { "text": "Love Songs", "emoji": "❤️", "value": "pop_love", "relation": "pop", "img": "" },
    { "text": "Dance Hits", "emoji": "🕺", "value": "pop_dance", "relation": "pop", "img": "" },

    { "text": "Classic Rock", "emoji": "🔥", "value": "rock_classic", "relation": "rock", "img": "" },
    { "text": "Alternative", "emoji": "🌿", "value": "rock_alt", "relation": "rock", "img": "" },
    { "text": "Heavy", "emoji": "⚡", "value": "rock_heavy", "relation": "rock", "img": "" },

    { "text": "Trap", "emoji": "💰", "value": "trap", "relation": "hiphop", "img": "" },
    { "text": "Old School", "emoji": "📼", "value": "old_school", "relation": "hiphop", "img": "" },
    { "text": "Freestyle", "emoji": "🎙️", "value": "freestyle", "relation": "hiphop", "img": "" },

    { "text": "House", "emoji": "🏠", "value": "house", "relation": "electronic", "img": "" },
    { "text": "Techno", "emoji": "🔊", "value": "techno", "relation": "electronic", "img": "" },
    { "text": "Ambient", "emoji": "🌫️", "value": "ambient", "relation": "electronic", "img": "" },

    { "text": "Lo-fi", "emoji": "☕", "value": "lofi", "relation": "chill", "img": "" },
    { "text": "Sleep", "emoji": "😴", "value": "sleep", "relation": "chill", "img": "" },
    { "text": "Focus", "emoji": "🧠", "value": "focus", "relation": "chill", "img": "" },

];


const relationOptions = ["Series", "Movies",  "Music", "Books"];

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