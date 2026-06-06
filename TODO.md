# TODO (Sign-in pending fix)

- [ ] Inspect backend email sending (done: EmailService found)
- [x] Implement async OTP email sending so `/auth/login` does not block on SMTP

- [x] Add SMTP timeouts to `application.properties` (connect/read/write) to prevent indefinite hangs
- [ ] Add request timeout to frontend axios client (optional but recommended)
- [ ] Retest login flow: verify `/auth/login` responds quickly and UI no longer buffers forever

