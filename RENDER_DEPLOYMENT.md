# Render.com Deployment Configuration

## Service Configuration for Render

### Web Service Settings:
- **Build Command**: `npm run render-build`
- **Start Command**: `npm start`
- **Node Version**: 18.x or higher
- **Root Directory**: `/` (project root)

### Environment Variables (Optional):
- `NODE_ENV=production`
- `PORT` (automatically set by Render)

### Auto-Deploy:
- Enable auto-deploy from your main branch
- The service will automatically rebuild and redeploy when you push changes

## Local Testing

Before deploying, test locally:

1. **Install dependencies:**
   ```bash
   npm run install-deps
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the production server:**
   ```bash
   npm start
   ```

4. **Visit http://localhost:3001 to test**

## Deployment Process

1. **Push your code to GitHub**
2. **Create a new Web Service on Render**
3. **Connect your GitHub repository**
4. **Use the configuration above**
5. **Deploy!**

## Troubleshooting

- If build fails, check that all dependencies are listed in package.json
- If frontend doesn't load, verify that the build process copies files to backend/public
- Check Render logs for any runtime errors
