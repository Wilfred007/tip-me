# API Testing Examples

This file contains example requests for testing the TipJar Backend API.

## Prerequisites

1. Start MongoDB:
```bash
docker run -d -p 27017:27017 mongo:latest
```

2. Start the backend:
```bash
npm run dev
```

3. Get a wallet and sign messages (use MetaMask or similar)

---

## 1. Authentication Flow

### Step 1: Request Nonce

```bash
curl -X POST http://localhost:5000/api/auth/nonce \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
  }'
```

**Response:**
```json
{
  "nonce": "abc123...",
  "message": "Sign this message to authenticate: abc123..."
}
```

### Step 2: Sign Message with Wallet

Use MetaMask or ethers.js to sign the message:

```javascript
// Frontend example
const message = "Sign this message to authenticate: abc123...";
const signature = await signer.signMessage(message);
```

### Step 3: Verify Signature and Get JWT

```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "signature": "0x..."
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb"
}
```

---

## 2. Media Upload

### Upload a File

```bash
curl -X POST http://localhost:5000/api/media/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/file.mp3"
```

**Response:**
```json
{
  "filename": "1703123456789-abc123.mp3",
  "url": "/uploads/1703123456789-abc123.mp3",
  "mimetype": "audio/mpeg",
  "size": 5242880
}
```

---

## 3. Content Management

### Create Content

```bash
curl -X POST http://localhost:5000/api/content/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "music",
    "title": "My Awesome Song",
    "description": "This is my latest track!",
    "mediaUrl": "/uploads/1703123456789-abc123.mp3",
    "thumbnailUrl": "/uploads/1703123456789-thumb.jpg"
  }'
```

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "creatorAddress": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "category": "music",
  "title": "My Awesome Song",
  "description": "This is my latest track!",
  "mediaUrl": "/uploads/1703123456789-abc123.mp3",
  "thumbnailUrl": "/uploads/1703123456789-thumb.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### List All Content

```bash
curl http://localhost:5000/api/content
```

### Filter by Category

```bash
curl "http://localhost:5000/api/content?category=music&page=1&limit=10"
```

### Filter by Creator

```bash
curl "http://localhost:5000/api/content?creator=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
```

### Get Single Content

```bash
curl http://localhost:5000/api/content/65a1b2c3d4e5f6g7h8i9j0k1
```

---

## 4. Likes

### Toggle Like

```bash
curl -X POST http://localhost:5000/api/likes/toggle \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "65a1b2c3d4e5f6g7h8i9j0k1"
  }'
```

**Response:**
```json
{
  "liked": true,
  "message": "Content liked"
}
```

### Get Like Count

```bash
curl http://localhost:5000/api/likes/count/65a1b2c3d4e5f6g7h8i9j0k1
```

**Response:**
```json
{
  "contentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "count": 42
}
```

### Check User Like Status

```bash
curl http://localhost:5000/api/likes/me/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "contentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "liked": true
}
```

---

## 5. Comments

### Create Comment

```bash
curl -X POST http://localhost:5000/api/comments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "text": "Great content! Love it!"
  }'
```

**Response:**
```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
  "contentId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "address": "0x742d35cc6634c0532925a3b844bc9e7595f0beb",
  "text": "Great content! Love it!",
  "deleted": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### List Comments

```bash
curl "http://localhost:5000/api/comments/65a1b2c3d4e5f6g7h8i9j0k1?page=1&limit=50"
```

### Update Comment

```bash
curl -X PUT http://localhost:5000/api/comments/65a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Updated comment text"
  }'
```

### Delete Comment

```bash
curl -X DELETE http://localhost:5000/api/comments/65a1b2c3d4e5f6g7h8i9j0k2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 6. Health Check

```bash
curl http://localhost:5000/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

---

## Testing with JavaScript/TypeScript

### Example: Complete Authentication Flow

```typescript
import { ethers } from 'ethers';

async function authenticate(walletAddress: string, signer: ethers.Signer) {
  // 1. Request nonce
  const nonceRes = await fetch('http://localhost:5000/api/auth/nonce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: walletAddress })
  });
  const { nonce, message } = await nonceRes.json();

  // 2. Sign message
  const signature = await signer.signMessage(message);

  // 3. Verify and get JWT
  const verifyRes = await fetch('http://localhost:5000/api/auth/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: walletAddress, signature })
  });
  const { token } = await verifyRes.json();

  return token;
}

// Usage
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const address = await signer.getAddress();
const jwt = await authenticate(address, signer);
console.log('JWT:', jwt);
```

### Example: Upload Content

```typescript
async function uploadContent(jwt: string, contentData: any) {
  const res = await fetch('http://localhost:5000/api/content/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify(contentData)
  });
  return await res.json();
}

// Usage
const content = await uploadContent(jwt, {
  category: 'music',
  title: 'My Song',
  description: 'Check this out!',
  mediaUrl: '/uploads/song.mp3',
  thumbnailUrl: '/uploads/thumb.jpg'
});
```

---

## Notes

- Replace `YOUR_JWT_TOKEN` with the actual JWT from authentication
- Replace content IDs with actual IDs from your database
- All authenticated endpoints require the `Authorization: Bearer <token>` header
- File uploads use `multipart/form-data`, other endpoints use `application/json`
