import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export async function createAccessToken(userID: Types.ObjectId) {
   try {
      const [value, unit] = process.env.TOKEN_EXPIRES_IN?.split("-") as string[];
      const accessToken = jwt.sign({ _id: userID.toString() }, process.env.JWT_SECRET_KEY as string, {
         expiresIn: `${value}${unit}`,
      });
      return accessToken;
   } catch (error) {
      console.log(error);
   }
}
