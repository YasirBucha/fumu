import { Controller, Post, Body, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('webhook')
    async handleClerkWebhook(@Body() body: any) {
        const { type, data } = body;

        switch (type) {
            case 'user.created':
            case 'user.updated':
                await this.authService.createOrUpdateUser(
                    data.id,
                    data.email_addresses[0].email_address,
                    data.first_name && data.last_name
                        ? `${data.first_name} ${data.last_name}`
                        : data.first_name || data.last_name
                );
                break;
            case 'user.deleted':
                await this.authService.deleteUser(data.id);
                break;
        }

        return { success: true };
    }

    @Get('user/:clerkId')
    @UseGuards(ClerkAuthGuard)
    async getUserByClerkId(@Param('clerkId') clerkId: string) {
        return this.authService.getUserByClerkId(clerkId);
    }

    @Get('user/id/:userId')
    @UseGuards(ClerkAuthGuard)
    async getUserById(@Param('userId') userId: string) {
        return this.authService.getUserById(userId);
    }
}
