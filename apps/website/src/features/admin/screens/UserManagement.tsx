import { useState } from "react";

// Mock data - in real implementation this would come from API
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user" as const,
    banned: false,
    createdAt: "2024-01-15",
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin" as const,
    banned: false,
    createdAt: "2024-01-10",
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  {
    id: "3",
    name: "Bad User",
    email: "bad@example.com",
    role: "user" as const,
    banned: true,
    createdAt: "2024-01-05",
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
];

export const UserManagement = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleBanUser = (userId: string) => {
    console.log("Ban user:", userId);
    // Stubbed API call
    setUsers(users.map((user) => (user.id === userId ? { ...user, banned: true } : user)));
  };

  const handleUnbanUser = (userId: string) => {
    console.log("Unban user:", userId);
    // Stubbed API call
    setUsers(users.map((user) => (user.id === userId ? { ...user, banned: false } : user)));
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    console.log("Change role:", userId, newRole);
    // Stubbed API call
    setUsers(users.map((user) => (user.id === userId ? { ...user, role: newRole as any } : user)));
  };

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">User Management</h2>
        <input
          type="text"
          placeholder="Search users..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={user.image} alt={user.name} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    className="select select-bordered select-sm"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  {user.banned ? (
                    <span className="badge badge-error">Banned</span>
                  ) : (
                    <span className="badge badge-success">Active</span>
                  )}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    {user.banned ? (
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUnbanUser(user.id)}
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleBanUser(user.id)}
                      >
                        Ban
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
