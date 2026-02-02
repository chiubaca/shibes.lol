import { createFileRoute } from "@tanstack/react-router";
import { FavoritesScreen } from "@/features/favorites/screens/FavoritesScreen";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "favorites | shibes.lol" },
      { name: "description", content: "your favorite shiba inu images collection" },
      { property: "og:title", content: "favorites | shibes.lol" },
      { property: "og:description", content: "your favorite shiba inu images collection" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "shibes.lol" },
      { property: "og:url", content: "https://shibes.lol/favorites" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "favorites | shibes.lol" },
      { name: "twitter:description", content: "your favorite shiba inu images collection" },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  return <FavoritesScreen />;
}
