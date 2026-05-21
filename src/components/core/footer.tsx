import React from "react";
import {Facebook, Instagram, Linkedin, Twitter} from "lucide-react";

const sections = [
	{
		title: "Product",
		links: [
			{name: "Overview", href: "#"},
			{name: "Pricing", href: "#"},
			{name: "Marketplace", href: "#"},
			{name: "Features", href: "#"},
		],
	},
	{
		title: "Company",
		links: [
			{name: "About", href: "#"},
			{name: "Team", href: "#"},
			{name: "Blog", href: "#"},
			{name: "Careers", href: "#"},
		],
	},
	{
		title: "Resources",
		links: [
			{name: "Help", href: "#"},
			{name: "Sales", href: "#"},
			{name: "Advertise", href: "#"},
			{name: "Privacy", href: "#"},
		],
	},
];

const socialLinks = [
	{icon: <Instagram className="size-5"/>, href: "#", label: "Instagram"},
	{icon: <Facebook className="size-5"/>, href: "#", label: "Facebook"},
	{icon: <Twitter className="size-5"/>, href: "#", label: "Twitter"},
	{icon: <Linkedin className="size-5"/>, href: "#", label: "LinkedIn"},
];

const legalLinks = [
	{name: "Terms and Conditions", href: "#"},
	{name: "Privacy Policy", href: "#"},
];

const logo = {
	url: "https://www.shadcnblocks.com",
	src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
	alt: "logo",
	title: "Bettle.com",
};


export default function Footer() {
	return (
		<section
			className="flex justify-center w-full py-24 bg-background/80 backdrop-blur-md border-t border-border/80 text-center">
			<div className="container w-full">
				<div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:text-center">
					<div className="flex w-full flex-col items-center justify-between gap-6">
						{/* Logo */}
						<div className="flex items-center justify-center gap-2">
							<a href={logo.url}>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={logo.src}
									alt={logo.alt}
									title={logo.title}
									className="h-8"
								/>
							</a>
							<h2 className="text-xl font-semibold text-primary">{logo.title}</h2>
						</div>
						<p className="text-muted-foreground max-w-[70%] text-sm mx-auto">
							A collection of components for your startup business or side project.
						</p>
						<ul className="text-muted-foreground flex items-center justify-center space-x-6">
							{socialLinks.map((social, idx) => (
								<li key={idx} className="hover:text-primary font-medium">
									<a href={social.href} aria-label={social.label}>
										{social.icon}
									</a>
								</li>
							))}
						</ul>
					</div>
					<div className="grid w-full gap-6 md:grid-cols-3 lg:gap-20">
						{sections.map((section, sectionIdx) => (
							<div key={sectionIdx} className="flex flex-col items-center">
								<h3 className="mb-4 font-bold">{section.title}</h3>
								<ul className="text-muted-foreground space-y-3 text-sm">
									{section.links.map((link, linkIdx) => (
										<li
											key={linkIdx}
											className="hover:text-primary font-medium"
										>
											<a href={link.href}>{link.name}</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div
					className="text-muted-foreground mt-8 flex flex-col items-center justify-center gap-4 border-t py-8 text-xs font-medium md:flex-row md:justify-between md:text-center">
					<p className="order-2 md:order-1">© 2024 Shadcnblocks.com. All rights reserved.</p>
					<ul className="order-1 flex flex-col items-center justify-center gap-2 md:order-2 md:flex-row">
						{legalLinks.map((link, idx) => (
							<li key={idx} className="hover:text-primary">
								<a href={link.href}> {link.name}</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}