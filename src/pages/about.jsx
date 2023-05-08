import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Image from "next/image";

function About() {
    return (
        <>
            <Nav />

            <section className="py-4 xs:px-6 lg:px-0 bg-[url('/group.jpeg')] bg-center bg-cover bg-no-repeat overlay">
                <div className="custom-container">
                    <div className="flex h-[300px] overflow-hidden items-center justify-center">
                        <div className="w-full text-center">
                            <h2 className="text-white font-bold text-3xl">About Us</h2>
                            <div className="border-b border-gray-300 w-1/12 m-auto h-[1px] my-3"></div>
                            <p className="text-gray-300 md:text-sm xs:text-xs">Learnhub was created for a purpose: find out about us!</p>
                        </div>

                    </div>
                </div>
            </section>
            <section className="py-14 xs:px-6 lg:px-0 ">
                <div className="custom-container">
                    <div className="md:flex  items-center justify-center gap-5">
                        <div className="md:w-1/2">
                            <p className="text-gray-500 mb-2 md:text-sm xs:text-sm">Learnhub was founded by Amanda Ahiwe in 2023 with a vision of providing life-transforming learning experiences to learners around the world. Today,



                            </p>
                            <p className="text-gray-500 mb-2 md:text-sm xs:text-sm">
                                It is a global platform for online learning and career development that offers anyone, anywhere, access to online courses and degrees from leading universities and companies. Learnhub has legal duty not only to our shareholders, but to also make a positive impact on society more broadly, as we continue our efforts to reduce barriers to world-class education for all.
                            </p>

                            <p className="text-gray-500 mb-2 md:text-sm xs:text-sm">Over 10 million learners  have come to The valley to access world-class learning—anytime, anywhere.</p>
                        </div>
                        <div className="md:w-1/2 xs:mt-8 md:mt-0">
                            <Image src={"/two.jpg"} alt="perosn" className="w-full h-72 object-cover rounded-lg" width={300} height={300} />
                        </div>

                    </div>
                </div>
            </section>

            <section className="xs:px-6 lg:px-0 py-9 mb-9">
                <div className="custom-container text-center">
                    <h2 className="text-center font-semibold text-3xl border-b-2 w-72 border-primary m-auto">Who we work with</h2>

                    <div className="grid grid-cols-2 gap-12">
                        <Image src={'/ud.png'} alt="course-Image" className="w-full xs:object-contain md:object-cover sm:h-[150px] xs:h-full xs:w-full cursor-pointer" width={300} height={300} />
                        <Image src={'/cou.png'} alt="course-Image" className="w-full xs:object-contain md:object-cover sm:h-[150px] xs:h-[100px] xs:w-full cursor-pointer" width={300} height={300} />
                        <Image src={'/ps.png'} alt="course-Image" className="w-full xs:object-contain md:object-cover sm:h-[170px] xs:h-full xs:w-full cursor-pointer" width={300} height={300} />
                        <Image src={'/click.png'} alt="course-Image" className="w-full xs:object-contain md:object-cover sm:h-[150px] xs:h-full xs:w-full cursor-pointer" width={300} height={300} />
                    </div>
                </div>
            </section>
            <section className="bg-slate-950  xs:px-6 lg:px-0 py-9">
                <div className="custom-container text-center">
                    <h2 className="text-center font-semibold text-2xl text-white">Join our global community and start learning today!</h2>

                    <button className="focus:border-2 border-2 focus:border-white border-white border-solid focus:border-solid mt-7 text-white rounded-lg py-3 px-9 hover:opacity-90 duration-300">Join now</button>
                </div>
            </section>

            <Footer />
        </>

    );
}

export default About;
