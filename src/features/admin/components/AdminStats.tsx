

// Mock data - in real implementation this would come from API
const mockStats = {
  totalUsers: 1234,
  totalShibas: 5678,
  activeUsers: 890,
  bannedUsers: 12,
  pendingReports: 3,
}

export const AdminStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div className="stat-title">Total Users</div>
        <div className="stat-value text-primary">{mockStats.totalUsers.toLocaleString()}</div>
        <div className="stat-desc">Registered users</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </div>
        <div className="stat-title">Total Shibas</div>
        <div className="stat-value text-secondary">{mockStats.totalShibas.toLocaleString()}</div>
        <div className="stat-desc">Images posted</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <div className="stat-title">Active Users</div>
        <div className="stat-value text-accent">{mockStats.activeUsers.toLocaleString()}</div>
        <div className="stat-desc">Last 30 days</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-error">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
          </svg>
        </div>
        <div className="stat-title">Banned Users</div>
        <div className="stat-value text-error">{mockStats.bannedUsers}</div>
        <div className="stat-desc">Currently banned</div>
      </div>

      <div className="stat bg-base-100 shadow-lg rounded-lg">
        <div className="stat-figure text-warning">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div className="stat-title">Pending Reports</div>
        <div className="stat-value text-warning">{mockStats.pendingReports}</div>
        <div className="stat-desc">Requires attention</div>
      </div>
    </div>
  )
}