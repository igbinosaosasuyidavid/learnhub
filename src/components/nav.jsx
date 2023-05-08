import Link from "next/link";

import { useSession } from "next-auth/react";

import MenuCart from "./menucart";
import UserProfile from "./userprofile";
import { useRouter } from "next/router";
import Image from "next/image";
import { BiMenuAltRight, BiSearch } from "react-icons/bi"
import { MdClose } from "react-icons/md"
import { useContext, useEffect, useState } from "react";
import LoaderContext from "@/contexts/loader";
import axios from "axios";
export default function Nav() {
  const { data: session } = useSession();
  const router = useRouter()
  const [toggle, setToggle] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [query, setQuery] = useState('')
  const [courses, setCourses] = useState([])
  const { setShowLoader } = useContext(LoaderContext)
  const getCourses = async (e) => {

    e.preventDefault()

    try {
      const res = await axios.get(`/api/app/courses/search?q=${e.target.value}`)
      if (res.data.success) {

        setCourses(res.data.courses)
        setShowResult(false)
      }

    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    console.log(courses);
  }, [courses])
  return (
    <nav className="py-4 xs:px-6  lg:px-0">
      <div className="custom-container ">
        <div className="flex items-center">
          <div className={`flex gap-3 items-center cursor-pointer mr-8 `} onClick={(e) => { e.preventDefault(); router.push("/"); setShowLoader(true) }}>
            <Image src="/logo.svg" alt="logo" className="md:w-10 md:h-10 xs:w-8 xs:h-8" width={200} height={200} />
            <h2 className="font-semibold text xs:text-xs md:text-[18px]">Learnhub</h2>


          </div>

          <ul className={` list-none flex justify-center gap-6 text-center nav-links  ${session?.user?.admin ? "m-auto":""}  nav-tog  ${toggle ? "toggled" : ""}`}>


            <li className="text-sm"><Link href="/" >Home</Link></li>
            {!session?.user?.admin && <li className="text-sm"><Link href="/courses">Courses</Link></li>}
            <li className="text-sm"><Link href="/about">About</Link></li>
            <li className="text-sm"><Link href="/contact">Contact</Link></li>
          </ul>


          <div className="ml-auto flex items-center gap-3  justify-end md:relative">
          { !session?.user?.admin &&
                 <form action="" onSubmit={(e) => { e.preventDefault() }}>
                 <div className="rounded-[30px] md:py-1 xs:py-0 md:px-4 xs:px-2 text-sm flex items-center md:w-56 border border-gray-200">
                   <input className="w-5/6 xs:hidden md:block" type="search" placeholder="Search course" onChange={(e) => {
                     setQuery(e.target.value);
                     setShowResult(true)
                     setTimeout(() => {
                       getCourses(e)
                     }, 1500)
                   }} />
                   <button onClick={() => { if (query) { setQuery('') } else { setQuery('.') } }} type="submit" className="  text-center rounded-[10px] p-2"><BiSearch className="text-black m-auto text-lg text-center" /></button>
                   {
                     (query?.length !== 0) &&
                     <div className="absolute md:top-16 xs:top-20 md:left-0 xs:left-1/2 -translate-x-1/2  bg-white shadow-[0_0_20px_0_rgb(0,0,0,0.1)] md:w-96 xs:w-11/12 py-6 z-[999] rounded-lg">
                       <input className="w-5/6 xs:block md:hidden border border-gray-200 xs:mx-3 xs:px-2 xs:py-2 rounded-[25px] mb-2" type="search" placeholder="Search course" onChange={(e) => {
                         setQuery(e.target.value);
                         setShowResult(true)
                         setTimeout(() => {
                           getCourses(e)
                         }, 1500)
                       }} />
                       {
                         courses?.length !== 0 ? <>
   
                           {
                             courses?.map((data) => <div className="" key={data.id}>
   
                               <div className="flex items-center gap-2 px-3 hover:bg-gray-50 duration-300 xs:py-3 md:py-2">
                                 <Image src={data.featuredImage} width={200} height={200} alt="img" className="w-1/6 h-11 rounded-md object-cover" />
                                 <Link className="py-3 block w-5/6 xs:text-xs md:text-sm" href={'/courses/' + data.id} onClick={() => setShowLoader(true)}>{data.title.length > 50 ? data.title.slice(0, 50) + '...' : data.title}</Link>
                               </div>
   
                             </div>)
                           }
                           {
                             showResult &&
                             <div className="flex justify-center items-center my-5 mb-9">
   
                               <span className="loader-course"></span>
                             </div>
                           }
                         </> : <>
                           {
                             showResult ?
                               <div className="flex justify-center items-center my-5 mb-9">
   
                                 <span className="loader-course"></span>
                               </div> : <p className="italic text-center">No results...</p>
                           }
                         </>
   
   
                       }
                     </div>
                   }
   
                 </div>
                 <div>
   
                 </div>
   
               </form>
          }
         
            {
              !session?.user?.admin &&
                    <MenuCart />
            }
      
            {!session?.user ?
              <>

                <Link href='/auth/login' className="font-semibold hover:text-gray-500 md:text-sm xs:text-[10px] ml-2 xs:text-gray-500 xs:border xs:border-black xs:rounded-3xl md:border-0 xs:py-0.5 xs:px-2 md:p-0">Sign in</Link>


                <Link href='/auth/register' className="border border-black rounded-3xl md:text-sm xs:text-[10px] md:py-2.5 md:px-8 xs:py-1.5 xs:px-3 font-semibold duration-300 hover:bg-black hover:text-white xs:text-gray-500 xs:hidden md:inline-block">Get Started</Link>

              </> :
              <>

                <UserProfile session={session} />

              </>
            }

          </div>
          <div className="md:hidden ml-2 cursor-pointer">
            {
              toggle ?
                <MdClose size={30} onClick={() => {
                  setToggle(prev => !prev)
                }} /> :
                <BiMenuAltRight size={30} onClick={() => {
                  setToggle(prev => !prev)
                }} />
            }

          </div>
        </div>

      </div>
    </nav>
  )
}

