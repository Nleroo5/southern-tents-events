# Southern Tents and Events Website

A modern, high-performance website for Southern Tents and Events - a premium event tent and equipment rental company.

## 🎯 Project Overview

This is a fully static, SEO-optimized website built with HTML5, CSS3, and vanilla JavaScript. The site is designed for optimal performance, accessibility, and user experience.

**Live Site:** [https://southerntentsandevents.com](https://southerntentsandevents.com)

## ✨ Features

- **Modern Design System** - Custom CSS variables for consistent branding
- **Fully Responsive** - Mobile-first design that works on all devices
- **SEO Optimized** - Semantic HTML, meta tags, structured data, sitemap
- **Fast Loading** - Optimized assets, lazy loading, minimal dependencies
- **Accessible** - WCAG 2.1 AA compliant with keyboard navigation
- **Interactive Components** - Contact forms, image gallery, smooth animations
- **No Dependencies** - Pure vanilla JavaScript, no frameworks needed

## 📁 Project Structure

```
southern-tents-events/
├── index.html              # Homepage
├── about.html              # About page
├── services.html           # Services page
├── gallery.html            # Photo gallery
├── contact.html            # Contact form
├── faq.html                # FAQ page
├── pricing.html            # Pricing guide
├── privacy.html            # Privacy policy
├── terms.html              # Terms of service
├── 404.html                # 404 error page
├── sitemap.xml             # XML sitemap for SEO
├── robots.txt              # Robots file for search engines
├── vercel.json             # Vercel deployment configuration
├── css/
│   ├── reset.css           # CSS reset & normalize
│   ├── variables.css       # Design system tokens
│   ├── components.css      # Reusable components
│   └── main.css            # Main styles
├── js/
│   ├── utils.js            # Utility functions
│   ├── components.js       # Interactive components
│   └── main.js             # Main initialization
├── images/                 # Image assets
└── assets/                 # Other assets (favicons, etc.)
```

## 🎨 Design System

The website uses a comprehensive design system with CSS custom properties:

### Brand Colors
- Primary: `#2e3e52` (Deep navy blue)
- Secondary: `#b97332` (Warm copper)
- Accent: `#973f0e` (Rich terracotta)
- Background: `#f5f0e6` (Warm cream)

### Typography
- Headings: Playfair Display (serif)
- Body: System font stack (optimal performance)
- Scale: 1.25 ratio (Major Third)

### Spacing
- Base unit: 8px
- Scale: 0.5rem to 12rem

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings
   - Click "Deploy"

3. **Custom Domain:**
   - In Vercel dashboard, go to Settings > Domains
   - Add `southerntentsandevents.com`
   - Follow DNS configuration instructions

### Manual Deployment

You can also host this on any static hosting service:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Simply upload all files to your hosting service.

## 🔧 Customization

### Update Contact Information

1. **Phone & Email:**
   - Search for `(XXX) XXX-XXXX` and replace with actual phone number
   - Search for `info@southerntentsandevents.com` and update if needed

2. **Address:**
   - Search for "Your Street Address" and update with real address

3. **Business Hours:**
   - Update in `index.html` and `contact.html`

### Update Content

- **Logo:** Replace the Firebase Storage URL with your own logo URL
- **Images:** Add your own event photos to `/images/` folder
- **Services:** Edit `services.html` to match your offerings
- **Pricing:** Update `pricing.html` with your actual pricing

### Update Colors

Edit `/css/variables.css`:
```css
:root {
  --color-primary: #2e3e52;
  --color-secondary: #b97332;
  --color-accent: #973f0e;
  --color-background: #f5f0e6;
}
```

## 📝 Form Setup

The contact form is currently set up with client-side validation. To make it functional:

### Option 1: Formspree (Easiest)
1. Sign up at [formspree.io](https://formspree.io)
2. Get your form endpoint
3. Update form action in `contact.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```

### Option 2: Custom Backend
- Set up Firebase Cloud Functions
- Or use any backend service (Node.js, PHP, etc.)
- Update the form submission handler in `js/components.js`

### Option 3: Email Service
- Use services like EmailJS, SendGrid, or Mailgun
- Follow their integration guides

## 🔍 SEO Checklist

- [x] Semantic HTML5 structure
- [x] Meta descriptions on all pages
- [x] Open Graph tags for social sharing
- [x] Twitter Card tags
- [x] Structured data (Schema.org)
- [x] XML sitemap (`sitemap.xml`)
- [x] Robots.txt file
- [x] Alt text on all images
- [x] Proper heading hierarchy (h1 > h2 > h3)
- [x] Mobile-friendly (responsive design)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Set up Google Analytics (optional)

## ⚡ Performance Optimization

- **Images:** Use WebP format with fallbacks
- **Lazy Loading:** Images load as they enter viewport
- **Minification:** Minify CSS/JS for production
- **Caching:** Vercel handles caching automatically
- **CDN:** Vercel provides global CDN

### Lighthouse Targets
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## 🛠️ Development

### Local Development

1. **Using VS Code Live Server:**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

2. **Using Python:**
   ```bash
   python -m http.server 8000
   ```
   Open http://localhost:8000

3. **Using Node.js:**
   ```bash
   npx serve
   ```

### Testing

- **Responsiveness:** Test on mobile, tablet, desktop
- **Browsers:** Chrome, Safari, Firefox, Edge
- **Accessibility:** Use aXe DevTools or WAVE
- **Performance:** Run Lighthouse audit in Chrome DevTools

## 📱 Browser Support

- Chrome (latest 2 versions)
- Safari (latest 2 versions)
- Firefox (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari 12+
- Android Chrome 90+

## 🤝 Contributing

This is a client project. For updates or changes:
1. Create a new branch
2. Make changes
3. Test thoroughly
4. Submit for review

## 📄 License

© 2025 Southern Tents and Events. All rights reserved.

## 📞 Support

For technical issues or questions:
- Developer: [Your Name]
- Email: [Your Email]

## 🎓 Next Steps

1. ✅ **Replace placeholder content** (phone, email, address)
2. ✅ **Add real images** to the gallery
3. ✅ **Set up form submission** (Formspree or custom backend)
4. ✅ **Connect custom domain** in Vercel
5. ✅ **Submit sitemap** to Google Search Console
6. ✅ **Add Google Analytics** (optional)
7. ✅ **Set up booking system** integration (Cal.com/Calendly)
8. ✅ **Add testimonials** with real client reviews
9. ✅ **Optimize images** (compress, convert to WebP)
10. ✅ **Final testing** across all devices and browsers

---

**Built with ❤️ using HTML, CSS, and JavaScript**
