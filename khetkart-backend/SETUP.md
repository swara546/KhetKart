# KhetKart Backend — Setup Guide
## (MongoDB Atlas + Node.js)

---

## Step 1 — Get your MongoDB Atlas connection string

1. Go to https://www.mongodb.com/cloud/atlas and **Sign Up** (free)
2. Click **"Build a Database"** → choose **M0 Free** → any region → Create
3. Create a **username and password** (remember these!)
4. Under **"Network Access"** → Add IP Address → click **"Allow access from anywhere"** (0.0.0.0/0)
5. Go to **"Database"** → click **"Connect"** → **"Connect your application"**
6. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2 — Set up the .env file

Open `khetkart-backend/.env` and fill in your values:

```
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/khetkart?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_like_this_khetkart2024
PORT=5000
```

> ⚠️ Replace `youruser` and `yourpassword` with your Atlas credentials
> ⚠️ Notice we added `/khetkart` before the `?` — this is your database name

---

## Step 3 — Install and run

Open terminal inside `khetkart-backend/` folder:

```bash
npm install
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Atlas connected successfully
```

---

## Step 4 — Test it's working

Open your browser and visit:
```
http://localhost:5000/api/health
```
You should see: `{ "status": "✅ KhetKart backend is running!" }`

---

## Step 5 — Connect frontend

In `khetkart-frontend/src/api/axios.js`:
```js
import axios from "axios";
export default axios.create({ baseURL: "http://localhost:5000" });
```

Then in each page, uncomment the axios calls and remove the dummy data.

---

## API Reference

### Auth
| Method | Route | Body | Protected |
|--------|-------|------|-----------|
| POST | `/api/auth/register` | `{ name, mobile, village, role, password }` | No |
| POST | `/api/auth/login` | `{ mobile, password }` | No |

### Products
| Method | Route | Body | Protected |
|--------|-------|------|-----------|
| GET | `/api/products` | — | No |
| GET | `/api/products?category=Seeds&search=wheat&sort=price-asc` | — | No |
| GET | `/api/products/:id` | — | No |
| POST | `/api/products` | `{ name, price, category, description, unit, stock, brand, image }` | Seller only |
| PUT | `/api/products/:id` | any fields to update | Seller only |
| DELETE | `/api/products/:id` | — | Seller only |

### Orders
| Method | Route | Body | Protected |
|--------|-------|------|-----------|
| POST | `/api/orders` | `{ items, subtotal, delivery, total }` | Customer |
| GET | `/api/orders/mine` | — | Customer |

### Seller
| Method | Route | Protected |
|--------|-------|-----------|
| GET | `/api/seller/products` | Seller only |
| GET | `/api/seller/orders` | Seller only |

---

## Folder Structure
```
khetkart-backend/
├── config/
│   └── db.js            ← MongoDB connection
├── middleware/
│   └── auth.js          ← JWT token checker
├── models/
│   ├── User.js          ← User schema
│   ├── Product.js       ← Product schema
│   └── Order.js         ← Order schema
├── routes/
│   ├── auth.js          ← Login & Register
│   ├── products.js      ← Product CRUD
│   ├── orders.js        ← Place & view orders
│   └── seller.js        ← Seller dashboard
├── .env                 ← Your secrets (never push to GitHub!)
├── .gitignore           ← Ignores node_modules and .env
├── package.json
└── server.js            ← App entry point
```
