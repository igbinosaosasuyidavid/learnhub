
import prisma from "../../../../../prisma/db";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

import streamifier from "streamifier";
const storage = multer.memoryStorage();
const upload = multer({ storage });
const uploadMiddleware = upload.single("courseImage");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}
export default async function handler(req, res) {

  await runMiddleware(req, res, uploadMiddleware);

  const stream = await cloudinary.uploader.upload_stream(
    {
      folder: "courseFeatured",
    },
    async (error, result) => {
      if (error) return res.status(500).send("Sorry an error occured on the server");
      console.log(req.body.courseCats, '-------');
      const course = await prisma.course.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          price: parseFloat(req.body.price),
          featuredImage: result.secure_url,
          author: {
            connect: {
              id: req.body.user_id
            },


          },
          categories: {
            connect: JSON.parse(req.body.courseCats).map(data => ({ id: data }))
          }
        },
      });

      return res.status(200).json({ course, success: true })
    }
  );
  streamifier.createReadStream(req.file.buffer).pipe(stream);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
