import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "@/components/Markdown";
import termsContent from "../../content/terms.md?raw";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | shibes.lol" },
      { name: "description", content: "Terms of service for shibes.lol - understand our usage policies" },
      { property: "og:title", content: "Terms of Service | shibes.lol" },
      { property: "og:description", content: "Terms of service for shibes.lol" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shibes.lol/terms" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Terms of Service | shibes.lol" },
      { name: "twitter:description", content: "Terms of service for shibes.lol" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="prose prose-stone prose-lg">
        <Markdown content={termsContent} />
      </article>
    </div>
  );
}
