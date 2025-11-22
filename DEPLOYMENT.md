# 🚀 Deployment Guide - Southern Tents and Events

This guide will walk you through deploying your website to Vercel and connecting your custom domain.

## Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free tier is fine)
- ✅ Access to your domain registrar (for DNS settings)

## Step 1: Push to GitHub

1. **Initialize Git repository (if not already done):**
   ```bash
   cd /Users/nicolasleroo/Desktop/southern-tents-events
   git init
   git add .
   git commit -m "Initial commit - Southern Tents and Events website"
   ```

2. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name: `southern-tents-events`
   - Description: "Website for Southern Tents and Events"
   - Keep it Private (recommended)
   - Do NOT initialize with README (we already have one)
   - Click "Create repository"

3. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/southern-tents-events.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Find and select your `southern-tents-events` repository
   - Click "Import"

3. **Configure Project:**
   - **Project Name:** `southern-tents-events` (or your choice)
   - **Framework Preset:** Other (it will auto-detect static site)
   - **Root Directory:** `./` (leave default)
   - **Build Command:** Leave empty (static site)
   - **Output Directory:** Leave empty

4. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes for deployment
   - You'll get a URL like: `https://southern-tents-events.vercel.app`

## Step 3: Connect Custom Domain

1. **Add Domain in Vercel:**
   - Go to your project dashboard
   - Click "Settings" → "Domains"
   - Enter `southerntentsandevents.com`
   - Click "Add"

2. **Configure DNS (at your domain registrar):**

   Vercel will show you the DNS records to add. Typically:

   **For Root Domain (southerntentsandevents.com):**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **For WWW subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **Wait for DNS Propagation:**
   - DNS changes can take 24-48 hours
   - Usually happens within 1-2 hours
   - Check status in Vercel dashboard

4. **SSL Certificate:**
   - Vercel automatically provisions SSL (HTTPS)
   - This happens automatically once DNS is configured
   - Your site will be secure with https://

## Step 4: Post-Deployment Checklist

### Immediate Updates

1. **Update Contact Information:**
   - [ ] Replace `(XXX) XXX-XXXX` with real phone number
   - [ ] Update email addresses if needed
   - [ ] Add real business address

2. **Update Content:**
   - [ ] Add real event photos to gallery
   - [ ] Update pricing if needed
   - [ ] Add actual testimonials
   - [ ] Update business hours

3. **Set Up Forms:**
   - [ ] Configure Formspree or custom form backend
   - [ ] Test form submissions
   - [ ] Set up email notifications

### SEO Setup

4. **Google Search Console:**
   - Go to https://search.google.com/search-console
   - Add property: `southerntentsandevents.com`
   - Verify ownership (DNS or HTML upload)
   - Submit sitemap: `https://southerntentsandevents.com/sitemap.xml`

5. **Google Business Profile:**
   - Claim your Google Business listing
   - Add website URL
   - Upload photos from your gallery

6. **Google Analytics (Optional):**
   - Create GA4 property
   - Add tracking code to all pages (before `</head>`)
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Performance Optimization

7. **Image Optimization:**
   - [ ] Compress all images (use TinyPNG.com or similar)
   - [ ] Convert to WebP format where possible
   - [ ] Ensure images are under 200KB each

8. **Run Lighthouse Audit:**
   - Open site in Chrome
   - Open DevTools (F12)
   - Go to "Lighthouse" tab
   - Click "Generate report"
   - Fix any issues identified

### Marketing Setup

9. **Social Media:**
   - [ ] Update Facebook business page with website URL
   - [ ] Update Instagram bio with website link
   - [ ] Share website launch post

10. **Email Signature:**
    - [ ] Add website URL to team email signatures
    - [ ] Update business cards if needed

## Step 5: Ongoing Maintenance

### Making Updates

1. **Edit files locally** in VS Code
2. **Test changes** using Live Server
3. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Vercel auto-deploys** - changes live in ~1 minute!

### Regular Tasks

- **Weekly:** Check form submissions, respond to inquiries
- **Monthly:** Update gallery with new event photos
- **Quarterly:** Review and update pricing
- **Yearly:** Update privacy policy and terms if needed

## Troubleshooting

### Site Not Loading
- Check DNS settings in your registrar
- Verify domain is added in Vercel settings
- Wait 24-48 hours for DNS propagation

### Forms Not Working
- Check form action URL
- Verify Formspree/backend is configured
- Check browser console for errors (F12)

### Images Not Loading
- Ensure image URLs are correct
- Check image file paths are absolute (`/images/...`)
- Verify images are uploaded to correct folder

### Styling Issues
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check CSS file paths in HTML

## Support

If you need help with deployment:

1. **Vercel Documentation:** https://vercel.com/docs
2. **GitHub Documentation:** https://docs.github.com
3. **Contact Developer:** [Your Email]

## Backup & Security

1. **GitHub serves as backup** - your code is safe
2. **Vercel keeps deployment history** - can rollback if needed
3. **Enable 2FA** on GitHub and Vercel accounts
4. **Don't commit sensitive data** (API keys, passwords) to Git

---

## Quick Reference Commands

```bash
# Check current status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub (triggers Vercel deployment)
git push

# View commit history
git log --oneline

# Create a new branch for testing
git checkout -b feature-name

# Switch back to main branch
git checkout main

# Merge feature branch
git merge feature-name
```

---

**✅ Once deployed, share the website:**
- Add to email signature
- Post on social media
- Add to Google Business Profile
- Include on business cards and marketing materials

**🎉 Congratulations! Your website is live!**
