# Real-Time Chat Application

A **fully responsive real-time messaging platform** built with modern technologies, supporting both **one-to-one and group conversations** with live updates, typing indicators, message lazy loading, and more. This platform is designed for seamless and secure communication, suitable for high-traffic environments.

## **Features**

- **Real-time secure chat:**  
  One-to-one and group conversations with instant message delivery powered by Socket.io.
- **Typing indicators:**  
  See when other users are typing in real time.
- **Scroll to load previous messages:**  
  Lazy loading for efficient fetching and smooth performance.
- **User experience:**  
  Optimized for speed, scalability, and real-world usability.

---

## **Tech Stack**

**Frontend:**
- React
- Redux
- TypeScript
- Vite

**Backend:**
- Node.js
- Express.js
- Mongoose (MongoDB)
- Socket.io
- TypeScript

---

## **Monorepo Structure**

```
chat-app-frontend/
  # Frontend React code
chat-app-server/
  # Backend Node.js/Express.js code
```

---

## **Environment Variables**

### **Backend (`chat-app-server/.env`):**
```
PORT=5000
MONGO_URL=your_mongodb_connection_string

NODE_ENV=development

JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

JWT_ACCESS_EXPIRES_IN=86400
JWT_REFRESH_EXPIRES_IN=31540000
```

### **Frontend (`chat-app-frontend/.env`):**
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_WEBSOCKET_URL=http://localhost:5000
VITE_IMAGE_HOSTING_KEY=your_imagebb_api_key
```

---

## **Getting Started**

### 1. **Clone the repository**

```bash
git clone https://github.com/MdSaifulIslamRafsan/chat-website.git
cd chat-app-frontend or cd chat-app-server
```

### 2. **Install dependencies**

- **Backend:**
    ```bash
    cd chat-app-server
    npm install
    ```
- **Frontend:**
    ```bash
    cd chat-app-frontend
    npm install
    ```

### 3. **Setup environment variables**

Create `.env` files as described above in both `chat-app-server` and `chat-app-frontend` folders.

### 4. **Run the Backend Server**

```bash
cd chat-app-server
npm run start:dev
```

Backend will be running on: `http://localhost:5000`

### 5. **Run the Frontend Dev Server**

```bash
cd chat-app-frontend
npm run dev
```

Frontend will be running on: typically `http://localhost:5173`  

