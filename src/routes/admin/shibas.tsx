import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getShibas } from "@/features/admin/actions/shibas";
import { ShibaManagement } from "@/features/admin/screens/ShibaManagement";

const searchSchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export const Route = createFileRoute("/admin/shibas")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const result = await getShibas({ data: deps });
    return result;
  },
  component: ShibasPage,
});

function ShibasPage() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();

  return (
    <ShibaManagement
      shibas={data.shibas}
      pagination={data.pagination}
      search={search.search ?? ""}
      page={search.page}
      limit={search.limit}
    />
  );
}
