# Deployment Guide

This guide will help you deploy the Churn Predictor application with the frontend on Vercel and backend on Render.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Your code pushed to a GitHub repository

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. **Sign up/Login to Render**
   - Go to [render.com](https://render.com)
   - Sign up or login to your account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your code

3. **Configure the Service**
   - **Name**: `churn-predictor-api` (or your preferred name)
   - **Root Directory**: `backend` (since your Flask app is in the backend folder)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`

4. **Environment Variables**
   - No additional environment variables needed for basic deployment

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Wait for the deployment to complete (usually 2-5 minutes)

6. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://your-app-name.onrender.com`
   - Save this URL for the frontend configuration

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. **Sign up/Login to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or login to your account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure the Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (since your React app is in the frontend folder)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - Add the following environment variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-render-app-name.onrender.com` (replace with your actual Render URL)

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Wait for the deployment to complete (usually 1-3 minutes)

6. **Get Your Frontend URL**
   - Once deployed, you'll get a URL like: `https://your-app-name.vercel.app`
   - This is your live application!

## Testing the Deployment

1. **Test Backend Health**
   - Visit: `https://your-render-app-name.onrender.com/health`
   - Should return: `{"status": "API is running"}`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try submitting a prediction form
   - Check if the API calls are working

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - The backend already has CORS configured
   - If you still get CORS errors, check that your frontend URL is correct

2. **API Not Responding**
   - Check Render logs for any errors
   - Ensure all model files are in the backend directory
   - Verify the start command is correct

3. **Build Failures**
   - Check that all dependencies are in `requirements.txt`
   - Ensure Python version is compatible (3.9+ recommended)

4. **Environment Variables**
   - Double-check the `VITE_API_URL` in Vercel
   - Make sure there are no trailing slashes

### File Structure for Deployment

```
your-repo/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── render.yaml
│   ├── customer_churn_voting_tuned_shap.pkl
│   └── encoders (1).pkl
└── frontend/
    ├── package.json
    ├── vercel.json
    ├── src/
    └── ...
```

## Updating Deployments

- **Backend**: Push changes to GitHub, Render will auto-deploy
- **Frontend**: Push changes to GitHub, Vercel will auto-deploy
- **Environment Variables**: Update in the respective platform's dashboard

## Cost Considerations

- **Vercel**: Free tier includes 100GB bandwidth/month
- **Render**: Free tier includes 750 hours/month (enough for small projects)
- Both platforms offer paid plans for higher usage

## Security Notes

- Never commit API keys or sensitive data to your repository
- Use environment variables for configuration
- Consider adding rate limiting for production use 