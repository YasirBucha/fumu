import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Characters() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/')
  }

  // TODO: Fetch characters from API
  const characters = []

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
                <Link href="/characters" className="text-blue-600 font-medium">
                  Characters
                </Link>
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                  Profile
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/characters/new">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  New Character
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Character Library</h1>
          <p className="text-gray-600">Manage your character consistency settings for AI generation</p>
        </div>

        {/* Character Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="text-2xl">🎭</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Characters</p>
                <p className="text-2xl font-bold text-gray-900">{characters.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">🔒</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locked Characters</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-2xl">🎬</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active in Scenes</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <div className="text-2xl">⚡</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Used</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No characters yet</h3>
              <p className="text-gray-600 mb-6">Create your first character to maintain consistency across scenes</p>
              <Link href="/characters/new">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Create Your First Character
                </button>
              </Link>
            </div>
          ) : (
            characters.map((character: any) => (
              <div key={character.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    {character.imageUrl ? (
                      <img 
                        src={character.imageUrl} 
                        alt={character.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-lg">
                          {character.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{character.name}</h3>
                      <p className="text-sm text-gray-500">
                        {character.isLocked ? '🔒 Locked' : '🔓 Unlocked'}
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
                
                {character.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{character.description}</p>
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Seed: {character.seed}</span>
                  <span>{new Date(character.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Link href={`/characters/${character.id}`}>
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      View
                    </button>
                  </Link>
                  <Link href={`/characters/${character.id}/edit`}>
                    <button className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Character Consistency Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">🎭 Character Consistency</h2>
          <p className="text-blue-800 mb-4">
            Character consistency ensures that your characters maintain the same appearance, clothing, and style across all scenes in your movie.
          </p>
          <ul className="text-blue-700 space-y-2">
            <li>• <strong>Character Seeds:</strong> Unique identifiers that help AI maintain consistency</li>
            <li>• <strong>Locked Characters:</strong> Prevent accidental changes to character appearance</li>
            <li>• <strong>Embeddings:</strong> AI-generated character profiles for enhanced consistency</li>
            <li>• <strong>Cross-Scene Usage:</strong> Use the same character across multiple scenes</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
