import prisma from "../../../../../prisma/db";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "GET") {
    try {


      await prisma.$connect()
      const result = await prisma.course.findFirst({
        where: {
          id: req.query.id
        },
        include: {
          author: true,
          lessons: true
        }
      })

      return res.status(200).json(result)
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}