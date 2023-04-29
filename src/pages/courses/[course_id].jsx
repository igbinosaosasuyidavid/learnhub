

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "@/components/nav";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import prisma from '../../../prisma/db'
import { FaTimes, FaUserFriends } from "react-icons/fa";
import { MdOndemandVideo } from "react-icons/md";
import CartContext from "@/contexts/cart";
import { useSession } from "next-auth/react";
import { BsStar } from "react-icons/bs";
import { loadStripe } from '@stripe/stripe-js';
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import Image from "next/image";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );



export const getServerSideProps=async ({ req, res ,params})=>{
    const session= await getServerSession(req, res, authOptions)
    console.log(session,'----');
    const resp=await axios.get(`http://localhost:3000/api/app/courses/get-course?id=${params.course_id}`)
    const resp2=await axios.get(`http://localhost:3000/api/app/user/user-student?user_id=${session?.id}&course_id=${params.course_id}`)
    

    
   
  
    return {
        props: {course:resp.data,userIsStudent:resp2.data.userIsStudent},
    }
}

function Course({course,userIsStudent}) {
    const {data: session}=useSession()
    const router=useRouter()
    const [currentLesson,showLesson]=useState(false)
    const [video,setVideo]=useState(false)
    const {setShowLoader}=useContext(LoaderContext)
    const {addToCart}=useContext(CartContext)
    const {setToast}=useContext(ToastContext)



   const checkOut= async (e)=>{
    e.preventDefault()
    try {
      setShowLoader(true)
      const stripe = await stripePromise;
      const checkoutSession =  await axios.post('/api/app/stripe/payment-session',{cart:[course],user:session?.user})
      const result = await stripe.redirectToCheckout({sessionId: checkoutSession.data.id});

      if (result.error) {
        setShowLoader(false)
        setToast(result.error.message,'error');
      }else{
        
      }
    } catch (e) {
      setShowLoader(false)
      console.log(e);
    }
  
  }
    useEffect(()=>{
        setShowLoader(false)
    })
  return (
    <>
        <Nav/>
      
        <div className="bg-[rgb(128,128,128,0.04)] py-6">
            <div className="custom-container">
                <div className="flex items-center gap-6">
                    <Image src={course.featuredImage} alt="course-Image"  className="h-72 w-1/2 object-cover rounded-xl" width={200} height={200}/>
                    <div className="w-1/2">
                    <h2 className="text-black font-semibold text-2xl mb-2">{course.title}</h2>
                    <h2>{course.description?.length>200 ? course.description?.slice(0,200)+'...':course.description}</h2>
                    <div className="flex items-center mt-3 mb-6"><FaUserFriends size={20}  className="mr-2 text-secondary"/> <span className="text-lg text-black font-semibold mr-1">{course.studentIds?.length}</span> <span className="text-md">{course.studentIds?.length===1? 'Student':"Students"}</span></div>

                    <h3 className="text-md text-black mb-2">Course Instructor</h3>
                    <div className="flex gap-2 items-center">
                        {
                        session?.user?.profile?.img ? <Image src={session?.user?.profile?.Image} alt="profile-pic" width={200} height={200}/> : <div className="flex justify-center items-center w-10 h-10 rounded-full  bg-gray-500 text-white font-semibold cursor-pointer uppercase text-xl">{course.author?.fullName.match(/\b(\w)/g).join('')}</div>
                        }
                        <h3 className=""><span className="text-black font-medium text-sm">{course.author?.fullName}</span><span className="text-xs m-0 p-0 !text-primary flex items-center gap-1"><BsStar/> Experienced</span></h3>
                    
                    </div>
                </div>
                </div>

            </div>
        </div>
        <div>
            <div className="custom-container">
                <div className="flex mt-8 gap-8 mb-10">
                    <div className="w-4/6">
                        <h1 className="text-2xl text-black font-semibold mb-2">Course Content</h1>

                        {
                            course.lessons.length!==0? <>
                                {
                                    course.lessons.map(data=>    
                                    <div key={data.id} className="flex items-center p-4 px-5 rounded-md bg-[rgb(128,128,128,0.05)] hover:bg-[rgb(128,128,128,0.1)] duration-300 border border-solid border-gray-400 cursor-pointer mb-1" onClick={(e)=>{if (!userIsStudent) {
                                        if (session.user) {
                                            setToast("Please purchase this course to be enrolled",'info')
                                        }else{
                                            router.push("/suth/register")
                                        }
                                        
                                    }else{
                                        showLesson(data)
                                    }}}>
                                        <h1>{data.title}</h1>
                                        <span className="ml-auto inline-flex items-center gap-2"><MdOndemandVideo size={20}/>{data.duration}</span>
                        

                                    </div>
                                )
                                }
                            </>:<p>No Lessons yet for this course</p>
                        }
                    
                       
                    </div>
                    <div className="w-2/6">
                        {
                            userIsStudent? <div className="mt-4">
                                    <p className="text-2xl">Howdy, {session.user?.name}</p>

                                    <div className=" mt-5">
                                        <div className="w-full p-1 bg-slate-100 rounded-3xl">
                                            <div style={{width:12+"%"}} className="p-1.5 rounded-3xl bg-secondary">

                                            </div>
                                        </div>
                                        <p className="text-sm flex items-center gap-2 mt-3">Your course is <span className="font-bold text-lg text-secondary">3%</span> Completed</p>

                                        <button className="bg-primary text-[#ffffff] rounded-lg py-2 px-4 shadow-md mt-4 hover:opacity-90 duration-300">
                                            Contine Learning
                                        </button>
                                    </div>
                                </div> : <>
                                <div className="flex items-center mb-4">
                                    <h4 className="font-semibold text-3xl">{new Intl.NumberFormat("en-US",{ style: 'currency', currency: 'USD', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 0,}).format(parseFloat(course.price).toFixed(3))}</h4>
                                    <span className="font-normal !text-sm ml-auto">14 days refund policy</span>
                                </div>
                            
                                <button className="bg-secondary text-white p-3 w-full rounded-lg font-semibold mb-3 hover:opacity-90 duration-300"onClick={()=>{
                                    addToCart(course,(err)=>{
                                    
                                        if(err) {setToast(`Already in your cart`,'info')}else {setToast(`Added to cart.`,'success');window.scrollTo(0, 0);}
                                    

                                    
                                    })}}>Add to Cart</button>
                                <button className="bg-transparent text-black p-3 w-full border border-gray-500 rounded-lg hover:bg-gray-100 duration-300 focus:border-gray-500 font-semibold"  onClick={checkOut} >Purchase Now</button>
                            </>
                        }
                        
                    </div>
                </div>
               
            </div>
        </div>
        <>
        {
            currentLesson &&
            <div className="fixed top-0 bg-[rgb(0,0,0,0.5)] flex items-center justify-center h-screen w-full ">
                <div className="bg-white relative w-[550px] h-[570px] p-7 rounded-lg overflow-y-scroll">
                <span className="absolute top-4 right-5 text-lg hover:text-gray-500 cursor-pointer duration-300 inline-flex gap-2 items-center text-secondary font-semibold" onClick={(e)=>{e.preventDefault();showLesson(false);setVideo(false)}}><FaTimes/></span>
                    <h2 className="text-xl font-semibold mb-3 mt-4">{currentLesson.title}</h2>
                    {
                        !video && <div className="flex justify-center absolute top-1/3 left-1/2"><span className="loader-vid bg-gra"></span></div>
                    }
                    <div className="h-[270px]">
                        <iframe onLoad={()=>{setVideo(true)}} src={`${currentLesson.video_url}?autoplay=true`} loading="lazy"  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowFullScreen="true" className={`${video?"block":"invisible"} lesson-vid w-full h-full rounded-lg`}>
                        </iframe>
                    </div>
                    <h3 className="font-medium text-lg mt-5 mb-2">Other Lessons</h3>
                    {
                        course.lessons.map(data=>
            
                    <div key={data.id}>
                     
                        <div className={`flex items-center p-4 px-5 rounded-md ,128,128,0.05)] hover:bg-[rgb(128,128,128,0.1)] duration-300  cursor-pointer ${data.title===currentLesson.title?"bg-gray-200":""}`} onClick={()=>{showLesson(data)}} key={data.id}>
                            <h1>{data.title}</h1>
                            <span className="ml-auto inline-flex items-center gap-2"><MdOndemandVideo size={20}/>{data.duration}</span>
            

                        </div>
                    </div>
                    )
                }
                </div>
            </div>
        }
        
        </>
   
       
    </>
   
  );
}

export default Course;
