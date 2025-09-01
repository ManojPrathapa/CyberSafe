---

````markdown
# 🚀 CyberSafe: Cybersecurity Awareness Platform  

CyberSafe is a **full-stack web application** built to **educate children, parents, and mentors** about safe online practices. With interactive modules, detailed dashboards, and intuitive interfaces, CyberSafe empowers families to **navigate the digital world with confidence**.

<div align="center">
  
![GitHub last commit](https://img.shields.io/github/last-commit/ManojPrathapa/CyberSafe?color=blue&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/ManojPrathapa/CyberSafe?style=flat-square)
![GitHub license](https://img.shields.io/github/license/ManojPrathapa/CyberSafe?style=flat-square)
![GitHub Repo stars](https://img.shields.io/github/stars/ManojPrathapa/CyberSafe?style=flat-square)

</div>

---

## 📚 Table of Contents  
- [✨ Features](#-features)  
- [🛠️ Tech Stack](#️-tech-stack)  
- [📂 Project Structure](#-project-structure)  
- [⚡ Getting Started](#-getting-started)  
  - [✅ Prerequisites](#-prerequisites)  
  - [🎨 Frontend Setup](#-frontend-setup)  
  - [🖥️ Backend Setup](#-backend-setup)  
- [▶️ Usage](#️-usage)  
- [📸 Screenshots](#-screenshots)  
- [🤝 Contributing](#-contributing)  
- [📜 License](#-license)  
- [👨‍💻 Author](#-author)  

---

## ✨ Features  

- 🎓 **Child Learning Modules** — Interactive, age-specific lessons for children.  
- 🧑‍🏫 **Mentor Dashboard** — Tools for mentors to upload and manage educational content.  
- 👨‍👩‍👧 **Parent Dashboard** — Monitor child progress and learning history.  
- 📊 **Data Visualization** — Insightful charts and progress tracking.  
- 📱 **Responsive Design** — Seamlessly adapts across devices.  
- ⚙️ **Modular Architecture** — Scalable and easy to maintain.

---

## 🛠️ Tech Stack  

**Frontend**  
- [Next.js](https://nextjs.org/) (App Router)  
- [React 18](https://react.dev/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Recharts](https://recharts.org/) (for charts)

**Backend**  
- Python (Flask or Django)  
- RESTful API design  

**Other Tools**  
- Git & GitHub  
- CSV/Excel integration  
- Responsive Design Tools  

---

## 📂 Project Structure  

```bash
CyberSafe/
├── backend/                      # Backend (Flask/Django APIs, auth, data logic)
├── cyber-awareness-frontend/    # Next.js frontend app
│   ├── app/
│   │   ├── child/                # Child dashboard
│   │   ├── parent/               # Parent dashboard
│   │   ├── mentor/               # Mentor dashboard
│   │   ├── admin/                # Admin panel
│   │   └── page.js               # Landing/Home page
│   ├── components/              # Reusable components (Navbar, Footer, etc.)
│   ├── public/                  # Static assets
│   ├── package.json
│   └── tailwind.config.js
├── requirements.txt              # Backend dependencies
├── LICENSE
├── README.md
└── .gitignore
````

---

## ⚡ Getting Started

### ✅ Prerequisites

Make sure the following are installed on your machine:

* [Node.js](https://nodejs.org/) v18+
* [npm](https://www.npmjs.com/) v9+
* [Python](https://www.python.org/) (for backend)
* Git

---

### 🎨 Frontend Setup

```bash
# Clone the repository
git clone https://github.com/ManojPrathapa/CyberSafe.git

# Navigate to frontend directory
cd CyberSafe/cyber-awareness-frontend

# Install dependencies
npm install

# Install Recharts (if not already included)
npm install recharts

# Start the development server
npm run dev
```

🌐 Visit `http://localhost:3000` to access the frontend.

---

### 🖥️ Backend Setup

```bash
# Navigate to the backend directory
cd CyberSafe/backend

# Install Python dependencies
pip install -r requirements.txt

# Start the backend server
python app.py  # or python manage.py runserver (if using Django)
```

🔌 Backend will be available at: `http://localhost:5000` *(update if different)*

---

## ▶️ Usage

* 👶 **Child Login** – Access fun and interactive learning modules.
* 👨‍👩‍👧 **Parent Login** – Track child’s learning, view analytics, and monitor safety metrics.
* 🧑‍🏫 **Mentor Login** – Upload and manage learning materials.
* 🛠️ **Admin Panel** – Manage users, modules, and content.

---

## 📸 Screenshots

> *Give users a visual preview of your app!*

| Child Dashboard                                     | Parent Report                                   |
| --------------------------------------------------- | ----------------------------------------------- |
| ![Child Dashboard](screenshots/child-dashboard.png) | ![Parent Report](screenshots/parent-report.png) |

> Add more screenshots in the `/screenshots` directory to showcase the platform.

---

## 🤝 Contributing

Contributions are welcome and appreciated! 💡

### 🧩 Steps to Contribute:

1. **Fork** this repository
2. **Clone** your forked repo
3. Create a new branch

   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Commit your changes

   ```bash
   git commit -m "✨ Added new feature"
   ```
5. Push to your fork

   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a **Pull Request** and describe your changes

> Please follow the project's code style and naming conventions.

---

## 📜 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for details.

---

## 👨‍💻 Author

**Manoj Prathapa**
🔗 [GitHub](https://github.com/ManojPrathapa)
🌟 *Special thanks to the amazing team and contributors who helped bring CyberSafe to life!*

---

<div align="center">

⭐️ *If you find this project helpful, give it a star on GitHub!* ⭐️

</div>
```

---
