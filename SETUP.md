# NYC Property Value — Setup Guide

## To Receive Form Submissions by Email (Required)

The form uses **Formspree** — a free service that emails you every time someone submits the valuation form.

### Steps:

1. Go to **https://formspree.io** and sign up for a free account (use jake@bkrea.com)
2. Click **"New Form"** and name it "NYC Property Value Leads"
3. Copy your **Form ID** (it looks like `xpzgkwqr`)
4. Open `js/script.js` and find this line (around line 87):

```javascript
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID'; // ← replace after Formspree signup
```

5. Replace `YOUR_FORMSPREE_ID` with your actual Form ID, e.g.:

```javascript
const FORMSPREE_ID = 'xpzgkwqr';
```

6. Save the file. You're done — every form submission will now send an email to jake@bkrea.com.

The free Formspree plan includes **50 submissions/month**. Upgrade to paid ($10/mo) for unlimited submissions and spam filtering.

---

## Opening the Site Locally

Just double-click `index.html` — no server required. It opens directly in your browser.

---

## Deploying the Site (Free Options)

### Option A: Netlify (Recommended — easiest)
1. Go to https://netlify.com and create a free account
2. Drag the entire `nyc-property-value` folder onto the Netlify dashboard
3. Your site is live instantly at a free `.netlify.app` URL
4. Connect a custom domain (e.g. nycpropertyvalue.com) in Settings → Domain Management

### Option B: GitHub Pages
1. Push the folder to a GitHub repository
2. Go to Settings → Pages → set source to main branch
3. Live at `https://yourusername.github.io/nyc-property-value`

---

## File Structure

```
nyc-property-value/
├── index.html                    ← Main landing page + valuation form
├── articles.html                 ← All articles listing page
├── articles/
│   ├── how-to-value-multifamily-nyc.html
│   ├── cap-rates-nyc-guide.html
│   ├── rent-stabilization-property-value.html
│   ├── selling-nyc-commercial-building.html
│   ├── mixed-use-properties-nyc.html
│   └── nyc-office-building-valuation.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
└── SETUP.md                      ← This file
```

---

## What the Form Collects

Each submission email to jake@bkrea.com will include:

**Property Info**
- Property type (Multi-family / Mixed-use / Commercial Office)
- Borough
- Full address
- Total units, free market units, rent stabilized units
- Retail component + square footage

**Financial Details**
- Gross annual income
- Annual operating expenses
- Years of ownership
- Mortgage balance (optional)
- Reason for valuation

**Contact Info**
- First + last name
- Email address
- Phone number
- Preferred contact method
- Additional notes
