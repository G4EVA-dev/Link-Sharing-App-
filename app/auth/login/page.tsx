"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toast, { ToastType } from "@/components/Toast";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";

interface FormErrors {
  email?: string;
  password?: string;
}

function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: ToastType }>({
    show: false,
    message: "",
    type: "info"
  });
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.user) {
        showToast("Logged in successfully!", "success");
        router.push("/dashboard");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to log in", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast("Please enter your email address", "error");
      return;
    }

    try {
      await authService.resetPassword(email);
      showToast("Password reset email sent!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to send reset email", "error");
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgColor p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaEnvelope className="text-purple" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <FaLock className="text-purple" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full bg-purple text-white py-2 rounded-md font-semibold transition-all duration-200 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-buttonHover hover:shadow-custom-shadow'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <LoadingSpinner size="small" />
                <span>Logging in...</span>
              </div>
            ) : (
              'Login'
            )}
          </motion.button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleResetPassword}
            className="text-purple font-semibold hover:underline"
          >
            Forgot password?
          </motion.button>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/auth/signup")}
              className="text-purple font-semibold hover:underline"
            >
              Create account
            </motion.button>
          </p>
        </div>
      </motion.div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}

export default Page;
