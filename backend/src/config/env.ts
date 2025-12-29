import dotenv from 'dotenv';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    mongodbUri: string;
    jwtSecret: string;
    jwtExpiration: string;
    rpcUrl: string;
    chainId: number;
    tipJarFactoryAddress: string;
    maxFileSize: number;
    maxThumbnailSize: number;
    uploadDir: string;
    allowedOrigins: string[];
}

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://streamaudiobox102_db_user:aCEIW6hJd5QszcJ7@cluster0.oudykdu.mongodb.net/',
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '7d',
    rpcUrl: process.env.RPC_URL || '',
    chainId: parseInt(process.env.CHAIN_ID || '11155111', 10),
    tipJarFactoryAddress: process.env.TIPJAR_FACTORY_ADDRESS || '',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '52428800', 10), // 50MB
    maxThumbnailSize: parseInt(process.env.MAX_THUMBNAIL_SIZE || '10485760', 10), // 10MB
    uploadDir: process.env.UPLOAD_DIR || 'uploads',
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
};

// Validate required environment variables
if (!config.jwtSecret || config.jwtSecret === 'your-secret-key') {
    console.warn('⚠️  WARNING: Using default JWT secret. Set JWT_SECRET in production!');
}

if (!config.tipJarFactoryAddress) {
    console.warn('⚠️  WARNING: TIPJAR_FACTORY_ADDRESS not set. Blockchain features will not work.');
}

export default config;
