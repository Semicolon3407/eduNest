import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/tutor/dashboard');
  return response.data;
};

export const getTutorClasses = async () => {
  const response = await api.get('/tutor/classes');
  return response.data;
};

export const getSchedule = async () => {
  const response = await api.get('/tutor/schedule');
  return response.data;
};

export const getAssignments = async () => {
  const response = await api.get('/tutor/assignments');
  return response.data;
};

export const createAssignment = async (data: any) => {
  const response = await api.post('/tutor/assignments', data);
  return response.data;
};

export const getSubmissions = async (assignmentId?: string) => {
  const response = await api.get('/tutor/submissions', {
    params: { assignmentId }
  });
  return response.data;
};

export const markAttendance = async (data: { records: any[], date: string }) => {
  const response = await api.post('/tutor/attendance', data);
  return response.data;
};

export const addBehaviorLog = async (data: any) => {
  const response = await api.post('/tutor/behavior', data);
  return response.data;
};

export const getGrades = async (filters: { classId?: string, term?: string }) => {
  const response = await api.get('/tutor/grades', { params: filters });
  return response.data;
};

export const upsertGrade = async (data: any) => {
  const response = await api.post('/tutor/grades', data);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/tutor/profile');
  return response.data;
};

export const applyLeave = async (data: any) => {
  const response = await api.post('/tutor/leaves', data);
  return response.data;
};

export const getStudentsByClass = async (classId: string) => {
  const response = await api.get(`/tutor/students/${classId}`);
  return response.data;
};

export const getStudentById = async (id: string) => {
  const response = await api.get(`/tutor/student/${id}`);
  return response.data;
};

export const deleteGrade = async (id: string) => {
  const response = await api.delete(`/tutor/grades/${id}`);
  return response.data;
};

export const getBehaviorLogs = async () => {
  const response = await api.get('/tutor/behavior');
  return response.data;
};

export const getMaterials = async (classId?: string) => {
  const response = await api.get('/tutor/materials', { params: { classId } });
  return response.data;
};

export const uploadMaterial = async (data: any) => {
  const response = await api.post('/tutor/materials', data);
  return response.data;
};

export const deleteMaterial = async (id: string) => {
  const response = await api.delete(`/tutor/materials/${id}`);
  return response.data;
};

export const checkAttendance = async (classId: string, date: string) => {
  const response = await api.get('/tutor/attendance/check', { params: { classId, date } });
  return response.data;
};

export const getStudentLeaves = async () => {
  const response = await api.get('/tutor/student-leaves');
  return response.data;
};

export const updateStudentLeaveStatus = async (id: string, status: string) => {
  const response = await api.put(`/tutor/student-leaves/${id}`, { status });
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await api.get('/tutor/announcements');
  return response.data;
};

export const createAnnouncement = async (data: any) => {
  const response = await api.post('/tutor/announcements', data);
  return response.data;
};

export const tutorService = {
  getDashboardStats,
  getTutorClasses,
  getSchedule,
  getAssignments,
  createAssignment,
  getSubmissions,
  markAttendance,
  addBehaviorLog,
  getGrades,
  upsertGrade,
  getProfile,
  applyLeave,
  getStudentsByClass,
  getStudentById,
  deleteGrade,
  getBehaviorLogs,
  getMaterials,
  uploadMaterial,
  deleteMaterial,
  checkAttendance,
  getStudentLeaves,
  updateStudentLeaveStatus,
  getAnnouncements,
  createAnnouncement,
};
