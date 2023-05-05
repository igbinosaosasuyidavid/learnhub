import Footer from "@/components/footer";
import Nav from "@/components/nav";

import { BiEnvelope, BiPhone, BiUser } from "react-icons/bi";
import { GiPositionMarker } from "react-icons/gi";

function Contact() {
  return (
    <>
        <Nav/>
   
        <section className="py-4 xs:px-6 lg:px-0 bg-[url('/login3.png')] bg-center bg-cover bg-no-repeat overlay rel ">

            <div className="custom-container">
                <div className="flex h-[300px] overflow-hidden items-center justify-center">
                    <div className="w-full text-center">
                        <h2 className="text-white font-bold text-3xl">Contact Us</h2>
                        <div className="border-b border-gray-300 w-1/12 m-auto h-[1px] my-3"></div>
                        <p className="text-gray-300 md:text-sm xs:text-xs">Need help? get in touch with us</p>
                    </div>
                   
                </div>
            </div>
        </section>
        <section className="py-14 xs:px-6 lg:px-0 relative">
        <div className="custom-hero-callout1 absolute rounded-full -right-6 -top-0 xs:hidden md:block"></div>
            <div className="custom-container">
                <h1 className="mb-5 font-semibold text-xl">Fill the form below</h1>
                <div className="md:flex  items-center justify-center gap-5">
                    <div className="md:w-1/2">
                      <form action="mailto:thevalley@the.com" method="post">
                        <div className="mb-4">
                            <label htmlFor="name" className="flex items-center gap-1 text-[14px] mb-1"><BiUser className="text-primary"/> Name</label>
                            <input type="text" name="Name" placeholder="John Doe"  className="border border-gray-300 w-full py-3 px-3 rounded-lg text-sm"/>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="name" className="flex items-center gap-1 text-[14px] mb-1"><BiEnvelope className="text-primary"/> Email</label>
                            <input type="text" name="Name" placeholder="name@exmaple.com"  className="border border-gray-300 w-full py-3 px-3 rounded-lg text-sm"/>
                        </div>
                        <div className="mb-4">
                          
                            <label htmlFor="name" className="flex items-center gap-1 mb-1 text-[14px]"><BiEnvelope className="text-primary "/>Description</label>
                            <textarea rows={6} type="text" name="Name" placeholder="Please explain the issue that you are facinf"  className="border border-gray-300 w-full py-3 px-3 rounded-lg text-sm"/>
                        </div>

                        
                        <button className="border-2 border-black  border-solid mt-7 rounded-lg py-2 px-9 hover:opacity-80 duration-300">Join now</button>
                            
                      </form>
                    </div>
                    <div className="md:w-1/2 xs:mt-8 md:mt-0 ">

                        <div className="">
                            <div className=" p-9 xs:pl-0 nd:pl-9  rounded-lg">
                            <BiPhone className=" text-4xl "/>
                            <span> Phone Numbeer</span>
                        
                            <h3 className="font-bold text-lg">044 813 1332</h3>
                        </div>
                        <div className=" p-9 xs:pl-0 nd:pl-9">
                            <GiPositionMarker className="text-4xl"/>
                            <span> Email</span>
                        
                            <h3 className="font-bold text-lg">hello@thevalley.com</h3>
                        </div>
                        <div className=" p-9 xs:pl-0 nd:pl-9">
                            <GiPositionMarker className="text-4xl"/>
                            <span>Address</span>
                        
                            <h3 className="font-bold text-lg">	2 Redman Place, London E20 United Kingdom</h3>
                        </div>
                        </div>
                     
                    </div>
                   
                </div>
            </div>
        </section>

       
        <Footer/>
    </>
   
  );
}

export default Contact;
