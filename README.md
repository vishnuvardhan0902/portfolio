# Space Portfolio - Vishnu Vardhan

A stunning 3D space-themed portfolio built with React, Three.js, and GSAP.

## Features

- 🌌 Interactive 3D space environment with planets
- 🎵 Background music controls
- 📱 Responsive design for all devices
- ✨ Smooth animations and transitions
- 🚀 Professional content sections

## Tech Stack

- **Frontend**: React 18, Three.js, GSAP
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Models**: GLTF format
- **Deployment**: Render

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start dev server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Deployment on Render

This project is ready for deployment on Render. Follow these steps:

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Static Site"
3. Connect your GitHub repository
4. Configure the deployment:
   - **Name**: space-portfolio
   - **Branch**: main
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes

### Step 3: Deploy
Render will automatically build and deploy your site. The process takes about 2-3 minutes.

## Project Structure

```
src/
├── components/
│   ├── CanvasScene.jsx    # 3D scene with Three.js
│   ├── Navigation.jsx     # Side navigation
│   ├── MusicControl.jsx   # Audio controls
│   └── ContentPanels.jsx  # Content sections
├── styles.css             # Global styles
└── App.jsx               # Main app component

public/
├── assets/               # 3D models and audio
├── cover_photos/         # Planet thumbnails
└── _redirects           # Routing configuration
```

## Performance Features

- Optimized 3D models
- Lazy loading of assets
- Responsive images
- Efficient GSAP animations
- CDN-served dependencies

## License

MIT License - Feel free to use this code for your own portfolio!
