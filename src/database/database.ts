import mongoose from "mongoose";
mongoose.set("strictQuery", false);

async function connect2db() {
   try {
      const data = await mongoose.connect(process.env.DATABASE_URL as string);
      console.log(`DB successfully connected 👍`);
      //console.log(data.connection.host);
   } catch (error) {
      console.error(error);
   }
}
connect2db();
