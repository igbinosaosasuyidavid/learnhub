import prisma from "../../../../../prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method?.toUpperCase() === "GET") {
    try {
      var session =await getServerSession(req,res,authOptions)
    
    await prisma.$connect()
    const result = await prisma.profile.update({
      where: { 
        userId: session.user.id 
      },
      data:{
        enrolledCourses:{
          connect:req.body.cart.map(data=>({id:data.id}))
        }
      },
      include:{
        enrolledCourses:true
      }
     
     
    })
   
    
    return res.status(200).json(result)
    } catch (e) {
      console.log(e);
      return res.status(500).json({message:"Error occured on server"})
    }
    

  }
}