import { ZodError } from 'zod';
import { sendError } from '../utils/response.js';
export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        }
        catch (error) {
            if (error instanceof ZodError) {
                return sendError(res, 'Validation Error', 400, error.issues);
            }
            return sendError(res, 'Internal Server Error', 500);
        }
    };
};
//# sourceMappingURL=validateMiddleware.js.map