
# 🚀 LaunchIt - A Web Deployment Platform

[![LaunchIt Banner](https://raw.githubusercontent.com/aditya1741/Launchit/refs/heads/main/Screenshot%202025-04-22%20095630.png)]

> LaunchIt is a modern, full-stack deployment platform inspired by Vercel. 
  It enables developers to deploy their applications seamlessly with Git integration, real-time logs, analytics, and collaboration features.

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00bfff)](https://raw.githubusercontent.com/aditya1741/Launchit/refs/heads/main/Screenshot%202025-04-22%20095630.png)
[![View Code](https://img.shields.io/badge/View-Code-blue)](https://github.com/aditya1741/Launchit)

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- TailwindCSS
- Next jS


**Backend:**
- Node.js
- Express.js

**Database & Storage:**
- PostgreSQL (Prisma)
- Redis (Caching / Sessions)

**Messaging & Streaming:**
- Apache Kafka

**Cloud Infrastructure:**
- AWS EC2, ECS, ECR, S3
- Docker

---

## 🔥 Features

- 🔐 GitHub OAuth Authentication
- 🧩 Modular Microservice Architecture
- 📁 Project Dashboard
- 📦 Environment Variables Manager
- 📤 Real-time Deployment Logs
- 📊 Analytics Dashboard
- 👥 Team Collaboration
- 🚀 Deployment Hooks
- ⚙️ CI/CD Integration

---

## 🧭 Folder Structure

```bash
LaunchIt/
├── frontend/             # Nextjs frontend.
├── api-server/           # It is server that interact with Frontend.
├── build-server/         # it build a container for one Deployement.
├── s3-reverse-proxy/     # it provide web apps content from s3 directly.
└── README.md
