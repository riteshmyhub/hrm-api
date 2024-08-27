export function mongooseSchemaError(error: any) {
   const errors: string[] = [];
   for (let field in error?.errors) {
      errors.push(error.errors[field].message);
   }
   return errors;
}

export function isValidDate(date: string | number) {
   return !isNaN(new Date(date).getTime());
}
