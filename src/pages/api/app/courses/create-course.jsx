import prisma from "../../../../../prisma/db";
import path from "path"
import formidable from "formidable";
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

        const course = await prisma.course.create({
              data: {
                title:fields.title,
                description:fields.description,
                price:parseFloat(fields.price),
                featuredImage:fields.host+'/images/'+files.courseImage.newFilename,
                author:{
                  connect:{
                    id:fields.user_id
                  }

                }
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

