# Southern Tents & Events - Quote Form Setup Guide

This guide will help you set up the custom email backend for the quote form.

## 🎯 Overview

The quote form now uses a custom Node.js backend server that:
- Receives form submissions directly from your website
- Sends beautifully formatted HTML emails to Southerntentsevents@gmail.com
- The email comes from the server (not the customer)
- Includes all quote details, customer info, and requested items
- Has rate limiting to prevent spam
- Is secure and reliable

## 📋 Prerequisites

You need to have **Node.js** installed on your computer.

To check if you have it:
```bash
node --version
```

If you don't have it, download from: https://nodejs.org (download the LTS version)

## 🚀 Setup Instructions

### Step 1: Install Dependencies

Open Terminal and navigate to your project folder:
```bash
cd /Users/nicolasleroo/Desktop/southern-tents-events
```

Install the required packages:
```bash
npm install
```

This will install:
- express (web server)
- nodemailer (email sending)
- cors (security)
- helmet (security)
- express-rate-limit (spam protection)
- dotenv (environment variables)

### Step 2: Configure Gmail

**IMPORTANT:** You need to create a Gmail App Password (NOT your regular Gmail password)

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com
   - Sign in with the Gmail account you want to use (Southerntentsevents@gmail.com)

2. **Enable 2-Step Verification** (if not already enabled)
   - Go to Security section
   - Find "2-Step Verification" and turn it on
   - Follow the prompts to set it up

3. **Create an App Password**
   - Go back to Security section
   - Click on "App passwords" (you'll only see this if 2-Step is enabled)
   - Select app: Choose "Mail"
   - Select device: Choose "Other (Custom name)"
   - Type: "Southern Tents Website"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Create Environment File

1. In your project folder, copy the example file:
```bash
cp .env.example .env
```

2. Open the `.env` file in a text editor and add your information:
```
EMAIL_USER=Southerntentsevents@gmail.com
EMAIL_APP_PASSWORD=abcd efgh ijkl mnop
PORT=3000
```

Replace `abcd efgh ijkl mnop` with the actual app password from Step 2.

**IMPORTANT:** Remove the spaces from the app password! It should be 16 characters like: `abcdefghijklmnop`

### Step 4: Start the Server

In Terminal, run:
```bash
npm start
```

You should see:
```
🎪 Southern Tents & Events Quote Server
📧 Email service ready
🚀 Server running on port 3000
```

### Step 5: Test the Form

1. Keep the server running in Terminal
2. Open your website in a browser
3. Go to the Contact page
4. Fill out and submit the quote form
5. Check your email at Southerntentsevents@gmail.com

## 🖥️ Running in Production

For production (when your website is live), you'll need to:

### Option 1: Deploy to a Cloud Service (Recommended)

**Using Heroku (Free tier available):**

1. Create account at https://heroku.com
2. Install Heroku CLI
3. Deploy your server:
```bash
heroku login
heroku create southern-tents-api
heroku config:set EMAIL_USER=Southerntentsevents@gmail.com
heroku config:set EMAIL_APP_PASSWORD=your-app-password
git push heroku main
```

4. Update `js/quote-form.js` line 141:
```javascript
const response = await fetch('https://southern-tents-api.herokuapp.com/api/quote', {
```

**Using Vercel (Free tier available):**

1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Add environment variables in Vercel dashboard

### Option 2: Run on Your Own Server

If you have a VPS or hosting with Node.js support:

1. Upload all files to your server
2. Run `npm install`
3. Set up environment variables
4. Use PM2 to keep it running:
```bash
npm install -g pm2
pm2 start server.js --name southern-tents
pm2 save
pm2 startup
```

5. Update the fetch URL in `js/quote-form.js` to your server's domain

## 📧 Email Format

The emails sent will include:
- Customer name, email, phone
- Event date, location, guest count
- All requested rental items with quantities and prices
- Special requests/message
- Beautiful HTML formatting with your brand colors
- Timestamp of submission

## 🔒 Security Features

- **Rate Limiting:** Max 5 quote requests per 15 minutes per IP
- **CORS Protection:** Only accepts requests from your domain
- **Helmet.js:** Security headers
- **Input Validation:** Email and required fields validated
- **App Password:** Never exposes your actual Gmail password

## 🐛 Troubleshooting

### "Cannot find module" error
Run `npm install` again

### Email not sending
- Check your app password is correct (no spaces)
- Verify 2-Step Verification is enabled
- Check Gmail account has not blocked the app
- Look at Terminal for error messages

### Form submission fails
- Make sure the server is running (`npm start`)
- Check browser console for errors (F12 → Console tab)
- Verify the URL in `quote-form.js` matches your server

### "Authentication failed" error
- Your app password is incorrect
- Make sure you removed all spaces from the password
- Create a new app password and try again

## 💡 Development vs Production

**Development (Local):**
```javascript
// In quote-form.js line 141
fetch('http://localhost:3000/api/quote', {
```

**Production (Live website):**
```javascript
// In quote-form.js line 141
fetch('https://your-domain.com/api/quote', {
```

## 📞 Need Help?

If you encounter issues:
1. Check the Terminal for error messages
2. Check browser console (F12 → Console)
3. Verify all steps above were completed
4. Make sure Node.js is installed correctly

## 🎉 Success!

Once everything is set up, when someone fills out your quote form:
1. They fill out the form on your website
2. The form sends data to your Node.js server
3. Your server formats a beautiful email
4. Email is sent from your server to Southerntentsevents@gmail.com
5. Customer never sees the backend - it all happens automatically!

The email will **come from your server** (not the customer), so all quote requests will arrive neatly in your inbox ready to respond to.
