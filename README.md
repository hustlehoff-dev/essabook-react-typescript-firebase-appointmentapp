# EssaBook - Mobile Web Appointment App

EssaBookl is a web-based application tailored for barbershop owners to manage their client appointments efficiently.

Initial project was here:https://github.com/hustlehoff-dev/reactnative-firebase-appointment-app

During development and later testing, I decided to recreate the app as Web Application.

The project will offer subscription model for owners of service premises in exchange of the most convienient customer relation management system in the industry.

## Screenshots

Soon

## Current Project State (updated: 25.04.2025)

**What's working:**

- User can now book/remove appointments.
- Booked appointments appear on the app's homepage as a handy list (agenda). From there, the user can call the client with one tap.
- After booking, the app sends an SMS to inform the client about the appointment.
- 12 or 24 hours before the appointment, the user gets a reminder SMS that allows them to confirm or cancel the visit.
- Each appointment starts with the "booked" status. It can later change to "confirmed" or "cancelled".

**What's being added:**

- Blacklist: lets the user ban problematic contacts (those who cancel or no-show).
- Contacts feature (obviously).
- Appointment scheduling widget redesign (planner like).
- Homepage clickable date (so user can check exact day visits).

## Key Features

- Appointment booking system with date, time, and time slot selection.
- Automated SMS notifications for appointment confirmation and reminders.
- User authentication with Firebase Authentication.
- Data storage using Firestore Database.
- Decentralized server handles booking states/reminders.
- User swap when both logged in.

## Technologies

- **_React + Typescript + SWC_**
- **_Styled Components_**
- **_FirebaseAPI (Firestore, Authentication, AdminSDK)_**
- **_TwilioAPI (SMS notifications)_**
- **_ExpressJS backend (handling SMS notifications, reminders and booking status)_**

Project is under development.

### Further development

- Landing page and Convienient webapp interface with control panel/subscription info (mobile app version is discontinued).
- Marketing CRM.
- Statistic dashboard, analyzer.

At the moment:

- Implementation of Express.js standalone server for sms/appointment confirmations handling.

## Setting up a project

- For the best performance, I used pnpm/vite:

  > pnpm create vite@latest .

- Pick

  > [] React ->
  > [] TypeScript + SWC

- To run development server (SWC):
  > pnpm dev
