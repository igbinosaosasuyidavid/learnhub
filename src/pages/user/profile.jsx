import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "../api/auth/[...nextauth]";
import Link from "next/link";
export const getServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session) {
        res.setHeader("location", "/auth/login");
        res.statusCode = 302;
        res.end();
        return {
            props: {}
        };
    }

    const user = await prisma.user.findFirst({
        where: {
            id: session?.id
        },
        include: {
            orders: true
        }

    })
 



    return {
        props: { user: JSON.parse(JSON.stringify(user)) }
    }
}

export default function Profile({ user }) {
    return (
        <>
            <Nav />
            <section className="bg-gray-100 h-[140px]"></section>
            <section className="-mt-[80px] py-4 xs:px-6 lg:px-0  min-h-screen">
                <div className="custom-container">
                    <div className="flex items-center gap-3">
                        <Image src={user?.pic || '/avatar.jpeg'} className="w-32 h-32 object-cover rounded-full" width={200} height={200} />
                        <div>
                            <h2 className="text-lg font-semibold">{user?.fullName}</h2>
                            <h2 className="text-sm"><Link href={`/user/courses/${user?.id}`}> {user?.courseIds.length}</Link> {user?.courseIds.length === 1 ? "Course" : "Courses"} Enrolled</h2>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </>

    )
}