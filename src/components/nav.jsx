import Link from "next/link";

import { useSession } from "next-auth/react";

import MenuCart from "./menucart";
import UserProfile from "./userprofile";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Nav() {
  const { data: session } = useSession();
  const router=useRouter()


    return (
      <nav className="py-4">
        <div className="custom-container">
          <div className="flex items-center">
            <div className="flex gap-3 items-center cursor-pointer w-2/6" onClick={(e)=>{e.preventDefault();router.push("/")}}>
                <Image src="/logo.svg" alt="logo" className="w-10 h-10" width={200} height={200}/>
                <h2 className="font-semibold text-lg">The Valley</h2>
            </div>
            <ul className="list-none flex justify-center gap-6 text-center nav-links w-3/6">
              
              
                <li><Link href="/" >Home</Link></li>
                <li><Link href="/">Courses</Link></li>
                <li><Link href="/">About</Link></li>
                <li><Link href="/">Contact</Link></li>
            </ul>
            <div className="ml-auto flex items-center gap-3 w-2/6 justify-end">
              
                { !session?.user ?
                  <>
                   
                    <Link href='/auth/login' className="font-semibold hover:text-gray-500 text-sm ml-2">Sign in</Link>
                  
                    <Link href='/auth/register' className="border border-black rounded-3xl text-sm py-2.5 px-8 font-semibold duration-300 hover:bg-black hover:text-white">Get Started</Link>
                </> : 
                <>
                  <MenuCart/>
                  <UserProfile session={session} />
                  
                </>
                }
            </div>
          </div>
         
        </div>
      </nav>
    )
  }
  
