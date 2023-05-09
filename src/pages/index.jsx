
import Nav from "@/components/nav"
import Image from "next/image"
import hero from "@/assets/images/hero.png"
import { useContext, useEffect, useState } from "react"
import { BsCart3 } from "react-icons/bs"
import { FaUserTie } from "react-icons/fa"
import CartContext from "@/contexts/cart"
import { useSession } from "next-auth/react"
import axios from "axios"
import ToastContext from "@/contexts/toast"
import { useRouter } from "next/router"
import Footer from "@/components/footer"
import LoaderContext from "@/contexts/loader"
import Link from "next/link"

export default function Home() {
  const router = useRouter()

  const { addToCart } = useContext(CartContext)
  const { setToast } = useContext(ToastContext)
  const [courses, setCourses] = useState([])

  const [loadCourse, setLoadCourse] = useState(true)
  const { setShowLoader } = useContext(LoaderContext)
  const { data: session } = useSession()


  useEffect(() => {
    getCourses()
    setShowLoader(false)
  }, [courses, setShowLoader])

  const getCourses = async () => {
    try {
      var res;
      if (session?.user?.admin) {
        res = await axios.get("/api/app/courses/get-courses")
      } else {
        res = await axios.get("/api/app/courses/get-courses")
      }
      if (res.data) {
        setLoadCourse(false)
        setCourses(res.data)

      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <>
      <Nav />
      <section className="bg-gray-50 pt-9 xs:px-6 xs:pb-9 md:pb-9 lg:px-0">
        <div className="custom-container">
          <div className="flex items-center ">
            <div className="md:w-1/2 xs:w-full xs:text-center md:text-left">
              <h1 className="md:text-4xl lg:text-5xl xs:text-3xl font-bold ">A lifetime of education begins here.</h1>
              <p className="text-gray-400 md:mt-2 xs:mt-4 md:text-sm xs:text-[12px] xs:w-3/4 xs:m-auto md:w-full md:m-0">Start or advance your career with our quality courses at the most affordable prices. We crush the barriers to your learning</p>
              <div className="mt-8">
                {
                  !session?.user?.admin ? <Link href={session?.user ? "/courses" : '/auth/register'} className="rounded-lg border border-secondary bg-secondary text-white py-2 px-5 hover:opacity-80 duration-300 font-semibold xs:text-[12px] md:text-[16px]" onClick={() => setShowLoader(true)}>{session?.user ? "Enroll a new course" : 'Join for Free'}</Link> : <Link className="rounded-lg border border-secondary bg-secondary text-white py-2 px-5 hover:opacity-80 duration-300 font-semibold xs:text-[12px] md:text-[16px]" href={"/courses/create/"}>Create a course</Link>
                }



              </div>

            </div>
            <div className="w-1/2 flex justify-center relative xs:hidden md:flex">
              <Image src={hero} alt="hero" className="w-full  h-96 object-cover z-10" />
              <div className="custom-hero-callout1 absolute rounded-full left-3 top-8"></div>
              <div className="custom-hero-callout2 absolute rounded-full right-3 bottom-0"></div>
            </div>

          </div>
        </div>
      </section>
      <section className="py-10  xs:px-6 lg:px-0">
        <div className="custom-container">
          <h2 className="font-semibold md:text-3xl xs:text-2xl text-center mb-4">{session?.user?.admin ? "Your" : "Our popular"} courses</h2>

          {
            loadCourse &&
            <div className="flex justify-center items-center my-5 mb-9">

              <span className="loader-course"></span>
            </div>
          }
          {

            (courses.length !== 0) ?
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 xs:grid-cols-2">

                <>
                  {
                    courses.slice(0, 8).filter(data => !data.studentIds.includes(session?.id)).map((data) => {
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
                              {
                                !session?.user?.admin && <>
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
                                </>
                              }
                             

                            </h3>




                          </div>

                        </div>
                      )
                    })
                  }
                </>

              </div>
              : <>
                {
                  !loadCourse && <div className="flex w-full flex-col justify-center text-center">
                    <p className="text-center w-full">You dont have any course yet.</p>
             

                  </div>
                }
              </>
          }
        </div>
      </section>
      <Footer />
    </>

  )
}
