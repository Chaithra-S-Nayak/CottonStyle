
# Tshirt Galaxy

Tshirt Galaxy is an e-commerce platform specializing in T-shirt sales, built using the MERN stack.

## Website

Live at: [Tshirt Galaxy](https://tshirtgalaxy.vercel.app)

## Features

- Browse and purchase a variety of T-shirts
- Secure payments with Razorpay
- User authentication with JWT
- Image uploads with Cloudinary
- Order tracking and management

## Tech Stack

- **Frontend:** React, Redux, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB
- **Deployment:** Vercel

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/Chaithra-S-Nayak/TshirtGalaxy.git
cd TshirtGalaxy
```

### 2. Backend setup:

- Navigate to the `backend` folder:

```bash
cd backend
```

- Install the dependencies:

```bash
npm install
```

- Create a `config` folder and an `.env` file with the following credentials:

```
PORT=8000
NODE_ENV=development
DB_URL="your_mongo_db_url"

JWT_SECRET_KEY="your_jwt_secret_key"
JWT_EXPIRES="your_jwt_expiration_time"
ACTIVATION_SECRET="your_activation_secret"

SMTP_SERVICE="your_smtp_service"
SMTP_HOST="your_smtp_host"
SMTP_PORT="your_smtp_port"
SMTP_PASSWORD="your_smtp_password"
SMTP_MAIL="your_smtp_mail"

RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_SECRET="your_razorpay_secret"

CLOUDINARY_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

COOKIE_EXPIRES_TIME="your_cookie_expires_time"
```

- Run the backend server:

```bash
npm run dev
```

### 3. Frontend setup:

- Open a second terminal and navigate to the `frontend` folder:

```bash
cd frontend
```

- Install the dependencies:

```bash
npm install
```

- Run the frontend server:

```bash
npm run dev
```

## Running the Application

Make sure both the frontend and backend are running. The backend should be running on `http://localhost:8000` and the frontend should be accessible at `http://localhost:3000`.
