import prisma from "../../../../../prisma/db";


export default async function handler(req, res) {
    if (req.method?.toUpperCase() === "GET") {
        try {


            await prisma.$connect()

            const courses = await prisma.course.findMany({
                where: {
                    OR: [
                        {
                            title: {
                                contains: req.query.q,
                                mode: 'insensitive',
                            }
                        },
                        {
                            categories: {
                                some: {
                                    name: {
                                        contains: req.query.q,
                                        mode: 'insensitive',
                                    }
                                }

                            },
                        },
                    ]
                },
            })


            return res.status(200).json({ courses, success: true })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ message: "Error occured on server" })
        }


    }
}