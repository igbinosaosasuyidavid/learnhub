import { Poppins } from 'next/font/google'
import "@/styles/index.css"
import "@/styles/globals.css"
import "@/styles/custom.css"
import "@/styles/loader.css"
import { SessionProvider } from "next-auth/react"

import { ChakraProvider } from '@chakra-ui/react'
import { CartProvider } from '@/contexts/cart'
import { LoaderProvider } from '@/contexts/loader'
import Loader from '@/components/loader'
import Toast from '@/components/toast'
import { ToastProvider } from '@/contexts/toast'

// If loading a variable font, you don't need to specify the font weight
const poppins = Poppins({ weight: ['100', '200', '300', '400', '500', '600', '700'], subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (

    <SessionProvider session={session}>
      <LoaderProvider>
        <ToastProvider>
          <CartProvider>
            <ChakraProvider>
              <main className={poppins.className}>
                <Loader />
                <Toast />
                <Component {...pageProps} />
              </main>
            </ChakraProvider>
          </CartProvider>
        </ToastProvider>
      </LoaderProvider>
    </SessionProvider>

  )
}
