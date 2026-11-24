# Gymshark MERN: Mac M2 to AWS

This guide follows the same five-step flow as the Windows guide, adapted to the current project and Mac M2. The app has `frontend/` (React/Vite) and `backend/` (Express/Mongoose); MongoDB Atlas hosts the database. CloudFormation creates EC2, Nginx, PM2, Systems Manager, and the GitHub OIDC deployment role. GitHub Actions deploys the app. No SSH key or AWS access-key secrets are needed.

## Project settings

| Setting | Value |
|---|---|
| GitHub repository | `https://github.com/prachimagar62-cmd/Gym-shark` |
| Branch | `main` |
| CloudFormation stack | `GymsharkStore` |
| AWS region | `us-east-1` (or choose one and use it everywhere) |
| EC2 | Ubuntu 24.04 x86_64, `t3.small` recommended |
| Frontend | `/var/www/app/frontend/dist` |
| Backend | `/var/www/app/backend`, internal port `5000` |
| Database | MongoDB Atlas, database `gymshark` |

## Before starting

The previous Windows guide contained an Atlas password and a JWT secret. Treat them as compromised: rotate the Atlas database-user password and use a new JWT secret. Never commit `.env` files or put real credentials in GitHub files. AWS and Atlas may incur charges; `t3.small` is not guaranteed free-tier eligible. Delete the CloudFormation stack when finished to remove the EC2 resources.

Your Mac is Apple Silicon (`arm64`). Use Node 22 LTS (22.12+) or Node 24. The Mac is only for editing, local builds and Git; GitHub Actions and EC2 install their own Linux x86_64 dependencies. Do not copy Windows/Mac `node_modules` to AWS. The app now uses `bcryptjs` to avoid native bcrypt binary differences.

## Step 1: Prepare and push from your Mac

Open Terminal in the project folder:

```sh
cd "$HOME/Documents/AWs/PrinceK.C_26140509"
node --version
npm ci --prefix frontend
npm ci --prefix backend
npm run build
```

Check that your Git remote is the intended public repository and your local secrets are ignored:

```sh
git remote -v
git check-ignore backend/.env
```

Commit and push the hosting changes and lockfiles:

```sh
git add .
git status --short
git commit -m "Prepare Gymshark for AWS hosting"
git push origin main
```

Skip the commit if all changes are already pushed. The EC2 bootstrap clones over HTTPS, so the repository must be public with the current template. Do not run Windows `start.bat` on the Mac.

## Step 2: Set up MongoDB Atlas

1. In MongoDB Atlas, create/select a cluster and database user. Use the new password after rotating the old one.
2. Use database name `gymshark` in the Atlas connection URI. URL-encode special characters in the password.
3. Do not allow `0.0.0.0/0`. After Step 3 creates the server, add its Elastic IP to Atlas Network Access as `PUBLIC_IP/32`.

## Step 3: Create AWS infrastructure and store app secrets

1. Sign in to AWS Console and choose one region (the guide defaults to `us-east-1`).
2. Open **CloudFormation → Create stack → With new resources** and upload `infra/ec2-instance.yaml`.
3. Use stack name `GymsharkStore`. Confirm repository URL `https://github.com/prachimagar62-cmd/Gym-shark.git`, branch `main`, and instance type `t3.small`. Acknowledge IAM resource creation and create the stack.
4. Wait for `CREATE_COMPLETE`. From **Outputs**, copy `PublicIP` and `GitHubDeployRoleArn`. Add `PublicIP/32` in Atlas Network Access and wait for the rule to activate.
5. In **AWS Secrets Manager**, create a plaintext JSON secret named exactly `GymsharkStore/production`:

```json
{
  "MONGO_URI": "mongodb+srv://USER:URL_ENCODED_PASSWORD@CLUSTER.mongodb.net/gymshark?retryWrites=true&w=majority",
  "JWT_SECRET": "NEW_RANDOM_SECRET"
}
```

Generate a new JWT value locally with `openssl rand -hex 32`; replace both placeholders with your own values. Do not put real values in this file, Git, screenshots, or chat. CloudFormation automatically creates the OIDC provider and least-privilege GitHub deploy role.

The stack opens HTTP/HTTPS only; SSH is not exposed. Nginx serves the Vite build and routes `/api/` to Express. PM2 keeps Express running. The Ubuntu AMI is selected per region, so no Windows/Mac AMI choice is needed.

## Step 4: Connect GitHub and deploy

In your GitHub repository, open **Settings → Secrets and variables → Actions**.

Add one repository secret:

| Secret | Value |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | The `GitHubDeployRoleArn` CloudFormation output |

Add two repository variables:

| Variable | Value |
|---|---|
| `AWS_REGION` | The region used for CloudFormation, such as `us-east-1` |
| `AWS_DEPLOY_ENABLED` | `true` |

No `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, SSH key, Mongo URI, or JWT secret belongs in GitHub. Now open **Actions → Build and deploy Gymshark → Run workflow**, select `main`, and run it. Later pushes to `main` deploy automatically.

The workflow builds the frontend on GitHub, waits for Systems Manager, then asks EC2 to pull the repository. EC2 reads Atlas/JWT secrets from Secrets Manager, installs Linux dependencies from each folder's lockfile, builds `frontend/`, and reloads PM2 and Nginx.

## Step 5: Verify the live site

Use the stack's `PublicURL` output (or `http://PUBLIC_IP`). Verify:

- `http://PUBLIC_IP/health` reports the backend as online and database as connected.
- `http://PUBLIC_IP/women` loads, and refreshing that route still works.
- Images load and product data appears. After testing signup/contact/orders, confirm the relevant collections exist in Atlas.
- GitHub **Actions** shows the deployment workflow succeeded.

The initial URL is HTTP. Before using real account credentials, attach a domain to the Elastic IP and configure HTTPS/TLS. Checkout is a demo and does not process payments.

## If something fails

- **Atlas connection:** Confirm the Atlas allow-list includes the EC2 Elastic IP as `/32`, the cluster is active, and the secret JSON keys are exactly `MONGO_URI` and `JWT_SECRET`.
- **Workflow cannot assume role:** Confirm `AWS_DEPLOY_ROLE_ARN`, `AWS_REGION`, repository variables, and that the OIDC trust in the CloudFormation stack matches this repository and `main`.
- **No deployment target:** Check that CloudFormation is `CREATE_COMPLETE` and the instance is running/online in Systems Manager.
- **Stop AWS charges:** Delete the `GymsharkStore` CloudFormation stack. Delete the Atlas cluster and Secrets Manager secret separately if no longer needed.