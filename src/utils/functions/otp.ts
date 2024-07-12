import crypto from "crypto";

export function passwordResetOtp() {
   const otp = String(Math.floor(1000 + Math.random() * 9000));
   const otpEncode = crypto.createHash("sha256").update(otp).digest("hex");
   const expTime = new Date(Date.now() + Number(process.env.RESET_PASSWORD_OTP_EXP_TIME?.split("-")[0]) * 60 * 1000);
   return { otp, otpEncode, expTime };
}
