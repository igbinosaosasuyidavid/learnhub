


import prisma from "../../../../../prisma/db";

export default async function handler(req, res) {

  if (req.method?.toUpperCase() === "GET") {

    try {


      await prisma.$connect()
      var check;
      if (!req.query.id) {
        check = {}
      } else {
        check = {
          categoryIds: {
            hasEvery: [req.query.id]
          }
        }

      }
      const courses = await prisma.course.findMany({
        where: check,
        include: {
          author: true
        }

      })

      return res.status(200).json(courses)
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}