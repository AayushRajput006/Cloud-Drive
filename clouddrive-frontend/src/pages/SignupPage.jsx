import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

function SignupPage() {
  const navigate = useNavigate();
  const { register, verifySignupOtp, loading, error, clearError } = useAuth();
  
  const [step, setStep] = useState(1);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    if (error) clearError();

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some(isNaN)) return;
    
    const newOtp = [...otp];
    pastedData.forEach((val, i) => {
      newOtp[i] = val;
    });
    setOtp(newOtp);
    
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) return;
      if (formData.password !== formData.confirmPassword) return;

      try {
        await register(formData.name, formData.email, formData.password);
        setStep(2);
        setResendCountdown(60);
      } catch (err) {}
    } else {
      const otpValue = otp.join("");
      if (otpValue.length !== 6) return;

      try {
        await verifySignupOtp(formData.email, otpValue);
        // Redirect to login with success message
        navigate("/login", { state: { successMessage: "Account created! Please log in." } });
      } catch (err) {}
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    try {
      await authService.resendOtp(formData.email);
      setResendCountdown(60);
      clearError();
    } catch (err) {
      // You could set error state here if authService throws
    }
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-md">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-lg h-16 bg-surface z-50 shadow-sm">
        <span className="text-h2 font-bold text-primary">CloudDrive</span>
        <span className="font-body-md text-on-surface-variant cursor-pointer hover:text-primary">Help</span>
      </header>
      <div className="w-full max-w-[440px] mt-16">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-xl mb-md shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">
              {step === 1 ? "cloud_upload" : "mark_email_read"}
            </span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">
            {step === 1 ? "Create your account" : "Verify your email"}
          </h1>
          {step === 2 && (
            <p className="text-body-md text-on-surface-variant mt-2">
              We've sent a 6-digit code to <br/>
              <span className="font-semibold text-primary">{formData.email}</span>
            </p>
          )}
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl shadow-sm">
          
          {error && (
            <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {error}
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            {step === 1 ? (
              <>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Full Name"
                  required
                  disabled={loading}
                />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Email Address"
                  required
                  disabled={loading}
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Password"
                  required
                  disabled={loading}
                />
                <input
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Confirm Password"
                  required
                  disabled={loading}
                />
              </>
            ) : (
              <div className="flex justify-between gap-2 mb-lg">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-14 text-center text-xl font-semibold bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    disabled={loading}
                  />
                ))}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors shadow-sm"
              disabled={loading || (step === 1 && formData.password !== formData.confirmPassword) || (step === 2 && otp.join("").length !== 6)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-sm">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-primary"></span>
                  {step === 1 ? "Creating Account..." : "Verifying..."}
                </span>
              ) : (
                step === 1 ? "Create Account" : "Verify Account"
              )}
            </button>
          </form>

          {step === 2 && (
            <div className="mt-lg text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCountdown > 0 || loading}
                className={`text-body-md font-semibold transition-colors ${resendCountdown > 0 ? "text-on-surface-variant cursor-not-allowed" : "text-primary hover:text-primary-hover"}`}
              >
                {resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : "Resend code"}
              </button>
            </div>
          )}

          {step === 1 && (
            <p className="mt-lg text-center text-body-md text-on-surface-variant">
              Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
