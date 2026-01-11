import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import {
	shibaSubmissionV2,
	userTable,
} from "@/infrastructure/database/drizzle/schema";
import { ShibaCard } from "@/components/ShibaCard";

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
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12">
			<div className="max-w-4xl mx-auto px-4">
				<ShibaCard shiba={shiba} variant="single" />

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
