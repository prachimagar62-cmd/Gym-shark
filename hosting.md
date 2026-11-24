# 🚀 Gymshark MERN Stack — AWS Hosting & DevOps Deployment Guide

> Complete, step-by-step production hosting guide for deploying **Gymshark** (Full MERN Stack: MongoDB Atlas + Express backend + React 19/Vite SPA frontend) onto **AWS EC2** using **CloudFormation Infrastructure-as-Code**, **Nginx Reverse Proxy**, **PM2 Process Manager**, and automated **GitHub Actions CI/CD**.

---

## 📋 Project Configuration Summary

| Field | Production Value |
|---|---|
| **GitHub Repository** | `https://github.com/Prince-KC/Gymshark` |
| **GitHub Username** | `Prince-KC` |
| **Repository Name** | `Gymshark` |
| **Branch** | `main` |
| **CloudFormation Stack Name** | `gymshark-stack` |
| **EC2 Server Type** | `t2.micro` (Free-tier eligible) |
| **Operating System** | Ubuntu 24.04 LTS (`ami-0e86e20dae9224db8`) |
| **AWS Region** | `us-east-1` (N. Virginia) |
| **Backend API Port** | `5000` |
| **Frontend Static Root** | `/var/www/app/frontend/dist` |
| **Database** | MongoDB Atlas Cloud (`gymshark` database) |

---

## 1. Hosting Architecture Overview

When a user visits your live Gymshark website, here is how traffic flows through the AWS server:

```
                            [ USER / BROWSER ]
                                    │
                         HTTP Request (Port 80)
                                    ▼
                  ┌───────────────────────────────────┐
                  │          AWS EC2 INSTANCE         │
                  │         (Ubuntu 24.04 LTS)        │
                  │                                   │
                  │   ┌───────────────────────────┐   │
                  │   │    NGINX (Reverse Proxy)  │   │
                  │   └─────────────┬─────────────┘   │
                  │                 │                 │
                  │    ┌────────────┴───────────┐     │
                  │    │                        │     │
                  │    ▼                        ▼     │
                  │  Static Files           Backend   │
                  │  (Frontend React)       API (PM2) │
                  │  /var/www/app/frontend  Port 5000 │
                  │  /dist                  /api/* &  │
                  │                         /image/*  │
                  └─────────────────────────────┬─────┘
                                                │
                                                │ Database Connection (TLS)
                                                ▼
                                    [ CLOUD DATABASE ]
                                    (MongoDB Atlas M0 - 24/7)
```

### Architectural Principles:
1. **Nginx Web Server (Port 80):** The public entry point. It serves the high-speed compiled React frontend (`frontend/dist`), while reverse-proxying `/api/*` and `/image/*` requests to the internal Express server running on port 5000.
2. **PM2 Process Manager:** Keeps the Express backend continuously active 24/7 in the background. If the Node process crashes or the EC2 instance reboots, PM2 revives it instantly.
3. **AWS CloudFormation (IaC):** Defines the entire virtual server, security group (Ports 80 & 22), and SSH key pair automatically via `infra/ec2-instance.yaml`.
4. **AWS Systems Manager (SSM) Parameter Store:** Automatically stores the generated SSH private key securely inside AWS without ever having to manually download or copy `.pem` files.
5. **GitHub Actions CI/CD:** A 2-job pipeline that builds the frontend on GitHub's fast 7GB runner, downloads artifacts, connects securely to EC2 via SSH, updates code, runs database migrations, and reloads PM2 and Nginx.

---

## 2. The 4 Infrastructure Files Created

### File 1: `infra/ec2-instance.yaml` (CloudFormation Infrastructure-as-Code)
- **What it does:** Automatically provisions the Ubuntu 24.04 EC2 instance, configures Security Groups opening Port 80 (HTTP) and Port 22 (SSH), and creates an SSH key pair stored in AWS SSM.
- **2GB Swap Enabled:** Includes automatic swap configuration on first boot to protect the 1GB `t2.micro` instance from memory exhaustion during builds.
- **UserData Bootstrap:** Automatically installs Node.js 22, Nginx, Git, PM2, and clones the repository.

