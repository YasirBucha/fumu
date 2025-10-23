import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Dashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                🎬 FuMu
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/projects" className="text-gray-700 hover:text-blue-600 font-medium">
                  Projects
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/projects/new">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  New Project
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to FuMu</h1>
          <p className="text-gray-600">Create amazing AI-powered movies with ease</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-2xl">🎬</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">🎭</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scenes Created</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="text-2xl">⏱️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Runtime</p>
                <p className="text-2xl font-bold text-gray-900">0s</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <div className="text-2xl">🎵</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Characters</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
            <Link href="/projects">
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                View All
              </button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-6">Start creating your first AI-powered movie</p>
            <Link href="/projects/new">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Create Your First Project
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
            <p className="text-gray-600 mb-4">Create a new project and start building your movie</p>
            <Link href="/projects/new">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                New Project
              </button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">🎭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Character Library</h3>
            <p className="text-gray-600 mb-4">Manage your character consistency settings</p>
            <Link href="/characters">
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                Manage Characters
              </button>
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-3xl mb-4">⚙️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
            <p className="text-gray-600 mb-4">Configure your AI models and preferences</p>
            <Link href="/settings">
              <button className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
                Open Settings
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
