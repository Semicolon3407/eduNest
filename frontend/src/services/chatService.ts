import api from './api';

export const getContacts = async () => {
  const response = await api.get('/chat/contacts');
  return response.data;
};

export const getMessages = async (recipientId: string) => {
  const response = await api.get(`/chat/messages/${recipientId}`);
  return response.data;
};

export const sendMessage = async (data: { recipientId: string, content: string }) => {
  const response = await api.post('/chat/messages', data);
  return response.data;
};
