import React, { useState, useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { DataObject, verifyOTP } from "@/app/api/verify";
import { Session } from "@supabase/supabase-js";

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  className?: string;
  email: string;
  onVerificationSuccess?: (data: DataObject) => void;
  onVerificationError?: (error: string) => void;
}

export function OTPInput({ 
  length = 6, 
  onComplete, 
  className,
  email,
  onVerificationSuccess,
  onVerificationError 
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Check if OTP is complete
    if (newOtp.every((digit) => digit !== "")) {
      onComplete(newOtp.join(""));
    }

    // Move to next input if current input is filled
    if (value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, length);
    if (isNaN(Number(pastedData))) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);

    if (pastedData.length === length) {
      onComplete(pastedData);
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== length) return;

    setIsVerifying(true);
    try {
      const result = await verifyOTP(email, otpString);
      if (result.success && result.data) {
        console.log(result.data);
        onVerificationSuccess?.(result.data);
      } else {
        onVerificationError?.(result.error || "Verification failed");
      }
    } catch (error) {
      onVerificationError?.(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className={`flex gap-2 ${className}`}>
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-lg"
          />
        ))}
      </div>
      <Button 
        onClick={handleVerify}
        disabled={isVerifying || otp.some(digit => digit === "")}
        className="w-full"
      >
        {isVerifying ? "Verifying..." : "Verify OTP"}
      </Button>
    </div>
  );
} 