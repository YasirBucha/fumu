import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl font-bold text-white">🎬 FuMu</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white text-blue-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold text-white mb-6">
            Create AI-Powered Movies
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transform your creative ideas into cinematic masterpieces with AI-powered video generation. 
            Build complete movies scene-by-scene using advanced AI models like SORA, Google Veo 3, and Runway.
          </p>
          
          <SignedIn>
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Go to Dashboard
              </button>
            </Link>
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105">
                Get Started
              </button>
            </SignInButton>
          </SignedOut>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Generation</h3>
            <p className="text-gray-300">
              Use cutting-edge AI models to generate images and videos from text prompts
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-white mb-3">Character Consistency</h3>
            <p className="text-gray-300">
              Maintain consistent characters across all scenes with advanced AI technology
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-semibold text-white mb-3">Professional Export</h3>
            <p className="text-gray-300">
              Export your movies in high quality with background music and transitions
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h4 className="text-lg font-semibold text-white mb-2">Write Your Story</h4>
              <p className="text-gray-300 text-sm">Describe your first scene with a text prompt</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h4 className="text-lg font-semibold text-white mb-2">Generate Images</h4>
              <p className="text-gray-300 text-sm">AI creates visual representations of your scenes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h4 className="text-lg font-semibold text-white mb-2">Create Videos</h4>
              <p className="text-gray-300 text-sm">Transform images into dynamic video clips</p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">4</div>
              <h4 className="text-lg font-semibold text-white mb-2">Export Movie</h4>
              <p className="text-gray-300 text-sm">Combine all scenes into your final movie</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}