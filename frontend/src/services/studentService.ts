import api from './api';

export const getDashboardStats = async () => {
  const response = await api.get('/student/dashboard/stats');
  return response.data;
};

export const getAnnouncements = async () => {
  const response = await api.get('/student/announcements');
  return response.data;
};

export const getAssignments = async () => {
  const response = await api.get('/student/assignments');
  return response.data;
};

export const submitAssignment = async (data: any) => {
  const response = await api.post('/student/assignments/submit', data);
  return response.data;
};

export const getCourses = async () => {
  const response = await api.get('/student/courses');
  return response.data;
};

export const getMaterials = async () => {
  const response = await api.get('/student/materials');
  return response.data;
};

export const getExamRoutine = async () => {
  const response = await api.get('/student/exams/routine');
  return response.data;
};

export const getResults = async () => {
  const response = await api.get('/student/exams/results');
  return response.data;
};

export const getFeeRecords = async () => {
  const response = await api.get('/student/fees');
  return response.data;
};

export const getBorrowedBooks = async () => {
  const response = await api.get('/student/library/borrowed');
  return response.data;
};

export const searchLibrary = async (query: string) => {
  const response = await api.get('/student/library/search', { params: { query } });
  return response.data;
};

export const getStudentProfile = async () => {
  const response = await api.get('/student/profile');
  return response.data;
};

export const applyLeave = async (data: any) => {
  const response = await api.post('/student/leaves', data);
  return response.data;
};

export const getLeaveHistory = async () => {
  const response = await api.get('/student/leaves');
  return response.data;
};

export const getTimetable = async () => {
  const response = await api.get('/student/timetable');
  return response.data;
};

export const initiateEsewaPayment = async (amount: number, feeRecordId?: string) => {
  const response = await api.post('/payment/esewa/initiate', { amount, feeRecordId });
  return response.data;
};

export const verifyEsewaPayment = async (data: string) => {
  const response = await api.get('/payment/esewa/verify', { params: { data } });
  return response.data;
};

export const checkEsewaStatus = async (transaction_uuid: string, total_amount: string) => {
  const response = await api.get('/payment/esewa/status', { params: { transaction_uuid, total_amount } });
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload/file', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
