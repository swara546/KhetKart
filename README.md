# 🌱 KhetKart — Farm to Vendor Marketplace

KhetKart is a direct farm-to-vendor marketplace built for Indian agriculture. It eliminates middlemen by connecting farmers directly with vendors — farmers earn more, vendors pay less.

---

## 🚀 Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React + Vite + Tailwind CSS          |
| Backend    | Node.js + Express.js                 |
| Database   | MongoDB Atlas                        |
| Auth       | JWT (JSON Web Tokens)                |
| AI Chatbot | Groq API (LLaMA 3.1)                 |

---

## 📁 Project Structure

```
khetkart/
├── khetkart-frontend/       # React frontend
│   ├── src/
│   │   ├── api/             # axios instance
│   │   ├── components/      # Navbar, Footer, KhetBot, ProtectedRoute
│   │   ├── context/         # AuthContext
│   │   └── pages/           # Home, Products, Cart, Login, Register,
│   │                        # FarmerDashboard, OrderHistory
│   └── .env                 # frontend env (Vite)
│
└── khetkart-backend/        # Node.js backend
    ├── config/              # MongoDB connection
    ├── middleware/          # auth middleware
    ├── models/              # User, Product, Order
    ├── routes/              # auth, products, orders, farmer, ai
    ├── server.js
    └── .env                 # backend env (never commit this!)
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or above
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
- A [Groq](https://console.groq.com/) account for AI chatbot (free)

---

## 📥 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vidhisonani/khetkart.git
cd khetkart
```

---

### 2. Backend Setup

```bash
cd khetkart-backend
npm install
```

#### Create `.env` file in `khetkart-backend/`:

```bash
# Create the file
touch .env
```

Add the following variables to `.env`:

```env
# MongoDB Atlas connection string
# Get from: MongoDB Atlas → Your Cluster → Connect → Drivers
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/khetkart?retryWrites=true&w=majority

# JWT Secret — any long random string (used to sign auth tokens)
JWT_SECRET=your_super_secret_key_here_make_it_long

# Groq API key for KhetBot AI assistant
# Get from: https://console.groq.com → API Keys → Create Key
GROQ_API_KEY=gsk_your_groq_api_key_here

# Port (optional, defaults to 5000)
PORT=5000
```

#### Start the backend:

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Atlas connected successfully
```

---

### 3. Frontend Setup

Open a new terminal:

```bash
cd khetkart-frontend
npm install
```

#### Start the frontend:

```bash
npm run dev
```

Frontend will be running at: **http://localhost:5173**

> The frontend is pre-configured to connect to `http://localhost:5000`. Make sure your backend is running before starting the frontend.

---

## 🔑 Getting API Keys

### MongoDB Atlas (Database)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account → Create a free cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. Replace `<username>` and `<password>` with your Atlas credentials
5. Add `khetkart` as the database name in the URI

### Groq API (AI Chatbot)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free (no credit card needed)
3. Go to **API Keys** → **Create API Key**
4. Copy the key starting with `gsk_...`
5. Paste it as `GROQ_API_KEY` in your backend `.env`

---

## 🛡️ .gitignore Setup

Make sure `.env` files are never pushed to GitHub.

#### `khetkart-backend/.gitignore`:
```
node_modules
.env
```

#### `khetkart-frontend/.gitignore`:
```
node_modules
dist
```

> ⚠️ **Never commit your backend `.env` file.** It contains your MongoDB URI, JWT secret, and API keys that others can misuse.

---

## 👥 User Roles

| Role       | What they can do                                      |
|------------|-------------------------------------------------------|
| 🧑‍🌾 Farmer  | List crops, manage listings, update order status      |
| 🏪 Vendor  | Browse crops, add to cart, place orders, view history |

### Test Accounts (after seeding)

You can register directly from the app at `/register`. Choose your role during signup.

---

## 📡 API Endpoints

| Method | Endpoint                    | Description                  | Access       |
|--------|-----------------------------|------------------------------|--------------|
| POST   | `/api/auth/register`        | Register new user            | Public       |
| POST   | `/api/auth/login`           | Login and get JWT token      | Public       |
| GET    | `/api/products`             | Get all crop listings        | Public       |
| POST   | `/api/products`             | List a new crop              | Farmer only  |
| PUT    | `/api/products/:id`         | Edit a crop listing          | Farmer only  |
| DELETE | `/api/products/:id`         | Remove a crop listing        | Farmer only  |
| POST   | `/api/orders`               | Place an order               | Vendor only  |
| GET    | `/api/orders/mine`          | Get my orders                | Vendor only  |
| PATCH  | `/api/orders/:id/status`    | Update order status          | Farmer only  |
| GET    | `/api/farmer/products`      | Get farmer's own listings    | Farmer only  |
| GET    | `/api/farmer/orders`        | Get orders for farmer's crops| Farmer only  |
| POST   | `/api/ai/chat`              | KhetBot AI chat              | All users    |

---

## ✨ Features

- 🌾 **Farmer Dashboard** — list, edit, delete crops; manage incoming orders
- 🏪 **Vendor Experience** — browse, filter, search crops; cart; order history
- 📦 **Order Status Tracking** — pending → confirmed → shipped → delivered
- 🤖 **KhetBot AI** — role-aware farming assistant (different for farmers vs vendors)
- 🔒 **Protected Routes** — role-based access control on all routes
- 🗂️ **Category Filters** — Grains, Vegetables, Fruits, Pulses
- 📱 **Responsive** — works on mobile and desktop

---

## 🧑‍💻 Authors

Built as a college project for Design Engineering (Semester 6).

---

## 📄 License

This project is for educational purposes only.
