import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function NewProject() {
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
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="mb-8">
                    <Link href="/projects" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                        ← Back to Projects
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
                    <p className="text-gray-600">Start your AI-powered movie creation journey</p>
                </div>

                {/* Project Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Project Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your movie title..."
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Describe your movie concept..."
                            />
                        </div>

                        <div>
                            <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                                Genre
                            </label>
                            <select
                                id="genre"
                                name="genre"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select a genre</option>
                                <option value="action">Action</option>
                                <option value="comedy">Comedy</option>
                                <option value="drama">Drama</option>
                                <option value="horror">Horror</option>
                                <option value="romance">Romance</option>
                                <option value="sci-fi">Science Fiction</option>
                                <option value="thriller">Thriller</option>
                                <option value="fantasy">Fantasy</option>
                                <option value="documentary">Documentary</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="targetLength" className="block text-sm font-medium text-gray-700 mb-2">
                                Target Length (minutes)
                            </label>
                            <input
                                type="number"
                                id="targetLength"
                                name="targetLength"
                                min="1"
                                max="120"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., 5"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-sm font-medium text-blue-800 mb-2">🎬 What happens next?</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Create your first scene with a text prompt</li>
                                <li>• Generate images using AI</li>
                                <li>• Convert images to videos</li>
                                <li>• Extend your story scene by scene</li>
                                <li>• Export your final movie</li>
                            </ul>
                        </div>

                        <div className="flex space-x-4">
                            <Link href="/projects">
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
                                Create Project
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
