import prisma from "../../../../../prisma/db";

export default async function handler(req, res) {
  console.log(global.prisma);
  if (req.method?.toUpperCase() === "GET") {
    try {
   
    
    await prisma.$connect()
    const result=await prisma.course.findMany({
        where:{},
        include:{
            author:true
        }
    })
    
    return res.status(200).json(result)
    } catch (e) {
      console.log(e);
      return res.status(500).json({message:"Error occured on server"})
    }
    

  }
}