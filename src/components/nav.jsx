import Link from "next/link";

import { useSession } from "next-auth/react";

import MenuCart from "./menucart";
import UserProfile from "./userprofile";
import { useRouter } from "next/router";
import Image from "next/image";
import {BiMenuAltRight} from "react-icons/bi"
import {MdClose} from "react-icons/md"
import { useContext, useState } from "react";
import LoaderContext from "@/contexts/loader";
export default function Nav() {
  const { data: session } = useSession();
  const router=useRouter()
  const [toggle,setToggle] =useState(false)
  const {setShowLoader} =useContext(LoaderContext)

    return (
      <nav className="py-4 xs:px-6  lg:px-0">
        <div className="custom-container ">
          <div className="flex items-center">
            <div className="flex gap-3 items-center cursor-pointer md:w-2/6 xs:w-1/2 " onClick={(e)=>{e.preventDefault();router.push("/");setShowLoader(true)}}>
                <Image src="/logo.svg" alt="logo" className="md:w-10 md:h-10 xs:w-8 xs:h-8" width={200} height={200}/>
                <h2 className="font-semibold text xs:text-xs md:text-[18px]">Learnhub</h2>
            </div>
  
            <ul className={`list-none flex justify-center gap-6 text-center nav-links w-3/6 nav-tog  ${toggle?"toggled":""}`}>
              
              
              <li><Link href="/" >Home</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
          </ul>
           
           
            <div className="ml-auto flex items-center gap-3 md:w-2/6 xs:w-1/2 justify-end">
                <MenuCart/>
                { !session?.user ?
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
                toggle?
                <MdClose  size={30} onClick={()=>{
                  setToggle(prev=>!prev)
                }}/> :
                   <BiMenuAltRight size={30} onClick={()=>{
                    setToggle(prev=>!prev)
                  }}/>
              }
           
            </div>
          </div>
         
        </div>
      </nav>
    )
  }
  
