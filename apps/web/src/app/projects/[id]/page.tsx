import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/')
  }

  // TODO: Fetch project data from API
  const project = {
    id: params.id,
    title: 'My First Movie',
    description: 'A sample project',
    scenes: [],
    createdAt: new Date(),
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
              <Link href={`/projects/${params.id}/new-scene`}>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Scene
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/projects" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>

        {/* Project Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-2xl">🎬</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scenes</p>
                <p className="text-2xl font-bold text-gray-900">{project.scenes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="text-2xl">⏳</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
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
                <p className="text-sm font-medium text-gray-600">Total Duration</p>
                <p className="text-2xl font-bold text-gray-900">0s</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Editor */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Scene Timeline</h2>
            <Link href={`/projects/${params.id}/new-scene`}>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add New Scene
              </button>
            </Link>
          </div>

          {project.scenes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No scenes yet</h3>
              <p className="text-gray-600 mb-6">Start building your movie by adding your first scene</p>
              <Link href={`/projects/${params.id}/new-scene`}>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create First Scene
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {project.scenes.map((scene: any, index: number) => (
                <div key={scene.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        Scene {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{scene.title || 'Untitled Scene'}</h3>
                        <p className="text-sm text-gray-600">{scene.prompt}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${scene.status === 'completed' ? 'bg-green-100 text-green-800' :
                          scene.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            scene.status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {scene.status}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Section */}
        {project.scenes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Export Movie</h2>
            <p className="text-gray-600 mb-4">Ready to create your final movie? Export all scenes into a single video file.</p>
            <Link href={`/projects/${params.id}/export`}>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
                Export Movie
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
