"use client";

import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { signUp } from "@/app/api/user";
import { useRouter } from "next/navigation";
import { OTPInput } from "@/components/otp-input";
import { Session } from "@supabase/supabase-js";
import { setAuthCookies } from "@/app/actions/auth";
import { DataObject } from "@/app/api/verify";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  className?: string;
  email: string;
  onVerificationSuccess?: (session: Session) => void;
  onVerificationError?: (error: string) => void;
}

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const [otpValue, setOtpValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Function layer:
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validatedData = formSchema.parse(formData);
      const user = await signUp(validatedData.email, validatedData.password);
      
      if (user) {
        console.log("User signed up successfully:", user);
        setShowOTP(true);
      } else {
        console.error("Failed to sign up user");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (otp: string) => {
    setOtpValue(otp);
    setOtpError(""); // Clear any previous errors
  };

  const handleVerificationSuccess = async (data: DataObject) => {
    // Set the JWT token in a cookie using the server action
    await setAuthCookies(data);
    router.push("/home");
  };

  const handleVerificationError = (error: string) => {
    setOtpError(error);
  };

  // Animation layer:
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // UI layer: 
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg"
      >
        {!showOTP ? (
          <>
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold text-center text-foreground"
            >
              Create an Account
            </motion.h1>
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </motion.div>

              <motion.div variants={itemVariants}>
                {/* Here is the "Sign Up" button */}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign Up"} 
                </Button>
              </motion.div>
            </motion.form>
          </>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.h1
              variants={itemVariants}
              className="text-3xl font-bold text-center text-foreground"
            >
              Verify Your Email
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-center text-muted-foreground"
            >
              We've sent a 6-digit code to your email address.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-4">
              <OTPInput 
                onComplete={handleOTPChange}
                email={formData.email}
                onVerificationSuccess={handleVerificationSuccess}
                onVerificationError={handleVerificationError}
              />
            </motion.div>
            {otpError && (
              <motion.p
                variants={itemVariants}
                className="text-center text-red-500"
              >
                {otpError}
              </motion.p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
} 