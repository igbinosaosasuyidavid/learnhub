import Link from "next/link";




import { useRouter } from "next/router";
import { BsFacebook, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function Footer() {

  const router=useRouter()


    return (
        <footer className="bg-gray-100 py-5">
            <div className="custom-container text-center">
                <p className="text-center text-gray-600 text-xs mt-3">&copy; Copyright {new Date().getFullYear()}. The valley All rights reserved</p>
                <div className="border-b border-gray-300 w-1/2 m-auto">.</div>
                <div className="flex items-center w-1/2 m-auto  mt-6">
                    <div className="flex items-center gap-2 ">
                        <a href="/privacy" className="text-xs">Privacy</a>
                        <a href="/privacy" className="text-xs">Terms of use</a>
                    </div>
                    <div className="inline-flex ml-auto gap-3">
                        <a href=""><BsTwitter/></a>
                        <a href=""><BsLinkedin/></a>
                        <a href=""><BsFacebook/></a>
                    </div>

                </div>
               
            </div>
           
        </footer>
    )
  }
  
