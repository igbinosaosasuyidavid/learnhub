import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Image from "next/image";
import prisma from '../../prisma/db'
import { useContext, useEffect, useState } from "react";
import LoaderContext from "@/contexts/loader";
import axios from "axios";
import { FaUserTie } from "react-icons/fa";
import { BsCart3 } from "react-icons/bs";
import ToastContext from "@/contexts/toast";
import CartContext from "@/contexts/cart";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
export const getServerSideProps = async ({req,res}) => {
    const session = await getServerSession(req, res, authOptions)

    if (session?.user?.admin) {
        res.setHeader("location", "/user/courses/"+session?.id);
        res.statusCode = 302;
        res.end();
        return {
            props: {}
        };
    }

    const categories = await prisma.category.findMany({
        where: {},
    })
    return {
        props: { categories: JSON.parse(JSON.stringify(categories)) }
    }
}

function Courses(props) {
    const [activeCategory, setActiveCategory] = useState('all categories')
    const [courses, setCourses] = useState([])
    const { setShowLoader } = useContext(LoaderContext)
    const [loadCourse, setLoadCourse] = useState(true)
    const { addToCart } = useContext(CartContext)
    const { setToast } = useContext(ToastContext)
    const router = useRouter()
    const { data: session } = useSession()
    const getCourseByCategory = async (category_id) => {

        setLoadCourse(true)
        try {
            const res = await axios.get(`/api/app/courses/get-by-cat?${category_id ? "id=" + category_id : ""}`)
            setLoadCourse(false)
            setCourses(res.data)
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        setShowLoader(false)
        setActiveCategory("all categories")
        getCourseByCategory()
    }, [setShowLoader])
    return (
        <>
            <Nav />

            <section className="bg-[url('/course.webp')] pt-9 xs:px-6 xs:pb-9 md:pb-9 lg:px-0 overlay bg-center bg-cover bg-no-repeat h-64">
                <div className="custom-container h-full">
                    <div className="flex justify-center items-center h-full">
                        <div>
                            <h1 className="text-center text-white text-3xl font-bold">Our Courses</h1>
                            <div className="h-[1px] bg-slate-300 w-1/5 m-auto my-3"></div>
                            <p className="text-center text-gray-300 md:text-sm xs:text-xs">Get more of our courses here</p>
                        </div>

                    </div>

                </div>
            </section>
            <section className="pt-9 xs:px-6 xs:pb-9 md:pb-9 lg:px-0 ">
                <div className="custom-container">
                    <div className="flex items-center gap-5 justify-center mt-5 mb-8 xs:overflow-x-scroll md:overflow-x-hidden">
                        <button onClick={() => { setActiveCategory("all categories"); getCourseByCategory() }} className={`${activeCategory === "all categories" ? "activeCat" : ""} capitalize duration-300 hover:text-black hover:border-black text-gray-400  text-sm focus:border-b-2 border-b-2 border-white pb-2 xs:ml-[200px] md:ml-0 whitespace-nowrap xs:mb-2 md:mt-0`}>All categories</button>
                        {
                            props.categories.map((c, i) => <button onClick={() => { setActiveCategory(c); getCourseByCategory(c.id) }} key={c.id} className={`${activeCategory === c ? "activeCat" : ""} capitalize duration-300 hover:text-black hover:border-black text-gray-400  text-sm focus:border-b-2 border-b-2 border-white pb-2 whitespace-nowrap xs:mb-2 md:mt-0`}>{c.name}</button>)
                        }
                    </div>
                    {
                        loadCourse &&
                        <div className="flex justify-center items-center my-5 mb-9">

                            <span className="loader-course"></span>
                        </div>
                    }

                    <>
                        {
                            !loadCourse ?
                                <>
                                    {
                                        courses.length !== 0 ?
                                            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 xs:grid-cols-2 mb-8">

                                                {
                                                    courses.filter(data => !data.studentIds.includes(session?.id)).map((data) => {
                                                        return (
                                                            <div className="shadow-lg border border-solid border-gray-500 " key={data.id}>
                                                                <Image src={data.featuredImage} alt="course-Image" className="w-full object-cover sm:h-[150px] xs:h-[100px] cursor-pointer" width={300} height={300} onClick={() => {
                                                                    setShowLoader(true)
                                                                    router.push(
                                                                        { pathname: `/courses/${data.id}` },
                                                                        "/courses/" + data.id
                                                                    );
                                                                }} />
                                                                <div className="p-3">
                                                                    <h3 className="text-black sm:text-sm xs:text-[10px] font-semibold cursor-pointer" onClick={() => {
                                                                        setShowLoader(true)
                                                                        router.push(
                                                                            { pathname: `/courses/${data.id}` },
                                                                            "/courses/" + data.id
                                                                        );
                                                                    }}>{data.title.length > 50 ? data.title.slice(0, 50) + '...' : data.title}</h3>
                                                                    <p className="flex items-center sm:text-xs xs:text-[9px] gap-1 mb-3 mt-1"><FaUserTie className="text-secondary " />{data.author.fullName}</p>

                                                                    <h3 className="font-bold sm:text-lg xs:text-[13px] flex items-center pb-3 z-50">
                                                                        <span>{data.price !== 0 ? new Intl.NumberFormat("en-US", { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, }).format(parseFloat(data.price).toFixed(3)) : "Free"}</span>
                                                                        {data.price !== 0 ?
                                                                            <button className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 sm:py-1 sm:px-2 xs:py-1 xs:px-1 text-[11px] rounded-md ml-auto" onClick={() => {
                                                                                addToCart(data, (err) => {

                                                                                    if (err) { setToast(`Already in your cart`, 'info') } else { setToast(`Added to cart.`, 'success'); window.scrollTo(0, 0); }



                                                                                })
                                                                            }}> <BsCart3 className="sm:text-[17px] xs:text-[11px]" /></button> :
                                                                            <button className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 sm:py-0 sm:px-2 xs:py-1 xs:px-1 text-[11px] rounded-md ml-auto" onClick={() => {
                                                                                setShowLoader(true)
                                                                                router.push(
                                                                                    { pathname: `/courses/${data.id}` },
                                                                                    "/courses/" + data.id
                                                                                );
                                                                            }}> Enroll</button>
                                                                        }

                                                                    </h3>




                                                                </div>

                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            : <div className="flex items-center justify-center mb-12">
                                                <p className="text-center text-sm text-slate-400">No courses found</p>
                                            </div>
                                    }

                                </>

                                : ''
                        }

                    </>


                </div>
            </section>

            <Footer />
        </>

    );
}

export default Courses;
