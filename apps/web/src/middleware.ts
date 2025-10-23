import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkSecretKey = process.env.CLERK_SECRET_KEY

if (!clerkPublishableKey || !clerkSecretKey) {
    throw new Error(
        'Missing Clerk environment variables. Please set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY.',
    )
}

const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/projects(.*)',
    '/profile(.*)',
    '/settings(.*)',
])

export default clerkMiddleware(
    async (auth, req) => {
        if (isProtectedRoute(req)) {
            await auth.protect()
        }
    },
    {
        publishableKey: clerkPublishableKey,
        secretKey: clerkSecretKey,
        debug: process.env.NODE_ENV === 'development',
    },
)

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
