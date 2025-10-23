import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ClerkClient } from '@clerk/backend';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('No authorization token provided');
        }

        const token = authHeader.substring(7);

        try {
            // For now, just validate the token format
            if (token.length > 10) {
                const payload = { sub: 'demo-user' };
                request.user = payload;
                return true;
            } else {
                throw new Error('Invalid token format');
            }
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
