# AWS Deployment Guide

This repository builds the Vite frontend into the root `dist/` folder and runs the Express API from `server/index.js`. AWS hosts the frontend and API on one Ubuntu EC2 instance; MongoDB Atlas hosts the database. Nginx serves the frontend and proxies `/api/` to Express. PM2 keeps Express running. GitHub Actions deploys through AWS Systems Manager using GitHub OIDC; no SSH port or long-lived AWS access key is required.

## Costs and prerequisites

- An AWS account with permission to create CloudFormation, EC2, VPC, Elastic IP, IAM, Systems Manager, and Secrets Manager resources.
- A GitHub repository. The included instance bootstrap clones the repository over HTTPS, so it must be public. Never commit `.env`, database credentials, or AWS credentials.
- A MongoDB Atlas account and cluster. Atlas is the hosted database; it is separate from AWS and may have its own limits/costs.
- `t3.small` is the template default because the production Vite build needs more headroom than a 1 GB micro instance. EC2, its Elastic IP, storage, data transfer, and Atlas usage can incur charges. Check current prices and delete the stack when finished.
- AWS region selected consistently for the stack, OIDC role, and workflow. The examples default to `us-east-1`.

## 1. Put the project on GitHub

Create a GitHub repository and push the complete project, including these hosting files, to its `main` branch. For example, replace the placeholders and run:

```sh
git init
git add .
git commit -m "Prepare storefront for AWS hosting"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_OWNER/YOUR_REPOSITORY.git
git push -u origin main
```

If the directory is already a Git repository, do not run `git init` or replace its remote; add and push the files normally. Confirm `.env` is ignored before pushing.

## 2. Create the MongoDB Atlas database

1. Create an Atlas project and cluster. Choose a region near the AWS region.
2. Create a database user and password. URL-encode special characters in the password when constructing the connection string.
3. Copy the application connection URI, replacing username, password, cluster host, and database name. It should resemble `mongodb+srv://USER:ENCODED_PASSWORD@cluster.example.mongodb.net/gymshark_store?retryWrites=true&w=majority`.
4. Do not allow `0.0.0.0/0` in Atlas. First create the AWS stack in the next step, then add its Elastic IP output as a `/32` entry in Atlas Network Access.

## 3. Create the EC2 stack

1. In AWS Console, switch to the chosen region, then open CloudFormation and choose **Create stack → With new resources**.
2. Upload `infra/ec2-instance.yaml`.
3. Set stack name to exactly `GymsharkStore`.
4. Set `GitHubRepositoryUrl` to the public HTTPS clone URL ending in `.git`, such as `https://github.com/YOUR_GITHUB_OWNER/YOUR_REPOSITORY.git`. Keep branch `main`; keep `t3.small` unless you have checked the memory/build tradeoff.
5. Acknowledge IAM resource creation and create the stack. Wait until status is `CREATE_COMPLETE`.
6. Open stack **Outputs** and record `PublicIP` and `PublicURL`. Add `PUBLIC_IP/32` to Atlas Network Access and wait until the Atlas rule is active.
7. In AWS Secrets Manager, create a **Plaintext** secret with the exact secret name from the stack output (`GymsharkStore/production/MONGODB_URI`) and the full MongoDB URI as its value. Secrets Manager encrypts it at rest. The EC2 instance role can read only this secret.

The stack creates a VPC, public subnet, EC2 instance, encrypted disk, Elastic IP, IAM instance role, and security group. The security group accepts web traffic on ports 80 and 443 only; use Systems Manager for administration. The site's initial app deployment is performed by GitHub Actions after the next setup steps.

## 4. Set up GitHub Actions OIDC

This allows GitHub Actions to obtain short-lived AWS credentials without AWS access-key secrets.

1. In AWS IAM, open **Identity providers**. If `token.actions.githubusercontent.com` does not already exist, add an OpenID Connect provider with provider URL `https://token.actions.githubusercontent.com` and audience `sts.amazonaws.com`. Do not create a duplicate provider.
2. Create an IAM policy from `infra/github-actions-permissions-policy.json`. Replace `YOUR_AWS_REGION` and `YOUR_AWS_ACCOUNT_ID`; leave `GymsharkStore` unchanged if that is your stack name.
3. Create an IAM role for **Web identity**, selecting the GitHub OIDC provider and audience `sts.amazonaws.com`. Use `infra/github-actions-trust-policy.json` as the trust policy; replace `YOUR_AWS_ACCOUNT_ID`, `YOUR_GITHUB_OWNER`, and `YOUR_REPOSITORY`. Keep the `main` branch restriction.
4. Attach the policy from step 2 to the role. Name the role, for example, `GymsharkGitHubDeployRole`.
5. Copy the role ARN. In GitHub repository **Settings → Secrets and variables → Actions**, add secret `AWS_DEPLOY_ROLE_ARN` with that ARN. Add repository variables `AWS_REGION` with the stack's region (for example `us-east-1`) and `AWS_DEPLOY_ENABLED` with value `true`. This enables deploys only after AWS is configured; before then the initial repository push will not start a broken deployment.

The permissions policy limits deployment commands to instances tagged `GymsharkApp=GymsharkStore`. Restrict role trust to your exact repository and branch. Never use a wildcard repository subject for a production deployment role.

## 5. Deploy and verify

1. Push a commit to `main`, or open GitHub **Actions** and run **Build and deploy to AWS** with **Run workflow**.
2. The workflow runs `npm ci` and `npm run build`, finds the tagged EC2 instance, then sends a deployment command through Systems Manager. The instance pulls `main` as the `ubuntu` app user, reads the Atlas URI from Secrets Manager, writes a local ignored `.env` with owner-only permissions, builds the app, reloads Nginx, and reloads PM2.
3. Wait for the workflow to finish successfully. Visit the `PublicURL` stack output.
4. Verify `http://PUBLIC_IP/api/health` reports `{"status":"ok","database":"connected"}` and refresh a client route such as `/women`.

## 6. Optional HTTPS and custom domain

The initial stack serves HTTP. For HTTPS, point an `A` record for a domain you control to the Elastic IP, then connect to the instance with **Systems Manager → Session Manager** and install/configure Certbot for Nginx. Use the domain in the Nginx `server_name` and request a certificate. Do not send customer credentials or payment details over the initial HTTP URL. The current checkout is only a demo and does not process payments.

## Maintenance

- Push to `main` to deploy updates. GitHub Actions logs show build/deployment status.
- Use Systems Manager Session Manager to inspect the server. Useful commands: `pm2 status`, `pm2 logs gymshark-store`, `sudo nginx -t`, and `sudo systemctl status nginx`.
- If Atlas cannot connect, verify the cluster is active, its IP allow-list contains the current Elastic IP with `/32`, and the secret URI/password are correct.
- To remove the AWS resources, delete the `GymsharkStore` CloudFormation stack. This terminates EC2 and releases its Elastic IP; delete the Atlas cluster and Secrets Manager secret separately if no longer needed.

## Files added for this project

- `infra/ec2-instance.yaml`: VPC, EC2, Elastic IP, security group, and instance permissions.
- `infra/nginx.conf`: serves root `dist/` and proxies `/api/` to port 5000.
- `server/ecosystem.config.cjs`: PM2 runs the existing `server/index.js` entry point.
- `infra/github-actions-trust-policy.json` and `infra/github-actions-permissions-policy.json`: restricted GitHub OIDC role policies.
- `.github/workflows/deploy.yml`: production build and SSM-based deployment pipeline.