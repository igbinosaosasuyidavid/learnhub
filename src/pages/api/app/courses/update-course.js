// import prisma from "../../../../../prisma/db";
// import path from "path"
// import formidable from "formidable";
// import fs from 'fs'
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method?.toUpperCase() === "POST") {
//     try {
//       await prisma.$connect()
//       const form = formidable({
//         uploadDir:path.join(process.cwd(), "/public/images"),
//         filename:(name, ext, path, form) => {
//           return Date.now().toString() + "_" + path.originalFilename
//         }
//       });
//       form.parse(req, async (err, fields, files) => {

//         if (err) {
//           return res.json({ err });
//         }
//         const updatedcourse= await prisma.course.findFirst({
//             where:{
//                 id:fields.course_id
//             }
//         })
//         if (files.courseImage) {
//             fs.unlink(path.join(process.cwd(),'/public/images', updatedcourse.featuredImage
//             .split('/')[4]),(e)=>{
//                 console.log(e);
//             })
//         }
//         console.log(fields);
//         const course = await prisma.course.update({
//             where:{
//                 id:fields.course_id
//             },
//             data: {
//               title:fields.title,
//               description:fields.description,
//               price:parseFloat(fields.price),
//               featuredImage:files.courseImage?fields.host+'/images/'+files.courseImage.newFilename :updatedcourse.featuredImage,
//             },
//           });

//         return res.status(200).json({course,success:true})


//       });



//       } catch (err) {
//         console.log(err);
//         return res.status(500).send("Sorry an error occured on the server");
//       }


//   }

// }




import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import prisma from "../../../../../prisma/db"
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

  const dcd = await prisma.course.update({
    where: {
      id: req.body.course_id
    },
    data: {
      categories: {
        set: []
      }
    }
  })

  if (req.file) {
    const stream = await cloudinary.uploader.upload_stream(
      {
        folder: "courseFeatured",
      },
      async (error, result) => {
        console.log(result);
        if (error) return res.status(500).send("Sorry an error occured on the server");
        const checkCourse = await prisma.course.findFirst({
          where: {
            id: req.body.course_id
          },
        })
        cloudinary.uploader.destroy('courseFeatured/' + checkCourse.featuredImage.split(/[./]/)[10], async (err, resp) => {
          if (err) console.log(err);
          const course = await prisma.course.update({
            where: {
              id: req.body.course_id
            },
            data: {
              title: req.body.title,
              description: req.body.description,
              price: parseFloat(req.body.price),
              featuredImage: result.secure_url,
              categories: {
                connect: JSON.parse(req.body.courseCats).map(data => ({ id: data }))
              }
            },
            include: {
              students: true,
              lessons: true,
              categories: true,
              author: true,
            }
          });
          return res.status(200).json({ course, success: true })
        })





      }
    );
    streamifier.createReadStream(req.file.buffer).pipe(stream);
  } else {

    const course = await prisma.course.update({
      where: {
        id: req.body.course_id
      },
      data: {
        title: req.body.title,
        description: req.body.description,
        price: parseFloat(req.body.price),
        categories: {
          connect: JSON.parse(req.body.courseCats).map(data => ({ id: data }))
        }
      },
      include: {
        students: true,
        lessons: true,
        categories: true,
        author: true,
      }
    });

    return res.status(200).json({ course, success: true })
  }


}

export const config = {
  api: {
    bodyParser: false,
  },
};


