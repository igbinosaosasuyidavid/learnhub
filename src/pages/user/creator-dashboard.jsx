import Footer from "@/components/footer";
import Nav from "@/components/nav";
import { authOptions } from "../api/auth/[...nextauth]";
// import prisma from "../../../prisma/db"
import { getServerSession } from "next-auth";


export const getServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return {
            props: {}
        };
    }

    
 



    return {
        props: { }
    }
}
export default function Dashboard() {

    return (
        <>
        <Nav />
        <section>
            <div className="custom-container">
                <h1>Dashboard</h1>
            </div>

        </section>
        <Footer />
    </>
    )
  
}