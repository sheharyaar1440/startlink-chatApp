# Deployment Guide

This guide covers deploying your chat application to various platforms.

## Prerequisites

Before deploying, ensure:
- ✅ `npm run build` completes successfully
- ✅ All tests pass (if applicable)
- ✅ Environment variables are configured
- ✅ Backend API is ready (or JSON Server is accessible)

## Build for Production

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

The build output will be in the `dist/` directory.

## Deployment Options

### 1. Vercel (Recommended for React Apps)

#### Via CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

#### Via Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Import project in Vercel dashboard
3. Set environment variables:
   - `VITE_API_URL`
   - `VITE_REALTIME_TRANSPORT`
4. Deploy

**Environment Variables in Vercel:**
- Go to Project Settings → Environment Variables
- Add each variable with appropriate value

### 2. Netlify

#### Via CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Via Git Integration
1. Push code to Git repository
2. Connect repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

**netlify.toml** (optional):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages

**Note:** GitHub Pages doesn't support environment variables. You'll need to hardcode API URLs or use a different hosting solution.

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

### 4. AWS S3 + CloudFront

#### S3 Static Website
```bash
# Build the app
npm run build

# Install AWS CLI
# Configure AWS credentials

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Set bucket policy for public access
```

#### CloudFront Distribution
1. Create CloudFront distribution
2. Point to S3 bucket
3. Set default root object: `index.html`
4. Configure error pages: 404 → `/index.html` (for SPA routing)

### 5. Docker

**Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

**Build and run:**
```bash
# Build image
docker build -t chat-app .

# Run container
docker run -p 8080:80 chat-app
```

### 6. Heroku

**Not recommended** for pure frontend apps, but possible:

```bash
# Install Heroku CLI
heroku create your-app-name

# Add buildpack
heroku buildpacks:set heroku/nodejs

# Add static.json for configuration
```

**static.json:**
```json
{
  "root": "dist",
  "clean_urls": true,
  "routes": {
    "/**": "index.html"
  }
}
```

## Backend Deployment

### JSON Server (Development/Demo)

#### Deploy JSON Server to Heroku
```bash
# Create separate repo for JSON Server
mkdir chat-api && cd chat-api
npm init -y
npm install json-server

# Create server.js
echo 'const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5000;

server.use(middlewares);
server.use(router);
server.listen(port);' > server.js

# Copy db.json
# Deploy to Heroku
heroku create chat-api
git push heroku main
```

#### Deploy JSON Server to Render
1. Create new Web Service
2. Connect Git repository
3. Build command: `npm install`
4. Start command: `npx json-server --watch db.json --port $PORT`

### Real Backend
See your backend framework's deployment guide (Node.js, Python, Go, etc.)

## Environment Configuration

### Production Environment Variables

Create `.env.production`:
```env
VITE_API_URL=https://your-api.com/api
VITE_REALTIME_TRANSPORT=ws
VITE_WS_URL=wss://your-api.com/realtime
```

### Staging Environment Variables

Create `.env.staging`:
```env
VITE_API_URL=https://staging-api.com/api
VITE_REALTIME_TRANSPORT=polling
```

### Building with Specific Environment

```bash
# Production
VITE_ENV=production npm run build

# Staging
VITE_ENV=staging npm run build
```

## Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Verify API connectivity
- [ ] Test realtime message updates
- [ ] Check console for errors
- [ ] Test on different devices/browsers
- [ ] Verify environment variables are loaded
- [ ] Test all user flows
- [ ] Check performance (Lighthouse)
- [ ] Verify HTTPS is enabled
- [ ] Test logout functionality

## Monitoring & Analytics

### Add Google Analytics (Optional)

Install:
```bash
npm install react-ga4
```

In `src/main.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR_GA4_MEASUREMENT_ID');
```

### Error Tracking (Optional)

**Sentry:**
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

## Performance Optimization

### Code Splitting
Already handled by Vite automatically.

### Image Optimization
Use next-gen formats (WebP, AVIF) and lazy loading.

### CDN
Consider using a CDN for static assets:
- Cloudflare
- AWS CloudFront
- Fastly

### Caching Strategy

**nginx cache headers:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

## Troubleshooting

### Issue: Blank page after deployment

**Solution:**
- Check browser console for errors
- Verify `base` path in `vite.config.ts`
- Check that all environment variables are set
- Ensure server is configured for SPA routing

### Issue: API calls failing

**Solution:**
- Verify CORS settings on backend
- Check `VITE_API_URL` is correct
- Ensure API is accessible from frontend domain
- Check network tab in browser DevTools

### Issue: WebSocket not connecting

**Solution:**
- Verify WebSocket URL (wss:// for HTTPS sites)
- Check firewall/proxy settings
- Ensure backend supports WebSocket
- Fall back to polling if needed

### Issue: Environment variables not working

**Solution:**
- Rebuild the application
- Ensure variables start with `VITE_`
- Check platform-specific env var settings
- Verify `.env` file is not in `.gitignore` for build

## Scaling Considerations

### Frontend Scaling
- Use CDN for global distribution
- Enable gzip/brotli compression
- Implement service worker for offline support
- Use HTTP/2 or HTTP/3

### Backend Scaling
- Implement load balancing
- Use Redis for session management
- Database read replicas
- Implement caching layer

## Security Checklist

- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] API authentication implemented
- [ ] Sensitive data not in client code
- [ ] CSP (Content Security Policy) headers
- [ ] Regular dependency updates
- [ ] Rate limiting on API

## Rollback Strategy

### Vercel/Netlify
- Previous deployments are automatically saved
- Use dashboard to rollback to previous version

### Docker
- Keep previous image tags
- Deploy previous version:
  ```bash
  docker pull your-image:previous-tag
  docker run your-image:previous-tag
  ```

### Manual
- Keep previous `dist/` folder
- Replace with backup if needed

## CI/CD Pipeline Example (GitHub Actions)

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          VITE_REALTIME_TRANSPORT: ${{ secrets.VITE_REALTIME_TRANSPORT }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Support

For deployment issues:
1. Check platform-specific documentation
2. Review browser console errors
3. Verify environment variables
4. Test API connectivity
5. Check deployment logs

---

**Ready to Deploy! 🚀**
