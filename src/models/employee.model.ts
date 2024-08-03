import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
   isActive: {
      type: Boolean,
      default: true,
   },
   role: {
      type: String,
      enum: ["employee"],
      required: true,
      default: "employee",
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
   //---------employee_details----------
   employee_allocation: {
      isAllocate: {
         type: Boolean,
         default: false,
      },
      start_date: Date,
      end_date: Date,
      project: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Project",
      },
   },
   employee_details: {
      company: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Company",
      },
      first_name: {
         type: String,
         required: [true, "first_name field is required"],
         trim: true,
      },
      last_name: {
         type: String,
         required: [true, "last_name field is required"],
         trim: true,
      },
      designation: {
         type: String,
         required: [true, "designation field is required"],
         trim: true,
      },
      avatar: {
         type: String,
      },
      phone_number: {
         type: String,
         trim: true,
      },
      linkedin_username: {
         type: String,
         trim: true,
      },
      skills: {
         type: [String],
         validate: {
            validator: function (v: string[]) {
               return Array.isArray(v) && new Set(v).size === v.length;
            },
            message: (props: any) => `${props.value} skill is duplicate skills`,
         },
      },
      total_experience: {
         type: Number,
         default: 0,
      },
      about: {
         type: String,
      },
      dateOfJoining: {
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

const Employee = mongoose.model("employee", employeeSchema);

export default Employee;
