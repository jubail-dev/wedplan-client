# 💍 WedPlan — Wedding Planning Platform

WedPlan is a modern wedding planning platform designed to make wedding planning easier and more organized. It connects customers with wedding service providers, allowing customers to explore services, book vendors, and manage their wedding arrangements from one place.

The platform provides separate dashboards for Admins, Customers, and Vendors to manage their respective activities efficiently.

## 🌐 Live Website

**Live Demo:** https://wedplan-client-two.vercel.app

## 📸 Project Overview

WedPlan provides a user-friendly platform where customers can discover wedding services, vendors can manage their services and bookings, and administrators can oversee the entire platform.

## ✨ Key Features

- **User Authentication:** Secure user registration, sign-in, and session management.
- **Role-Based Dashboards:** Dedicated dashboards for Admin, Customer, and Vendor.
- **Browse Wedding Services:** Explore available wedding services without logging in.
- **Service Details:** View detailed information about individual wedding services.
- **Vendor Service Management:** Vendors can add and manage their wedding services.
- **Booking Management:** Customers can book services and manage their bookings.
- **Vendor Booking Management:** Vendors can view and manage customer bookings.
- **Admin Dashboard:** Administrators can manage users, services, and transactions.
- **Payment Integration:** Payment success and cancellation handling.
- **Image Upload:** Upload images for wedding services.
- **Responsive Design:** Optimized user experience across different screen sizes.
- **Modern UI:** Clean and user-friendly interface for a better experience.

## 👥 User Roles

### 1. Admin
- Access the admin dashboard.
- Manage users.
- Review and manage services.
- Monitor transactions.
- Oversee platform activities.

### 2. Customer
- Browse wedding services.
- View service details.
- Book wedding services.
- Manage personal bookings.
- Manage profile information.

### 3. Vendor
- Access the vendor dashboard.
- Add new wedding services.
- Manage existing services.
- View and manage bookings.
- Manage subscription information.

## 🛠️ Technology Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Better Auth
- **Icons & UI:** Lucide React, Custom UI Components
- **Notifications:** Toast Notifications
- **Animation:** Motion / Framer Motion
- **Deployment:** Vercel

## 📁 Project Structure

```text
wedplan-client/
├── public/
├── src/
│   ├── proxy.ts
│   ├── app/
│   │   ├── about/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   └── upload/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   │   ├── services/
│   │   │   │   ├── transactions/
│   │   │   │   └── users/
│   │   │   ├── customer/
│   │   │   │   └── bookings/
│   │   │   ├── profile/
│   │   │   └── vendor/
│   │   │       ├── add-service/
│   │   │       ├── bookings/
│   │   │       ├── services/
│   │   │       └── subscription/
│   │   ├── payment/
│   │   │   ├── cancel/
│   │   │   └── success/
│   │   ├── services/
│   │   │   └── [id]/
│   │   │       └── booking/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── shared/
│   │   └── ui/
│   └── lib/
│       ├── auth-client.ts
│       ├── auth.ts
│       └── utils.ts
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/jubail-dev/wedplan-client.git
```

### 2. Navigate to the Project Directory

```bash
cd wedplan-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables.

```env
NEXT_PUBLIC_BASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Add any additional variables required by your server, image upload service, and payment integration.

**Important:** Never commit secret keys, database credentials, or private API credentials to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for Production

```bash
npm run build
```

## 🔗 Related Links

- **Live Website:** https://wedplan-client-two.vercel.app
- **Client Repository:** https://github.com/jubail-dev/wedplan-client
- **Server Repository:** https://github.com/jubail-dev/wedplan-server

## 👨‍💻 Developer

**Jubail**

Frontend Developer | React.js | Next.js | TypeScript

- **LinkedIn:** https://www.linkedin.com/in/jubail-dev
- **GitHub:** https://github.com/jubail-dev

---

⭐ If you find this project interesting, feel free to explore the repository.

**WedPlan — Making Wedding Planning Simple & Beautiful.**