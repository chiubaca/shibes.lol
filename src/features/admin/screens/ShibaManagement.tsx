import { useState } from "react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { makeImageUrl } from "@/lib/image";
import { Image } from "@unpic/react";
import { banUser } from "@/features/admin/actions/ban-user";
import { unbanUser } from "@/features/admin/actions/unban-user";

interface ShibaAuthor {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "user" | "admin" | "banned";
  banned: boolean | null;
}

interface Shiba {
  id: number;
  imageRef: string;
  userId: string;
  createdAt: string;
  author: ShibaAuthor | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ShibaManagementProps {
  shibas: Shiba[];
  pagination: Pagination;
  search: string;
  page: number;
  limit: number;
}

export const ShibaManagement = ({
  shibas,
  pagination,
  search,
  page,
  limit,
}: ShibaManagementProps) => {
  const navigate = useNavigate();
  const router = useRouter();

  const banUserMutation = useMutation({
    mutationFn: (data: { userId: string; reason?: string }) => banUser({ data }),
    onSuccess: () => {
      router.invalidate();
      setSelectedUserToBan(null);
      setBanReason("");
    },
  });

  const unbanUserMutation = useMutation({
    mutationFn: (userId: string) => unbanUser({ data: { userId } }),
    onSuccess: () => {
      router.invalidate();
    },
  });

  const [selectedShiba, setSelectedShiba] = useState<string | null>(null);
  const [selectedUserToBan, setSelectedUserToBan] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [localSearch, setLocalSearch] = useState(search);
  const [banReason, setBanReason] = useState("");

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        search: value || undefined,
        page: 1,
      }),
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  };

  const handleLimitChange = (newLimit: number) => {
    navigate({
      to: ".",
      search: (prev) => ({
        ...prev,
        limit: newLimit,
        page: 1,
      }),
    });
  };

  const handleDeleteShiba = (shibaId: string) => {
    console.log("Delete shiba:", shibaId);
    setSelectedShiba(null);
  };

  const handleBanUser = (userId: string, userName: string) => {
    setSelectedUserToBan({ id: userId, name: userName });
  };

  const handleUnbanUser = (userId: string) => {
    unbanUserMutation.mutate(userId);
  };

  const confirmBanUser = () => {
    if (!selectedUserToBan) return;
    banUserMutation.mutate({
      userId: selectedUserToBan.id,
      reason: banReason || "Banned by administrator",
    });
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Shiba Management</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by author or image ID..."
            className="input input-bordered w-full max-w-xs"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <select
            className="select select-bordered"
            value={limit}
            onChange={(e) => handleLimitChange(Number(e.target.value))}
          >
            <option value={24}>24 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm opacity-70">
        Showing {shibas.length} of {pagination.total} shibas
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shibas.map((shiba) => (
          <div key={shiba.id} className="card bg-base-200 shadow-xl">
            <figure>
              <Image src={makeImageUrl(shiba.imageRef)} layout="fullWidth" aspectRatio={1} />
            </figure>
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img
                      src={
                        shiba.author?.image ??
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                      alt={shiba.author?.name ?? "Unknown"}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium">{shiba.author?.name ?? "Unknown"}</div>
                {shiba.author?.banned && <span className="badge badge-error badge-sm">banned</span>}
              </div>

              <div className="text-xs opacity-70 mb-2">
                ID: {shiba.imageRef} • {new Date(shiba.createdAt).toLocaleDateString()}
              </div>

              <div className="card-actions justify-end gap-2">
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => handleDeleteShiba(shiba.id.toString())}
                >
                  Delete Image
                </button>
                {shiba.author &&
                  (shiba.author.banned ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUnbanUser(shiba.author!.id)}
                      disabled={unbanUserMutation.isPending}
                    >
                      {unbanUserMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Unban User"
                      )}
                    </button>
                  ) : (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleBanUser(shiba.author!.id, shiba.author!.name)}
                      disabled={banUserMutation.isPending}
                    >
                      {banUserMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        "Ban User"
                      )}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {shibas.length === 0 && <div className="text-center py-12 opacity-50">No shibas found</div>}

      <div className="flex justify-center gap-2 mt-6">
        <button disabled={page <= 1} onClick={() => handlePageChange(1)} className="btn btn-sm">
          First
        </button>
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="btn btn-sm"
        >
          Previous
        </button>
        <span className="btn btn-sm no-click">
          Page {page} of {pagination.totalPages}
        </span>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => handlePageChange(page + 1)}
          className="btn btn-sm"
        >
          Next
        </button>
        <button
          disabled={page >= pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
          className="btn btn-sm"
        >
          Last
        </button>
      </div>

      {selectedShiba && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this shiba image? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setSelectedShiba(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={() => handleDeleteShiba(selectedShiba)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedUserToBan && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Ban User</h3>
            <p className="py-4">
              Are you sure you want to ban <strong>{selectedUserToBan.name}</strong>? This will
              prevent them from accessing the platform.
            </p>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ban Reason (optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Enter reason for ban..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setSelectedUserToBan(null);
                  setBanReason("");
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-warning"
                onClick={confirmBanUser}
                disabled={banUserMutation.isPending}
              >
                {banUserMutation.isPending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Ban User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
