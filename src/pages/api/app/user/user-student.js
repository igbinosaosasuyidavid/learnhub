import prisma from "../../../../../prisma/db";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "GET") {

    try {
      await prisma.$connect()



      const courses = await prisma.course.findFirst({
        where: {
          AND: {
            id: req.query.course_id,
            studentIds: {
              hasEvery: [req.query.user_id]
            }
          },
        },


      })
      console.log(courses);

      return res.status(200).json({ courses, userIsStudent: courses ? courses.length !== 0 ? true : false : false })
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}