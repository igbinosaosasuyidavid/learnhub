import prisma from "../../../../../prisma/db";
import { authOptions } from "../../auth/[...nextauth]";
import { getServerSession } from "next-auth";


export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session.id) {
    return res.status(403).json({ success: false, message: "Auth error" });
  }

  if (req.method?.toUpperCase() === "POST") {
    // Add new course as user wishlist
    const { courseId } = req.body;
    const exist = await prisma.wishlist.findFirst({
      where: {
        courseId,
        userId: session.id
      }
    });
    if (exist) return res.status(200).json({ success: false, message: "Already in wishlist", data: exist });
    const newWish = await prisma.wishlist.create({
      data: {
        courseId,
        userId: session.id
      }
    });
    return res.status(201).json({ success: true, message: "Successfully added to wishlist", data: newWish });
  } else if (req.method?.toUpperCase() === "GET") {
    // Return users wishlists
    const wishes = await prisma.wishlist.findMany({
      where: {
        userId: session.id
      },
      include: {
        course: {
          include: {
            author: true,
            lessons: true,
          }
        }
      }
    });
    return res.json({ success: true, message: "User wishlist", data: wishes });
  } else if (req.method?.toUpperCase() === "PUT") {
    // Remove from wishlist
    const { courseId } = req.body;
    const wish = await prisma.wishlist.findFirst({
      where: { courseId, userId: session?.id }
    });
    if (wish) {
      await prisma.wishlist.delete({
        where: { id: wish.id }
      });
    }
    return res.json({ success: true, message: "Successfully removed from wishlist" });
  } else {
    return res.status(400).json({ success: false, message: "Method not supported" });
  }
}