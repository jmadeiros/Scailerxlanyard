const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper function to ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper function to clean directory
function cleanDir(dir) {
  if (fs.existsSync(dir)) {
    try {
      // First, try to remove read-only attribute
      execSync(`attrib -r "${dir}\\*.*" /s`, { stdio: 'ignore' });
    } catch (error) {
      console.warn(`Warning: Could not remove read-only attributes from ${dir}`);
    }

    try {
      fs.rmSync(dir, { recursive: true, force: true });
    } catch (error) {
      console.warn(`Warning: Could not completely remove ${dir}: ${error.message}`);
      // Try to remove as much as possible
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const curPath = path.join(dir, file);
          try {
            if (fs.lstatSync(curPath).isDirectory()) {
              cleanDir(curPath);
            } else {
              fs.unlinkSync(curPath);
            }
          } catch (e) {
            console.warn(`Warning: Could not remove ${curPath}`);
          }
        }
      } catch (e) {
        console.warn(`Warning: Could not read directory ${dir}`);
      }
    }
  }
}

// Helper function to copy directory recursively
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

console.log('Starting deployment process...');

try {
  // Clean previous build artifacts
  console.log('\n🧹 Cleaning previous build...');
  cleanDir('.next');
  cleanDir('public');
  cleanDir('functions');
  console.log('✅ Cleanup completed');

  // Install dependencies if needed
  console.log('\n📦 Checking dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');

  // Build Next.js application
  console.log('\n🏗️ Building Next.js application...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed');

  // Setup Firebase Functions
  console.log('\n🔧 Setting up Firebase Functions...');
  ensureDir('functions');
  
  // Remove any existing server.js to avoid confusion
  const serverJsPath = path.join(__dirname, 'functions', 'server.js');
  if (fs.existsSync(serverJsPath)) {
    fs.unlinkSync(serverJsPath);
  }

  // Copy Next.js standalone files
  console.log('Copying Next.js standalone files...');
  const standaloneDir = path.join(__dirname, '.next', 'standalone');
  if (fs.existsSync(standaloneDir)) {
    copyDir(standaloneDir, path.join(__dirname, 'functions'));
    console.log('✅ Standalone files copied');
  } else {
    console.error('ERROR: Standalone directory not found!');
    process.exit(1);
  }

  // Copy .next directory
  console.log('Copying .next directory...');
  const nextDir = path.join(__dirname, '.next');
  if (fs.existsSync(nextDir)) {
    copyDir(nextDir, path.join(__dirname, 'functions', '.next'));
    console.log('✅ .next directory copied');
  }

  // Create functions package.json
  const functionsPackageJson = {
    name: "functions",
    description: "Cloud Functions for Firebase",
    scripts: {
      "lint": "echo 'No linting configured'",
      "serve": "firebase emulators:start --only functions",
      "shell": "firebase functions:shell",
      "start": "npm run shell",
      "deploy": "firebase deploy --only functions",
      "logs": "firebase functions:log"
    },
    engines: {
      "node": "18"
    },
    main: "index.js",
    dependencies: {
      "firebase-admin": "^11.8.0",
      "firebase-functions": "^4.3.1",
      "next": "13.4.19",
      "react": "18.2.0",
      "react-dom": "18.2.0",
      "express": "^4.18.2"
    }
  };

  fs.writeFileSync(
    path.join(__dirname, 'functions', 'package.json'),
    JSON.stringify(functionsPackageJson, null, 2)
  );

  // Install functions dependencies
  console.log('Installing functions dependencies...');
  execSync('cd functions && npm install', { stdio: 'inherit' });
  console.log('✅ Functions dependencies installed');

  // Copy our Next.js function handler
  console.log('Creating Next.js function handler...');
  const functionContent = `const functions = require('firebase-functions');
const next = require('next');
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Add detailed logging
const logRequest = (req, res, next) => {
  console.log('--------------------');
  console.log('Request Details:');
  console.log(\`Path: \${req.path}\`);
  console.log(\`Method: \${req.method}\`);
  console.log(\`Headers:\`, req.headers);
  console.log('--------------------');
  next();
};

app.use(logRequest);

// Initialize Next.js with standalone configuration
const nextApp = next({
  dev: false,
  dir: __dirname,
  conf: {
    distDir: '.next',
    experimental: {
      outputStandalone: true
    }
  }
});

const handle = nextApp.getRequestHandler();

// Log the current directory structure
const logDirectoryStructure = () => {
  console.log('Current directory structure:');
  const dirs = ['.', '.next', 'public'];
  dirs.forEach(dir => {
    try {
      const items = fs.readdirSync(path.join(__dirname, dir));
      console.log(\`\${dir}/:\`, items);
    } catch (err) {
      console.log(\`Error reading \${dir}/: \${err.message}\`);
    }
  });
};

// Initialize the Next.js app
const initializeApp = async () => {
  try {
    console.log('Starting Next.js initialization...');
    console.log('Current directory:', __dirname);
    logDirectoryStructure();
    
    await nextApp.prepare();
    console.log('Next.js initialization complete');
    
    return app;
  } catch (err) {
    console.error('Initialization error:', err);
    throw err;
  }
};

// Initialize the app and export the function
let initialized = false;
let initializationPromise = null;

exports.nextServer = functions
  .region('europe-west1')
  .runWith({
    memory: '1GB',
    timeoutSeconds: 60
  })
  .https.onRequest(async (req, res) => {
    try {
      console.log('Function invoked:', {
        path: req.path,
        timestamp: new Date().toISOString()
      });

      if (!initialized) {
        if (!initializationPromise) {
          console.log('Starting first-time initialization...');
          initializationPromise = initializeApp();
        }
        await initializationPromise;
        initialized = true;
      }

      // Handle all requests with Next.js
      return handle(req, res);
    } catch (err) {
      console.error('Function error:', err);
      res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  });`;

  fs.writeFileSync(
    path.join(__dirname, 'functions', 'index.js'),
    functionContent
  );

  // Copy required Next.js files
  console.log('Copying Next.js required files...');
  const requiredFiles = [
    '.next/static',
    '.next/required-server-files.json',
    '.next/BUILD_ID',
    '.next/prerender-manifest.json',
    '.next/routes-manifest.json',
    'public'
  ];

  for (const file of requiredFiles) {
    const src = path.join(__dirname, file);
    const dest = path.join(__dirname, 'functions', file);
    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        copyDir(src, dest);
      } else {
        ensureDir(path.dirname(dest));
        fs.copyFileSync(src, dest);
      }
    }
  }
  console.log('✅ Functions setup completed');

  // Prepare static files for hosting
  console.log('\n📂 Preparing static files for hosting...');
  ensureDir('public');
  
  // Copy Next.js static files to public
  const staticSrc = path.join(__dirname, '.next', 'static');
  if (fs.existsSync(staticSrc)) {
    // Ensure _next/static directory exists
    ensureDir(path.join(__dirname, 'public', '_next'));
    copyDir(staticSrc, path.join(__dirname, 'public', '_next', 'static'));
    console.log('✅ Next.js static files copied');
  }

  // Copy public directory contents
  const publicSrc = path.join(__dirname, 'public');
  if (fs.existsSync(publicSrc)) {
    const files = fs.readdirSync(publicSrc);
    files.forEach(file => {
      const src = path.join(publicSrc, file);
      const dest = path.join(__dirname, 'public', file);
      if (fs.statSync(src).isDirectory()) {
        copyDir(src, dest);
      } else {
        fs.copyFileSync(src, dest);
      }
    });
    console.log('✅ Public directory contents copied');
  }

  // Copy additional Next.js assets
  console.log('Copying additional Next.js assets...');
  const nextAssets = [
    '.next/BUILD_ID',
    '.next/prerender-manifest.json',
    '.next/routes-manifest.json',
    '.next/required-server-files.json',
    '.next/static',
    '.next/standalone',
    '.next/server/pages',
    '.next/server/chunks',
  ];

  for (const asset of nextAssets) {
    const src = path.join(__dirname, asset);
    const dest = path.join(__dirname, 'functions', asset);
    if (fs.existsSync(src)) {
      if (fs.statSync(src).isDirectory()) {
        copyDir(src, dest);
      } else {
        ensureDir(path.dirname(dest));
        fs.copyFileSync(src, dest);
      }
    }
  }
  console.log('✅ Additional Next.js assets copied');

  // Deploy to Firebase
  console.log('\n🚀 Deploying to Firebase...');
  execSync('firebase deploy', { stdio: 'inherit' });
  console.log('✅ Firebase deployment completed');

  console.log('\n✨ Deployment successful!');
} catch (error) {
  console.error('\n❌ Deployment failed:', error);
  process.exit(1);
} 