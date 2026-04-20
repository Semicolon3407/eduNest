"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = __importDefault(require("./config/swagger"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
// Load env vars
dotenv_1.default.config();
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
// Body parser
app.use(express_1.default.json());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Security headers
app.use((0, helmet_1.default)());
// Compress all responses
app.use((0, compression_1.default)());
// Enable CORS
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
// Swagger UI
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Mount routers
app.use('/api/v1/auth', authRoutes_1.default);
// Error handler
app.use(errorMiddleware_1.default);
// Welcome route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to EduNest API' });
});
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api/docs`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
