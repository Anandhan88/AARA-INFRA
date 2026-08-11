import { useForm } from "react-hook-form";
import { useState } from "react";
import { registerUser } from "../utility/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CreditCard, CheckCircle, ShieldCheck, MapPin, Phone } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function SignUpPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get("role") === "admin" ? "admin" : "client";
  const [selectedRole, setSelectedRole] = useState(initialRole);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm();
  const [signupMessage, setSignupMessage] = useState("");
  const [signupMessageColor, setSignupMessageColor] = useState("green");
  const navigate = useNavigate();

  const password = watch("password");

  const onSignUp = async (data) => {
    setSignupMessage("");
    try {
      const signupData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
        role: selectedRole,
      };

      const response = await registerUser(signupData);

      // Store token and user data to ensure the user is logged in
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      localStorage.setItem("tokenExpiry", Date.now() + 60 * 60 * 1000);

      setSignupMessage(`Registration successful! Redirecting to ${response.user.role === 'admin' ? 'Admin' : 'Client'} Dashboard...`);
      setSignupMessageColor("green");

      setTimeout(() => {
        if (response.user.role === "admin") {
          navigate("/dashboard");
        } else {
          navigate("/client/dashboard");
        }
      }, 1500);

      reset();
    } catch (error) {
      const errorMessage = typeof error === 'string' ? error : (error?.message || "Registration failed. Please try again.");
      setSignupMessage(errorMessage);
      setSignupMessageColor("red");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-500 py-8">
      <div className="flex w-full max-w-5xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mx-4 border border-gray-200 dark:border-gray-700">

        {/* Left Panel - Hero Section */}
        <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-primary-600 via-indigo-600 to-indigo-800 items-center justify-center p-12 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse-slow"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-center text-white space-y-6">
            <div className="bg-white/10 backdrop-blur-lg p-5 rounded-2xl inline-block shadow-lg mb-4">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-display font-bold tracking-tight">
              Join <span className="text-accent-300">AaraInfraa</span>
            </h1>
            <p className="text-lg text-blue-100 font-light max-w-sm mx-auto leading-relaxed">
              Create an account to manage consultancy projects, invoices, and operations with elegance and efficiency.
            </p>
          </div>
        </div>

        {/* Right Panel - SignUp Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center bg-white dark:bg-gray-800 relative">
          <div className="max-w-md mx-auto w-full space-y-5">
            
            {/* Role Selection Tabs */}
            <div className="bg-gray-100 dark:bg-gray-700/50 p-1.5 rounded-2xl flex items-center justify-between border border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={() => { setSelectedRole("client"); setSignupMessage(""); }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedRole === "client"
                    ? "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-md font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <User className="w-4 h-4" /> Register as Client
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole("admin"); setSignupMessage(""); }}
                className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                  selectedRole === "admin"
                    ? "bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-md font-semibold"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <ShieldCheck className="w-4 h-4" /> Register as Admin
              </button>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                Create {selectedRole === "admin" ? "Admin" : "Client"} Account
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Register as {selectedRole === "admin" ? "an Administrator" : "a Client"} to access your dedicated dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSignUp)} className="space-y-3.5">
              {/* Name Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Min 2 characters",
                      },
                    })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email format",
                      },
                    })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                    placeholder="you@company.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone & Address in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      {...register("phone", {
                        required: "Phone is required"
                      })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                      placeholder="9876543210"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>
                  )}
                </div>

                {/* Address Input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      type="text"
                      {...register("address", {
                        required: "Address is required"
                      })}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                      placeholder="City, State"
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Min 6 characters",
                      },
                    })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Confirm Password</label>
                <div className="relative group">
                  <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2 text-sm"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Register as {selectedRole === "admin" ? "Admin" : "Client"} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {signupMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2.5 rounded-lg text-xs text-center ${signupMessageColor === 'green' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'}`}
                >
                  {signupMessage}
                </motion.div>
              )}
            </form>

            <div className="pt-3 text-center border-t border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Already have an account?{" "}
                <button
                  onClick={() => navigate(`/admin?role=${selectedRole}`)}
                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold hover:underline transition-all"
                >
                  Sign In as {selectedRole === "admin" ? "Admin" : "Client"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
