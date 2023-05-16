import { getServerSession } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { authOptions } from "../api/auth/[...nextauth]";
import Image from "next/image";
import prisma from "../../../prisma/db"
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import LoaderContext from "@/contexts/loader";
import { useSession } from "next-auth/react";
import ToastContext from "@/contexts/toast";
import axios from "axios";
import { useRouter } from "next/router";
export const getServerSideProps = async ({ req, res }) => {
    const session = await getServerSession(req, res, authOptions)

    if (!session?.user?.admin) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return {
            props: {}
        };
    }

    const categories = await prisma.category.findMany({
        where: {},
    })
    console.log(categories, '-------------');
    return {
        props: { categories: JSON.parse(JSON.stringify(categories)) }
    }
}
export default function Create({ categories }) {
    const [courseCategories, setCourseCatgories] = useState([])
    const { setShowLoader } = useContext(LoaderContext)
    const { setToast } = useContext(ToastContext)
    const [courseImage, setCourseImage] = useState()
    const { data: session } = useSession()
    const router = useRouter()
    const createCourse = async (event) => {
        if (!courseImage) {
            setToast('Please upload an image for your course', 'error')
        }
        event.preventDefault();

        const { title_c, description_c, price_c } = event.target
        console.log(event.target);
        try {
            setShowLoader(true)
            const formData = new FormData()
            formData.set("courseImage", courseImage);
            formData.append("title", title_c.value)
            formData.append("user_id", session?.id)
            formData.append("description", description_c.value)
            formData.append("host", window.location.origin)
            formData.append("price", price_c.value)
            formData.append("courseCats", JSON.stringify(courseCategories))

            const res = await axios.post(`/api/app/courses/create-course`, formData)
            console.log(res.data);
            if (res.data.success) {

                setShowLoader(false)
                setToast('Course created', 'success')
                setTimeout(() => {
                    setShowLoader(true)
                    router.push(`/user/courses/${session?.id}`);
                }, 2000);


            } else {
                setToast('Something is wrong with your input please try again', 'warning')
            }

        } catch (err) {
            console.log(err);
            setShowLoader(false)
            if (err.response) {
                setToast(err.response.data.message, 'error')
            }
        }
    };
    const handleImage = (e) => {
        const file = e.target.files[0]
        console.log(file);
        if (file) {


            setCourseImage(file)
            const reader = new FileReader()
            reader.onload = () => {
                const parent = document.querySelector('.preview-box')
                parent.innerHTML = `<Image class="h-[150px] w-full object-cover rounded-lg" src=${reader.result} />`

            }
            reader.readAsDataURL(file)

        }
    }

    useEffect(() => {
        setShowLoader(false)
    }, [])
    return (
        <>
            <Nav />
            <section className="xs:px-6 lg:px-0">
                <div className="custom-container">
                    <div className=" w-full pt-8 pb-20 ">
                        <div className=" bg-white rounded-md p-6]">
                            <div className="">
                                <form onSubmit={createCourse} method="POST" className="w-full" >
                                    <h2 className="text-black font-medium mb-3 md:text-2xl xs:text-lg">
                                        Create Course
                                    </h2>
                                    <div className="md:flex gap-6 items-center">
                                        <div className="md:w-3/5">
                                            <div className="mb-3">

                                                <input required type="text" name="title_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg md:text-sm xs:text-xs" placeholder="Course Title" id="title_c" />

                                            </div>
                                            <div className="mb-3">

                                                <textarea required name="description_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg md:text-sm xs:text-xs outline-none shadow-none resize-none" placeholder="Course Description" id="description_c" rows={6} />

                                            </div>
                                            <div className="mb-3">

                                                <input required type="number" name="price_c" className="bg-slate-100 w-full p-2 px-3 rounded-lg md:text-sm xs:text-xs" placeholder="Course Price" id="price_c" step=".01" />

                                            </div>
                                        </div>
                                        <div className="md:w-2/5">
                                            <div className="mb-3">
                                                <p className="md:text-sm xs:text-xs my-2">Course Image</p>
                                                <div onClick={() => { document.getElementById("image").click() }} className="p-2 bg-gray-100 rounded cursor-pointer inline-block w-fit text-gray-600 md:text-sm xs:text-xs">
                                                    Upload image
                                                </div>
                                                <input type="file"
                                                    name="image_c" hidden onChange={handleImage} id="image" placeholder="" className="p-4 px-6 rounded-lg bg-slate-100" accept=".jpg,.jpeg,.png,.svg,.webp" />
                                                <div className="preview-box mt-9">

                                                </div>
                                            </div>

                                            <div>
                                                <p className="md:text-sm xs:text-xs my-2">Course Category</p>
                                                {
                                                    categories?.map((c) => <span key={c.id}><input type="checkbox" className="mr-0.5" value={c.id} onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setCourseCatgories(prev => [...prev, e.target.value])
                                                        } else {
                                                            setCourseCatgories(prev => prev.filter((data) => data !== e.target.value))
                                                        }

                                                    }} /><span className="capitalize mr-3 text-xs">{c.name}</span></span>)
                                                }
                                            </div>
                                        </div>
                                    </div>







                                    <button type="submit" className=" w-fit py-3 px-6 bg-secondary text-white rounded-lg mt-3">Create</button>




                                </form>
                            </div>



                        </div>
                    </div>
                </div>

            </section>
            <Footer />
        </>


    )
}