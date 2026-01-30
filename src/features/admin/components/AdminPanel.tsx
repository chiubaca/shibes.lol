import { useState } from 'react'
import { UserManagement } from './UserManagement'
import { ShibaManagement } from './ShibaManagement'
import { AdminStats } from './AdminStats'

export const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-base-content mb-2">Admin Panel</h1>
        <p className="text-base-content/70">Manage users and shiba submissions</p>
      </div>

      <div className="tabs tabs-boxed">
        <button 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'shibas' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('shibas')}
        >
          Shiba Management
        </button>
        <button 
          className={`tab ${activeTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
      </div>
      
      <div className="mt-6">
        {activeTab === 'overview' && <AdminStats />}
        {activeTab === 'shibas' && <ShibaManagement />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  )
}