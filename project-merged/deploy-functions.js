const { execSync } = require('child_process');

console.log('Starting Firebase Functions deployment process...');

try {
  // Deploy only the Firebase Functions
  console.log('\n🚀 Deploying Firebase Functions...');
  execSync('firebase deploy --only functions', { stdio: 'inherit' });
  
  console.log('\n✅ Functions deployment completed successfully!');
  console.log('Your Cloud Functions are now live at: https://us-central1-scailertest-37078.cloudfunctions.net/');
  
} catch (error) {
  console.error('\n❌ Functions deployment failed:', error.message);
  process.exit(1);
} 