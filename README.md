# Based off GitHub Template Repo = flat-monorepo-fastapi-expo-refresh-connect-test

A minimal flat monorepo for a fullstack Expo + FastAPI app scaffolded by `scaffold_fullstack_app13.py`.

## 🧱 Stack

- 📱 **Frontend**: React Native + Expo (`frontend-expo`)
- ⚙️ **Backend**: FastAPI (`backend-fastapi`)
- 📦 **Shared Types**: `common/`

---

## 🚀 Quickstart

### 1. Clone the repo locally

```bash
git clone https://github.com/rob4abcba/<your new repo name e.g. flat-monorepo-fastapi-expo-refresh-connect-test1>.git
cd <your new repo name e.g. flat-monorepo-fastapi-expo-refresh-connect-test1>
```

If you get GitHub errors, follow their instructions.

### 2. Inspect the folder structure

```bash
/backend-fastapi
/frontend-expo
README.md
...
```

Confirm you have two folders at the root, one for backend, one for frontend.

### 3. Backend (FastAPI)

```bash
cd backend-fastapi

# (optional) create and activate virtual env:
python3 -m venv .venv
source .venv/bin/activate

# install dependencies
pip install -r requirements.txt

# (optional) upgrade pip
pip install --upgrade pip

# run FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The FastAPI server will be available at:  
👉 http://localhost:8000 <-- Hover over this link in your Terminal, then Cmd + Click this link

In your Chrome/Safair/etc browser:  👉 http://localhost:8000 <-- Add /docs to the end of this url
👉 http://localhost:8000/docs <-- You will see the "FastAPI - Swagger UI" here. 

Click GET > Try it out > Execute
If "Server response" gives Code "200" and you see your expected result in "Response body" then all is well.


### 2. Frontend (Expo)

Keep the backend-fastapi running in the terminal from the Backend (FastAPI) above.  Go to a new terminal to execute the steps below for the frontend-expo:

```bash
cd frontend-expo

# install dependencies
npm install

# Choose one of the following to start Expo dev server
npx expo start
npx expo start -c <-- Use -c flag to clear caches if you see any strange unexplained errors the first time
```

Follow the steps shown in the terminal to open the "Expo Go" app in your iPhone Simulator, Android Emulator, or actual, real, physical phone device.  

Make sure the backend is still running before starting the app so the Refresh tab works.

---

## ✅ Features

- `/ping` FastAPI backend route
- Working frontend **Refresh** tab:
  - Calls backend endpoint and displays response
- Hot-updatable backend message from server
- Flat monorepo layout with top-level Git repo

---

## 📌 Project Structure

```
flat-monorepo-fastapi-expo-refresh-connect-test/
├── backend-fastapi/       # FastAPI backend server
│   └── main.py            # Core app
├── frontend-expo/         # Expo React Native frontend
│   └── app/               # Screens, tabs, components
├── common/                # Shared constants or types
├── scaffold_fullstack_app13.py
└── README.md              # This file
```

---

## 🛠️ To Do

- [ ] Add more backend endpoints (e.g., `/status`, `/echo`, etc.)
- [ ] Add persistent backend storage (e.g., SQLite, Postgres)
- [ ] Build out additional UI tabs or screens
- [ ] Auth integration (optional)
- [ ] Testing + CI setup

---

## 🧪 Git Setup

If not already initialized:

```bash
cd flat-monorepo-fastapi-expo-refresh-connect-test
git init
git add .
git commit -m "Initial commit: Working fullstack Expo + FastAPI app"
```

Then push to your GitHub repo:

```bash
git remote add origin https://github.com/YOUR_USERNAME/flat-monorepo-fastapi-expo-refresh-connect-test.git
git push -u origin main
```

---

## 🪪 License

[MIT](LICENSE)
