import React, { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/router';
import CartContext from '@/contexts/cart';
import ToastContext from '@/contexts/toast';
import Image from 'next/image';
import Link from 'next/link';
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

export default function ConfirmOrder() {
    const router = useRouter()
    const { cart, setCart } = useContext(CartContext)
    const { setToast } = useContext(ToastContext)
    const [failed, setFailed] = useState(false)
    useEffect(() => {

        checkOrder()

    }, [cart]);
    async function checkOrder() {
        const query = new URLSearchParams(window.location.search);
        if (query.get('payment') === "true") {
            try {
                console.log(JSON.stringify(cart));
                const res = await axios.post("/api/app/user/create-order", { cart: cart, id: query.get('session_id') })

                if (res.data.success) {
                    setToast("Payment Successful. You are now enrolled into all courses paid for", "success")
                    setTimeout(() => {
                        setCart(() => [])
                        router.push("/")
                    }, 3000);


                } else {
                    setToast("Something went wrong", "error")
                }
            } catch (e) {
                console.log(e);
            }
        } else if (query.get('payment') === "false") {
            setFailed(true)
        } else {
            router.push('/')
        }
    }


    return (

        <>
            {
                failed ?
                    <div className='flex h-screen w-full justify-center items-center'>
                        <div className='h-screen flex items-center justify-center w-full'>
                            <div className='text-center'>
                                <Image src="/logo.svg" alt="" className='text-center !inline' width={100} height={100} />
                                <h1 className='text-center mt-9 xs:text-sm md:text-lg'>Sorry we coudn&apos;t receive your payment please try checking out again</h1>

                                <Link href={"/"} className='mt-8 inline-block text-white xs:text-xs md:text-sm  bg-secondary py-1.5 px-4' >Back to Home</Link>
                            </div>

                        </div>

                    </div>
                    :
                    <div className="flex justify-center items-center fixed h-full w-full bg-white  z-[200] text-center">
                        <div>
                            <div className='text-center mb-[100px]'>
                                <Image src="/logo.svg" alt="" className='text-center !inline' width={100} height={100} />
                            </div>
                            <span className="loader w-full"></span>
                            <div className='text-md font-semibold mt-3 w-full'>Please wait we are verifying your payment...</div>
                        </div>

                    </div>

            }

        </>

    );
}