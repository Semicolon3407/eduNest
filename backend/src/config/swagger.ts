import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduNest API',
      version: '1.0.0',
      description:
        'Production-ready REST API for the EduNest School Management System. ' +
        'All protected routes require a Bearer access token in the Authorization header.',
      contact: {
        name: 'EduNest Team',
        email: 'admin@edunest.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@edunest.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'adminpassword123',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '69e2799e8d8c089aae86e3c9' },
            name: { type: 'string', example: 'Product Owner' },
            email: { type: 'string', example: 'admin@edunest.com' },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'ORGANIZATION', 'HR', 'ADMIN', 'TUTOR', 'STUDENT'],
              example: 'SUPER_ADMIN',
            },
            accessToken: {
              type: 'string',
              description: 'Short-lived JWT (15 min). Refresh token set as httpOnly cookie.',
              example: 'eyJhbGc...',
            },
          },
        },
        RefreshResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string', example: 'eyJhbGc...' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Invalid email or password' },
          },
        },
      },
    },
  },
  // Source files that contain JSDoc swagger annotations
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
