/** Feature flags shared by the site shell, the footer and pages. Kept in its own module so
 *  small consumers (the footer, the 4c landing) don't pull in pages.tsx and the content tunnel. */
export const SHOW_BUILD_IN_PUBLIC = false
