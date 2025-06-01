# EssaBook – Web Appointment Management App

EssaBook is a lightweight, web-based application designed for service business owners (e.g., barbers) who want to manage client appointments easily – mobile-first, intuitive, and chaos-free.

The original project started as a mobile app:  
➡️ [reactnative-firebase-appointment-app](https://github.com/hustlehoff-dev/reactnative-firebase-appointment-app)  
During testing, the decision was made to rebuild it entirely as a web application.

---

![Widok aplikacji](image.png)

---

## 🟢 Current Project State (as of: 01.06.2025)

The app is fully functional and currently in **commercial testing** with 3 business users.

### ✅ What works:

- Users can **book and manage appointments**.
- The main screen shows a **daily agenda** with the upcoming appointment and the **most recent past visit** (rebooking with 1 click).
- After booking, the client receives an **SMS notification**.
- At **18:00 (6 PM) the day before** the appointment, the client gets an **SMS reminder with links to confirm or cancel** (1-click – done: browser window opens with visdual confirmation HTML).
- Appointment status updates **in real-time** (booked → confirmed/cancelled).
- **Clickable dates** in the agenda to quickly browse days.

  The project ensures complete data anonymity. Even the app administrator or developer cannot access users' passwords.

### 🔧 In progress:

- **Multi-user logged-in sessions** (adding multi-user acc switching).

- **Client blacklist** (for no-shows and frequent cancellers).
- **Contacts module** (manage clients).
- **Appointment widget redesign** (more like a planner than a simple list).

---

## 🔑 Key Features

- Appointment booking (date, time, slot).
- Automated SMS notifications (confirmation + reminder).
- 1-click links for client actions directly from SMS.
- Firebase Authentication + Firestore for user/data management.
- Separate Express.js backend for notification & status handling.

---

## ⚙️ Technologies

- **React + TypeScript + SWC**
- **Styled Components**
- **Firebase (Firestore, Authentication, AdminSDK)**
- **~~Twilio~~ SMSAPI (SMS notifications)**
- **Express.js backend** (for confirmations, reminders, status updates)

---

## Planned Features

- **Landing page** + control panel (subscriptions, CRM, settings).
- **CRM module** with marketing tools.
- **Statistics dashboard & analytics**.
- **Webapp-first** approach (mobile app discontinued – full PWA focus).

---

## Running the Project Locally

- For the best performance, I used pnpm/vite:

  > pnpm create vite@latest .

- Pick

  > [] React ->
  > [] TypeScript + SWC

- To run development server (SWC):
  > pnpm dev
