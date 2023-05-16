import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/nav";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import { FaTimes, FaUserFriends } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import CartContext from "@/contexts/cart";
import { useSession } from "next-auth/react";
import { BsHeartFill, BsStar } from "react-icons/bs";
import { loadStripe } from "@stripe/stripe-js";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../../prisma/db";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
import { BiHeart } from "react-icons/bi";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export const getServerSideProps = async ({ req, res, params }) => {
    const session = await getServerSession(req, res, authOptions);

    const result = await prisma.course.findFirst({
        where: {
            id: params.course_id,
        },
        include: {
            author: true,
            lessons: true,
        },
    });

    let wishlisted = false;
    if (session?.id) {
        const wishlist = await prisma.wishlist.findFirst({
            where: {
                courseId: params.course_id,
                userId: session.id,
            },
        });

        wishlisted = wishlist?.id ? true : false;
    }
    console.log(result);
    const courses = await prisma.course.findFirst({
        where: {
            AND: {
                id: params.course_id,
                studentIds: {
                    hasEvery: [session?.id],
                },
            },
        },
    });

    return {
        props: {
            course: JSON.parse(JSON.stringify(result)),
            userIsStudent: courses ? (courses.length !== 0 ? true : false) : false,
            wishlisted,
        },
    };
};

function Course({ course, userIsStudent, wishlisted }) {
    const { data: session } = useSession();
    const router = useRouter();
    const [currentLesson, showLesson] = useState(false);
    const [video, setVideo] = useState(false);
    const [wished, setWished] = useState(wishlisted);
    const { setShowLoader } = useContext(LoaderContext);
    const { cart, addToCart } = useContext(CartContext);
    const { setToast } = useContext(ToastContext);



    const enrollUser = async () => {
        if (!session?.user) {
            setToast("Please sign in to access this course", "info");
            return null
        }
        if (session?.user?.admin) {
            setToast("Teachers cannot enroll courses", "info");
            return null
        }
        if (course.price !== 0) {
            setToast("Not a free course", "error");
            return null
        }
        try {
            setShowLoader(true)
            const res = await axios.post('/api/app/courses/enroll-user', {

                course_id: course.id
            })

            if (res.data.success) {
                setToast("Succesfully Enrolled", "success");
                setShowLoader(false)
                router.replace(router.asPath);
            } else {
                setToast("Enroll failed ", "error");
                setShowLoader(true)
            }
        } catch (e) {
            console.log(e);
            setToast("Something went wrong", "error");
            setShowLoader(false)
        }
    }
    const addCourseToWishlist = async (e) => {
        e.preventDefault()
        if (!session?.user) return router.push("/auth/login")

        try {
            console.log("Adding course to wishlist");
            await axios.post("/api/app/user/wishlist", {
                courseId: course.id,
            });
            setWished(true);
            setToast("Added to wishlist", 'success')
        } catch (error) {
            console.log("Couldn't add to wishlist");
            console.log(error);
        }
    };

    const removeCourseFromWishlist = async () => {
        if (!session.id) return alert("Please login");
        try {
            console.log("Removing course from wishlist");
            console.log(course);
            await axios.put("/api/app/user/wishlist", {
                courseId: course.id,
            });
            setWished(false);
            setToast("Removed from wishlist", 'success')
        } catch (error) {
            console.log("Couldn't add to wishlist");
            console.log(error);
        }
    };

    const checkOut = async (e) => {
        e.preventDefault();
        if (!session?.user) return router.push("/auth/login");
        if (session?.user?.admin) {
            setToast("Teachers cannot purchase courses", "info");
            return null
        }
        try {
            setShowLoader(true);
            const stripe = await stripePromise;

            addToCart(course, () => { });
            const checkoutSession = await axios.post(
                "/api/app/stripe/payment-session",
                { cart: cart, user: session?.user }
            );
            console.log(cart);

            const result = await stripe.redirectToCheckout({
                sessionId: checkoutSession.data.id,
            });

            if (result.error) {
                setShowLoader(false);
                setToast(result.error.message, "error");
            } else {
            }
        } catch (e) {
            setShowLoader(false);
            console.log(e);
        }
    };
    useEffect(() => {
        setShowLoader(false);
    }, []);
    return (
        <>
            <Nav />

            <div className="bg-[rgb(128,128,128,0.04)] py-6 xs:px-6  lg:px-0">
                <div className="custom-container">
                    <div className="md:flex items-center gap-6">
                        <Image
                            src={course?.featuredImage}
                            alt="course-Image"
                            className="md:h-72 md:w-1/2 xs:h-44 object-cover rounded-xl"
                            width={300}
                            height={300}
                        />
                        <div className="md:w-1/2">
                            <h2 className="text-black font-semibold md:text-2xl xs:text-xl mb-2 mt-4 md:mt-0">
                                {course?.title}
                            </h2>
                            <h2 className="xs:text-xs md:text-sm">
                                {course?.description?.length > 200
                                    ? course?.description?.slice(0, 200) + "..."
                                    : course?.description}
                            </h2>
                            <div className="flex items-center mt-3 mb-6">
                                <FaUserFriends className="mr-2 text-secondary text-sm md:text-lg" />{" "}
                                <span className="md:text-lg xs:text-sm text-black font-semibold mr-1">
                                    {course?.studentIds?.length}
                                </span>{" "}
                                <span className="xs:text-sm">
                                    {course?.studentIds?.length === 1 ? "Student" : "Students"}
                                </span>
                            </div>

                            <h3 className="text-md text-black mb-2">Course Instructor</h3>
                            <div className="flex gap-2 items-center">
                                {session?.user?.profile?.img ? (
                                    <Image
                                        src={session?.user?.profile?.Image}
                                        alt="profile-pic"
                                        width={200}
                                        height={200}
                                    />
                                ) : (
                                    <div className="flex justify-center items-center md:w-10 md:h-10 xs:w-8 xs:h-8 rounded-full  bg-gray-500 text-white font-semibold cursor-pointer uppercase md:text-xl xs:text-sm">
                                        {course?.author?.fullName.match(/\b(\w)/g)?.join("")}
                                    </div>
                                )}
                                <h3 className="">
                                    <span className="text-black font-medium md:text-sm xs:text-[13px]">
                                        {course?.author?.fullName}
                                    </span>
                                    <span className="md:text-xs xs:text-[9px] m-0 p-0 !text-primary flex items-center gap-1">
                                        <BsStar /> Experienced
                                    </span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="xs:px-6  lg:px-0">
                <div className="custom-container">
                    <div className="md:flex mt-8 gap-8 mb-10">
                        <div className="md:w-4/6 xs:mb-8 md:mb-0">
                            <h1 className="md:text-2xl xs:text-xl text-black font-semibold mb-2">
                                Course Content
                            </h1>

                            {course.lessons.length !== 0 ? (
                                <>
                                    {course.lessons.map((data) => (
                                        <div
                                            key={data.id}
                                            className="flex items-center p-4 px-5 rounded-md bg-[rgb(128,128,128,0.05)] hover:bg-[rgb(128,128,128,0.1)] duration-300 border border-solid border-gray-400 cursor-pointer mb-1"
                                            onClick={(e) => {
                                                if (session?.user) {
                                                    if (!userIsStudent) {
                                                        if (session?.user) {
                                                            setToast(
                                                                "Please enroll into the course first to view lessons ",
                                                                "info"
                                                            );
                                                        } else {
                                                            router.push("/auth/login");
                                                        }
                                                    } else {
                                                        showLesson(data);
                                                    }
                                                }else{
                                                    setToast(
                                                        "Please sign in to access lessons"
                                                    );
                                                }
                                               
                                            }}
                                        >
                                            <h1 className="xs:text-sm md:text-lg">{data.title}</h1>
                                            <span className="ml-auto inline-flex items-center gap-2">
                                                <MdOndemandVideo className="md:text-[20px] xs:text-[16px]" />
                                                <span className="xs:text-[12px] md:text-lg">
                                                    {data.duration}
                                                </span>
                                            </span>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <p className="xs:text-xs md:text-sm">
                                    No Lessons yet for this course
                                </p>
                            )}
                        </div>
                        <div className="md:w-2/6">
                            {(userIsStudent && session?.user) ? (
                                <div className="mt-4">
                                    <p className="md:text-2xl xs:text-sm">
                                        Howdy, {session?.user?.name}
                                    </p>

                                    <div className=" mt-5">
                                        <div className="w-full p-1 bg-slate-100 rounded-3xl">
                                            <div
                                                style={{ width: 12 + "%" }}
                                                className="p-1.5 rounded-3xl bg-secondary"
                                            ></div>
                                        </div>
                                        <p className="md:text-sm xs:text-[13px] flex items-center gap-2 mt-3">
                                            Your course is{" "}
                                            <span className="font-bold xs:text-sm md:text-lg text-secondary">
                                                3%
                                            </span>{" "}
                                            Completed
                                        </p>

                                        <button className="bg-primary text-[#ffffff] rounded-lg py-2 px-4 shadow-md mt-4 hover:opacity-90 duration-300 xs:text-xs md:text-sm cursor-pointer" onClick={()=>{  showLesson(course?.lessons[0]);}}>
                                            Continue Learning
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center mb-4">
                                        <h4 className="font-semibold md:text-3xl xs:text-xl">
                                            {course.price !== 0 ? new Intl.NumberFormat("en-US", {
                                                style: "currency",
                                                currency: "GBP",
                                                currencyDisplay: "narrowSymbol",
                                                minimumFractionDigits: 0,
                                            }).format(parseFloat(course.price).toFixed(3)) : "Free"}
                                        </h4>
                                        {course.price !== 0 && <span className="font-normal !text-sm ml-auto">
                                            14 days refund policy
                                        </span>}
                                    </div>

                                    {
                                        course.price !== 0 ? <>
                                            <div className="flex items-center gap">
                                                <button
                                                    className="bg-secondary text-white p-3 w-5/6 rounded-lg font-semibold mb-3 hover:opacity-90 duration-300 xs:text-xs md:text-sm"
                                                    onClick={() => {
                                                        if (session?.user?.admin) {
                                                            setToast(`Teachers cannot add to cart`, "info");
                                                        } else {
                                                            addToCart(course, (err) => {
                                                                if (err) {
                                                                    setToast(`Already in your cart`, "info");
                                                                } else {
                                                                    setToast(`Added to cart.`, "success");
                                                                    window.scrollTo(0, 0);
                                                                }
                                                            });
                                                        }
                                                     
                                                    }}
                                                >
                                                    Add to Cart
                                                </button>
                                                <button title="Add to wishlist"
                                                    className=" w-1/6 text-white p-3 rounded-lg font-semibold mb-3 hover:opacity-90 duration-300 xs:text-xs md:text-sm ml-auto"
                                                    onClick={(e) => {
                                                        e.target.disabled = true;
                                                        try {
                                                            if (wished) removeCourseFromWishlist(e);
                                                            else addCourseToWishlist(e);
                                                        } catch (error) {
                                                            console.log(error);
                                                        } finally {
                                                            e.target.disabled = false;
                                                        }
                                                    }}
                                                >
                                                    {wished ? <BsHeartFill size={30} color="#6255a4" /> : <BiHeart size={30} color="#6255a4" />}
                                                </button>

                                            </div>

                                            <button
                                                className="bg-transparent text-black p-3 w-full active:border focus:border border border-gray-500 rounded-lg hover:bg-gray-100 duration-300 focus:border-gray-500 active:border-gray-500 font-semibold xs:text-xs md:text-sm"
                                                onClick={checkOut}
                                            >
                                                Purchase Now
                                            </button>
                                        </> : <button
                                            className="bg-secondary text-white p-3 w-full rounded-lg font-semibold mb-3 hover:opacity-90 duration-300 xs:text-xs md:text-sm"
                                            onClick={enrollUser}
                                        >
                                            Enroll
                                        </button>
                                    }

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <>
                {currentLesson && (
                    <div className="fixed top-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center h-screen w-full z-[999999]">
                        <div className="bg-white relative md:w-[550px] xs:w-full md:h-[570px] xs:h-full p-7 rounded-lg overflow-y-scroll">
                            <span
                                className="absolute top-4 right-5 text-lg hover:text-gray-500 cursor-pointer duration-300 inline-flex gap-2 items-center text-secondary font-semibold"
                                onClick={(e) => {
                                    e.preventDefault();
                                    showLesson(false);
                                    setVideo(false);
                                }}
                            >
                                <FaTimes />
                            </span>
                            <h2 className="text-xl font-semibold mb-3 mt-4">
                                {currentLesson.title}
                            </h2>
                            {!video && (
                                <div className="flex justify-center absolute top-1/3 left-1/2">
                                    <span className="loader-vid bg-gra"></span>
                                </div>
                            )}
                            <div className="h-[270px]">
                                <iframe
                                    onLoad={() => {
                                        setVideo(true);
                                    }}
                                    src={`${currentLesson.video_url}?autoplay=true`}
                                    loading="lazy"
                                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                    allowFullScreen="true"
                                    className={`${video ? "block" : "invisible"
                                        } lesson-vid w-full h-full rounded-lg`}
                                ></iframe>
                            </div>
                            <h3 className="font-medium text-lg mt-5 mb-2">Other Lessons</h3>
                            {course.lessons.map((data) => (
                                <div key={data.id}>
                                    <div
                                        className={`flex items-center p-4 px-5 rounded-md ,128,128,0.05)] hover:bg-[rgb(128,128,128,0.1)] duration-300  cursor-pointer ${data.title === currentLesson.title ? "bg-gray-200" : ""
                                            }`}
                                        onClick={() => {
                                            setVideo(false);
                                            showLesson(data);
                                        }}
                                        key={data.id}
                                    >
                                        <h1 className="xs:text-sm md:text-lg">{data.title}</h1>
                                        <span className="ml-auto inline-flex items-center gap-2">
                                            <MdOndemandVideo className="xs:text-[16px] md:text-[20px]" />
                                            <span className="xs:text-[12px] md:text-lg">
                                                {data.duration}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </>
        </>
    );
}

export default Course;
