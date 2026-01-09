import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import {
	shibaSubmission,
	user,
} from "@/infrastructure/database/drizzle/out/schema";
import { makeImageUrl } from "@/lib/image";

const getLatestShibas = createServerFn({ method: "GET" }).handler(async () => {
	const db = getDb();
	const latestShibas = await db
		.select({
			id: shibaSubmission.id,
			imageRef: shibaSubmission.imageRef,
			createdAt: shibaSubmission.createdAt,
			userName: user.userName,
			avatarUrl: user.avatarUrl,
		})
		.from(shibaSubmission)
		.leftJoin(user, eq(shibaSubmission.userId, user.id))
		.orderBy(desc(shibaSubmission.createdAt))
		.limit(50);

	return latestShibas;
});

export const Route = createFileRoute("/")({
	loader: () => getLatestShibas(),
	component: App,
});

function App() {
	const shibas = Route.useLoaderData();

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-4xl font-bold text-white mb-8">Latest Shibas</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{shibas.map((shiba) => (
						<div
							key={shiba.id}
							className="bg-slate-800 rounded-lg overflow-hidden shadow-lg"
						>
							<img
								src={makeImageUrl(shiba.imageRef)}
								alt={`Shiba submission ${shiba.id}`}
								className="w-full h-48 object-cover"
							/>
							<div className="p-4">
								<div className="flex items-center gap-2 mb-2">
									{shiba.avatarUrl && (
										<img
											src={shiba.avatarUrl}
											alt={shiba.userName || "User"}
											className="w-6 h-6 rounded-full"
										/>
									)}
									<span className="text-white text-sm">{shiba.userName}</span>
								</div>
								<p className="text-gray-400 text-xs">
									{new Date(shiba.createdAt).toLocaleDateString()}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
