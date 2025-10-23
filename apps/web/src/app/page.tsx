import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-peach-50 to-rose-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-mauve-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-peach-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 animate-slide-down">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-2xl">🎬</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text">FuMu</h1>
          </div>
          <div className="flex items-center space-x-4">
            <SignInButton mode="modal">
              <button className="btn-primary">
                Sign In
              </button>
            </SignInButton>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-7xl font-bold mb-8 gradient-text leading-tight">
              Create AI-Powered
              <span className="block">Cinematic Magic</span>
            </h2>
            <p className="text-xl md:text-2xl text-charcoal-700 mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your creative visions into stunning movies with cutting-edge AI technology.
              From concept to final cut, bring your stories to life with professional-grade tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/dashboard">
                <button className="btn-primary text-lg px-8 py-4 shadow-glow hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                  Start Creating
                  <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <button className="btn-ghost text-lg px-8 py-4">
                Watch Demo
                <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-5-8V6a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20 animate-slide-up">
          <div className="card-elevated p-8 text-center group hover:shadow-glow-rose transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <span className="text-3xl">🤖</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">AI-Powered Generation</h3>
            <p className="text-charcoal-700 leading-relaxed">
              Leverage cutting-edge AI models including SORA, Google Veo 3, and Runway to generate
              stunning visuals from simple text descriptions.
            </p>
          </div>

          <div className="card-elevated p-8 text-center group hover:shadow-glow-peach transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-peach-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-peach">
              <span className="text-3xl">🎭</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Character Consistency</h3>
            <p className="text-charcoal-700 leading-relaxed">
              Maintain perfect character consistency across all scenes with advanced AI technology
              that remembers and preserves character details.
            </p>
          </div>

          <div className="card-elevated p-8 text-center group hover:shadow-glow transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-mauve-500 to-bluegray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
              <span className="text-3xl">🎬</span>
            </div>
            <h3 className="text-2xl font-bold text-charcoal-900 mb-4">Professional Export</h3>
            <p className="text-charcoal-700 leading-relaxed">
              Export your creations in professional quality with custom background music,
              smooth transitions, and cinematic effects.
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="card-elevated p-12 mb-20 animate-scale-in">
          <h3 className="text-4xl font-bold text-center mb-12 gradient-text">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              <h4 className="text-xl font-bold text-charcoal-900 mb-3">Write Your Story</h4>
              <p className="text-charcoal-700 leading-relaxed">Describe your scenes with rich, detailed prompts that bring your vision to life.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-peach-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-glow-rose group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              <h4 className="text-xl font-bold text-charcoal-900 mb-3">Generate Images</h4>
              <p className="text-charcoal-700 leading-relaxed">AI creates stunning visual representations of your scenes with incredible detail.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-peach-500 to-bluegray-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-glow-peach group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              <h4 className="text-xl font-bold text-charcoal-900 mb-3">Create Videos</h4>
              <p className="text-charcoal-700 leading-relaxed">Transform static images into dynamic, engaging video sequences.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-bluegray-500 to-mauve-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                4
              </div>
              <h4 className="text-xl font-bold text-charcoal-900 mb-3">Export Movie</h4>
              <p className="text-charcoal-700 leading-relaxed">Download your complete cinematic masterpiece with professional audio and effects.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="card-elevated p-12 max-w-4xl mx-auto bg-gradient-to-br from-mauve-50 to-rose-50">
            <h3 className="text-4xl font-bold mb-6 gradient-text">Ready to Create Your Masterpiece?</h3>
            <p className="text-xl text-charcoal-700 mb-8 leading-relaxed">
              Join thousands of creators who are already bringing their stories to life with FuMu.
              Start your cinematic journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="btn-primary text-lg px-10 py-4 shadow-glow hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                  Get Started Free
                  <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
              <button className="btn-secondary text-lg px-10 py-4">
                View Examples
                <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}