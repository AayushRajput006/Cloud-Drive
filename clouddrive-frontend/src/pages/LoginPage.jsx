import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyLoginOtp, loading, error, clearError } = useAuth();
  
  const [step, setStep] = useState(1);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || null
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      if (!formData.email || !formData.password) return;

      try {
        await login(formData.email, formData.password);
        setStep(2);
        setResendCountdown(60);
      } catch (err) {}
    } else {
      const otpValue = otp.join("");
      if (otpValue.length !== 6) return;

      try {
        await verifyLoginOtp(formData.email, otpValue);
        navigate("/dashboard");
      } catch (err) {}
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    try {
      await authService.resendOtp(formData.email);
      setResendCountdown(60);
      clearError();
    } catch (err) {}
  };

  return (
    <main className="bg-background text-on-background min-h-screen flex items-center justify-center p-md">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-xl text-center">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-md shadow-sm">
            <span className="material-symbols-outlined text-primary text-[32px]">
              {step === 1 ? "cloud" : "mark_email_read"}
            </span>
          </div>
          <h1 className="font-h1 text-h1 text-on-background mb-xs">CloudDrive</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Secure, minimalist cloud storage for teams.</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl w-full shadow-sm">
          <header className="mb-lg">
            <h2 className="font-h2 text-h2 text-on-surface">
              {step === 1 ? "Welcome back" : "Verify your login"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              {step === 1 ? "Please enter your details to sign in." : (
                <>We've sent a 6-digit code to <span className="font-semibold text-primary">{formData.email}</span></>
              )}
            </p>
          </header>
          
          {successMessage && (
            <div className="mb-md p-md bg-[#e6f4ea] text-[#1e7e34] border border-[#a8d5b5] rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">check_circle</span>
              {successMessage}
              <button onClick={() => setSuccessMessage(null)} className="ml-auto text-[#1e7e34] hover:text-[#155724]">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}

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
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                />
                <input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
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
              disabled={loading || (step === 1 && (!formData.email || !formData.password)) || (step === 2 && otp.join("").length !== 6)}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-sm">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-primary"></span>
                  {step === 1 ? "Signing In..." : "Verifying..."}
                </span>
              ) : (
                step === 1 ? "Sign In" : "Verify & Sign In"
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
        </div>
        
        {step === 1 && (
          <p className="mt-lg font-body-md text-body-md text-on-surface-variant">
            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        )}
      </div>
    </main>
  );
}

export default LoginPage;
