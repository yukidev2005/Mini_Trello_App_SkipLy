# 🚀 Skipli Trello API — Backend

> REST API cho ứng dụng quản lý dự án dạng Trello clone, xây dựng bằng **Node.js + Express + TypeScript + Firebase Firestore**.

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tech Stack](#-tech-stack)
- [Kiến trúc dự án](#-kiến-trúc-dự-án)
- [Yêu cầu môi trường](#-yêu-cầu-môi-trường)
- [Cài đặt & Chạy](#-cài-đặt--chạy)
- [Biến môi trường](#-biến-môi-trường)
- [API Documentation](#-api-documentation)
- [Xác thực (Authentication)](#-xác-thực-authentication)
- [Danh sách API Endpoints](#-danh-sách-api-endpoints)
- [Socket.IO Events](#-socketio-events)
- [Cấu trúc Response](#-cấu-trúc-response)
- [Error Handling](#-error-handling)

---

## 🌟 Tổng quan

Skipli Trello API cung cấp backend cho một ứng dụng quản lý công việc theo mô hình Kanban board, bao gồm:

- **Quản lý Board/Card/Task** theo mô hình phân cấp
- **Xác thực OTP** qua email (không cần password)
- **Phân quyền** dựa trên JWT
- **Thời gian thực** qua Socket.IO
- **Tích hợp GitHub** để đính kèm PR/Issue vào task
- **Mời thành viên** vào board/card

---

## 🛠 Tech Stack

| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| Node.js | ≥ 18 | Runtime |
| Express | ^5.2.1 | Web framework |
| TypeScript | ^5.9.3 | Type safety |
| Firebase Admin | ^14.2.0 | Firestore database |
| Socket.IO | ^4.8.3 | Real-time events |
| JWT (jsonwebtoken) | ^9.0.3 | Xác thực token |
| Nodemailer | ^9.0.4 | Gửi email OTP |
| Zod | ^4.4.3 | Validation schema |
| swagger-ui-express | ^5.0.1 | API docs UI |
| Nodemon | ^3.1.14 | Dev hot-reload |

---

## 📁 Kiến trúc dự án

```
server/
├── src/
│   ├── index.ts                # Entry point — khởi tạo app, middlewares, routes
│   ├── type.d.ts               # Global type declarations
│   │
│   ├── configs/
│   │   └── swaggerConfig.ts    # Cấu hình Swagger UI
│   │
│   ├── constants/              # Hằng số (OTP expiry, ...)
│   │
│   ├── middlewares/
│   │   └── authorization.ts    # JWT middleware xác thực Bearer token
│   │
│   ├── res/                    # Resources (modules theo domain)
│   │   ├── auth/               # Đăng ký, đăng nhập, gửi OTP
│   │   ├── board/              # CRUD board
│   │   ├── card/               # CRUD card (column trong board)
│   │   ├── task/               # CRUD task
│   │   ├── invite/             # Mời thành viên vào board/card
│   │   ├── assign/             # Phân công task cho thành viên
│   │   └── github/             # Tích hợp GitHub API
│   │
│   ├── socket/
│   │   └── card-socket.ts      # Xử lý Socket.IO events
│   │
│   ├── swagger/
│   │   └── swagger.yaml        # OpenAPI 3.0 specification
│   │
│   └── utils/
│       ├── error-handler.ts    # Global error handler middleware
│       ├── http-error.ts       # Helper tạo HTTP error
│       ├── transporter.ts      # Nodemailer transporter
│       ├── email-template.ts   # HTML template OTP email
│       └── index.ts            # Utilities (generateOtp, ...)
│
├── .env                        # Biến môi trường (không commit)
├── .env.example                # Template biến môi trường
├── nodemon.json                # Cấu hình nodemon
├── tsconfig.json               # TypeScript config
├── eslint.config.mjs           # ESLint config
└── package.json
```

### Cấu trúc mỗi module (ví dụ: `board/`)

```
board/
├── board.route.ts       # Định nghĩa routes
├── board.controller.ts  # Xử lý request/response
├── board.service.ts     # Business logic + Firestore queries
├── board.schema.ts      # Zod validation schemas
└── board.interface.ts   # TypeScript interfaces
```

---

## 📦 Yêu cầu môi trường

- **Node.js** >= 18.x
- **npm** >= 9.x (hoặc **bun** >= 1.x)
- **Firebase project** với Firestore enabled
- **Gmail account** (hoặc SMTP) để gửi OTP email
- *(Tùy chọn)* **GitHub Personal Access Token** để dùng tính năng GitHub integration

---

## 🚀 Cài đặt & Chạy

### 1. Clone và cài dependencies

```bash
cd server
npm install
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
# Chỉnh sửa .env với các giá trị thực
```

### 3. Cấu hình Firebase

Tải file service account JSON từ Firebase Console:
> Firebase Console → Project Settings → Service Accounts → Generate new private key

Đặt file vào: `src/firebase-service-account.json`

### 4. Chạy development server

```bash
npm run dev
```

Server khởi động tại: `http://localhost:3000`
Socket.IO server tại: `http://localhost:3636`

### 5. Build production

```bash
npm run build
npm start
```

---

## 🔐 Biến môi trường

Tạo file `.env` dựa trên `.env.example`:

```env
# Server
PORT=3000

# JWT
JWT_SECRETKEY=your_super_secret_jwt_key_here
AUTH_CODE=your_auth_code_here

# Email (Gmail SMTP)
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password

# OTP
OTP_EXPIRES_MINUTES=5
```

> **Lưu ý**: Với Gmail, cần bật **2-Factor Authentication** và tạo **App Password** thay vì dùng mật khẩu thông thường.

---

## 📖 API Documentation

Sau khi khởi động server, truy cập Swagger UI tại:

```
http://localhost:3000/swagger
```

Swagger UI cung cấp:
- Danh sách đầy đủ tất cả endpoints
- Request/Response schemas
- Khả năng test API trực tiếp trên browser
- Ví dụ cho từng endpoint

---

## 🔑 Xác thực (Authentication)

API sử dụng **JWT Bearer Token** + **OTP qua email** (Passwordless Authentication).

### Flow đăng ký

```
POST /auth/signup { email }
  → Hệ thống tạo user + gửi OTP 6 số đến email
  → OTP có hiệu lực 5 phút
```

### Flow đăng nhập

```
POST /auth/send-code { email }   ← Gửi OTP (nếu cần)
POST /auth/signin { email, verificationCode }
  → Trả về { accessToken, userId, email, ... }
```

### Dùng token

Thêm header vào mọi request (trừ Auth endpoints):

```
Authorization: Bearer <accessToken>
```

---

## 📡 Danh sách API Endpoints

### 🔐 Auth (`/auth`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `POST` | `/auth/signup` | Đăng ký tài khoản, gửi OTP | ❌ |
| `POST` | `/auth/send-code` | Gửi lại OTP | ❌ |
| `POST` | `/auth/signin` | Đăng nhập bằng OTP | ❌ |

### 📋 Board (`/boards`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `GET` | `/boards` | Lấy tất cả boards | ✅ |
| `POST` | `/boards` | Tạo board mới | ✅ |
| `GET` | `/boards/:id` | Lấy board theo ID | ✅ |
| `PUT` | `/boards/:id` | Cập nhật board (owner only) | ✅ |
| `DELETE` | `/boards/:id` | Xóa board + cascade (owner only) | ✅ |
| `GET` | `/boards/:boardId/members` | Lấy thành viên của board | ✅ |

### 🗂 Card (`/boards/:boardId/cards`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `GET` | `/boards/:boardId/cards` | Lấy tất cả cards trong board | ✅ |
| `POST` | `/boards/:boardId/cards` | Tạo card mới | ✅ |
| `GET` | `/boards/:boardId/cards/:cardId` | Lấy card theo ID | ✅ |
| `PUT` | `/boards/:boardId/cards/:cardId` | Cập nhật card | ✅ |
| `DELETE` | `/boards/:boardId/cards/:cardId` | Xóa card | ✅ |
| `GET` | `/boards/:boardId/cards/user/:userId` | Lấy cards của user | ✅ |
| `GET` | `/boards/:boardId/cards/:cardId/members` | Lấy thành viên của card | ✅ |

### ✉️ Invite

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `POST` | `/boards/:boardId/invite` | Mời thành viên vào board | ✅ |
| `POST` | `/boards/:boardId/cards/:cardId/invite/accept` | Phản hồi lời mời | ✅ |

### ✅ Task (`/boards/:boardId/cards/:cardId/tasks`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `GET` | `.../tasks` | Lấy tất cả tasks trong card | ✅ |
| `POST` | `.../tasks` | Tạo task mới | ✅ |
| `GET` | `.../tasks/:taskId` | Lấy task theo ID | ✅ |
| `PUT` | `.../tasks/:taskId` | Cập nhật task (owner only) | ✅ |
| `DELETE` | `.../tasks/:taskId` | Xóa task (owner only) | ✅ |

### 👥 Assign (`/boards/:boardId/cards/:cardId/tasks/:taskId/assign`)

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `GET` | `.../assign` | Lấy danh sách được phân công | ✅ |
| `POST` | `.../assign` | Phân công thành viên | ✅ |
| `DELETE` | `.../assign` | Hủy phân công | ✅ |

### 🐙 GitHub

| Method | Endpoint | Mô tả | Auth Required |
|--------|----------|-------|:---:|
| `GET` | `/repositories/:repositoryId/github-info` | Lấy info repo GitHub | ✅ + GitHub Token |
| `POST` | `.../tasks/:taskId/github-attach` | Đính kèm PR/Issue vào task | ✅ |
| `DELETE` | `.../tasks/:taskId/github-attach` | Xóa đính kèm GitHub | ✅ |

> **GitHub repositoryId format**: `{owner}_{repoName}` — dùng dấu `_` thay cho `/`
> Ví dụ: `octocat_Hello-World` → `github.com/octocat/Hello-World`

---

## ⚡ Socket.IO Events

Socket server chạy trên port **3636**.

### Client → Server

| Event | Payload | Mô tả |
|-------|---------|-------|
| `join-board` | `boardId: string` | Tham gia room của board để nhận updates |
| `leave-board` | `boardId: string` | Rời khỏi room của board |

### Server → Client

| Event | Payload | Mô tả |
|-------|---------|-------|
| `new-card` | `boardId, cardData` | Phát khi có card/board mới được tạo |

### Ví dụ kết nối (client-side)

```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:3636')

// Tham gia room board
socket.emit('join-board', 'board123')

// Lắng nghe board updates
socket.on('new-card', (data) => {
  console.log('New card created:', data)
})
```

---

## 📦 Cấu trúc Response

### Success Response

```json
{
  "message": "Success",
  "data": { ... },
  "statusCode": 200,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/boards"
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation error message"
}
```

---

## ⚠️ Error Handling

| Status Code | Ý nghĩa |
|-------------|---------|
| `400` | Bad Request — Dữ liệu đầu vào không hợp lệ (Zod validation) |
| `401` | Unauthorized — Thiếu hoặc token không hợp lệ/hết hạn |
| `403` | Forbidden — Không có quyền (ví dụ: không phải owner) |
| `404` | Not Found — Không tìm thấy tài nguyên |
| `409` | Conflict — Tài nguyên đã tồn tại (email đã đăng ký, đã attach GitHub) |
| `500` | Internal Server Error — Lỗi server |

---

## 🧹 Scripts

```bash
npm run dev          # Chạy development với hot-reload (nodemon)
npm run build        # Build TypeScript → JavaScript (dist/)
npm run start        # Chạy production build
npm run lint         # Kiểm tra ESLint
npm run lint:fix     # Tự động fix ESLint errors
npm run prettier     # Kiểm tra code format
npm run prettier:fix # Tự động format code
```

---

## 🗄️ Firestore Collections

| Collection | Mô tả |
|------------|-------|
| `users` | Tài khoản người dùng |
| `boards` | Boards/workspaces |
| `cards` | Cards (columns) trong board |
| `tasks` | Tasks trong card |
| `invites` | Lời mời thành viên |
| `assigns` | Phân công task |
| `attachs` | GitHub attachments của task |

---

## 👤 Tác giả

**Yuki Dev** — yukidev2005@gmail.com

---

*License: MIT*
