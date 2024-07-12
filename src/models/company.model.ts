import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
   isActive: {
      type: Boolean,
      default: true,
   },
   role: {
      type: String,
      enum: ["admin", "company"],
      required: true,
      default: "company",
   },
   email: {
      type: String,
      required: [true, "email field is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "invalid email"],
   },
   password: {
      type: String,
      required: [true, "password field is required"],
      trim: true,
      select: false,
   },
   //---------company_details----------
   company_details: {
      company_name: {
         type: String,
         required: [true, "company_name field is required"],
         trim: true,
      },
      phone_number: {
         type: String,
         required: [true, "company_phone_number field is required"],
         trim: true,
      },
      designations: [
         {
            name: {
               type: String,
               required: [true, "name field is required"],
               minlength: [3, "name is too short"],
               trim: true,
               lowercase: true,
            },
         },
      ],
      dateOfRegister: {
         type: Date,
         default: Date.now,
      },
   },
   resetPasswordToken: {
      type: String,
      select: false,
   },
   resetPasswordExpire: {
      type: Date,
      select: false,
   },
});
const Company = mongoose.model("company", companySchema);
export default Company;
