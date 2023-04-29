// /prisma/index.ts
import { PrismaClient } from "@prisma/client";


let prisma=null;

if (process.env.NODE_ENV === "production") {
  console.log("testing");
  prisma = new PrismaClient();
} else {
  console.log();
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    
  }
  prisma = global.prisma;

}
export default prisma;