### File 2: `infra/nginx.conf` (Web Server & Reverse Proxy)
- **Frontend Serving:** Serves compiled Vite React assets from `/var/www/app/frontend/dist` with `try_files $uri $uri/ /index.html` (prevents 404 errors when refreshing React Router pages).
- **API Proxying:** Proxies `/api/*` requests directly to `http://127.0.0.1:5000/api/`.
- **Image Proxying:** Proxies product images at `/image/*` to Express static file handling with 7-day browser caching headers.
- **Health Check:** Provides `/health` endpoint returning `Gymshark Live OK` for uptime monitoring.

### File 3: `backend/ecosystem.config.cjs` (PM2 Process Manager)
- **CommonJS Compatibility:** Uses the `.cjs` extension so PM2 can execute CommonJS configuration while `backend/package.json` specifies `"type": "module"`.
- **Process Management:** Runs `index.js` under the name `gymshark-backend` with automatic restarts and a 300MB memory ceiling.

### File 4: `.github/workflows/deploy.yml` (Automated CI/CD Pipeline)
- **Job 1 (`build`):** Runs on GitHub's Ubuntu runner with Node 22, compiles the Vite React frontend using `VITE_API_URL=/api`, and uploads the `frontend-dist` artifact.
- **Job 2 (`deploy`):** Authenticates with AWS using repository secrets, deploys the CloudFormation stack, fetches the EC2 public IP and SSM private key, waits for SSH port 22 to open, connects via `appleboy/ssh-action@v1.2.0`, pulls the latest code, writes production `.env`, runs database seed, and restarts PM2 and Nginx.
- **Manual Trigger:** Includes `workflow_dispatch:` so you can trigger deployments with one click directly from the GitHub Actions web UI.

---

## 3. Step-by-Step Hosting Setup (From Scratch)

Follow these 5 steps in order:

---

### Step 1: Set Up Cloud Database (MongoDB Atlas)

You can reuse your existing MongoDB Atlas account:

1. Log into **https://www.mongodb.com/atlas**
2. In your existing cluster (e.g., `cluster0.4i4h5r0.mongodb.net`):
   - You can reuse your existing user: `princekca25_db_user`
   - Or create a new user under **Database Access**
3. Verify that **Network Access** includes `0.0.0.0/0` (Active).
4. Your connection string for Gymshark is:
   ```
   mongodb+srv://princekca25_db_user:w55gXCtpYvyrFJCE@cluster0.4i4h5r0.mongodb.net/gymshark?retryWrites=true&w=majority
   ```
   *(Notice `/gymshark` is the database name — MongoDB Atlas will automatically create this isolated database without affecting other projects).*

---

### Step 2: Collect AWS Credentials

#### If using AWS Learner Lab:
1. Open your AWS Academy Learner Lab portal.
2. Click **Start Lab** and wait for the status dot to turn green.
3. Click **AWS Details** (top right) and click **Show** next to AWS CLI.
4. Copy the three values:
   - `aws_access_key_id`
   - `aws_secret_access_key`
   - `aws_session_token`

#### If using a standard AWS Account:
1. Log into AWS Console -> IAM -> Security Credentials -> Create Access Key.
2. Copy `Access key ID` and `Secret access key` (session token is not needed).

---

### Step 3: Configure GitHub Secrets & Variables

1. Go to your Gymshark repository on GitHub:  
   **https://github.com/Prince-KC/Gymshark**
2. Click **Settings** (top navigation tab of the repository).
3. In the left sidebar, click **Secrets and variables** -> **Actions**.

#### Add these 5 Repository Secrets:

Click **New repository secret** for each:

