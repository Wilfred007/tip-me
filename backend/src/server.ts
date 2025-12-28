import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import config from './config/env';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { MediaService } from './services/mediaService';

// Import routes
import authRoutes from './routes/auth';
import contentRoutes from './routes/content';
import likesRoutes from './routes/likes';
import commentsRoutes from './routes/comments';
import mediaRoutes from './routes/media';

const app: Application = express();

// Middleware
app.use(cors({
    origin: config.allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadDir)));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: config.nodeEnv
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/media', mediaRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
    try {
        // Ensure upload directory exists
        await MediaService.ensureUploadDir();
        console.log('✅ Upload directory ready');

        // Connect to database
        await connectDatabase();

        // Start listening
        app.listen(config.port, () => {
            console.log('🚀 TipJar Backend Server Started');
            console.log(`📍 Port: ${config.port}`);
            console.log(`🌍 Environment: ${config.nodeEnv}`);
            console.log(`🔗 Health check: http://localhost:${config.port}/health`);
            console.log(`📡 API base: http://localhost:${config.port}/api`);

            if (config.tipJarFactoryAddress) {
                console.log(`⛓️  TipJar Factory: ${config.tipJarFactoryAddress}`);
            } else {
                console.warn('⚠️  No TipJar Factory address configured');
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start the server
startServer();

export default app;
