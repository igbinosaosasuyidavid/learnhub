import CartContext from '@/contexts/cart';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,

} from '@chakra-ui/react'
import React, { useEffect, useContext, useState, use } from 'react';
import { BsCart3 } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';

import axios from 'axios';
import LoaderContext from '@/contexts/loader';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';
import ToastContext from '@/contexts/toast';
import Image from 'next/image';
import { useRouter } from 'next/router';
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
export default function MenuCart() {

  const { cart, removeCart } = useContext(CartContext)
  const { setShowLoader } = useContext(LoaderContext)
  const { setToast } = useContext(ToastContext)
  const [cartTotal, setCartTotal] = useState(0)
  const { data: session } = useSession()
  const router = useRouter()
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
      setToast("Teachers cannot buy courses", "info");
      return null
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
    <div className='border-0 bg-transparent z-50 '>
      <Popover >
        <PopoverTrigger>
          <a className="text-secondary hover:text-opacity-80 relative cursor-pointer block"><BsCart3 className='xs:text-[20px] md:text-xl' />{cart.length !== 0 && <span className="absolute bottom-3.5 bg-secondary text-white rounded-full flex items-center justify-center md:w-4 md:h-4 text-xs xs:w-3 xs:h-3 left-3.5 font-bold lg:text-[11px] xs:text-[8px]">{cart.length}</span>}</a>
        </PopoverTrigger>
        <div className=''>
          <PopoverContent>
            <div className='md:p-8 xs:p-4 h-full mt-5 text-center z-50 bg-white shadow-[0_0_20px_-10px_rgba(0,0,0,0.3)] rounded-lg xs:w-72 md:w-[350px]'>

              {cart.length !== 0 ?
                <>
                  {
                    cart.map((data) => {

                      return (
                        <div className='border-b border-gray-300 p-2 py-4 cursor-pointer ' key={data.id} >
                          <div className='flex items-center gap-3'>
                            <Image src={data.featuredImage} alt="" className='w-16 h-16 object-cover rounded-md' width={200} height={200} />
                            <div>
                              <p className='md:text-sm xs:text-[10px]  text-left'>{data.title.length > 40 ? data.title.slice(0, 40) + '...' : data.title}</p>
                              <h3 className='text-black text-left md:text-[14px] xs:text-[12px] font-semibold mt-1.5 flex items-center'><span>{new Intl.NumberFormat("en-US", { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, }).format(parseFloat(data.price).toFixed(3))}</span><span className='text-xs text-red-400 cursor-pointer ml-auto' onClick={() => removeCart(data.id)}><FaTimes /></span></h3>
                            </div>

                          </div>
                        </div>
                      )

                    })
                  }
                  <div className='flex items-center py-3'>
                    <p className='mr-1 md:text-[16px] xs:text-[13px]'>Total : </p>
                    <p className='text-xl text-black font-bold md:text-xl xs:text-[15px]'> {new Intl.NumberFormat("en-US", { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', minimumFractionDigits: 2, }).format(parseFloat(cartTotal).toFixed(3))}</p>
                  </div>
                  <div className='flex justify-center items-center gap-3 mt-3'>
                    <button onClick={checkOut} className='checkout bg-primary hover:opacity-90 duration-300 text-white md:p-2  xs:p-1 md:px-4 xs:px-2 md:text-xs xs:text-[9px] rounded-md'> Checkout</button>
                    <button onClick={(e) => {
                      e.preventDefault();
                      router.push('/user/cart')
                    }} className='checkout bg-black hover:opacity-90 duration-300 text-white rounded-md  md:p-2  xs:p-1 md:px-4 xs:px-2 md:text-xs xs:text-[9px]'>View cart</button>
                  </div>
                </>
                :
                <p className='md:text-sm xs:text-xs text-gray-600'>No items in your cart</p>


              }

            </div>
          </PopoverContent>
        </div>

      </Popover>
    </div>
  );
}