
# TODO (Sign-in pending fix)

- [ ] Inspect backend email sending (done: EmailService found)
- [x] Implement async OTP email sending so `/auth/login` does not block on SMTP

- [x] Add SMTP timeouts to `application.properties` (connect/read/write) to prevent indefinite hangs
- [ ] Add request timeout to frontend axios client (optional but recommended)
- [ ] Retest login flow: verify `/auth/login` responds quickly and UI no longer buffers forever
# Cloud Drive - Landing Page + Routing/Protection Implementation

## TODO
- [ ] Add new public route `/` for LandingPage and redirect authenticated users to `/dashboard`.
- [ ] Ensure required protected routes exist and are protected: `/dashboard`, `/drive`, `/shared`, `/starred`, `/recent`, `/trash`, `/analytics`.
- [ ] Add public auth route `/verify-otp` (reuse existing OTP logic if present; otherwise implement UI using AuthContext).
- [ ] Build Glassmorphism premium LandingPage with sections: Navbar, Hero (mockup), Trust counters, Features, Analytics (Recharts), Security, How it works timeline, Testimonials, CTA, Footer.
- [ ] Use Framer Motion for scroll reveal + subtle floating.
- [ ] Add route alias/wrapper pages for `/drive`, `/shared`, `/recent`, `/analytics` mapping to existing pages without changing dashboard functionality.
- [ ] Add or update dependencies (`framer-motion`, `recharts`) if missing.
- [ ] Validate: Login/Signup/OTP works, protected routes redirect correctly, `/dashboard` unchanged, mobile responsive.

