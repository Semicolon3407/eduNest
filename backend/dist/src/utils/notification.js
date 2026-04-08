import { io } from '../server.js';
export const sendNotification = (orgId, event, data) => {
    if (io) {
        io.to(orgId).emit(event, data);
    }
};
//# sourceMappingURL=notification.js.map