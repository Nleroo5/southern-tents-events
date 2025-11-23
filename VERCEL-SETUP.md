# Vercel Deployment Setup for Form Submission

## ✅ What Has Been Completed

1. **Serverless Function Created**: `/api/quote.js`
   - Handles form submissions via POST requests
   - Sends formatted emails using Gmail + Nodemailer
   - Includes rate limiting, validation, and error handling

2. **Vercel Configuration**: `vercel.json`
   - Configured for Vercel serverless functions
   - API routing properly set up

3. **Frontend Updated**: `js/quote-form.js`
   - Dynamic API endpoint (works locally and in production)
   - Proper error handling and user feedback

4. **Local Environment**: `.env` file
   - Gmail credentials configured locally
   - **NEVER commit this file to Git**

---

## 🚀 Next Steps: Deploy to Vercel

### Step 1: Add Environment Variables to Vercel

You need to add your Gmail credentials to Vercel's environment variables:

1. **Go to your Vercel Dashboard**:
   - Visit: https://vercel.com/dashboard
   - Select your project: `southern-tents-events`

2. **Navigate to Settings**:
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add These Two Variables**:

   **Variable 1:**
   - Key: `EMAIL_USER`
   - Value: `Southerntentsevents@gmail.com`
   - Environment: Select all (Production, Preview, Development)
   - Click "Add"

   **Variable 2:**
   - Key: `EMAIL_APP_PASSWORD`
   - Value: `hrpigfzmykusjigt`
   - Environment: Select all (Production, Preview, Development)
   - Click "Add"

4. **Redeploy** (if already deployed):
   - Go to "Deployments" tab
   - Click "..." menu on the latest deployment
   - Click "Redeploy"

### Step 2: Verify Deployment

Once environment variables are added and the site is deployed:

1. **Test the Form**:
   - Visit: https://southerntentsandevents.com/contact.html
   - Fill out the form with test data
   - Submit and check for success message

2. **Check Your Gmail**:
   - Look for email at: Southerntentsevents@gmail.com
   - Should receive formatted quote request with all details

3. **Check Vercel Logs** (if issues):
   - Go to Vercel Dashboard → Your Project → "Functions" tab
   - Click on `/api/quote`
   - View logs to see any errors

---

## 🔧 Testing Locally

To test the form locally before deploying:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Server**:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   - Visit: http://localhost:3000
   - Test the contact form
   - Emails will be sent via your Gmail account

---

## 📧 How the Email System Works

### When a User Submits the Form:

1. **Frontend** (`quote-form.js`):
   - Validates required fields
   - Ensures at least one rental item is selected
   - Sends form data to `/api/quote` endpoint

2. **Backend** (`api/quote.js`):
   - Validates email address format
   - Calculates item quantities and subtotals
   - Generates professional HTML email
   - Sends email to: `Southerntentsevents@gmail.com`
   - Email includes:
     - Customer contact information
     - Event date and location
     - Requested rental items with quantities
     - Calculated subtotal (base pricing)
     - Special requests/messages

3. **Email Delivery**:
   - Uses Gmail SMTP via Nodemailer
   - Reply-To is set to customer's email
   - Professional branded email template

---

## 🚨 Troubleshooting

### Issue 1: "Cannot find module 'nodemailer'"
**Fix**: Vercel automatically installs dependencies from `package.json`
- Ensure `package.json` is committed to Git
- Redeploy after pushing changes

### Issue 2: "Unauthorized" or 535 Error
**Fix**: Gmail App Password is incorrect or not set
- Verify environment variables in Vercel Dashboard
- Make sure you're using the App Password, not your regular Gmail password
- App Password: `hrpigfzmykusjigt`

### Issue 3: 404 Error When Submitting Form
**Fix**: API endpoint not properly configured
- Check `vercel.json` is committed to Git
- Verify environment variables are set in Vercel
- Check Vercel logs for deployment errors

### Issue 4: CORS Error
**Fix**: CORS headers are already configured in `api/quote.js`
- If still having issues, check browser console for specific error
- Verify the API endpoint URL is correct

### Issue 5: Email Not Sending
**Fix**: Check Vercel Function Logs:
1. Go to Vercel Dashboard → Your Project
2. Click "Deployments" → Select latest deployment
3. Click "Functions" tab
4. Click on `/api/quote`
5. View logs for detailed error messages

### Issue 6: "Too Many Requests" Error
**Fix**: Rate limiting is enabled (5 requests per 15 minutes per IP)
- This is intentional to prevent spam
- Wait 15 minutes and try again
- Or adjust rate limit in `api/quote.js` if needed

---

## 📝 Important Notes

### Security:
- ✅ `.env` file is in `.gitignore` (never committed to Git)
- ✅ Environment variables are stored securely in Vercel
- ✅ Rate limiting prevents spam submissions
- ✅ Input validation protects against malicious data

### Gmail App Password:
- The App Password (`hrpigfzmykusjigt`) is specific to this application
- It's different from your regular Gmail password
- If you need to regenerate it:
  1. Go to: https://myaccount.google.com/apppasswords
  2. Create new app password
  3. Update environment variables in Vercel
  4. Update `.env` file locally

### Email Recipient:
- All quote requests are sent to: `Southerntentsevents@gmail.com`
- To change recipient, edit line 310 in `api/quote.js`

---

## ✅ Deployment Checklist

Before going live, verify:

- [ ] Environment variables added to Vercel (`EMAIL_USER` and `EMAIL_APP_PASSWORD`)
- [ ] Latest code pushed to GitHub
- [ ] Vercel automatically deployed latest changes
- [ ] Test form submission on live site
- [ ] Check Gmail inbox for test quote request
- [ ] Verify email formatting looks correct
- [ ] Test reply functionality (click reply in email)
- [ ] Check mobile responsiveness of form

---

## 🎉 You're All Set!

Once environment variables are added to Vercel, your quote form will be fully functional and ready to accept customer inquiries!

The form will automatically:
- Validate customer input
- Calculate rental subtotals
- Send professional branded emails
- Provide immediate feedback to customers
- Store nothing in databases (email-only system)

If you encounter any issues, check the troubleshooting section above or review the Vercel Function logs for detailed error messages.
