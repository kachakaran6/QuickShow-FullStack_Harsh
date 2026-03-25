# Movieswift Rebranding Checklist

## ✅ Completed Changes

### 1. **Text Replacements**

- [x] Updated HTML page title: "QuickShow - GreatStack" → "Movieswift - Movie Ticket Booking Platform"
- [x] Updated database name: `quickshow` → `movieswift` in MongoDB connection string
- [x] Updated all email templates: "QuickShow Team" → "Movieswift Team" (3 places in inngest/index.js)
- [x] Updated footer copyright: "GreatStack" → "Movieswift"
- [x] Updated production deployment documentation

### 2. **Branding Configuration**

- [x] Created centralized branding config: `client/src/config/branding.js`
  - Contains all brand constants (APP_NAME, LOGO_PATH, EMAIL_SIGNATURE, etc.)
  - Provides helper functions for accessing branded text
  - Includes SEO metadata configuration
  - Color scheme defined for future reference

### 3. **Files Modified**

1. `client/index.html` - Page title
2. `server/configs/db.js` - Database name
3. `server/inngest/index.js` - Email signatures (3 updates)
4. `client/src/components/Footer.jsx` - Footer copyright
5. `PRODUCTION_DEPLOYMENT.md` - Documentation title
6. `client/src/config/branding.js` - NEW: Centralized branding config

---

## 🎨 Logo Setup (MANUAL STEP REQUIRED)

### Current Status

- New logo file location: `WhatsApp Image 2026-03-25 at 23.53.07.jpeg` (in project root)
- Branding config points to: `/assets/movieswift-logo.png`

### Next Steps

1. **Copy the logo file to assets folder:**

   ```bash
   # Option 1: Copy with rename
   cp "WhatsApp Image 2026-03-25 at 23.53.07.jpeg" client/src/assets/movieswift-logo.png

   # Option 2: If it's JPG, you may want to convert to PNG or SVG first
   # (Use image converter tool or Photoshop/GIMP)
   ```

2. **Update assets.js** (if you want to use the new logo):
   - Change `logo.svg` import to `movieswift-logo.png`
   - Update the import statement in `client/src/assets/assets.js`

3. **Verify logo displays correctly:**
   - Check Navbar (displays on all pages)
   - Check Footer (displays with company info)
   - Check responsive behavior on mobile

---

## 🔍 Verification Checklist

### Text Verification

- [x] Browser tab title shows "Movieswift"
- [x] HTML metadata updated
- [x] Email templates show "Movieswift Team"
- [x] Footer shows "Movieswift" copyright
- [x] All config files reference the new name

### Visual Verification (After Logo Copy)

- [ ] Header logo displays correctly
- [ ] Logo is responsive on mobile/tablet
- [ ] Logo is responsive on desktop
- [ ] No distortion or quality loss
- [ ] Footer logo displays properly
- [ ] Admin panel branding updated (if applicable)

### Code Quality

- [x] No broken imports
- [x] All TypeScript/ESLint checks pass
- [x] Branding config properly exported
- [x] Database connection string valid
- [x] API endpoints unaffected

---

## 📝 Usage of Branding Config

The new branding config can be imported and used anywhere:

```javascript
// Import the branding config
import { APP_NAME, FOOTER_TEXT, LOGO_PATH } from "@/config/branding";
import BRAND_CONFIG from "@/config/branding";

// Use in components
const pageTitle = BRAND_CONFIG.APP_NAME_TAGLINE; // "Movieswift - Movie Ticket Booking Platform"
const emailTemplate = `Thanks, ${BRAND_CONFIG.EMAIL_SIGNATURE}`; // "Thanks, Movieswift Team"

// For future updates, just modify branding.js
```

---

## 🚀 Future Rebranding

To rebrand again in the future, simply:

1. Update values in `client/src/config/branding.js`
2. Replace the logo file at `/assets/movieswift-logo.png`
3. All references will automatically use the new branding

---

## 🔗 Related Files

- **Centralized Branding Config:** `client/src/config/branding.js`
- **Frontend Config:** `client/src/config/api.js`
- **Backend Database Config:** `server/configs/db.js`
- **Email Configuration:** `server/inngest/index.js`
- **Deployment Guide:** `PRODUCTION_DEPLOYMENT.md`

---

## ⚠️ Known Issues / Notes

- Database migration: If you have existing MongoDB data, the collection names won't change automatically. Consider:
  - Creating a migration script to rename collections from `quickshow` to `movieswift`
  - Or updating the database reference in `configs/db.js` to point to the original `quickshow` database

- Deployment URLs: Backend URLs still contain "quickshow" in the domain names (this is DNS-related and can be updated separately)

---

## 📋 Remaining Tasks

1. **Logo File Copy:** Copy `WhatsApp Image 2026-03-25 at 23.53.07.jpeg` to `client/src/assets/movieswift-logo.png`
2. **Update assets.js:** If using the new logo, update the import statement (optional)
3. **Test All Pages:** Ensure no visual regressions
4. **Git Commit:** Commit rebranding changes
5. **Production Deploy:** Deploy to Vercel/Render with updated branding

---

Generated: 2026-03-25
