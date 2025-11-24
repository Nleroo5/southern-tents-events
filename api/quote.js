/**
 * Southern Tents & Events - Quote Form Serverless Function
 * Handles form submissions and sends emails to business owner
 * Vercel Serverless Function
 */

const nodemailer = require('nodemailer');
const path = require('path');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Format items for email display
function formatQuoteItems(formData) {
  const items = [];

  const itemList = {
    'tent-20x20-canopy': { name: '20x20 All Purpose Canopy', price: '$300.00' },
    'tent-20x20-peak': { name: '20x20 High Peak Tent', price: '$375.00' },
    'tent-20x30-canopy': { name: '20x30 All Purpose Canopy', price: '$380.00' },
    'tent-20x40-peak': { name: '20x40 High Peak Tent', price: '$700.00' },
    'dancefloor-12x12': { name: '12x12 Dark Maple Dance Floor', price: '$200.00' },
    'dancefloor-15x15': { name: '15x15 Dark Maple Dance Floor', price: '$350.00' },
    'dancefloor-18x18': { name: '18x18 Dark Maple Dance Floor', price: '$500.00' },
    'dancefloor-24x24': { name: '24x24 Dark Maple Dance Floor', price: '$800.00' },
    'table-farm-8ft': { name: '8\' Farm Table', price: '$85.00 each' },
    'chair-crossback': { name: 'Crossback Chair', price: '$8.00 each' },
    'lights-string': { name: 'String Lights', price: '$1.25 per sq ft' },
    'lights-pole': { name: 'Light Support Pole', price: '$10.00 each' },
    'popcorn-machine': { name: 'Popcorn Machine', price: '$75.00' },
    'cotton-candy-machine': { name: 'Cotton Candy Machine', price: '$75.00' }
  };

  let subtotal = 0;

  Object.keys(itemList).forEach(key => {
    const quantity = parseInt(formData[key]) || 0;
    if (quantity > 0) {
      const itemInfo = itemList[key];
      const priceString = itemInfo.price;
      const priceMatch = priceString.match(/\$?([\d,]+\.?\d*)/);
      const unitPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
      const lineTotal = unitPrice * quantity;
      subtotal += lineTotal;

      items.push({
        name: itemInfo.name,
        quantity: quantity,
        price: priceString,
        unitPrice: unitPrice,
        lineTotal: lineTotal
      });
    }
  });

  return { items, subtotal };
}

