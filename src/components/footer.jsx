import Link from "next/link";




import { useRouter } from "next/router";
import { BsFacebook, BsLinkedin, BsTwitter } from "react-icons/bs";

export default function Footer() {

    const router = useRouter()


    return (
        <footer className="bg-gray-100 py-5 xs:px-6  lg:px-0">
            <div className="custom-container text-center">
                <p className="text-center text-gray-600 sm:text-xs xs:text-[10px] mt-3">&copy; Copyright {new Date().getFullYear()}. Learnhub All rights reserved</p>
                <div className="border-b border-gray-300 md:w-1/2 xs:w-5/6 m-auto mb-7">.</div>
                <div className="flex items-center md:w-1/2 md:m-auto xs:w-full xs:m-0  xs:mt-6">
                    <div className="flex items-center gap-2 ">
                        <Link href="/privacy-policy" className="sm:text-xs xs:text-[10px]">Privacy</Link>
                        <Link href="/terms" className="sm:text-xs xs:text-[10px]">Terms of use</Link>
                    </div>

                    <div className="inline-flex ml-auto gap-3">
                        <Link href="/"><BsTwitter /></Link>
                        <Link href="/"><BsLinkedin /></Link>
                        <Link href="/"><BsFacebook /></Link>

                    </div>

                </div>

            </div>

        </footer>
    )
}

