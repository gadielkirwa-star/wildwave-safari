# 🦁 WildWave Safaris - Complete Safari Booking Platform

Premium East African safari booking platform with admin dashboard and real-time booking management.

## ✨ Features

### Frontend (Customer-Facing)
- 🏠 Beautiful homepage with hero section
- 🗺️ 35+ safari destinations across Kenya, Tanzania, Uganda & Rwanda
- 📦 6 curated safari packages with pricing
- 📝 Contact form with real-time submission
- 📱 Fully responsive design
- 🎨 Safari-themed design system
- 💬 WhatsApp integration

### Admin Dashboard
- 📊 Real-time analytics dashboard
- 📋 Booking management system
- 🗺️ Destination CRUD operations
- 💬 Enquiry management
- 🔐 JWT authentication
- 📈 Revenue tracking

### Backend API
- 🔒 Secure authentication with JWT
- 🗄️ PostgreSQL database
- 🚀 RESTful API endpoints
- ⚡ Real-time updates with Socket.IO
- 🛡️ Rate limiting & security
- 📧 Email notifications (ready)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Root (Frontend)
npm install

# Backend
cd backend && npm install

# Admin
cd ../admin && npm install
```

### 2. Setup Database
```bash
cd backend
./setup-db.sh
```

### 3. Start All Services
```bash
cd ..
./start-all.sh
```

**Access Points:**
- Frontend: http://localhost:8080
- Backend: http://localhost:5000
- Admin: http://localhost:3000

**Admin Login:**
- Email: admin@wildwavesafaris.com
- Password: admin123

## 📁 Project Structure

```
savanna-vision-craft/
├── src/                    # Frontend React app
│   ├── pages/             # Route pages
│   ├── components/        # UI components
│   └── assets/            # Images
├── backend/               # Express API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, validation
│   │   └── config/       # Database config
│   └── db/               # Migrations & seeds
├── admin/                 # Next.js admin dashboard
│   └── src/app/          # Admin pages
└── public/               # Static assets
```

## 🔌 API Endpoints

### Public
- `GET /api/public/destinations` - List destinations
- `POST /api/public/bookings` - Submit booking
- `POST /api/public/enquiries` - Contact form

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Admin (Protected)
- `GET /api/admin/dashboard` - Stats
- `GET /api/admin/bookings` - Bookings
- `GET /api/admin/destinations` - Destinations
- `GET /api/admin/enquiries` - Enquiries
- `GET /api/admin/analytics` - Analytics

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- shadcn/ui

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Socket.IO
- bcrypt

**Admin:**
- Next.js 14
- TypeScript
- Recharts
- Axios

## 📊 Database Schema

- **users** - Authentication & roles
- **destinations** - Safari locations
- **bookings** - Customer bookings
- **enquiries** - Contact submissions
- **safari_packages** - Tour packages
- **testimonials** - Reviews
- **blog_posts** - Content
- **admin_logs** - Audit trail

## 🔐 Security

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 req/15min)
- CORS configuration
- Input validation
- SQL injection prevention

## 📦 Deployment

### Frontend (Vercel)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
# Set environment variables
# Run migrations
npm start
```

### Admin (Vercel)
```bash
cd admin
npm run build
# Deploy
```

## 🧪 Testing

```bash
# Test backend
curl http://localhost:5000/health

# Test destinations API
curl http://localhost:5000/api/public/destinations

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wildwavesafaris.com","password":"admin123"}'
```

## 📝 Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/wild_waves_safaris
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=http://localhost:8080
ADMIN_URL=http://localhost:3000
```

**Admin (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

**Database connection error:**
```bash
sudo service postgresql start
psql -U postgres -l
```

**Port already in use:**
```bash
lsof -ti:5000 | xargs kill -9
```

**Admin can't login:**
```bash
cd backend
./setup-db.sh  # Resets admin user
```

## 📞 Contact

- Email: wildwavesafaris@gmail.com
- Phone: +254 713 241 666
- WhatsApp: +254 713 241 666
- Location: Thika Road, Spur Mall, Nairobi

## 📄 License

MIT License - See LICENSE file

## 🎯 Roadmap

- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Image upload to cloud
- [ ] Blog functionality
- [ ] Customer accounts
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Advanced analytics

---

Built with ❤️ for African Safari Adventures
# wildwave-safari
