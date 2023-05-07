import prisma from "../../../../../prisma/db";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "POST") {
    try {


    await prisma.$connect()
    const result = await prisma.course.update({
        where: { 
          id:req.body.course_id
        },
        data:{
          students:{
            disconnect:[
                {
                id:req.body.student_id
                }
            ],
          }
        },
        include:{
          students:true,
          lessons:true,
          categories:true,
          author:true,
        }
       
       
      })
    return res.status(200).json({course:result,success:true})
    } catch (e) {
      console.log(e);
      return res.status(500).json({message:"Error occured on server"})
    }
    

  }
}