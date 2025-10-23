import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Projects() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }

  // TODO: Fetch projects from API
  const projects = []

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
                <Link href="/projects" className="text-blue-600 font-medium">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage your AI-powered movie projects</p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Start creating your first AI-powered movie</p>
              <Link href="/projects/new">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Your First Project
                </button>
              </Link>
            </div>
          ) : (
            projects.map((project: any) => (
              <div key={project.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <span className="text-sm text-gray-500">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {project.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>{project.scenes?.length || 0} scenes</span>
                  <span>{project.characters?.length || 0} characters</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/projects/${project.id}`}>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Open
                    </button>
                  </Link>
                  <Link href={`/projects/${project.id}/edit`}>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
