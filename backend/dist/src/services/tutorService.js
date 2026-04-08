import prisma from '../config/prisma.js';
export const markAttendance = async (data) => {
    return await prisma.attendance.create({
        data: {
            date: data.date,
            isPresent: data.isPresent,
            studentId: data.studentId,
            remark: data.remark,
        },
    });
};
export const inputMarks = async (data) => {
    return await prisma.gradebook.create({
        data: {
            marksObtained: data.marksObtained,
            totalMarks: data.totalMarks,
            studentId: data.studentId,
            subjectId: data.subjectId,
            comments: data.comments,
        },
    });
};
//# sourceMappingURL=tutorService.js.map