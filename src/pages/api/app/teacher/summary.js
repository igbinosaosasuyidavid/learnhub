import prisma from "../../../../../prisma/db";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session.id) {
    return res.status(403).json({ success: false, message: "Auth error" });
  }

  if (req.method?.toUpperCase() === "GET") {
    const courses = await prisma.course.findMany({
      where: { authorId: session.id },
      include: {
        orders: true,
        wishlist: true,
        students: true
      }
    });
    // const myCourses = courses.reduce((acc, cur) => {
    //   // How many times teacher's courses where ordered
    //   cur.orders = cur.orders.length;
    //   // Total number of students in each course
    //   cur.totalStudents = cur.students.length;
    //   // Last five students enrolled in course
    //   cur.students = cur.students.slice(-5);
    //   // Number of wishlist on each course
    //   cur.wishlist = cur.wishlist.length;
    //   acc[cur.id] = cur;
    //   return acc;
    // }, {});

    const myCourses = courses.map((course) => {
      // How many times teacher's courses where ordered
      course.numOrders = course.orders.length;
      // Total number of students in each course
      course.totalStudents = course.students.length;
      // Last five students enrolled in course
      course.students = course.students.slice(-5);
      // Number of wishlist on each course
      course.wishlist = course.wishlist.length;
      return course;
    });

    return res.status(200).json({
      success: true,
      message: "Author data summary",
      data: myCourses
    });
  } else {
    return res.status(400).json({ success: false, message: "Method not supported" });
  }
}