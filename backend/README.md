# TipJar Creator Backend

A Web3-native, non-custodial backend system for creator content management with wallet-based authentication and on-chain tipping integration.

## Features

✅ **Wallet Authentication** - Passwordless login using EIP-191 signature verification  
✅ **Content Management** - Upload and manage categorized content  
✅ **Social Features** - Likes and comments with wallet-based identity  
✅ **Media Storage** - File upload handling with validation  
✅ **Blockchain Integration** - Read-only integration with TipJar smart contracts  
✅ **JWT Sessions** - Stateless authentication with 7-day token expiration  

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB
- **Blockchain**: Ethers.js v6
- **Authentication**: JWT + EIP-191 signatures

## Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/tipjar

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Blockchain
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
CHAIN_ID=11155111
TIPJAR_FACTORY_ADDRESS=0x...

# File Upload
MAX_FILE_SIZE=52428800
MAX_THUMBNAIL_SIZE=10485760
UPLOAD_DIR=uploads

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Running the Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## API Endpoints

### Authentication

#### Request Nonce
```http
POST /api/auth/nonce
Content-Type: application/json

{
  "address": "0x..."
}
```

#### Verify Signature
```http
POST /api/auth/verify
Content-Type: application/json

{
  "address": "0x...",
  "signature": "0x..."
}
```

### Content

#### Upload Content
```http
POST /api/content/upload
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "music",
  "title": "My Song",
  "description": "Description...",
  "mediaUrl": "/uploads/file.mp3",
  "thumbnailUrl": "/uploads/thumb.jpg"
}
```

#### List Content
```http
GET /api/content?page=1&limit=20&category=music&creator=0x...
```

#### Get Single Content
```http
GET /api/content/:id
```

### Likes

#### Toggle Like
```http
POST /api/likes/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentId": "..."
}
```

#### Get Like Count
```http
GET /api/likes/count/:contentId
```

#### Check User Like Status
```http
GET /api/likes/me/:contentId
Authorization: Bearer <token>
```

### Comments

#### Create Comment
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "contentId": "...",
  "text": "Great content!"
}
```

#### List Comments
```http
GET /api/comments/:contentId?page=1&limit=50
```

#### Update Comment
```http
PUT /api/comments/:commentId
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated comment"
}
```

#### Delete Comment
```http
DELETE /api/comments/:commentId
Authorization: Bearer <token>
```

### Media

#### Upload File
```http
POST /api/media/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <binary>
```

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

1. **Request Nonce**: Frontend calls `/api/auth/nonce` with wallet address
2. **Sign Message**: User signs the nonce with their wallet
3. **Verify Signature**: Frontend sends signature to `/api/auth/verify`
4. **Receive JWT**: Backend verifies signature and returns JWT token
5. **Authenticated Requests**: Include JWT in `Authorization: Bearer <token>` header

## Database Schema

### Content
```typescript
{
  creatorAddress: string,
  category: enum,
  title: string,
  description?: string,
  mediaUrl: string,
  thumbnailUrl?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Like
```typescript
{
  contentId: ObjectId,
  address: string,
  createdAt: Date
}
```

### Comment
```typescript
{
  contentId: ObjectId,
  address: string,
  text: string,
  deleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ Nonce-based authentication prevents replay attacks
- ✅ JWT expiration enforcement
- ✅ No private keys stored
- ✅ No custody of user funds
- ✅ Input validation and sanitization
- ✅ File upload size limits
- ✅ CORS configuration

## Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Build TypeScript
npm run build

# Lint code
npm run lint
```

## License

MIT
