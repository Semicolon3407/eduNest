import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
export const createStudent = async (data) => {
    const hashedPassword = await bcrypt.hash('student123', 10); // Default password
    return await prisma.$transaction(async (tx) => {
        // 1. Create User
        const user = await tx.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
                role: 'STUDENT',
                organizationId: data.organizationId,
            },
        });
        // 2. Create Student Profile
        const studentProfile = await tx.studentProfile.create({
            data: {
                userId: user.id,
                studentId: data.studentId,
                gradeId: data.gradeId,
                sectionId: data.sectionId,
            },
        });
        return { user, studentProfile };
    });
};
export const getStudentsByOrg = async (orgId) => {
    return await prisma.studentProfile.findMany({
        where: {
            user: {
                organizationId: orgId,
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    isActive: true,
                },
            },
            grade: true,
            section: true,
        },
    });
};
//# sourceMappingURL=studentService.js.map