import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-col min-h-[100dvh]">
			<header className="px-4 lg:px-6 h- flex items-center">
				<Link href="#" className="flex items-center justify-center" prefetch={false}>
					<Image
						src="/skylogo.jpg"
						alt="NoteFusion Inc"
						className="ml-2 h-24 w-24"
						width={512}
						height={512}
					/>
					<span className="sr-only">NoteFusion Inc</span>
				</Link>
				<nav className="ml-auto flex gap-4 sm:gap-6">
					<Link
						href="#"
						className="text-sm font-medium hover:underline underline-offset-4"
						prefetch={false}
					>
						Features
					</Link>
					<Link
						href="#"
						className="text-sm font-medium hover:underline underline-offset-4"
						prefetch={false}
					>
						Pricing
					</Link>
					<Link
						href="#"
						className="text-sm font-medium hover:underline underline-offset-4"
						prefetch={false}
					>
						About
					</Link>
					<Link
						href="#"
						className="text-sm font-medium hover:underline underline-offset-4"
						prefetch={false}
					>
						Contact
					</Link>
				</nav>
			</header>
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
						<div className="space-y-4">
							<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
								Elevate Your Productivity
							</h1>
							<p className="max-w-[600px] text-muted-foreground md:text-xl">
								Unlock the power of our note-taking application that takes your
								thinking to the next level!
							</p>
							<div className="flex gap-2">
								<Link
									href="/home"
									className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
									prefetch={false}
								>
									Get Started
								</Link>
								<Link
									href="#"
									className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
									prefetch={false}
								>
									Learn More
								</Link>
							</div>
						</div>
						<Image
							src="/rabgif.gif"
							width="550"
							height="550"
							alt="Hero"
							className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
						/>
					</div>
				</section>
				<section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
					<div className="container px-4 md:px-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
						<Image
							src="/simplenote.webp"
							width="550"
							height="400"
							alt="Feature"
							className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full"
						/>
						<div className="space-y-4">
							<div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
								Note Features
							</div>
							<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
								Have Better Ideas
							</h2>
							<p className="max-w-[600px] text-muted-foreground md:text-xl">
								Our platform offers a comprehensive suite of tools and features to
								help you take notes and generates AI suggestion to form better
								thoughts.
							</p>
							<div className="grid gap-6">
								<div className="grid gap-1">
									<h3 className="text-xl font-bold">Seamless Experience</h3>
									<p className="text-muted-foreground">
										Available to use in multiple cases such as automatic/
										manuel, auditory, and predictive note-taking.
									</p>
								</div>
								<div className="grid gap-1">
									<h3 className="text-xl font-bold">Scalable Infrastructure</h3>
									<p className="text-muted-foreground">
										Scale your thoughts and note experience effortlessly.
									</p>
								</div>
								<div className="grid gap-1">
									<h3 className="text-xl font-bold">Cutting-Edge Analytics</h3>
									<p className="text-muted-foreground">
										Gain deep understanding in subjects and help form ideas that
										before was hard to come out with.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
			<footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
				<p className="text-xs text-muted-foreground">
					&copy; 2024 NoteFusion Inc. All rights reserved.
				</p>
				<nav className="sm:ml-auto flex gap-4 sm:gap-6">
					<Link
						href="#"
						className="text-xs hover:underline underline-offset-4"
						prefetch={false}
					>
						Terms of Service
					</Link>
					<Link
						href="#"
						className="text-xs hover:underline underline-offset-4"
						prefetch={false}
					>
						Privacy
					</Link>
				</nav>
			</footer>
		</div>
	);
}
