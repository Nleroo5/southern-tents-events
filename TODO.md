# 📋 Customization Checklist

Before launching the website, customize the following placeholder content with your actual business information.

## 🔴 Critical (Replace Before Launch)

### Contact Information

- [ ] **Phone Number:** Replace `(XXX) XXX-XXXX` with actual phone number
  - Files: `index.html`, `contact.html`, `privacy.html`, `terms.html`, `404.html`
  - Search for: `(XXX) XXX-XXXX` or `+1234567890`

- [ ] **Email Address:** Verify or update `info@southerntentsandevents.com`
  - Files: All HTML files
  - Update if you use a different email

- [ ] **Physical Address:** Replace placeholder address
  - Files: `index.html`, `contact.html`, `privacy.html`, `terms.html`
  - Search for: "Your Street Address"

- [ ] **Business Hours:** Verify hours are correct
  - Files: `index.html`, `contact.html`
  - Currently set to: Mon-Fri 9-6, Sat 10-4, Sun by appointment

### Social Media Links

- [ ] **Facebook URL:** Update in `index.html` footer
  - Current: `https://www.facebook.com/southerntentsandevents`

- [ ] **Instagram URL:** Update in `index.html` footer
  - Current: `https://www.instagram.com/southerntentsandevents`

## 🟡 Important (Update Soon)

### Content

- [ ] **Gallery Images:** Replace Unsplash placeholder images with real photos
  - Files: `index.html`, `gallery.html`, `services.html`, `about.html`
  - Location: `/images/` folder
  - Add 12-20 high-quality event photos

- [ ] **Testimonials:** Add real client testimonials
  - File: `index.html` (testimonials section)
  - Get permission to use client names
  - Add 3-6 testimonials

- [ ] **About Page:** Customize your story
  - File: `about.html`
  - Update company history
  - Add years in business
  - Update statistics (events completed, happy clients, etc.)

- [ ] **Pricing:** Verify all prices are accurate
  - File: `pricing.html`
  - Update tent rental prices
  - Update furniture and equipment prices
  - Adjust based on your market

### Form Setup

- [ ] **Contact Form Backend:**
  - Option 1: Set up Formspree (easiest)
    1. Go to https://formspree.io
    2. Create account
    3. Get form endpoint
    4. Update form in `contact.html` and `index.html`

  - Option 2: Set up custom backend
    - Use Firebase Cloud Functions
    - Or create PHP/Node.js backend
    - Update `js/components.js` with API endpoint

- [ ] **Test Form Submissions:**
  - Submit test form
  - Verify emails are received
  - Test validation messages

## 🟢 Optional Enhancements

### SEO & Analytics

- [ ] **Google Analytics:** Add tracking code
  - Get GA4 tracking ID
  - Add to all HTML pages before `</head>`

- [ ] **Google Search Console:**
  - Add and verify property
  - Submit sitemap.xml
  - Monitor for errors

- [ ] **Meta Descriptions:** Customize for local SEO
  - Add city/region names to meta descriptions
  - Update in each HTML file's `<head>`

- [ ] **Open Graph Images:** Create custom images
  - Design 1200x630px image for social sharing
  - Upload to `/images/og-image.jpg`
  - Update OG image URLs in all HTML files

### Features

- [ ] **Booking System Integration:**
  - Sign up for Cal.com or Calendly
  - Get embed code
  - Add booking widget to contact page or create dedicated booking page

- [ ] **Live Chat Widget (optional):**
  - Consider adding Tidio, Intercom, or similar
  - Helps with customer service

- [ ] **Customer Reviews Widget:**
  - Google Reviews integration
  - Yelp reviews
  - Display on homepage

- [ ] **Blog Section (optional):**
  - Add `/blog.html` page
  - Share event tips, trends, success stories
  - Good for SEO

### Performance

- [ ] **Image Optimization:**
  - Compress all images (use TinyPNG.com)
  - Convert to WebP format
  - Keep images under 200KB each

- [ ] **Favicon:**
  - Create favicon.ico
  - Add to `/assets/` folder
  - Create multiple sizes (16x16, 32x32, 180x180)
  - Update links in all HTML files

- [ ] **Performance Audit:**
  - Run Lighthouse in Chrome DevTools
  - Aim for 90+ scores in all categories
  - Fix any identified issues

### Legal

- [ ] **Privacy Policy:** Review and customize
  - File: `privacy.html`
  - Update company name and address
  - Add any specific data collection practices

- [ ] **Terms of Service:** Review and customize
  - File: `terms.html`
  - Customize rental terms
  - Have attorney review if needed

## 📝 Search & Replace Guide

Use your code editor's find and replace feature:

| Find This | Replace With | Files |
|-----------|--------------|-------|
| `(XXX) XXX-XXXX` | Your phone number | All HTML |
| `+1234567890` | Your phone (tel: link) | All HTML |
| `Your Street Address` | Your actual address | Multiple |
| `City, State ZIP` | Your city/state/zip | Multiple |
| `Not specified` | Actual information | About page |

## 🎯 Priority Order

1. **Week 1 (Critical):**
   - Contact information (phone, email, address)
   - Social media links
   - Form backend setup
   - Test all functionality

2. **Week 2 (Important):**
   - Add real gallery images
   - Update pricing
   - Add testimonials
   - Verify all content accuracy

3. **Week 3 (SEO):**
   - Set up Google Search Console
   - Add Google Analytics
   - Submit sitemap
   - Optimize images

4. **Ongoing:**
   - Regularly update gallery
   - Collect and add new testimonials
   - Update pricing seasonally
   - Monitor and respond to inquiries

## ✅ Validation Checklist

Before going live, test:

- [ ] All navigation links work
- [ ] Contact form submits successfully
- [ ] Phone numbers are clickable (tel: links)
- [ ] Email links open mail client
- [ ] Site works on mobile phone
- [ ] Site works on tablet
- [ ] Site works on desktop
- [ ] All images load
- [ ] No console errors (F12 in browser)
- [ ] Fast loading (under 3 seconds)
- [ ] All pages have correct titles
- [ ] 404 page works
- [ ] Social media links work

---

**Use this checklist as you customize the site. Check off items as you complete them!**
