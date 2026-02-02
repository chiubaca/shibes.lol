import { createFileRoute } from "@tanstack/react-router";
import { Markdown } from "@/components/Markdown";
import privacyContent from "../../content/privacy.md?raw";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | shibes.lol" },
      { name: "description", content: "Privacy policy for shibes.lol - learn how we protect your data" },
      { property: "og:title", content: "Privacy Policy | shibes.lol" },
      { property: "og:description", content: "Privacy policy for shibes.lol" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://shibes.lol/privacy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Privacy Policy | shibes.lol" },
      { name: "twitter:description", content: "Privacy policy for shibes.lol" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <article className="prose prose-stone prose-lg">
        <Markdown content={privacyContent} />
      </article>
    </div>
  );
}
