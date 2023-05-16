import Footer from "@/components/footer";
import Nav from "@/components/nav";
import CartContext from "@/contexts/cart";
import LoaderContext from "@/contexts/loader";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { BsDot } from "react-icons/bs";
import { loadStripe } from '@stripe/stripe-js';
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import ToastContext from "@/contexts/toast";
const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    );
export default function Profile() {
    const { cart, removeCart } = useContext(CartContext)
    const {setShowLoader } = useContext(LoaderContext)
    const {setToast } = useContext(ToastContext)
    const [cartTotal, setCartTotal] = useState(0)
    const {data:session}=useSession()
    useEffect(() => {

        var result = cart.reduce(function (acc, data) { return acc + data.price; }, 0);

        setCartTotal(result)
    }, [cart])

    const checkOut = async (e) => {
      
        e.preventDefault()
        if (!session?.user) {
            router.push("/auth/login")
            return null
        }
        if (session?.user?.admin) {
            setToast("Teachers cannot buy courses","info");
            return  null
        }
        try {
      
            setShowLoader(true)
            const stripe = await stripePromise;
            const checkoutSession = await axios.post('/api/app/stripe/payment-session', { cart, user: session?.user })
            const result = await stripe.redirectToCheckout({ sessionId: checkoutSession.data.id });

            if (result.error) {
                setShowLoader(false)
                setToast(result.error.message, 'error');
            } else {

            }
        } catch (e) {
            setShowLoader(false)
            console.log(e);
        }

    }

    return (
        <>
            <Nav />
            <section className="py-4 xs:px-6 lg:px-0 border-t border-gray-200">
                <div className="custom-container">
                    <h1 className="md:text-3xl xs:text-xl font-semibold mb-16 mt-5">Shopping cart</h1>
                    <h1 className="md:text-lg xs:text-sm font-semibold mb-1">{cart.length} items in cart</h1>


                    <div className="">
                        {cart.length !== 0 ?
                            <>
                                <div className="md:flex gap-6 mb-10" >
                                    <div className="md:w-4/6 ">
                                        {
                                            cart.map((data) => {

                                                return (
                                                    <div className='border-b border-gray-300 p-2 py-6 cursor-pointer ' key={data.id} >
                                                        <div className='flex items-center gap-3'>
                                                            <Image src={data.featuredImage} alt="" className='w-2/6 h-28 object-cover rounded-md' width={200} height={200} />
                                                            <div className="w-4/6">
                                                                <p className='md:text-lg xs:text-[15px]  text-left '>{data.title}</p>
                                                                <p className="flex items-center sm:text-sm xs:text-[12px] gap-1 mb-3 mt-1 text-gray-500">By {data.author.fullName} <BsDot color="black" size={20}/>{data.lessons?.length} lessons</p>
                                                                <h3 className='text-black text-left md:text-[18px] xs:text-[17px] font-semibold mt-1.5 flex items-center'><span>{new Intl.NumberFormat("en-US", { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, }).format(parseFloat(data.price).toFixed(3))}</span><span className='text-xs text-red-400 cursor-pointer ml-auto' onClick={() => removeCart(data.id)}><FaTimes /></span></h3>
                                                            </div>

                                                        </div>
                                                    </div>
                                                )

                                            })
                                        }
                                    </div>
                                    <div className="md:w-2/6 sticky top-1 self-start shadow-lg p-4">
                                        <div className='flex items-center pt-3'>
                                            <p className='mr-1 md:text-[20px] xs:text-[16px]'>Total : </p>
                                            <p className='text-xl text-black font-bold md:text-2xl xs:text-[16px]'> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, }).format(parseFloat(cartTotal).toFixed(3))}</p>
                                        </div>
                                        
                                        <span className="font-normal !text-sm ml-auto mb-6 inline-block">14 days refund policy</span>
                                        <button onClick={checkOut} className='w-full checkout bg-primary hover:opacity-90 duration-300 text-white md:p-4  xs:p-2 md:px-4 xs:px-2 md:text-lg xs:text-[15px] rounded-md'>Checkout</button>
                                    </div>
                                </div>
                             

                            </>
                            :
                            <p className='md:text-sm xs:text-center md:text-left xs:text-xs text-gray-600 mb-9 mi'>No items in your cart</p>


                        }
                    </div>
                </div>

            </section>
            <Footer />
        </>

    )
}