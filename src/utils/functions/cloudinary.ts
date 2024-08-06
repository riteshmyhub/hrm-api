import { UploadApiOptions, v2 as cloudinary } from "cloudinary";

//cloudinary config



function init() {
   cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
   });
}

type UploadType = { file: any; options: UploadApiOptions };
async function uploadFile({ file, options }: UploadType) {
   const src = await cloudinary.uploader.upload(file, options);
   return src;
}

type UpdateType = { publicID: string; path: string; file: any };
async function updateFile({ publicID, path, file }: UpdateType) {
   await cloudinary.uploader.destroy(publicID);
   const src = await cloudinary.uploader.upload(file, {
      folder: path,
      width: 200,
   });
   return src;
}

async function deleteFile(publicID: string) {
   const res = await cloudinary.uploader.destroy(publicID);
   return res;
}

async function getImage(publicID: string) {
   const res = await cloudinary.api.resource(publicID);
   return res;
}

const bucket = {
   init,
   getImage,
   uploadFile,
   updateFile,
   deleteFile,
};
export default bucket;
