# SMSGuard Web Dashboard

This repository contains the companion web application for **SMSGuard**, an offline-first Android app designed to help users find, alarm, and lock lost or stolen phones via SMS commands. 

The web dashboard serves as a management portal and a lost-and-found lookup system, bridging the gap between the mobile app and the web.

## ✨ Features

* **Home:** Introduces the SMSGuard ecosystem and its core offline security features.
* **Lost & Found Registry:** Allows owners to report a device as lost using its IMEI, model, and a contact method. Anyone can query the database to check the status of an IMEI.
* **Device Dashboard:** A centralized hub showing counts of registered, lost, and recovered devices. Users can easily mark a device as safe or lost.
* **Deep Linking:** Seamlessly opens the mobile app via Android intent deep links (`smsgward://`) for device pairing.
* **Setup Guide:** Step-by-step instructions for installing the Android app and utilizing the web portal.

## 📸 Web Dashboard Screenshots

Here is a glimpse of the SMSGuard Web Dashboard interface:

| Secure Authentication | Main Dashboard (Empty State) |
| :---: | :---: |
| <img src="assets/login.png" width="450" alt="Login Screen"/> | <img src="assets/dashboard.png" width="450" alt="Main Dashboard"/> |

| Device Pairing (QR Code) | Account Settings |
| :---: | :---: |
| <img src="assets/pairing.png" width="450" alt="Device Pairing"/> | <img src="assets/settings.png" width="450" alt="Account Settings"/> |

## 🔗 Related Repositories
* **Android App:** [smsgward-org/smsgward](https://github.com/smsgward-org/smsgward)
## 🛠️ Technology Stack

This project is built using a modern web stack to ensure fast performance and reliable data handling:
* **Framework:** [Next.js](https://nextjs.org/) (React framework)
* **Database / ORM:** [Prisma](https://www.prisma.io/) for database schema, migrations, and querying.
* **Styling:** (Add Tailwind CSS or your styling method here if applicable)
* **Deployment:** Hosted on [Vercel](https://vercel.com/)
* **Live Demo:** [smsgward-web.vercel.app](https://smsgward-web.vercel.app/)

## 🚀 Getting Started (Local Development)

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Node.js:** Version 18.17 or later. ([Download Node.js](https://nodejs.org/))
- **Git:** For cloning the repository. ([Download Git](https://git-scm.com/))
- **Package Manager:** `npm` (comes with Node.js) or `yarn` / `pnpm`.
- **Database:** A local database running (e.g., PostgreSQL) or SQLite if configured in the Prisma schema.

To run this web dashboard locally, follow these steps: 

## 🚀 Step-by-Step Setup

### 1. Clone the Repository

Clone the project to your local machine and navigate into the directory:

```bash
git clone https://github.com/smsgward-org/smsgward-web.git
cd smsguard-web
```

### 2. Set Up Environment Variables

Copy the example environment file to create your local `.env` file:

```bash
cp .env.example .env
```

Open the newly created `.env` file in your code editor. You **must** update the `DATABASE_URL` with your local database credentials. For example:

- **PostgreSQL:** `DATABASE_URL="postgresql://user:password@localhost:5432/smsguard?schema=public"`
- **SQLite:** `DATABASE_URL="file:./dev.db"`

### 3. Initialize the Database (Prisma)

Run the following commands to generate the Prisma Client and apply the database schema (create the necessary tables):

```bash
npx prisma generate
npx prisma migrate dev --name init
```

*Note: If you are using a fresh SQLite database, this will create the `dev.db` file automatically.*

### 4. Start the Development Server

Now you are ready to start the Next.js development server:

```bash
npm run dev
```

### 5. View the Website

Open your web browser and navigate to:

[**http://localhost:3000**](http://localhost:3000)

The page will auto-update as you edit files in the `app/` or `pages/` directory.

## 🔄 How it Connects to the Mobile App
The web portal is designed to complement the SMS-based nature of the mobile app. While the mobile app operates entirely offline via carrier SMS (no internet required), the web portal provides an online layer for community-driven lost-and-found reporting and device management.

## ⚠️ Limitations & Future Work
Currently, the platform is expanding from a front-end demonstration to a full-stack application. Future roadmap includes:
* **Automated Locate Requests:** Connecting the web dashboard to a backend that can trigger SMS locate requests directly to a lost phone and display the GPS reply on a web map.
* **User Authentication:** Allowing owners to create secure accounts to manage multiple devices and view location history.
* **Replay Protection:** Integrating secure one-time tokens with the mobile app.

## 👥 The Team
SMSGuard is built by a team of six, organized in three pairs:
* **Developers & AI Promoters (2):** Implement the Android app and the website.
* **Feature & Security Logic Leads (2):** Design command handling, authentication, and anti-tamper behavior.
* **UI & Documentation Leads (2):** Design the interface and write project documentation.