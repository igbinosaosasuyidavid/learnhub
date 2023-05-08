import { getServerSession } from "next-auth";
import prisma from "../../../../../prisma/db";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const session= await getServerSession(req,res,authOptions)
  if (req.method?.toUpperCase() === "GET") {

    try {


      await prisma.$connect()
      var result
      if (session?.user?.admin) {
        result = await prisma.user.findFirst({
          where: {
            id: session?.id
          },
          select: {
            createdCourses: {
              include: {
                author: true,
                lessons: true,
                categories: true,
              }
            }
          }
        })
      }else{
        result = await prisma.course.findMany({
          where: {},
          include: {
            author: true,
            lessons: true
          }
        })
      }
   
     
      return res.status(200).json(result.createdCourses || result)
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}