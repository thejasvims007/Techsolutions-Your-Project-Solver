/**
 * Setup Verification Script
 * This script checks if the Tech Solutions application is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Tech Solutions - Setup Verification\n');
console.log('='.repeat(50));

let hasErrors = false;

// Check 1: Environment files
console.log('\n📄 Checking environment files...');
const rootEnvExists = fs.existsSync(path.join(__dirname, '.env'));
const frontendEnvExample = fs.existsSync(path.join(__dirname, 'frontend', '.env.example'));

if (rootEnvExists) {
    console.log('✅ Root .env file exists');
} else {
    console.log('❌ Root .env file missing - copy from .env.example');
    hasErrors = true;
}

if (frontendEnvExample) {
    console.log('✅ Frontend .env.example exists');
} else {
    console.log('⚠️  Frontend .env.example missing');
}

// Check 2: Dependencies
console.log('\n📦 Checking dependencies...');
const rootNodeModules = fs.existsSync(path.join(__dirname, 'node_modules'));
const frontendNodeModules = fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'));

if (rootNodeModules) {
    console.log('✅ Backend dependencies installed');
} else {
    console.log('❌ Backend dependencies missing - run: npm install');
    hasErrors = true;
}

if (frontendNodeModules) {
    console.log('✅ Frontend dependencies installed');
} else {
    console.log('❌ Frontend dependencies missing - run: cd frontend && npm install');
    hasErrors = true;
}

// Check 3: Required files
console.log('\n📁 Checking required files...');
const requiredFiles = [
    'server.js',
    'package.json',
    'frontend/package.json',
    'frontend/src/App.jsx',
    'frontend/src/services/api.js',
    'README.md',
    'DEPLOYMENT.md'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} missing`);
        hasErrors = true;
    }
});

// Check 4: Environment variables
console.log('\n🔐 Checking environment configuration...');
if (rootEnvExists) {
    const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
    const requiredVars = ['PORT', 'MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL', 'NODE_ENV'];

    requiredVars.forEach(varName => {
        if (envContent.includes(varName)) {
            console.log(`✅ ${varName} is configured`);
        } else {
            console.log(`⚠️  ${varName} is missing in .env`);
        }
    });
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('\n❌ Setup verification failed!');
    console.log('\nPlease fix the errors above and run this script again.');
    console.log('\nQuick fix commands:');
    console.log('  npm install');
    console.log('  cd frontend && npm install && cd ..');
    console.log('  cp .env.example .env');
    console.log('  cd frontend && cp .env.example .env.local && cd ..');
    process.exit(1);
} else {
    console.log('\n✅ Setup verification passed!');
    console.log('\nYour application is ready to run.');
    console.log('\nNext steps:');
    console.log('  1. Make sure MongoDB is running');
    console.log('  2. Run: npm run dev');
    console.log('  3. Visit: http://localhost:3000');
    console.log('  4. Seed database: http://localhost:5000/api/seed');
    console.log('\nDefault credentials:');
    console.log('  Admin: admin@techsolutions.com / admin123');
}

console.log('\n');
