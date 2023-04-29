
import Nav from "@/components/nav"
import Image from "next/image"
import hero from "@/assets/images/hero.png" 
import { useContext, useEffect, useState } from "react"
import {  BsCart3 } from "react-icons/bs"
import { FaUserTie } from "react-icons/fa"
import CartContext from "@/contexts/cart"
import { useSession } from "next-auth/react"
import axios from "axios"
import ToastContext from "@/contexts/toast"
import { useRouter } from "next/router"
import Footer from "@/components/footer"
import LoaderContext from "@/contexts/loader"

export default function Home() {
  const router=useRouter()
  const [activeCategory,setActiveCategory]=useState('all categories')
  const {addToCart}=useContext(CartContext)
  const {setToast}=useContext(ToastContext)
  const [courses,setCourses]=useState([])

  const [loadCourse,setLoadCourse]=useState(true)
  const {setShowLoader}=useContext(LoaderContext)

  const categories=['all categories','web design','ui/ux','coding',"data science",'writing','marketing']
  useEffect(()=>{
    getCourses()
   
  },[courses])

  const getCourses= async ()=>{
    try {
      const res=await axios.get("/api/app/courses/get-courses")
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
      <Nav/>
      <section className="bg-gray-50 pt-9">
        <div className="custom-container">
            <div className="flex items-center ">
              <div className="w-1/2">
                <h1 className="text-5xl font-bold">A lifetime of education begins here.</h1>
                <p className="text-gray-400 mt-2">Start or advance your career with our quality courses at the most affordable prices. We crush the barriers to your learning</p>
                <div className="mt-8">
        
                <button className="rounded-lg border border-secondary bg-secondary text-white py-2 px-5 hover:opacity-80 duration-300 font-semibold">Join for Free</button>
                
                </div>
              
              </div>
              <div className="w-1/2 flex justify-center relative">
                <Image src={hero} alt="hero" className="w-full  h-96 object-cover z-10"/>
                <div className="custom-hero-callout1 absolute rounded-full left-3 top-8"></div>
                <div className="custom-hero-callout2 absolute rounded-full right-3 bottom-0"></div>
              </div>

            </div>
        </div>
      </section>
      <section className="py-10">
        <div className="custom-container">
          <h2 className="font-semibold text-3xl text-center">Our popular courses</h2>
          <div className="flex items-center gap-5 justify-center mt-5 mb-8">
            {
              categories.map((c,i)=><button onClick={()=>setActiveCategory(c)} key={i} className={`${activeCategory===c?"activeCat":""} capitalize duration-300 hover:text-black hover:border-black text-gray-400  text-sm border-b-2 border-white pb-2`}>{c}</button>)
            }
            

          </div>
          {
              loadCourse &&
              <div className="flex justify-center items-center my-5 mb-9">

              <span className="loader-course"></span>
              </div>
            }
          <div className="grid grid-cols-4 gap-5">
           
            {
              courses.slice(0,8).map((data)=>{
                return (
                  <div onClick={()=>{
                    setShowLoader(true)
                      router.push(
                        { pathname: `/courses/${data.id}`},
                        "/courses/"+data.id
                      );
                  }} className="shadow-lg border border-solid border-gray-500 cursor-pointer" key={data.id}>
                      <Image src={data.featuredImage} alt="course-Image" className="w-full object-cover h-[150px]" width={200} height={200}/>
                      <div className="p-3">
                        <h3 className="text-black text-sm font-semibold">{data.title.length>50?data.title.slice(0,50)+'...':data.title}</h3>
                        <p className="flex items-center text-xs gap-1 mb-3 mt-1"><FaUserTie className="text-secondary "/>{data.author.fullName}</p>
                    
                        <h3 className="font-bold text-lg flex items-center pb-3 z-50">
                          <span>{new Intl.NumberFormat("en-US",{ style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0,}).format(parseFloat(data.price).toFixed(3))}</span>
                          <button className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 py-1 px-2 text-[11px] rounded-md ml-auto" onClick={()=>{
                              addToCart(data,(err)=>{
                              
                                if(err) {setToast(`Already in your cart`,'info')}else {setToast(`Added to cart.`,'success');window.scrollTo(0, 0);}
                              

                               
                              })
                          }}> <BsCart3 size={15} /></button>
                        </h3>
             
      
      
                      
                      </div>
                    
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
            <Footer/>
    </>
 
  )
}
