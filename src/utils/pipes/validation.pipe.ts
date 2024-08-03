import mongoose from "mongoose";

export function mongooseSchemaError(error: any) {
   const errors: string[] = [];
   for (let field in error?.errors) {
      errors.push(error.errors[field].message);
   }
   return errors;
}

export function isDocumentId(_id: string | number | mongoose.mongo.BSON.ObjectId | mongoose.mongo.BSON.ObjectIdLike | Uint8Array) {
   return mongoose.Types.ObjectId.isValid(_id) && _id;
}

export function isValidDate(date: string | number) {
   return !isNaN(new Date(date).getTime());
}
