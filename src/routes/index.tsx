import { createFileRoute } from "@tanstack/react-router";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";

function IndexRoute() {
  // Get user from route context (will be added later)
  const user = null;

  return (
    <>
      <Navigation user={user} />
      <div className="relative hero min-h-screen bg-base-200 pt-16">
        <div className="bg-img"></div>
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-semibold">submit your shibas</h1>
            <span className="flex justify-center items-center">
              <span>🙏</span>
              <p className="pt-6">
                <a
                  className="link"
                  href="https://twitter.com/ShibaEveryHour"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @ShibaEveryHour
                </a>{" "}
                needs your help to build a new archive of shibas!
                <a
                  className="link hover:link-hover"
                  href="https://twitter.com/chiubaca/status/1795816063835541854"
                >
                  More info here
                </a>
                ...
              </p>
              <span>🙏</span>
            </span>
            <p className="pt-2">
              This collection will be used to keep ShibaEveryHour running!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export const Route = createFileRoute("/")({
  component: IndexRoute,
});