import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { GradientBackground } from '../../components/ui/GradientBackground'

export default function DesignShowcase() {
    return (
        <GradientBackground variant="homepage">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <header className="text-center mb-16 animate-slide-down">
                    <h1 className="text-6xl font-bold gradient-text mb-6">Design System Showcase</h1>
                    <p className="text-xl text-charcoal-700 max-w-3xl mx-auto">
                        Experience our sophisticated color palette and modern UI components in action
                    </p>
                </header>

                {/* Color Palette */}
                <section className="mb-20 animate-fade-in">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Color Palette</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {/* Peach Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Peach</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-peach-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-peach-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-peach-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>

                        {/* Rose Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Rose</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-rose-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-rose-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-rose-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>

                        {/* Mauve Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Mauve</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-mauve-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-mauve-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-mauve-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>

                        {/* Charcoal Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Charcoal</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-charcoal-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-charcoal-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-charcoal-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>

                        {/* Blue Gray Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Blue Gray</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-bluegray-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-bluegray-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-bluegray-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>

                        {/* Lavender Colors */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-charcoal-900">Lavender</h3>
                            <div className="space-y-2">
                                <div className="h-12 bg-lavender-300 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-lavender-500 rounded-lg shadow-soft"></div>
                                <div className="h-12 bg-lavender-700 rounded-lg shadow-soft"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Button Variants */}
                <section className="mb-20 animate-slide-up">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Button Variants</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Primary Buttons</CardTitle>
                                <CardDescription>Main actions and primary CTAs</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="primary" size="sm">Small Primary</Button>
                                <Button variant="primary" size="md">Medium Primary</Button>
                                <Button variant="primary" size="lg">Large Primary</Button>
                                <Button variant="primary" size="xl">Extra Large Primary</Button>
                            </CardContent>
                        </Card>

                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Secondary Buttons</CardTitle>
                                <CardDescription>Secondary actions and alternatives</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="secondary" size="sm">Small Secondary</Button>
                                <Button variant="secondary" size="md">Medium Secondary</Button>
                                <Button variant="secondary" size="lg">Large Secondary</Button>
                                <Button variant="secondary" size="xl">Extra Large Secondary</Button>
                            </CardContent>
                        </Card>

                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Accent Buttons</CardTitle>
                                <CardDescription>Highlighted actions and special features</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="accent" size="sm">Small Accent</Button>
                                <Button variant="accent" size="md">Medium Accent</Button>
                                <Button variant="accent" size="lg">Large Accent</Button>
                                <Button variant="accent" size="xl">Extra Large Accent</Button>
                            </CardContent>
                        </Card>

                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Ghost Buttons</CardTitle>
                                <CardDescription>Subtle actions and secondary options</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="ghost" size="sm">Small Ghost</Button>
                                <Button variant="ghost" size="md">Medium Ghost</Button>
                                <Button variant="ghost" size="lg">Large Ghost</Button>
                                <Button variant="ghost" size="xl">Extra Large Ghost</Button>
                            </CardContent>
                        </Card>

                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Outline Buttons</CardTitle>
                                <CardDescription>Bordered actions with clear boundaries</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="outline" size="sm">Small Outline</Button>
                                <Button variant="outline" size="md">Medium Outline</Button>
                                <Button variant="outline" size="lg">Large Outline</Button>
                                <Button variant="outline" size="xl">Extra Large Outline</Button>
                            </CardContent>
                        </Card>

                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Destructive Buttons</CardTitle>
                                <CardDescription>Actions that remove or delete content</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button variant="destructive" size="sm">Small Destructive</Button>
                                <Button variant="destructive" size="md">Medium Destructive</Button>
                                <Button variant="destructive" size="lg">Large Destructive</Button>
                                <Button variant="destructive" size="xl">Extra Large Destructive</Button>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Card Variants */}
                <section className="mb-20 animate-scale-in">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Card Variants</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <Card variant="default">
                            <CardHeader>
                                <CardTitle>Default Card</CardTitle>
                                <CardDescription>Standard card with soft shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-charcoal-700">This is a default card with subtle styling and clean appearance.</p>
                            </CardContent>
                        </Card>

                        <Card variant="elevated">
                            <CardHeader>
                                <CardTitle>Elevated Card</CardTitle>
                                <CardDescription>Enhanced card with stronger shadow</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-charcoal-700">This elevated card has more prominent shadows for better visual hierarchy.</p>
                            </CardContent>
                        </Card>

                        <Card variant="glass">
                            <CardHeader>
                                <CardTitle>Glass Card</CardTitle>
                                <CardDescription>Transparent card with backdrop blur</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white">This glass card uses backdrop blur for a modern, translucent effect.</p>
                            </CardContent>
                        </Card>

                        <Card variant="gradient">
                            <CardHeader>
                                <CardTitle>Gradient Card</CardTitle>
                                <CardDescription>Card with subtle gradient background</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-charcoal-700">This gradient card features a beautiful color transition background.</p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Input Components */}
                <section className="mb-20 animate-fade-in">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Input Components</h2>
                    <div className="max-w-2xl mx-auto space-y-8">
                        <Card variant="elevated" className="p-8">
                            <CardHeader>
                                <CardTitle>Text Inputs</CardTitle>
                                <CardDescription>Various input field styles and states</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Input
                                    label="Default Input"
                                    placeholder="Enter your text here..."
                                    helperText="This is a helpful description"
                                />
                                <Input
                                    label="Input with Left Icon"
                                    placeholder="Search..."
                                    leftIcon={
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    }
                                />
                                <Input
                                    label="Input with Error"
                                    placeholder="Enter your email..."
                                    error="This field is required"
                                />
                                <Input
                                    label="Disabled Input"
                                    placeholder="This field is disabled"
                                    disabled
                                />
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Shadow Effects */}
                <section className="mb-20 animate-slide-up">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Shadow Effects</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-2xl mx-auto mb-4 shadow-soft"></div>
                            <h3 className="text-lg font-semibold mb-2">Soft Shadow</h3>
                            <p className="text-muted-foreground">Subtle shadow for gentle elevation</p>
                        </Card>

                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-peach-500 rounded-2xl mx-auto mb-4 shadow-medium"></div>
                            <h3 className="text-lg font-semibold mb-2">Medium Shadow</h3>
                            <p className="text-muted-foreground">Balanced shadow for moderate elevation</p>
                        </Card>

                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-peach-500 to-bluegray-500 rounded-2xl mx-auto mb-4 shadow-strong"></div>
                            <h3 className="text-lg font-semibold mb-2">Strong Shadow</h3>
                            <p className="text-muted-foreground">Prominent shadow for high elevation</p>
                        </Card>
                    </div>
                </section>

                {/* Glow Effects */}
                <section className="mb-20 animate-scale-in">
                    <h2 className="text-4xl font-bold text-center mb-12 gradient-text">Glow Effects</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-mauve-500 to-rose-500 rounded-2xl mx-auto mb-4 shadow-glow"></div>
                            <h3 className="text-lg font-semibold mb-2">Primary Glow</h3>
                            <p className="text-muted-foreground">Mauve-tinted glow effect</p>
                        </Card>

                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-peach-500 rounded-2xl mx-auto mb-4 shadow-glow-rose"></div>
                            <h3 className="text-lg font-semibold mb-2">Rose Glow</h3>
                            <p className="text-muted-foreground">Rose-tinted glow effect</p>
                        </Card>

                        <Card variant="elevated" className="p-8 text-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-peach-500 to-bluegray-500 rounded-2xl mx-auto mb-4 shadow-glow-peach"></div>
                            <h3 className="text-lg font-semibold mb-2">Peach Glow</h3>
                            <p className="text-muted-foreground">Peach-tinted glow effect</p>
                        </Card>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center animate-fade-in">
                    <Card variant="gradient" className="p-12 max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold mb-6 gradient-text">Love the Design?</h2>
                        <p className="text-xl text-charcoal-700 mb-8 leading-relaxed">
                            This sophisticated design system creates beautiful, user-friendly, and addictive experiences.
                            Every component is crafted with attention to detail and modern aesthetics.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="primary" size="lg" className="shadow-glow hover:shadow-glow transform hover:scale-105 transition-all duration-300">
                                Start Building
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                            <Button variant="secondary" size="lg">
                                Explore Components
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </Button>
                        </div>
                    </Card>
                </section>
            </div>
        </GradientBackground>
    )
}
