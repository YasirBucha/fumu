import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface NewScenePageProps {
  params: {
    id: string
  }
}

export default async function NewScenePage({ params }: NewScenePageProps) {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }

  // TODO: Fetch project data and characters from API
  const project = {
    id: params.id,
    title: 'My First Movie',
    description: 'A sample project',
  }

  const characters = [
    {
      id: '1',
      name: 'Sarah',
      description: 'A tall, athletic woman with auburn hair',
      imageUrl: null,
      isLocked: false,
    },
    {
      id: '2',
      name: 'John',
      description: 'A middle-aged man with glasses and a beard',
      imageUrl: null,
      isLocked: true,
    },
  ]

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
                <Link href="/characters" className="text-gray-700 hover:text-blue-600 font-medium">
                  Characters
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link href={`/projects/${params.id}`} className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Project
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Scene</h1>
          <p className="text-gray-600">Add a new scene to "{project.title}"</p>
        </div>

        {/* Scene Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Scene Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter scene title (optional)..."
              />
            </div>

            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Scene Description *
              </label>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe what happens in this scene. Be specific about the setting, actions, and characters..."
              />
            </div>

            <div>
              <label htmlFor="character" className="block text-sm font-medium text-gray-700 mb-2">
                Character (Optional)
              </label>
              <select
                id="character"
                name="character"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">No character (create new character appearance)</option>
                {characters.map((character) => (
                  <option key={character.id} value={character.id}>
                    {character.name} {character.isLocked ? '🔒' : ''} - {character.description}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                Select a character to maintain consistency across scenes
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                  AI Model
                </label>
                <select
                  id="model"
                  name="model"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="runway">Runway ML (Recommended)</option>
                  <option value="google-veo">Google Veo 3</option>
                  <option value="openai">OpenAI DALL-E 3</option>
                </select>
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Video Duration (seconds)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  min="1"
                  max="10"
                  defaultValue="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                Resolution
              </label>
              <select
                id="resolution"
                name="resolution"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1024x1024">1024x1024 (Square)</option>
                <option value="1024x1792">1024x1792 (Portrait)</option>
                <option value="1792x1024">1792x1024 (Landscape)</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintainCharacter"
                name="maintainCharacter"
                defaultChecked
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="maintainCharacter" className="ml-2 block text-sm text-gray-700">
                Maintain character consistency (recommended)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🎬 Scene Creation Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about the setting and environment</li>
                <li>• Describe character actions and emotions</li>
                <li>• Include lighting and mood details</li>
                <li>• Use character consistency for recurring characters</li>
                <li>• Consider camera angles and shot types</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">✨ Example Scene Description</h3>
              <p className="text-sm text-green-700 italic">
                "Sarah walks through a dimly lit alley at night, her leather jacket reflecting streetlight. 
                She pauses at a doorway, looking concerned. The camera follows her as she knocks on the door."
              </p>
            </div>

            <div className="flex space-x-4">
              <Link href={`/projects/${params.id}`}>
                <button
                  type="button"
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Generate Scene
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