| Secret Name | Value | Description |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | `ASIA...` or `AKIA...` | Your AWS access key from Step 2 |
| `AWS_SECRET_ACCESS_KEY` | `wJalr...` | Your AWS secret key from Step 2 |
| `AWS_SESSION_TOKEN` | `IQoJb...` | Your AWS session token (Learner Lab only) |
| `MONGO_URI` | `mongodb+srv://princekca25_db_user:w55gXCtpYvyrFJCE@cluster0.4i4h5r0.mongodb.net/gymshark?retryWrites=true&w=majority` | MongoDB Atlas URI |
| `JWT_SECRET` | `Gymshark@2026#SecureAthleteJWTToken` | Long random secret string for JWT auth |

#### Add this 1 Repository Variable:

Click the **Variables** tab (next to Secrets) -> **New repository variable**:

| Variable Name | Value |
|---|---|
| `AWS_REGION` | `us-east-1` |

---

### Step 4: Push Infrastructure Files & Deploy

Open PowerShell in `D:\coding\College\Summer_break\Mern_stack\Gymshark` and execute:

```powershell
git add .
git commit -m "feat: complete MERN stack application and AWS CI/CD deployment infrastructure"
git push origin main
```

---

### Step 5: Verify Live Website

1. Go to **https://github.com/Prince-KC/Gymshark/actions**
2. Click on the running workflow: **"Deploy Gymshark (CloudFormation + SSH)"**
3. Watch both jobs run:
   - `Build Frontend` (Compiles React app with Vite on 7GB runner)
   - `Deploy to EC2` (Creates/verifies CloudFormation stack, connects via SSH, and reloads PM2)
4. When finished, open the final step **"Print Live URL"** in the deployment log. You will see:
   ```
   🎉 Live Gymshark site at http://<YOUR-EC2-PUBLIC-IP>
   ```
5. Click the URL or paste it in your browser. Your live Gymshark website is up and running!

---

## 4. Live Server Maintenance & Useful Commands

To connect directly to your EC2 server:

```bash
# 1. Fetch your private key from SSM Parameter Store using AWS CLI:
aws ssm get-parameter --name "/ec2/keypair/gymshark-stack-key" --with-decryption --query "Parameter.Value" --output text > gymshark-key.pem
chmod 600 gymshark-key.pem

# 2. SSH into your Ubuntu server:
ssh -i gymshark-key.pem ubuntu@<YOUR-EC2-IP>
```

### PM2 Process Manager Commands:
```bash
pm2 status                        # Check status of gymshark-backend
pm2 logs gymshark-backend         # View live console logs
pm2 restart gymshark-backend      # Restart backend server
pm2 reload ecosystem.config.cjs   # Zero-downtime hot reload
```

### Nginx Web Server Commands:
```bash
sudo systemctl status nginx       # Check Nginx status
sudo nginx -t                     # Test Nginx syntax
sudo systemctl reload nginx       # Apply configuration changes
sudo cat /var/log/nginx/gymshark.error.log   # View server error logs
```

### Manual Database Re-Seeding:
```bash
cd /var/www/app/backend
node src/seed.js                  # Seeds 52 Gymshark products into MongoDB Atlas
```

---

## 5. Handling AWS Lab Expiration & Server Recovery

AWS Academy Learner Lab sessions expire every 4 hours. When your lab resets:

1. Click **Start Lab** in AWS Academy.
2. Open **AWS Details** and copy the new credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN`).
3. Update those 3 secrets in **GitHub -> Settings -> Secrets and variables -> Actions**.
4. Go to **Actions** -> click **Deploy Gymshark (CloudFormation + SSH)** -> click the blue **Run workflow** dropdown button -> click **Run workflow**.
5. GitHub Actions will automatically detect if the server was terminated, re-provision the EC2 instance, install all dependencies, connect to MongoDB Atlas, and bring the website back online!

> **Note on Data Persistence:** Your products, registered users, and placed orders reside in **MongoDB Atlas (in the cloud)**, so your database is 100% persistent and is never lost when AWS Lab resets.

---

*Authored for Gymshark MERN Stack Deployment · Architecture: Node 22 / React 19 / Express 5 / MongoDB Atlas / Nginx / PM2 / AWS CloudFormation / GitHub Actions*
