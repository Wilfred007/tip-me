# TipJar Backend - Quick Start Guide

## Overview

This backend provides a Web3-native API for the TipJar Creator platform with:
- 🔐 Wallet-based authentication (no passwords)
- 📝 Content management with categories
- ❤️ Likes and comments
- 📁 File uploads
- ⛓️ Blockchain integration (read-only)

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or cloud)
- **Wallet** (MetaMask or similar) for testing

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

Or use the setup script:

```bash
chmod +x setup.sh
./setup.sh
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
nano .env
```

**Required Configuration:**

```env
# Database - Update with your MongoDB URI
MONGODB_URI=mongodb://localhost:27017/tipjar

# JWT Secret - Change this!
JWT_SECRET=your-super-secret-key-here

# Blockchain - Add your RPC URL and contract address
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
TIPJAR_FACTORY_ADDRESS=0xYourContractAddress
```

### 3. Start MongoDB

Using Docker:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Or use a cloud MongoDB service (MongoDB Atlas).

### 4. Run the Server

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

The server will start at `http://localhost:5000`

## Verify Installation

Check if the server is running:

```bash
curl http://localhost:5000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-12-28T...",
  "environment": "development"
}
```

## Quick Test

### 1. Request Authentication Nonce

```bash
curl -X POST http://localhost:5000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{"address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"}'
```

### 2. List Content

```bash
curl http://localhost:5000/api/content
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration (DB, blockchain, env)
│   ├── middleware/      # Auth, upload, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Validators and helpers
│   └── server.ts        # Main entry point
├── uploads/             # Uploaded files
├── .env                 # Environment variables
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/nonce` - Get nonce for signing
- `POST /api/auth/verify` - Verify signature and get JWT

### Content
- `POST /api/content/upload` - Create content (auth required)
- `GET /api/content` - List content (with filters)
- `GET /api/content/:id` - Get single content
- `GET /api/content/creator/:address` - Get creator's content

### Likes
- `POST /api/likes/toggle` - Toggle like (auth required)
- `GET /api/likes/count/:contentId` - Get like count
- `GET /api/likes/me/:contentId` - Check if user liked (auth required)

### Comments
- `POST /api/comments` - Create comment (auth required)
- `GET /api/comments/:contentId` - List comments
- `PUT /api/comments/:commentId` - Update comment (auth required)
- `DELETE /api/comments/:commentId` - Delete comment (auth required)

### Media
- `POST /api/media/upload` - Upload file (auth required)

## Content Categories

- `music` - Music tracks
- `podcast` - Podcast episodes
- `article` - Written articles
- `video` - Video content
- `art` - Digital art
- `motivation` - Motivational content
- `business` - Business content
- `education` - Educational content

## Authentication Flow

1. **Request nonce** from `/api/auth/nonce` with wallet address
2. **Sign the message** with your wallet (MetaMask, etc.)
3. **Verify signature** at `/api/auth/verify` to get JWT
4. **Use JWT** in `Authorization: Bearer <token>` header for protected routes

## Common Issues

### MongoDB Connection Failed

**Error:** `Failed to connect to MongoDB`

**Solution:**
- Ensure MongoDB is running: `docker ps`
- Check `MONGODB_URI` in `.env`
- Try: `docker start mongodb`

### Port Already in Use

**Error:** `Port 5000 already in use`

**Solution:**
- Change `PORT` in `.env` to another port (e.g., 5001)
- Or kill the process: `lsof -ti:5000 | xargs kill`

### File Upload Fails

**Error:** `File too large` or `File type not allowed`

**Solution:**
- Check file size limits in `.env`
- Ensure file type is supported (images, audio, video, PDF)

### Blockchain Features Not Working

**Error:** `TIPJAR_FACTORY_ADDRESS not configured`

**Solution:**
- Deploy the TipJar smart contract
- Add contract address to `.env`
- Add RPC URL (Alchemy, Infura, etc.)

## Next Steps

1. ✅ Test authentication flow with a real wallet
2. ✅ Upload some test content
3. ✅ Deploy smart contract and configure blockchain integration
4. ✅ Build the frontend to interact with this API
5. ✅ Set up production environment (PM2, Docker, etc.)

## Documentation

- **Full API Docs:** See `README.md`
- **API Examples:** See `API_EXAMPLES.md`
- **Smart Contract:** See `../contract/tip-jar.sol`

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review API_EXAMPLES.md for usage examples
3. Ensure all environment variables are correctly set

---

**Happy Building! 🚀**
