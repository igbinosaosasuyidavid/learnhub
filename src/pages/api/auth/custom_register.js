import prisma from "../../../../prisma/db";
import bcrypt from "bcryptjs";

async function handler(req, res) {
  if (req.method?.toUpperCase() === "POST") {
    try {
      await prisma.$connect()
      const { email, password, fullName, creator } = req.body;
      let users = await prisma.user.findMany()

      // check if user exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {

        return res
          .status(400)
          .json({ success: false, message: "User already exist" });
      }

      // create new user
      const salt = bcrypt.genSaltSync(10);
      const hash = await bcrypt.hash(password, salt);
      user = await prisma.user.create({
        data: {
          email,
          hash,
          fullName,
          admin: creator === "true" ? true : false
        },
      });
      console.log('user dong');
      const cleanedUser = { ...user, hash: null };
      return res
        .status(200)
        .json({ message: "User", data: cleanedUser, success: true });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.json({ message: "Method not supported" });
  }
}

export default handler;
