import React from 'react'

interface GradientBackgroundProps {
    children: React.ReactNode
    variant?: 'homepage' | 'dashboard' | 'minimal'
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
    children,
    variant = 'homepage'
}) => {
    const getBackgroundClasses = () => {
        switch (variant) {
            case 'homepage':
                return 'bg-gradient-to-br from-lavender-50 via-peach-50 to-rose-50'
            case 'dashboard':
                return 'bg-gradient-to-br from-lavender-50 via-peach-50 to-rose-50'
            case 'minimal':
                return 'bg-gradient-to-br from-neutral-50 to-bluegray-50'
            default:
                return 'bg-gradient-to-br from-lavender-50 via-peach-50 to-rose-50'
        }
    }

    const getFloatingElements = () => {
        if (variant === 'minimal') return null

        return (
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-mauve-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-40 left-1/2 w-80 h-80 bg-peach-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen relative ${getBackgroundClasses()}`}>
            {getFloatingElements()}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
