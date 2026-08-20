TRIOBYTE TECHNOLOGY — INTERNAL COMPANY PORTAL

Current branch: portal-ui-foundation

This branch contains the first frontend foundation for the internal company portal.

Files:
- index.html — responsive portal shell and authentication screen
- style.css — Triobyte design tokens, responsive layout and themes
- script.js — role-specific navigation, dashboard views and frontend interactions
- Triobyte logo.jpg — original company logo asset, kept unchanged

ROLE PREVIEW ACCOUNTS (FRONTEND ONLY)
These credentials are temporary demo credentials for UI development. They must NOT be used in production and must be removed when backend authentication is connected.

CEO
Email: ceo@triobyte.com
Password: Demo@123

HR
Email: hr@triobyte.com
Password: Demo@123

Admin
Email: admin@triobyte.com
Password: Demo@123

Employee
Email: emp001@triobyte.com
Password: Demo@123

CURRENT UI FOUNDATION
- Separate CEO, HR, Admin and Employee experiences
- Responsive sidebar/navigation
- Mobile drawer navigation
- Desktop, tablet and mobile layouts
- Light, Dark and Custom Accent themes
- Role-specific dashboards
- Responsive tables, cards, charts and forms
- Profile and settings screens
- Notifications and message entry points
- Accessibility-aware focus states and reduced-motion support

IMPORTANT
This is a frontend foundation only. Authentication, password hashing, forced first-login password change, authorization, database access, chat, repository operations, audit logs, salary records and other server-side features must be implemented in the backend before production deployment.

LOCAL RUN
Because this branch uses plain HTML/CSS/JS, it does not require npm for the current UI preview. Open index.html with a local static server for the best browser behavior.

Example with VS Code Live Server:
1. Open the repository in VS Code.
2. Install/enable Live Server.
3. Right-click index.html.
4. Select Open with Live Server.

The production implementation should replace the frontend demo authentication with a secure server-side identity system and real role permissions.
