import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

export default async function Dashboard() {
    const { userId } = await auth()

    if (!userId) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lavender-50 via-peach-50 to-rose-50">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-mauve-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-peach-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Header */}
            <header className="relative z-10 bg-white/80 backdrop-blur-md border-b border-border shadow-soft">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-xl flex items-center justify-center shadow-glow">
                                    <span className="text-xl">🎬</span>
                                </div>
                                <span className="text-2xl font-bold gradient-text">FuMu</span>
                            </Link>
                            <nav className="hidden md:flex space-x-6">
                                <Link href="/dashboard" className="text-charcoal-700 hover:text-primary font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <Link href="/projects" className="text-charcoal-700 hover:text-primary font-medium transition-colors">
                                    Projects
                                </Link>
                                <Link href="/characters" className="text-charcoal-700 hover:text-primary font-medium transition-colors">
                                    Characters
                                </Link>
                                <Link href="/profile" className="text-charcoal-700 hover:text-primary font-medium transition-colors">
                                    Profile
                                </Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/projects/new">
                                <Button variant="primary" size="md">
                                    New Project
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-4 py-8">
                <div className="mb-12 animate-slide-down">
                    <h1 className="text-4xl font-bold gradient-text mb-4">Welcome to Your Creative Studio</h1>
                    <p className="text-xl text-charcoal-700">Transform your ideas into cinematic masterpieces with AI-powered creativity</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-12 animate-slide-up">
                    <Card variant="elevated" className="group hover:shadow-glow transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-xl flex items-center justify-center shadow-glow">
                                    <span className="text-2xl">🎬</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="group hover:shadow-glow-rose transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-peach-500 rounded-xl flex items-center justify-center shadow-glow-rose">
                                    <span className="text-2xl">🎭</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Scenes Created</p>
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="group hover:shadow-glow-peach transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-peach-500 to-bluegray-500 rounded-xl flex items-center justify-center shadow-glow-peach">
                                    <span className="text-2xl">⏱️</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Total Runtime</p>
                                    <p className="text-2xl font-bold text-foreground">0s</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="group hover:shadow-glow transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-bluegray-500 to-mauve-500 rounded-xl flex items-center justify-center shadow-glow">
                                    <span className="text-2xl">🎵</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-muted-foreground">Characters</p>
                                    <p className="text-2xl font-bold text-foreground">0</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Projects */}
                <Card variant="elevated" className="mb-12 animate-scale-in">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Recent Projects</CardTitle>
                                <CardDescription>Your latest cinematic creations</CardDescription>
                            </div>
                            <Link href="/projects">
                                <Button variant="ghost" size="sm">
                                    View All
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-mauve-200 to-rose-200 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                                <span className="text-4xl">🎬</span>
                            </div>
                            <h3 className="text-2xl font-bold text-charcoal-900 mb-3">Ready to Create Your First Masterpiece?</h3>
                            <p className="text-charcoal-700 mb-8 text-lg">Start your cinematic journey with AI-powered creativity</p>
                            <Link href="/projects/new">
                                <Button variant="primary" size="lg" className="shadow-glow hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                                    Create Your First Project
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-8 animate-fade-in">
                    <Card variant="elevated" className="group hover:shadow-glow transition-all duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <CardTitle className="mb-3">Quick Start</CardTitle>
                            <CardDescription className="mb-6">
                                Create a new project and start building your movie with AI-powered tools
                            </CardDescription>
                            <Link href="/projects/new" className="block">
                                <Button variant="primary" className="w-full">
                                    New Project
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="group hover:shadow-glow-rose transition-all duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-peach-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-rose group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🎭</span>
                            </div>
                            <CardTitle className="mb-3">Character Library</CardTitle>
                            <CardDescription className="mb-6">
                                Manage your character consistency settings and create memorable personas
                            </CardDescription>
                            <Link href="/characters" className="block">
                                <Button variant="secondary" className="w-full">
                                    Manage Characters
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card variant="elevated" className="group hover:shadow-glow-peach transition-all duration-300">
                        <CardContent className="p-8 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-peach-500 to-bluegray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow-peach group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">⚙️</span>
                            </div>
                            <CardTitle className="mb-3">Settings</CardTitle>
                            <CardDescription className="mb-6">
                                Configure your AI models and customize your creative experience
                            </CardDescription>
                            <Link href="/settings" className="block">
                                <Button variant="accent" className="w-full">
                                    Open Settings
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
