import prisma from "../../../../../prisma/db";
import path from "path"
import formidable from "formidable";
import fs from 'fs'
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "POST") {
    try {
      await prisma.$connect()
      const form = formidable({
        uploadDir:path.join(process.cwd(), "/public/images"),
        filename:(name, ext, path, form) => {
          return Date.now().toString() + "_" + path.originalFilename
        }
      });
      form.parse(req, async (err, fields, files) => {
    
        if (err) {
          return res.json({ err });
        }
        const updatedcourse= await prisma.course.findFirst({
            where:{
                id:fields.course_id
            }
        })
        if (files.courseImage) {
            fs.unlink(path.join(process.cwd(),'/public/images', updatedcourse.featuredImage
            .split('/')[4]),(e)=>{
                console.log(e);
            })
        }
        console.log(fields);
        const course = await prisma.course.update({
            where:{
                id:fields.course_id
            },
            data: {
              title:fields.title,
              description:fields.description,
              price:parseFloat(fields.price),
              featuredImage:files.courseImage?fields.host+'/images/'+files.courseImage.newFilename :updatedcourse.featuredImage,
            },
          });
        
        return res.status(200).json({course,success:true})
      
       
      });
     
    

      } catch (err) {
        console.log(err);
        return res.status(500).send("Sorry an error occured on the server");
      }
    

  }

}

