import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <main className="bg-background text-on-background min-h-screen flex items-center justify-center p-md">
      <div className="w-full max-w-[440px] flex flex-col items-center">
        <div className="mb-xl text-center">
          <div className="w-16 h-16 bg-primary-container rounded-xl flex items-center justify-center mx-auto mb-md">
            <span className="material-symbols-outlined text-white text-[32px]">cloud</span>
          </div>
          <h1 className="font-h1 text-h1 text-on-background mb-xs">CloudDrive</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Secure, minimalist cloud storage for teams.</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl w-full">
          <header className="mb-lg">
            <h2 className="font-h2 text-h2 text-on-surface">Welcome back</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Please enter your details to sign in.</p>
          </header>
          
          {error && (
            <div className="mb-md p-md bg-error-container text-on-error-container rounded-lg text-sm">
              {error}
            </div>
          )}

          <form className="space-y-md" onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="name@company.com"
              required
              disabled={loading}
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg"
              placeholder="••••••••"
              required
              disabled={loading}
            />
            <button
              type="submit"
              className="w-full h-12 bg-primary text-on-primary font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-sm">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-primary"></span>
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
        <p className="mt-lg font-body-md text-body-md text-on-surface-variant">
          Don't have an account? <Link to="/signup" className="text-primary font-semibold">Create an account</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
