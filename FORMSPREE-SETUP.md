# 📧 Formspree Setup Guide for Quote Form

Your new simplified quote form is ready! Follow these simple steps to connect it to your email.

---

## ✅ What's Been Completed

- ✅ Simplified single-column form layout
- ✅ Quantity selectors for all rental items (Tents, Tables, Chairs, Lighting, Accessories)
- ✅ Rustic-styled +/- buttons with visual feedback
- ✅ Beautiful thank you modal with rustic design
- ✅ Form validation (requires at least one item selected)
- ✅ Mobile-responsive design
- ✅ Ready for Formspree email integration

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Formspree Account

1. Go to [https://formspree.io](https://formspree.io)
2. Click "Get Started" or "Sign Up"
3. Create a free account using your email

### Step 2: Create Your Form

1. Once logged in, click "+ New Form"
2. Give it a name: "Quote Request Form"
3. Formspree will generate a unique form endpoint like: `https://formspree.io/f/xyzabc123`
4. **Copy this URL** - you'll need it in the next step

### Step 3: Update contact.html

1. Open `/contact.html`
2. Find line 59 which currently says:
   ```html
   <form data-validate id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Replace `YOUR_FORM_ID` with your actual Formspree ID
4. Example final result:
   ```html
   <form data-validate id="contact-form" action="https://formspree.io/f/xyzabc123" method="POST">
   ```
5. Save the file

### Step 4: Configure Email Settings in Formspree

1. In your Formspree dashboard, click on your form
2. Go to "Settings"
3. Set these options:
   - **Email to:** `Southerntentsevents@gmail.com` (or your preferred email)
   - **Reply-to field:** `email` (so you can reply directly to customers)
   - **Email subject:** `New Quote Request from Website`

### Step 5: Test Your Form

1. Go to your website's contact page
2. Fill out the form with test data
3. Select some rental items using the +/- buttons
4. Submit the form
5. You should see the "Thank You" modal appear
6. Check your email for the quote request

---

## 📋 What You'll Receive via Email

When someone submits a quote request, you'll get an email with:

- **Customer Contact Info:**
  - Name
  - Email
  - Phone
  - Event Date

- **Rental Items Requested:** (nicely formatted by category)
  - TENTS
    - 20x20 Frame Tent: 1
    - 30x40 Frame Tent: 2
  - TABLES
    - 60" Round Table: 10
  - CHAIRS
    - White Folding Chair: 80
  - (etc.)

- **Special Requests:** Any additional notes from the customer

---

## 💡 Formspree Features You Get

### Free Plan (50 submissions/month):
- ✅ Email notifications
- ✅ Spam protection
- ✅ Email confirmation to customer
- ✅ Form submissions archive
- ✅ Export to CSV

### Paid Plans ($10/month):
- Unlimited submissions
- File uploads
- Custom autoresponders
- Webhooks integration
- Priority support

---

## 🎨 How the Form Works

### Quantity Selectors:
- Click **+** to add items
- Click **−** to remove items
- Cards highlight when items are selected (cream background, golden border)
- Visual feedback with animations

### Form Validation:
- All contact fields are required
- Must select at least one rental item
- Clear error messages if something's missing

### Thank You Experience:
- Beautiful modal pops up on successful submission
- Confirmation message
- Options to close or view gallery
- Form automatically resets

---

## 🔧 Advanced Customization (Optional)

### Custom Email Template:

In Formspree settings, you can customize the email template:

```
New Quote Request

From: {{name}}
Email: {{email}}
Phone: {{phone}}
Event Date: {{event-date}}

{{items_requested}}

Additional Notes:
{{message}}
```

### Add reCAPTCHA (Prevent Spam):

1. In Formspree dashboard, go to form settings
2. Enable reCAPTCHA v2 or v3
3. No code changes needed - Formspree handles it

### Email Confirmations to Customers:

1. In Formspree settings, enable "Autoresponder"
2. Customize the message customers receive:

```
Thank you for your quote request!

We've received your request and will get back to you within 48 hours with a detailed quote.

If you have any urgent questions, call us at 770-328-2920.

- Southern Tents and Events Team
```

---

## 🐛 Troubleshooting

### Form not submitting?
- Check that you replaced `YOUR_FORM_ID` with your actual Formspree ID
- Make sure you're connected to the internet
- Check browser console for errors (F12)

### Not receiving emails?
- Check spam/junk folder
- Verify email address in Formspree settings
- Test with a different email address

### Quantity buttons not working?
- Make sure `/js/quote-form.js` is loaded
- Check browser console for JavaScript errors
- Try hard-refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

## 📱 Mobile Experience

The form is fully responsive:
- Quantity buttons are touch-friendly
- Single column layout on mobile
- Easy to use on phones and tablets
- Modal works perfectly on all devices

---

## 🎯 Next Steps After Setup

1. **Test thoroughly** - Submit test quotes with different items
2. **Create email templates** - Have a standard quote response ready
3. **Set up autoresponder** - So customers know you received their request
4. **Monitor submissions** - Check Formspree dashboard regularly
5. **Track conversions** - See which items are most requested

---

## ✅ Checklist

- [ ] Create Formspree account
- [ ] Get form endpoint URL
- [ ] Update contact.html with your Formspree ID
- [ ] Configure email settings in Formspree
- [ ] Submit test quote request
- [ ] Verify email received
- [ ] Enable autoresponder (optional)
- [ ] Add reCAPTCHA (optional)
- [ ] Create email template for responses
- [ ] Add to favorites/bookmarks for easy access

---

## 💬 Support

If you have questions:
- **Formspree Docs:** https://help.formspree.io
- **Formspree Support:** support@formspree.io

Your form is production-ready! Just add your Formspree ID and you're good to go! 🎉
