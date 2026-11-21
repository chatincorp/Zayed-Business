# Installme.md — Installation & Deployment Guide

Complete instructions for installing, building, and running the Yasir Zayed website on any platform.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
   - [Windows](#windows)
   - [macOS](#macos)
   - [Linux (Ubuntu/Debian)](#linux-ubuntudebian)
   - [Linux (CentOS/RHEL)](#linux-centosrhel)
3. [Build & Production](#build--production)
4. [VPS / Dedicated Server Deployment](#vps--dedicated-server-deployment)
5. [cPanel / WHM Deployment](#cpanel--whm-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Cloud Platform Deployment](#cloud-platform-deployment)
   - [Vercel](#vercel)
   - [Netlify](#netlify)
   - [Convex Backend Deployments (preview vs production)](#convex-backend-deployments-preview-vs-production)
   - [Cloudflare Workers](#cloudflare-workers)
8. [Freebuff Platform](#freebuff-platform)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Tool | Version | Install Link |
|---|---|---|
| **Node.js** | 18+ (20+ recommended) | https://nodejs.org |
| **Bun** | 1.0+ (recommended) | https://bun.sh |
| **Git** | 2.x+ | https://git-scm.com |
| **Convex CLI** | Latest (installed via npx/bunx) | https://convex.dev |

---

## Local Development

### Windows

#### Option A: Using Winget (Recommended)
```powershell
# Install Node.js
winget install OpenJS.NodeJS.LTS

# Install Git
winget install Git.Git

# Install Bun
powershell -c "irm bun.sh/install.ps1 | iex"

# Verify installations
node --version    # Should show v18+ or v20+
bun --version     # Should show 1.0+
git --version
```

#### Option B: Using Chocolatey
```powershell
choco install nodejs-lts git
powershell -c "irm bun.sh/install.ps1 | iex"
```

#### Option C: Using Scoop
```powershell
scoop install nodejs-lts git
scoop install bun
```

#### Clone & Run
```powershell
git clone https://github.com/your-org/yasir-zayed-web.git
cd yasir-zayed-web
bun install
bunx convex dev --once    # Set up Convex backend
bun dev                    # Start dev server at http://localhost:5173
```

#### Windows-Specific Notes
- If you get permission errors, run PowerShell as Administrator
- If `bun` command not found, restart your terminal after installation
- For WSL2 users, follow the Linux instructions inside WSL

---

### macOS

#### Using Homebrew (Recommended)
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js and Git
brew install node@20 git

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.zshrc

# Verify
node --version
bun --version
```

#### Using nvm (Node Version Manager)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc

# Install Node.js
nvm install 20
nvm use 20
nvm alias default 20

# Install Bun
curl -fsSL https://bun.sh/install | bash
```

#### Clone & Run
```bash
git clone https://github.com/your-org/yasir-zayed-web.git
cd yasir-zayed-web
bun install
bunx convex dev --once
bun dev
```

---

### Linux (Ubuntu/Debian)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify
node --version    # v20.x.x
npm --version     # 10.x.x
bun --version     # 1.x.x
git --version

# Clone & Run
git clone https://github.com/your-org/yasir-zayed-web.git
cd yasir-zayed-web
bun install
bunx convex dev --once
bun dev
```

#### Firewall (if needed)
```bash
# Allow port 5173 (dev) or 4173 (preview)
sudo ufw allow 5173
sudo ufw allow 4173
```

---

### Linux (CentOS/RHEL/AlmaLinux)

```bash
# Install Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs git

# Install Bun
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Clone & Run
git clone https://github.com/your-org/yasir-zayed-web.git
cd yasir-zayed-web
bun install
bunx convex dev --once
bun dev
```

#### Firewall (firewalld)
```bash
sudo firewall-cmd --permanent --add-port=5173/tcp
sudo firewall-cmd --permanent --add-port=4173/tcp
sudo firewall-cmd --reload
```

---

## Build & Production

### Build the project
```bash
bun run build
```
Output is in the `dist/` directory.

### Preview the production build locally
```bash
bun preview
# Serves at http://localhost:4173
```

### Serve with a static file server
```bash
# Using Node.js
npx serve dist

# Using Python
cd dist && python3 -m http.server 8080

# Using Bun
bun run --bun src/main.ts  # Uses the Deno server in main.ts
```

---

## VPS / Dedicated Server Deployment

### Option A: Nginx (Recommended)

#### 1. Install Nginx
```bash
# Ubuntu/Debian
sudo apt install -y nginx

# CentOS/RHEL
sudo yum install -y nginx
```

#### 2. Build the project
```bash
cd /home/deploy/yasir-zayed-web
bun run build
```

#### 3. Configure Nginx
```bash
sudo nano /etc/nginx/sites-available/yasirzayed
```

```nginx
server {
    listen 80;
    server_name yasirzayed.com www.yasirzayed.com;
    root /home/deploy/yasir-zayed-web/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 256;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Convex API proxy (if needed)
    location /api/ {
        proxy_pass https://your-convex-deployment.convex.cloud;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 4. Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/yasirzayed /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. SSL with Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yasirzayed.com -d www.yasirzayed.com
sudo certbot renew --dry-run
```

### Option B: Apache

```bash
sudo apt install -y apache2
sudo a2enmod rewrite
```

Create `/etc/apache2/sites-available/yasirzayed.conf`:
```apache
<VirtualHost *:80>
    ServerName yasirzayed.com
    ServerAlias www.yasirzayed.com
    DocumentRoot /home/deploy/yasir-zayed-web/dist

    <Directory /home/deploy/yasir-zayed-web/dist>
        AllowOverride All
        Require all granted
    </Directory>

    # SPA fallback
    FallbackResource /index.html

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
    </IfModule>

    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType image/* "access plus 1 year"
    </IfModule>
</VirtualHost>
```

```bash
sudo a2ensite yasirzayed
sudo systemctl reload apache2
```

### Option C: PM2 + Node.js Server

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create server file
cat > /home/deploy/yasir-zayed-web/server.js << 'EOF'
const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

http.createServer((req, res) => {
  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Yasir Zayed website running on port ${PORT}`);
});
EOF

# Start with PM2
pm2 start server.js --name yasirzayed
pm2 save
pm2 startup
```

---

## cPanel / WHM Deployment

### Step 1: Build Locally
```bash
bun run build
```

### Step 2: Upload dist/ via File Manager or FTP
1. Log into cPanel
2. Open **File Manager**
3. Navigate to `public_html/` (or your subdomain folder)
4. Upload ALL contents of the `dist/` folder (not the folder itself)

Your file structure should look like:
```
public_html/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── ...
└── ...
```

### Step 3: Create .htaccess for SPA Routing
In `public_html/`, create a file named `.htaccess`:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Handle SPA routing — serve index.html for all routes
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE image/svg+xml
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE text/plain
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Step 4: Force HTTPS (in cPanel)
1. Go to **Security** → **SSL/TLS Status**
2. Select your domain
3. Click **Run AutoSSL**
4. Enable **Force HTTPS Redirect**

### Step 5: Set Up Node.js App (if needed for Convex)
If your cPanel has **Setup Node.js App**:
1. Go to **Software** → **Setup Node.js App**
2. Create a new application with Node.js 20
3. Set the application root to your project folder
4. Set the startup file to `server.js`
5. Run `npm install` in the terminal

### WHM-Specific Notes
- Ensure **ProxyPass** is disabled for your domain (it conflicts with SPA routing)
- If using **MultiPHP**, ensure PHP is set to the latest version for `.htaccess` processing
- For SSL, use **AutoSSL** or install Let's Encrypt via **Terminal**

---

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json bun.lock* ./
RUN npm install -g bun && bun install --frozen-lockfile
COPY . .
RUN bun run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    restart: always
```

### Build & Run
```bash
docker build -t yasirzayed .
docker run -d -p 80:80 --name yasirzayed yasirzayed

# Or with docker-compose
docker-compose up -d
```

---

## Cloud Platform Deployment

### Vercel

1. Push code to GitHub/GitLab/Bitbucket
2. Go to https://vercel.com/new
3. Import your repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
5. Add environment variables:
   - `VITE_CONVEX_URL` = your Convex URL
6. Deploy

### Netlify

1. Push code to GitHub
2. Go to https://app.netlify.com
3. Click "Add new site" → "Import an existing project"
4. Configure:
   - **Build command**: `bun run build`
   - **Publish directory**: `dist`
5. Add `_redirects` file in `dist/` for SPA routing:
```
/*    /index.html   200
```
6. Deploy

### Convex Backend Deployments (preview vs production)

There are two Convex deployments and they must never share a key:

| Target | Deploy key variable | Deployment |
| --- | --- | --- |
| `preview` | `CONVEX_DEPLOY_KEY_PREVIEW` | one per Git branch, created on demand |
| `production` | `CONVEX_DEPLOY_KEY_PRODUCTION` | the deployment staff use |

A preview deploy key makes `npx convex deploy` target a per-branch deployment
(`--preview-name <branch>`), including its own schema and data. A `prod:` key
targets the staff deployment. The scripts below pick the key from the target and
refuse to run when the two disagree — a branch holding the production key stops
instead of reshaping the live schema.

1. Create the deployments and keys in the Convex dashboard (**Settings → Deploy
   Keys**): one **production** key for the staff deployment, one **preview** key
   for branch deployments. Creating a deployment needs a dashboard login;
   `npx convex deployment create --type preview` refuses a deploy key.
2. Put both in the environment (never commit them):
   ```bash
   # .env.local or your CI secret store
   CONVEX_DEPLOY_KEY_PRODUCTION=prod:<deployment>|<secret>
   CONVEX_DEPLOY_KEY_PREVIEW=preview:<deployment>|<secret>
   ```
3. Deploy:
   ```bash
   npm run convex:deploy:preview       # branch deployment, schema included
   npm run convex:deploy:production    # the staff deployment
   ```
   Add `-- --build` to build the frontend against the deployment that was just
   pushed (`VITE_CONVEX_URL` is injected by Convex), for example
   `npm run convex:deploy:preview -- --build`.

Preview deploys reuse the deployment for their branch name, so repeated pushes
update it rather than creating new ones. `CONVEX_DEPLOYMENT` from a local
`.env.local` is removed from the deploy process, so it cannot redirect a deploy
to another deployment.

### Cloudflare Workers

`wrangler.jsonc` deploys the same artefact as the hosted preview: `worker.js`
serves `dist/` through the `ASSETS` binding and falls back to `index.html` for
client-side routes.

1. Sign in once with the Cloudflare account that owns the domain:
   ```bash
   npx --yes wrangler@4 login
   ```
2. Build with the production backend URL and **the origin the site will be
   served from**. Both are baked in at build time. `VITE_CONVEX_URL` is not read
   from `.env.development.local` — Vite only loads that file in dev mode — so a
   bare `npm run build:cloudflare` ships a site with no backend, where every
   panel falls back to reference data. Export it or pass it inline:
   ```bash
   VITE_CONVEX_URL=https://your-project.convex.cloud \
   SITE_ORIGIN=https://yasirzayed.com \
   npm run cloudflare:deploy
   ```
   `cloudflare:deploy` refuses to start when `VITE_CONVEX_URL` is unset.
   `SITE_ORIGIN` sets the URLs in `sitemap.xml` and the `Sitemap:` line in
   `robots.txt`; it defaults to `https://yasirzayed.com`. Always use the
   production origin, not the workers.dev hostname: the canonical and `og:url`
   tags in `index.html` name the production domain regardless, so staging URLs
   must not reach the sitemap.
3. First deploy prints the worker URL (`https://yasir-zayed.<subdomain>.workers.dev`).

#### Attach the custom domain

1. The zone (e.g. `yasirzayed.com`) must be active in the same Cloudflare
   account — nameservers pointed at Cloudflare.
2. Dashboard → **Workers & Pages → yasir-zayed → Settings → Domains & Routes →
   Add → Custom domain**, enter `yasirzayed.com` and repeat for `www`.
3. Cloudflare creates the proxied DNS record automatically. Keep the record
   proxied (orange cloud); do not add a separate A record.
4. No rebuild is needed if you already deployed with the production origin —
   `sitemap.xml`, `robots.txt` and the canonical tags all name it.

#### Verify after deploying

- `/` and `/markets` return 200 and render; reloading a deep route (e.g.
  `/tabloid/markets`) still loads the app.
- `/sitemap.xml` lists the same origin you deployed to.
- The market bar shows live quotes and `/portal` lists orders — both prove the
  build reached the Convex deployment.
- Local parity check without publishing: `npm run build:cloudflare && npx --yes
  wrangler@4 dev` (serves on `http://localhost:8787`). `dist/` is gitignored, so
  the build step is required — `cloudflare:dev` on its own has no assets to
  serve.

---

## Freebuff Platform

The Freebuff platform runs this project automatically:

1. The dev server starts at port 5173
2. Convex dev runs with `bunx convex dev --once`
3. File changes are picked up automatically
4. Do NOT start/stop dev servers manually
5. Do NOT modify `vite.config.ts` HMR settings

---

## Environment Variables

Create a `.env` file (not committed to git):

```env
# Convex (required)
VITE_CONVEX_URL=https://your-project.convex.cloud

# Paystack (for payments)
PAYSTACK_PUBLIC_KEY=pk_live_xxxxx

# OpenAI (for AI chatbot and content rewrite)
OPENAI_API_KEY=sk-xxxxx
```

> **Do not edit `.env` files on the Freebuff platform.** Use the Keys/API keys UI instead.

---

## Troubleshooting

### Blank page after build
- Ensure all routes serve `index.html` (SPA fallback)
- Check `.htaccess` or Nginx config for SPA routing

### CSS not loading
- Verify Tailwind CSS is included in the build output
- Check that `index.html` references the correct CSS file

### Convex errors
- Run `bunx convex dev --once` to regenerate types
- Verify `VITE_CONVEX_URL` is set correctly

### 502 Bad Gateway
- Clear Vite cache: `rm -rf node_modules/.vite`
- Restart the dev server

### Port already in use
```bash
# Find and kill the process
lsof -ti:5173 | xargs kill -9

# Or use a different port
bun dev --port 3000
```

---

**Yasir Zayed** · Nairobi, Kenya · info@yasirzayed.com
