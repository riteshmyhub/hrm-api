function slugPipe(string: string) {
   return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
}

function truncate(string: string, limit: number) {
   return string.length > limit ? string.substr(0, limit) + "..." : string;
}

function mongoose2Date(date: string | number | Date) {
   return new Date(date).toISOString().split("T")[0];
}

export { slugPipe, truncate, mongoose2Date };
