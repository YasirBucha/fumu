import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClerkClient } from '@clerk/backend';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async createOrUpdateUser(clerkUserId: string, email: string, name?: string) {
        try {
            const user = await this.prisma.user.upsert({
                where: { email: email },
                update: {
                    email,
                    name,
                    updatedAt: new Date(),
                },
                create: {
                    email,
                    name,
                    provider: 'clerk',
                    providerId: clerkUserId,
                    subscription: 'free',
                },
            });

            return user;
        } catch (error) {
            console.error('Error creating/updating user:', error);
            throw new Error('Failed to create or update user');
        }
    }

    async getUserByClerkId(clerkUserId: string) {
        return this.prisma.user.findFirst({
            where: { providerId: clerkUserId },
        });
    }

    async getUserById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                projects: {
                    include: {
                        scenes: true,
                        characters: true,
                    },
                },
            },
        });
    }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
}
