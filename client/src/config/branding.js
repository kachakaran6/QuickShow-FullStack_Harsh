/**
 * Branding Configuration - Movieswift
 * Centralized branding constants used across the entire application
 * Update these values for future rebranding needs
 */

export const BRAND_CONFIG = {
  // Application Name
  APP_NAME: "Movieswift",
  APP_NAME_TAGLINE: "Movieswift - Movie Ticket Booking Platform",

  // Short Description
  APP_DESCRIPTION:
    "Book movie tickets online quickly and securely with Movieswift.",

  // Logo Configuration
  LOGO_PATH: "/assets/movieswift-logo.png",
  LOGO_ALT: "Movieswift Logo",

  // Footer Text
  FOOTER_TEXT: "© 2026 Movieswift. All rights reserved.",
  COMPANY_NAME: "Movieswift",

  // Email Branding
  EMAIL_SIGNATURE: "Movieswift Team",

  // Meta Tags & SEO
  META_TITLE: "Movieswift - Book Movie Tickets Online",
  META_DESCRIPTION:
    "Easily book movie tickets online at the best prices. Get exclusive deals and enjoy seamless ticket booking with Movieswift.",
  META_KEYWORDS:
    "movie tickets, movie booking, cinema tickets, online booking, Movieswift",

  // Social Links (Optional)
  SOCIAL_LINKS: {
    website: "https://movieswift.com",
    twitter: "https://twitter.com/movieswift",
    instagram: "https://instagram.com/movieswift",
    facebook: "https://facebook.com/movieswift",
  },

  // Support Contact
  SUPPORT_EMAIL: "support@movieswift.com",
  SUPPORT_PHONE: "+1-800-MOVIESWIFT",

  // Theme Colors (if needed for styling)
  BRAND_COLORS: {
    primary: "#FF6B35", // Primary action color
    secondary: "#004E89", // Secondary color
    accent: "#F7D08A", // Accent color
  },
};

// Helper function to get branded text
export const getBrandedText = (key) => {
  return BRAND_CONFIG[key] || "";
};

// Export commonly used branding strings
export const {
  APP_NAME,
  APP_NAME_TAGLINE,
  LOGO_PATH,
  EMAIL_SIGNATURE,
  FOOTER_TEXT,
  META_TITLE,
  META_DESCRIPTION,
} = BRAND_CONFIG;

export default BRAND_CONFIG;
