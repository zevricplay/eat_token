# API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## 🔄 Token Conversion Endpoints

### 1. EAT → JWT Token
**Endpoint:** `POST /convert/eat-to-jwt`

**Request:**
```json
{
  "eat": "850c3ca593e30d3ad0a56a18f854a12e...",
  "region": "ID"
}
```

**Response:**
```json
{
  "success": true,
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "region": "ID"
}
```

---

### 2. EAT → Access Token
**Endpoint:** `POST /convert/eat-to-access`

**Request:**
```json
{
  "eat": "850c3ca593e30d3ad0a56a18f854a12e...",
  "region": "ID"
}
```

**Response:**
```json
{
  "success": true,
  "accessToken": "access_a1b2c3d4e5f6g7h8...",
  "region": "ID",
  "expiresIn": 3600
}
```

---

### 3. Access Token → JWT Token
**Endpoint:** `POST /convert/access-to-jwt`

**Request:**
```json
{
  "accessToken": "access_a1b2c3d4e5f6g7h8...",
  "region": "ID"
}
```

**Response:**
```json
{
  "success": true,
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "region": "ID"
}
```

---

### 4. JWT → EAT Token
**Endpoint:** `POST /convert/jwt-to-eat`

**Request:**
```json
{
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "eat": "850c3ca593e30d3ad0a56a18f854a12e..."
}
```

---

## 🎨 Bio Generation Endpoints

### 5. Generate Bio
**Endpoint:** `POST /bio/generate`

**Request:**
```json
{
  "style": "gaming",
  "length": "long"
}
```

**Styles Available:**
- `gaming` - Gaming theme
- `aesthetic` - Aesthetic theme
- `cool` - Cool theme
- `romantic` - Romantic theme
- `motivational` - Motivational theme
- `stylish` - Stylish theme

**Response:**
```json
{
  "success": true,
  "bio": "🎮 GAMER 🎮 | FF PLAYER | ❤️ GAMING ❤️",
  "preview": "🎮 GAMER 🎮 | FF PLAYER | ❤️ GAMING ❤️"
}
```

---

### 6. Update Bio
**Endpoint:** `POST /bio/update`

**Request:**
```json
{
  "uid": "user123",
  "bio": "🎮 GAMER 🎮 | FF PLAYER",
  "jwtToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "region": "ID"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bio updated successfully",
  "bio": "🎮 GAMER 🎮 | FF PLAYER"
}
```

---

## 📝 History Endpoints

### 7. Save Token to History
**Endpoint:** `POST /history/save`

**Request:**
```json
{
  "uid": "user123",
  "eat": "850c3ca593e30d3ad0a56a18f854a12e...",
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "accessToken": "access_a1b2c3d4e5f6g7h8...",
  "provider": "google",
  "region": "ID"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token saved to history"
}
```

---

### 8. Get User History
**Endpoint:** `GET /history/:uid`

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "eat": "850c3ca593e30d3ad0a56a18f854a12e...",
      "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "accessToken": "access_a1b2c3d4e5f6g7h8...",
      "createdAt": "2024-09-03T10:30:00Z"
    }
  ]
}
```

---

## 🔐 Authentication Endpoints

### 9. Google OAuth
**Endpoint:** `POST /auth/google`

**Request:**
```json
{
  "token": "google_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "user123",
    "email": "user@gmail.com",
    "provider": "google"
  },
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## ✅ Health Check

### 10. Server Health
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "OK",
  "message": "Server running"
}
```

---

## 🔴 Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 📊 Supported Regions

- `ID` - Indonesia
- `IND` - India
- `SG` - Singapore
- `BR` - Brazil
- `TH` - Thailand
- `US` - United States
- `VN` - Vietnam

---

## 🔑 Authentication

All endpoints except `/health` and `/auth/google` require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 Examples

### Using cURL
```bash
# EAT to JWT
curl -X POST http://localhost:5000/api/convert/eat-to-jwt \
  -H "Content-Type: application/json" \
  -d '{
    "eat": "850c3ca593e30d3ad0a56a18f854a12e...",
    "region": "ID"
  }'
```

### Using Fetch API
```javascript
const response = await fetch('http://localhost:5000/api/convert/eat-to-jwt', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    eat: '850c3ca593e30d3ad0a56a18f854a12e...',
    region: 'ID'
  })
});

const data = await response.json();
console.log(data);
```

### Using Python
```python
import requests

response = requests.post(
  'http://localhost:5000/api/convert/eat-to-jwt',
  json={
    'eat': '850c3ca593e30d3ad0a56a18f854a12e...',
    'region': 'ID'
  }
)

print(response.json())
```

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes
- **Response Header:** `X-RateLimit-Remaining`

---

## Version

**Current Version:** 2.0.0

---

**Last Updated:** September 2024