// Generate HTML email template
function generateEmailHTML(formData, itemsData) {
  const { items, subtotal } = itemsData;

  const itemRows = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e8e4dc;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e8e4dc; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e8e4dc; text-align: right;">${item.price}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e8e4dc; text-align: right; font-weight: 600;">$${item.lineTotal.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8f6f2;">
      <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

        <!-- Header -->
        <div style="background: linear-gradient(135deg, #c9a86a 0%, #ddbf8a 100%); padding: 40px 30px; text-align: center;">
          <img src="https://southerntentsandevents.com/images/logo-white.png" alt="Southern Tents & Events Logo" style="max-width: 200px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
          <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">New Quote Request</h1>
          <p style="margin: 10px 0 0 0; color: #faf8f3; font-size: 16px;">Southern Tents & Events</p>
        </div>

        <!-- Customer Information -->
        <div style="padding: 30px; border-bottom: 2px solid #e8e4dc;">
          <h2 style="margin: 0 0 20px 0; color: #5d622a; font-size: 24px;">Customer Information</h2>

          <div style="margin-bottom: 15px;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Name:</strong>
            <span style="color: #2d2d2d;">${formData.name || 'N/A'}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Email:</strong>
            <a href="mailto:${formData.email}" style="color: #c9a86a; text-decoration: none;">${formData.email || 'N/A'}</a>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Phone:</strong>
            <a href="tel:${formData.phone}" style="color: #c9a86a; text-decoration: none;">${formData.phone || 'N/A'}</a>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Event Date:</strong>
            <span style="color: #2d2d2d;">${formData['event-date'] || 'N/A'}</span>
          </div>

          <div style="margin-bottom: 15px;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Event Location:</strong>
            <span style="color: #2d2d2d;">${formData.location || 'N/A'}</span>
          </div>

          <div style="margin-bottom: 0;">
            <strong style="color: #6d6760; display: inline-block; width: 150px;">Guest Count:</strong>
            <span style="color: #2d2d2d;">${formData.guests || 'N/A'}</span>
          </div>
        </div>

        <!-- Requested Items -->
        ${items.length > 0 ? `
        <div style="padding: 30px; border-bottom: 2px solid #e8e4dc;">
          <h2 style="margin: 0 0 20px 0; color: #5d622a; font-size: 24px;">Requested Items</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f0ece5;">
                <th style="padding: 12px; text-align: left; color: #5d622a; font-weight: 600; border-bottom: 2px solid #c9a86a;">Item</th>
                <th style="padding: 12px; text-align: center; color: #5d622a; font-weight: 600; border-bottom: 2px solid #c9a86a;">Quantity</th>
                <th style="padding: 12px; text-align: right; color: #5d622a; font-weight: 600; border-bottom: 2px solid #c9a86a;">Unit Price</th>
                <th style="padding: 12px; text-align: right; color: #5d622a; font-weight: 600; border-bottom: 2px solid #c9a86a;">Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
            <tfoot>
              <tr style="background-color: #f0ece5;">
                <td colspan="3" style="padding: 15px; text-align: right; color: #5d622a; font-weight: 700; font-size: 18px; border-top: 2px solid #c9a86a;">SUBTOTAL:</td>
                <td style="padding: 15px; text-align: right; color: #5d622a; font-weight: 700; font-size: 18px; border-top: 2px solid #c9a86a;">$${subtotal.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <!-- Pricing Disclaimer -->
          <div style="margin-top: 20px; padding: 20px; background-color: #fff8f0; border-left: 4px solid #c9a86a; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; color: #5d622a; font-weight: 700; font-size: 14px;">⚠️ INTERNAL PRICING NOTES:</p>
            <ul style="margin: 0; padding-left: 20px; color: #6d6760; font-size: 13px; line-height: 1.8;">
              <li><strong>Subtotal shown is base pricing only</strong></li>
              <li><strong>Additional fees may apply:</strong> setup, delivery, labor, mileage, etc.</li>
              <li><strong>Tax is NOT calculated</strong> in this subtotal</li>
              <li><strong>Final quote must be provided to customer</strong> after reviewing all details</li>
            </ul>
          </div>
        </div>
        ` : ''}

        <!-- Additional Details -->
        ${formData.message ? `
        <div style="padding: 30px; border-bottom: 2px solid #e8e4dc;">
          <h2 style="margin: 0 0 20px 0; color: #5d622a; font-size: 24px;">Special Requests</h2>
          <p style="margin: 0; color: #2d2d2d; line-height: 1.6; white-space: pre-wrap;">${formData.message}</p>
        </div>
        ` : ''}

        <!-- Footer -->
        <div style="padding: 30px; background-color: #faf8f3; text-align: center;">
          <p style="margin: 0 0 10px 0; color: #6d6760; font-size: 14px;">
            This quote request was submitted on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US')}
          </p>
          <p style="margin: 0; color: #978e82; font-size: 12px;">
            Southern Tents & Events | Senoia, GA
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}

// Generate plain text email (fallback)
function generateEmailText(formData, itemsData) {
  const { items, subtotal } = itemsData;

  let text = `
NEW QUOTE REQUEST
Southern Tents & Events

CUSTOMER INFORMATION
---------------------
Name: ${formData.name || 'N/A'}
Email: ${formData.email || 'N/A'}
Phone: ${formData.phone || 'N/A'}
Event Date: ${formData['event-date'] || 'N/A'}
Location: ${formData.location || 'N/A'}
Guest Count: ${formData.guests || 'N/A'}

`;

  if (items.length > 0) {
    text += `
REQUESTED ITEMS
---------------
`;
    items.forEach(item => {
      text += `${item.name} - Qty: ${item.quantity} - ${item.price} - Line Total: $${item.lineTotal.toFixed(2)}\n`;
    });
    text += `\nSUBTOTAL: $${subtotal.toFixed(2)}\n`;
    text += `
*** INTERNAL PRICING NOTES ***
- Subtotal shown is base pricing only
- Additional fees may apply: setup, delivery, labor, mileage, etc.
- Tax is NOT calculated in this subtotal
- Final quote must be provided to customer after reviewing all details
`;
  }

  if (formData.message) {
    text += `
SPECIAL REQUESTS
----------------
${formData.message}
`;
  }

  text += `
---
Submitted: ${new Date().toLocaleString()}
  `;

  return text;
}

// Main serverless function handler
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    const formData = req.body;

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone || !formData['event-date']) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, phone, or date'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }

    // Format requested items and calculate totals
    const itemsData = formatQuoteItems(formData);

    // Email options
    const mailOptions = {
      from: `"Southern Tents Quote System" <${process.env.EMAIL_USER}>`,
      to: 'Southerntentsevents@gmail.com',
      replyTo: formData.email,
      subject: `New Quote Request from ${formData.name} - Event on ${formData['event-date']}`,
      text: generateEmailText(formData, itemsData),
      html: generateEmailHTML(formData, itemsData)
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Quote request submitted successfully! We will contact you within 48 hours.'
    });

  } catch (error) {
    console.error('Error processing quote request:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again or contact us directly.'
    });
  }
};
