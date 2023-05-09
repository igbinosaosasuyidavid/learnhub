import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
const storage = multer.memoryStorage();
const upload = multer({ storage });
import prisma from "../../../../../prisma/db"
const uploadMiddleware = upload.single("userPic");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
});
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}
export default async function handler(req, res) {
    await runMiddleware(req, res, uploadMiddleware);

    console.log(req.body);

    if (req.file) {
        const stream = await cloudinary.uploader.upload_stream(
            {
                folder: "userPic",
            },
            async (error, result) => {
                console.log(result);
                if (error) return res.status(500).send("Sorry an error occured on the server");
                const checkUser = await prisma.user.findFirst({
                    where: {
                        id: req.body.id
                    },
                })
                if (checkUser.pic) {
                    cloudinary.uploader.destroy('courseFeatured/' + checkUser.pic.split(/[./]/)[10], async (err, resp) => {
                        if (err) console.log(err);
                    })
                }
                const user = await prisma.user.update({
                    where: {
                        id: req.body.id
                    },
                    data: {
                        fullName: req.body.fullName,
                        bio: req.body.bio,
                        email: req.body.email,
                        pic: result.secure_url,
                        sortCode:req.body.sortCode,
                        accountNo:req.body.accountNo,
                        accountName:req.body.accountName,
                        bankName:req.body.bankName,
                    },
                    include: {
                        orders: true,
                        createdCourses: true,
                    }
                });
                return res.status(200).json({ user, success: true })






            }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
    } else {

        const user = await prisma.user.update({
            where: {
                id: req.body.id
            },
            data: {
                fullName: req.body.fullName,
                bio: req.body.bio,
                email: req.body.email,
                sortCode:req.body.sortCode,
                accountNo:req.body.accountNo,
                accountName:req.body.accountName,
                bankName:req.body.bankName,
              
            },
            include: {
                orders: true,
                createdCourses: true,
            }
        });

        return res.status(200).json({ user, success: true })
    }


}

export const config = {
    api: {
        bodyParser: false,
    },
};