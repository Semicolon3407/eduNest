export declare const markAttendance: (data: {
    date: Date;
    isPresent: boolean;
    studentId: string;
    remark?: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    date: Date;
    studentId: string;
    isPresent: boolean;
    remark: string | null;
}>;
export declare const inputMarks: (data: {
    marksObtained: number;
    totalMarks: number;
    studentId: string;
    subjectId: string;
    comments?: string;
}) => Promise<{
    comments: string | null;
    id: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: string;
    subjectId: string;
    marksObtained: number;
    totalMarks: number;
}>;
