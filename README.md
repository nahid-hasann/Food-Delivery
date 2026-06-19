# 🍔 QuickBite — Premium Food Delivery Web Application

QuickBite is a state-of-the-art, full-stack food delivery application designed with a **premium dark glassmorphic UI**, fluid CSS-only animations, and seamless order management workflows.

---

## 🌟 Key Features

### 💻 Frontend & User Experience
*   **Premium Glassmorphic UI**: High-end styling using CSS backdrop-filters, custom radial glows, and elegant shadows.
*   **Fluid Animations**: Smooth transitions, card hover scales, slide-ins, and YouTuber-style **Skeleton Loaders** for food items.
*   **Unified Navigation**: Responsive header with instant scrolling to **Features**, **How it Works**, and **About Us** sections on the home page. Includes seamless redirection and scrolling when coming from other pages.
*   **Sliding Shopping Cart**: Elegant sidebar shopping cart showing real-time item count badges and price updates.
*   **Custom Order Cancellation**: Stateful, layout-safe confirmation modal in the "My Orders" screen.
*   **Diner Profiles & Wishlist**: Personalized user accounts, favorite lists, and complete profile management.

### 🛡️ Backend & Management
*   **RESTful API**: Node.js & Express server handling secure authentication, food menus, order state, and validation.
*   **State Machine Validation**: Robust order status lifecycle controls, including direct order cancellation support.
*   **Admin Control Panel**: Advanced dashboard for administrators to create/delete food items, track stats, and manage order statuses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), React Router DOM, Context API, Lucide Icons, Vanilla CSS |
| **Backend** | Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT) |
| **Styling** | Custom styling tokens, glassmorphism shadows, pure CSS Keyframe animations |

---

## 📂 Project Structure

```
Food Delivery/
├── backend/
│   ├── config/            # Database connection configuration
│   ├── controllers/       # Business logic handlers
│   ├── middleware/        # Authentication & admin filters
│   ├── models/            # Mongoose schemas (User, Order, Food)
│   ├── routes/            # Express routing configurations
│   └── server.js          # API entrypoint
└── frontend/
    ├── public/            # Static assets
    └── src/
        ├── assets/        # Stylesheets & variables
        ├── components/    # Reusable UI components (Navbar, Cart, Footer)
        ├── context/       # State management (Auth, Cart, Wishlist, Toast)
        ├── pages/         # Page components (Home, Menu, Profile, Admin)
        └── main.jsx       # React mount point
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local or Atlas cloud database)

### 2. Backend Configuration
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `backend/` folder:
    ```env
    PORT=5005
    MONGO_URI=your_mongodb_connection_uri
    JWT_SECRET=your_jwt_signing_key
    ```
4.  Start the backend server:
    ```bash
    npm start
    ```

### 3. Frontend Configuration
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Important Design Decisions

### ⚡ Pure CSS Animations
To prevent page freezes and asynchronous rendering conflicts (common when using JavaScript-based observers during pagination and tab switching), QuickBite relies entirely on **pure CSS animations** (`@keyframes` and standard classes like `.reveal`, `.reveal-left`, and `.reveal-right`).

### 📦 Coordinate Containment Fixes
Interactive overlays (such as the custom Order Cancellation modal) are positioned in React Fragments outside animated page containers. This prevents viewport alignment bugs caused by parent CSS `transform` configurations, guaranteeing consistent, centered modal rendering.
