# 🌾 Smart Crop Advisor

Smart Crop Advisor is an intelligent agricultural decision support system for farmers. The system provides local soil guidance, Indian seasonal planners, crop nutrition profiles, and integrates with **Google Gemini AI** to deliver customized recommendations and leaf disease diagnostics.

---

## 🚀 Hosting & Deployment Guide

This project is fully ready for hosting on modern cloud platforms (such as **Render**, **Heroku**, **Fly.io**, or **Vercel**).

### Prerequisites
1. **GitHub Account**: You will need to upload your project to a GitHub repository.
2. **MongoDB Atlas Account**: A cloud-hosted MongoDB database connection string is required for online deployment.
3. **Google Gemini API Key**: Used to connect to the AI model.

---

### Step 1: Set Up MongoDB Atlas (Cloud Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a new database cluster (select the Shared free tier).
3. Under **Database Access**, create a user with a username and password.
4. Under **Network Access**, add an IP address rule `0.0.0.0/0` (Allow Access from Anywhere) so your hosting platform can connect.
5. Click **Connect** -> **Drivers**, and copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`

---

### Step 2: Push Your Code to GitHub
1. Initialize git in your project directory (if not already done):
   ```bash
   git init
   ```
2. Add your files and commit them:
   ```bash
   git add .
   git commit -m "Initialize Smart Crop Advisor full-stack app"
   ```
   *(Note: The `.gitignore` file ensures your local `.env` containing your private keys and `node_modules` are not pushed to GitHub.)*
3. Create a public/private repository on GitHub.
4. Push your local code to your GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 3: Deploy to Render (Recommended & Free)
1. Sign in to [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your `Smart Crop Advisor` repository.
4. Configure the Web Service settings:
   - **Name**: `smart-crop-advisor`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Scroll down and click **Advanced** -> **Add Environment Variable**. Add the following:
   - `GEMINI_API_KEY` = *Your Google Gemini API Key*
   - `MONGODB_URI` = *Your MongoDB Atlas Connection String (from Step 1)*
   - `PORT` = `3000` *(Render will overwrite this automatically, but it is good practice)*
6. Click **Deploy Web Service**. Render will build the project and provide a public URL (e.g., `https://smart-crop-advisor.onrender.com`).

---

## 🛠️ Local Running instructions
To run the server locally on your computer:
1. Ensure MongoDB is running locally.
2. Build dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   node server.js
   ```
4. Access `http://localhost:3000` in your browser.
