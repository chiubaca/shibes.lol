import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/infrastructure/database/database";
import {
	shibaSubmissionV2,
	userTable,
} from "@/infrastructure/database/drizzle/schema";
import { signIn, signOut, useSession } from "@/lib/auth-client";
import { makeImageUrl } from "@/lib/image";

const getLatestShibas = createServerFn({ method: "GET" }).handler(async () => {
	const db = getDb();
	const latestShibas = await db
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
		.limit(50);

	return latestShibas;
});

export const Route = createFileRoute("/")({
	loader: () => getLatestShibas(),
	component: App,
});

function App() {
	const shibas = Route.useLoaderData();
	const { data: session, isPending } = useSession();

	const handleSignInWithGoogle = () => {
		signIn.social({
			provider: "google",
			callbackURL: "/",
		});
	};

	const handleSignInWithTwitter = () => {
		signIn.social({
			provider: "twitter",
			callbackURL: "/",
		});
	};

	const handleSignOut = () => {
		signOut();
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
			<div className="container mx-auto px-4 py-8">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold text-white">Latest Shibas</h1>
					<div>
						{isPending ? (
							<span className="text-gray-400">Loading...</span>
						) : session ? (
							<div className="flex items-center gap-4">
								<Link
									to="/my-shibas"
									className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
								>
									My Shibas
								</Link>
								<div className="flex items-center gap-2">
									{session.user.image && (
										<img
											src={session.user.image}
											alt={session.user.name || "User"}
											className="w-8 h-8 rounded-full"
										/>
									)}
									<span className="text-white">{session.user.name}</span>
								</div>
								<button
									type="button"
									onClick={handleSignOut}
									className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
								>
									Sign Out
								</button>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<button
									type="button"
									onClick={handleSignInWithGoogle}
									className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 font-medium rounded-lg transition-colors"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="#34A853"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="#FBBC05"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="#EA4335"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Sign in with Google
								</button>
								<button
									type="button"
									onClick={handleSignInWithTwitter}
									className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white font-medium rounded-lg transition-colors"
								>
									<svg
										className="w-5 h-5"
										viewBox="0 0 24 24"
										aria-hidden="true"
										fill="currentColor"
									>
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
									Sign in with X
								</button>
							</div>
						)}
					</div>
				</div>
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
