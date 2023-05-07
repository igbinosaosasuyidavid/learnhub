import prisma from "../../../../../prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "POST") {
    try {
      var session = await getServerSession(req, res, authOptions)

      await prisma.$connect()
      console.log(req.body.cart);
      const order = await prisma.order.create({
        data: {
          userId: session.id,
          stripeSessionId: req.body.id,
          status: "success",
          total: req.body.cart.reduce(function (acc, data) { return acc + data.price; }, 0),

          items: {
            connect: req.body.cart.map(data => ({ id: data.id }))
          }
        }

      })

      const result = await prisma.user.update({
        where: {
          id: session.id
        },
        data: {
          enrolledCourses: {
            connect: req.body.cart.map(data => ({ id: data.id }))
          }
        },
        include: {
          enrolledCourses: true
        }


      })

      return res.status(200).json({ success: true })
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "Error occured on server" })
    }


  }
}