import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewCharacter() {
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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Link href="/characters" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
            ← Back to Characters
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Character</h1>
          <p className="text-gray-600">Define a character that will maintain consistency across all your scenes</p>
        </div>

        {/* Character Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Character Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter character name..."
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Character Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the character's appearance, clothing, personality, and any distinctive features..."
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Reference Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/character-image.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a reference image to help AI maintain character consistency
              </p>
            </div>

            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Associate with Project (Optional)
              </label>
              <select
                id="project"
                name="project"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Global character (can be used in any project)</option>
                {/* TODO: Populate with user's projects */}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isLocked"
                name="isLocked"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isLocked" className="ml-2 block text-sm text-gray-700">
                Lock character (prevent accidental changes)
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">🎭 Character Consistency Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Be specific about physical features (hair color, eye color, build)</li>
                <li>• Describe clothing style and colors</li>
                <li>• Include distinctive features (scars, tattoos, accessories)</li>
                <li>• Mention personality traits that affect appearance</li>
                <li>• Use consistent terminology across descriptions</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">✨ Example Character Description</h3>
              <p className="text-sm text-green-700 italic">
                "A tall, athletic woman in her 30s with shoulder-length auburn hair and green eyes. 
                She wears a dark blue leather jacket over a white t-shirt, dark jeans, and black boots. 
                Has a small scar above her left eyebrow and always wears a silver pendant necklace."
              </p>
            </div>

            <div className="flex space-x-4">
              <Link href="/characters">
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
                Create Character
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
