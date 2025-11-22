# Tech Solutions - Your Problem Solver

A full-stack web application for providing technical project solutions to students and professionals. Built with React frontend and Express/MongoDB backend.

## 🚀 Features

- **User Authentication**: Secure login system with JWT tokens
- **Role-Based Access**: Separate dashboards for clients and administrators
- **Project Management**: Browse and purchase technical solutions
- **Order Tracking**: Real-time order status updates
- **Responsive Design**: Beautiful UI with Tailwind CSS and Framer Motion
- **RESTful API**: Well-structured backend with Express.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd techsolutions-backend
```

### 2. Install Dependencies

Install backend dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/techsolutions
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:3000
```

Create a `.env.local` file in the `frontend` directory:
```bash
cd frontend
cp .env.example .env.local
```

Update `frontend/.env.local`:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Database Setup

If using local MongoDB, make sure MongoDB is running:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

Seed the database with initial data:
```bash
# The backend will automatically seed data on first run
# Or manually trigger it by visiting: http://localhost:5000/api/seed
```

## 🚀 Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 👤 Default Credentials

### Admin Account
- Email: `admin@techsolutions.com`
- Password: `admin123`

### Test Client Account
You can create a client account through the signup form, or use the admin credentials to access the admin dashboard.

## 📁 Project Structure

```
techsolutions-backend/
├── frontend/                 # React frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── services/        # API service layer
│   │   │   └── api.js       # API client
│   │   ├── App.jsx          # Main application component
│   │   ├── App.css          # Application styles
│   │   └── index.js         # Entry point
│   ├── package.json
│   └── .env.example
├── server.js                # Express server
├── package.json             # Backend dependencies
├── .env.example             # Environment template
└── README.md                # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project (Admin only)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (Admin only)

### Utility
- `GET /api/health` - Health check
- `POST /api/seed` - Seed database with initial data

## 🎨 Technologies Used

### Frontend
- React 18
- Tailwind CSS
- Framer Motion
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing

## 📦 Building for Production

### Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### Run Production Server
```bash
NODE_ENV=production npm start
```

The production server will serve the React build files and API from the same port.

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for various platforms.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📧 Contact

For questions or support, please contact: contact@techsolutions.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB for the database solution
- All contributors and users of this project
