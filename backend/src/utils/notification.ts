import { io } from '../server.js';

export const sendNotification = (orgId: string, event: string, data: any) => {
  if (io) {
    io.to(orgId).emit(event, data);
  }
};
