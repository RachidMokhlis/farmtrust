# 🌿 FarmTrust by Rashid

Full-stack farm products marketplace with real-time chat, loyalty points, promo countdowns, and an **ad video banner**.

---

## 🚀 Setup

### 1. Backend (server/)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
node index.js
```

### 2. Frontend (client/)

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL and admin user ID
npm start
```

---

## 🎬 Video Ad Feature

### How it works:
1. Login as **admin** → go to `/admin`
2. Click the **🎬 Video** tab
3. Upload any video (MP4, WebM, MOV)
4. The video will appear on the **home page** in **16:9 format** as a prominent ad banner, with autoplay (muted) + controls
5. Visitors can close it with ✕
6. To remove: go back to admin → Video tab → click 🗑 Remove

> ⚠️ In production, replace `localStorage` in `VideoAd.js` with a real server upload endpoint (multer is already set up in the backend).

---

## 🌐 Features

| Feature | Description |
|---|---|
| 🎬 Video Ad | Admin uploads 16:9 video shown on landing |
| 🌍 Multi-language | Arabic, French, English (i18n) |
| 🔐 Auth | JWT, roles: admin / client |
| 🐄 Animals | CRUD with food, health tracking |
| 📦 Products | Linked to animals, with quantity selector |
| 🛒 Cart | Quantity control, order confirmation |
| ⭐ Points | Earned on every purchase |
| 🔥 Promos | Countdown timer |
| 💬 Chat | Real-time with Socket.io |
| 👑 Admin | Full dashboard: animals, products, orders, comments, promos, stats, video |

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, React Router v6, i18next
- **Backend**: Node.js, Express, Socket.io, JWT, Multer
- **Database**: MongoDB Atlas (Mongoose)
- **Hosting**: Railway

---

## 🌐 Deployment (Railway)

1. Push to GitHub
2. Create two Railway services: `server` and `client`
3. Set environment variables in Railway dashboard
4. For client build: `npm run build` → serve with `serve -s build`

---

## 📁 Structure

```
farmtrust/
├── client/          # React frontend
│   └── src/
│       ├── components/   # Navbar, Countdown, VideoAd
│       ├── pages/        # Home, Auth, Products, Cart, Chat, Admin
│       ├── context/      # AuthContext, CartContext
│       ├── services/     # API calls
│       ├── animations/   # AnimatedAnimals
│       └── i18n/         # AR, FR, EN translations
└── server/          # Node.js backend
    ├── models/       # User, Animal, Product, Order, Comment, Promo, Message, Stats
    ├── controllers/
    ├── routes/
    ├── middleware/   # JWT auth
    └── sockets/      # Socket.io chat
```

---

Made with 💚 by Rashid
