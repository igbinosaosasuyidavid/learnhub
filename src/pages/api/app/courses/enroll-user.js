import prisma from "../../../../../prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "POST") {
    try {
      var session = await getServerSession(req, res, authOptions)

      await prisma.$connect()
      const course = await prisma.course.update({
        where: {
          id: req.body.course_id
        },
        data: {
          students: {
            connect: {
              id: session?.id
            }
          }
        },
        include: {
          lessons: true,
          author: true
        }


      })


      return res.status(200).json({ course, success: true })
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}