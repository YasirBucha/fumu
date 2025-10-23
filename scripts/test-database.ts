import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDatabase() {
    try {
        console.log('🔍 Testing database connection...');

        // Test basic connection
        await prisma.$connect();
        console.log('✅ Database connection successful');

        // Test queries
        const userCount = await prisma.user.count();
        console.log(`✅ Users in database: ${userCount}`);

        const projectCount = await prisma.project.count();
        console.log(`✅ Projects in database: ${projectCount}`);

        const characterCount = await prisma.character.count();
        console.log(`✅ Characters in database: ${characterCount}`);

        const sceneCount = await prisma.scene.count();
        console.log(`✅ Scenes in database: ${sceneCount}`);

        const aiModelCount = await prisma.aIModel.count();
        console.log(`✅ AI Models in database: ${aiModelCount}`);

        const jobCount = await prisma.generationJob.count();
        console.log(`✅ Generation Jobs in database: ${jobCount}`);

        // Test sample data
        const sampleUser = await prisma.user.findFirst({
            where: { email: 'demo@fumu.app' },
            include: {
                projects: {
                    include: {
                        scenes: true,
                        characters: true,
                    },
                },
            },
        });

        if (sampleUser) {
            console.log(`✅ Sample user found: ${sampleUser.name} (${sampleUser.email})`);
            console.log(`✅ User has ${sampleUser.projects.length} projects`);
            if (sampleUser.projects.length > 0) {
                const project = sampleUser.projects[0];
                console.log(`✅ First project: ${project.title}`);
                console.log(`✅ Project has ${project.scenes.length} scenes and ${project.characters.length} characters`);
            }
        } else {
            console.log('❌ Sample user not found');
        }

        console.log('🎉 Database test completed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testDatabase();
