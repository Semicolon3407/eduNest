import api from './api';

export const tutorService = {
  getDashboardStats: async () => {
    const response = await api.get('/tutor/dashboard');
    return response.data;
  },

  getTutorClasses: async () => {
    const response = await api.get('/tutor/classes');
    return response.data;
  },

  getSchedule: async () => {
    const response = await api.get('/tutor/schedule');
    return response.data;
  },

  getAssignments: async () => {
    const response = await api.get('/tutor/assignments');
    return response.data;
  },

  createAssignment: async (data: any) => {
    const response = await api.post('/tutor/assignments', data);
    return response.data;
  },

  getSubmissions: async (assignmentId?: string) => {
    const response = await api.get('/tutor/submissions', {
      params: { assignmentId }
    });
    return response.data;
  },

  markAttendance: async (data: { records: any[], date: string }) => {
    const response = await api.post('/tutor/attendance', data);
    return response.data;
  },

  addBehaviorLog: async (data: any) => {
    const response = await api.post('/tutor/behavior', data);
    return response.data;
  },

  getGrades: async (filters: { classId?: string, term?: string }) => {
    const response = await api.get('/tutor/grades', { params: filters });
    return response.data;
  },

  upsertGrade: async (data: any) => {
    const response = await api.post('/tutor/grades', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/tutor/profile');
    return response.data;
  },

  applyLeave: async (data: any) => {
    const response = await api.post('/tutor/leaves', data);
    return response.data;
  },

  getStudentsByClass: async (classId: string) => {
    const response = await api.get(`/tutor/students/${classId}`);
    return response.data;
  },

  getStudentById: async (id: string) => {
    const response = await api.get(`/tutor/student/${id}`);
    return response.data;
  },

  deleteGrade: async (id: string) => {
    const response = await api.delete(`/tutor/grades/${id}`);
    return response.data;
  },

  getBehaviorLogs: async () => {
    const response = await api.get('/tutor/behavior');
    return response.data;
  },

  getMaterials: async (classId?: string) => {
    const response = await api.get('/tutor/materials', { params: { classId } });
    return response.data;
  },

  uploadMaterial: async (data: any) => {
    const response = await api.post('/tutor/materials', data);
    return response.data;
  },

  deleteMaterial: async (id: string) => {
    const response = await api.delete(`/tutor/materials/${id}`);
    return response.data;
  },
};
