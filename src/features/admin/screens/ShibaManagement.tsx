import { useState } from 'react'

// Mock data - in real implementation this would come from API
const mockShibas = [
  {
    id: '1',
    imgRef: 'shiba1',
    author: {
      name: 'John Doe',
      id: '1',
      image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
    },
    createdAt: '2024-01-20',
    likes: 42,
    imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
  },
  {
    id: '2',
    imgRef: 'shiba2',
    author: {
      name: 'Jane Smith',
      id: '2',
      image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
    },
    createdAt: '2024-01-19',
    likes: 128,
    imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
  },
  {
    id: '3',
    imgRef: 'shiba3',
    author: {
      name: 'Bad User',
      id: '3',
      image: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
    },
    createdAt: '2024-01-18',
    likes: 15,
    imageUrl: 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
  }
]

export const ShibaManagement = () => {
  const [shibas, setShibas] = useState(mockShibas)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedShiba, setSelectedShiba] = useState<string | null>(null)

  const filteredShibas = shibas.filter(shiba => 
    shiba.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shiba.imgRef.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDeleteShiba = (shibaId: string) => {
    console.log('Delete shiba:', shibaId)
    // Stubbed API call
    setShibas(shibas.filter(shiba => shiba.id !== shibaId))
    setSelectedShiba(null)
  }

  const handleBanUser = (userId: string) => {
    console.log('Ban user from shiba:', userId)
    // Stubbed API call
    // In real implementation, this would call the user management API
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Shiba Management</h2>
        <input
          type="text"
          placeholder="Search by author or image ID..."
          className="input input-bordered w-full max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShibas.map((shiba) => (
          <div key={shiba.id} className="card bg-base-200 shadow-xl">
            <figure className="h-48">
              <img 
                src={shiba.imageUrl} 
                alt={`Shiba by ${shiba.author.name}`}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="avatar">
                  <div className="w-8 rounded-full">
                    <img src={shiba.author.image} alt={shiba.author.name} />
                  </div>
                </div>
                <div className="text-sm font-medium">{shiba.author.name}</div>
              </div>
              
              <div className="text-xs opacity-70 mb-2">
                ID: {shiba.imgRef} • {new Date(shiba.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">❤️ {shiba.likes}</span>
              </div>
              
              <div className="card-actions justify-end gap-2">
                <button 
                  className="btn btn-error btn-sm"
                  onClick={() => handleDeleteShiba(shiba.id)}
                >
                  Delete Image
                </button>
                <button 
                  className="btn btn-warning btn-sm"
                  onClick={() => handleBanUser(shiba.author.id)}
                >
                  Ban User
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {selectedShiba && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this shiba image? This action cannot be undone.</p>
            <div className="modal-action">
              <button 
                className="btn btn-ghost"
                onClick={() => setSelectedShiba(null)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={() => handleDeleteShiba(selectedShiba)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}