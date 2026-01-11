import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import {
	shibaSubmissionV2,
	userTable,
} from "@/infrastructure/database/drizzle/schema";
import { makeImageUrl } from "@/lib/image";

const getAllShibas = createServerFn({ method: "GET" }).handler(async () => {
	const db = getDb();
	const shibas = await db
		.select({
			id: shibaSubmissionV2.id,
			imageRef: shibaSubmissionV2.imageRef,
			createdAt: shibaSubmissionV2.createdAt,
			userName: userTable.userName,
			avatarUrl: userTable.avatarUrl,
		})
		.from(shibaSubmissionV2)
		.leftJoin(userTable, eq(shibaSubmissionV2.userId, userTable.id))
		.orderBy(desc(shibaSubmissionV2.createdAt))
		.limit(100);

	return shibas;
});

export const Route = createFileRoute("/shibe/$imgRef")({
	loader: () => getAllShibas(),
	component: ShibaPage,
});

function ShibaPage() {
	const allShibas = Route.useLoaderData();
	const { imgRef } = Route.useParams();

	// Find the specific shiba by imgRef
	const shiba = allShibas.find((s) => s.imageRef === imgRef);

	if (!shiba) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-white mb-4">
						Shiba not found
					</h1>
					<a
						href="/"
						className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
					>
						Back to Gallery
					</a>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-12">
			<div className="max-w-4xl mx-auto px-4">
				<div className="bg-white transform rotate-1 hover:rotate-0 transition-transform duration-300 shadow-2xl">
					<div className="p-4">
						<img
							src={makeImageUrl(shiba.imageRef)}
							alt={`Shiba submission by ${shiba.userName}`}
							className="w-full h-auto"
						/>
					</div>
					<div className="bg-white px-8 pb-8 pt-4">
						<div className="flex items-center gap-4 mb-6">
							{shiba.avatarUrl && (
								<img
									src={shiba.avatarUrl}
									alt={shiba.userName || "User"}
									className="w-16 h-16 rounded-full border-3 border-gray-300"
								/>
							)}
							<div>
								<p className="text-gray-800 font-bold text-xl">
									{shiba.userName}
								</p>
								<p className="text-gray-500 text-sm">
									{new Date(shiba.createdAt).toLocaleDateString("en-US", {
										weekday: "long",
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-6 text-gray-600 border-t pt-4">
							<button
								type="button"
								className="flex items-center gap-2 hover:text-red-500 transition-colors"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Like</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									/>
								</svg>
								<span className="text-sm font-medium">Like</span>
							</button>
							<button
								type="button"
								className="flex items-center gap-2 hover:text-blue-500 transition-colors"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Comment</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
									/>
								</svg>
								<span className="text-sm font-medium">Comment</span>
							</button>
							<button
								type="button"
								className="flex items-center gap-2 hover:text-green-500 transition-colors"
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>Share</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326"
									/>
								</svg>
								<span className="text-sm font-medium">Share</span>
							</button>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center">
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Back to Gallery</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M10 19l-7-7m0 0l7-7m-7 7h18"
							/>
						</svg>
						Back to Gallery
					</Link>
				</div>
			</div>
		</div>
	);
}
