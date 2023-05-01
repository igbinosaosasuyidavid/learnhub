import Footer from "@/components/footer";
import Nav from "@/components/nav";
import Image from "next/image";

function About() {
  return (
    <>
        <Nav/>
   
        <section className="py-4 xs:px-6 lg:px-0 bg-[url('/group.jpeg')] bg-center bg-cover bg-no-repeat overlay">
            <div className="custom-container">
                <div className="flex h-[300px] items-center justify-center">
                    <div className="w-full text-center">
                        <h2 className="text-white font-bold text-3xl">About Us</h2>
                        <div className="border-b border-gray-300 w-1/12 m-auto h--[1px] my-3"></div>
                        <p className="text-gray-300 md:text-sm xs:text-xs">The valley was created for a purpose find out about us</p>
                    </div>
                   
                </div>
            </div>
        </section>
        <section className="py-14 xs:px-6 lg:px-0 ">
            <div className="custom-container">
                <div className="flex h-[300px] items-center justify-center gap-5">
                    <div className="w-1/2">
                        <p className="text-gray-500 mb-2 md:text-sm xs:text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                        <p className="text-gray-500 mb-2 md:text-sm xs:text-sm">It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                    </div>
                    <div className="w-1/2">
                        <Image src={"/two.jpg"} alt="perosn" className="w-full h-72 object-cover rounded-lg" width={300} height={300}/>
                    </div>
                   
                </div>
            </div>
        </section>
       
        <Footer/>
    </>
   
  );
}

export default About;
