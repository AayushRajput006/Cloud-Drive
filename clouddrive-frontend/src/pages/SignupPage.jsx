import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function SignupPage() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <main className="bg-background min-h-screen flex flex-col items-center justify-center p-md">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-lg h-16 bg-surface z-50">
        <span className="text-h2 font-bold text-primary">CloudDrive</span>
        <span className="font-body-md text-on-surface-variant">Help</span>
      </header>
      <div className="w-full max-w-[440px] mt-16">
        <div className="text-center mb-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-container rounded-xl mb-md">
            <span className="material-symbols-outlined text-on-primary-container text-[32px]">cloud_upload</span>
          </div>
          <h1 className="font-h1 text-h1 text-on-surface mb-xs">Create your account</h1>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-xl">
          
          {error && (
            <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="Full Name"
              required
              disabled={loading}
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="Email Address"
              required
              disabled={loading}
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="Password"
              required
              disabled={loading}
            />
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="Confirm Password"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || formData.password !== formData.confirmPassword}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-sm">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-primary"></span>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <p className="mt-lg text-center text-body-md text-on-surface-variant">
            Already have an account? <Link to="/login" className="text-primary font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
