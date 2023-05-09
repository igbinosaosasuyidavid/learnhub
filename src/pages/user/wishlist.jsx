import Footer from "@/components/footer";
import Nav from "@/components/nav";
import CartContext from "@/contexts/cart";
import LoaderContext from "@/contexts/loader";
import ToastContext from "@/contexts/toast";
import axios from "axios";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";

function Wishlist() {
  const {setShowLoader}=useContext(LoaderContext)
  const {cart,addToCart}=useContext(CartContext)
  const {setToast}=useContext(ToastContext)
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setShowLoader(false)
    async function getWishes() {
      try {
        const result = await axios.get("/api/app/user/wishlist");
        const filter = result.data.data.map(wish => wish.course);
        setCourses(filter);
      } catch (error) {
        console.log(error);
      }
    }
    getWishes();
  }, []);

  return (
    <div>
      <Nav />
      <section className="py-4 xs:px-6 lg:px-0 border-t border-gray-200">
        <div className="custom-container">
          <h2 className="md:text-3xl xs:text-xl font-semibold mt-14 mb-8">Your Wishlist</h2>
        {courses.length !== 0 ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5 xs:grid-cols-2 mb-8">
          {courses
            .map((data) => {
              return (
                <div
                  className="shadow-lg border border-solid border-gray-500 "
                  key={data.id}
                >
                  <Image
                    src={data.featuredImage}
                    alt="course-Image"
                    className="w-full object-cover sm:h-[150px] xs:h-[100px] cursor-pointer"
                    width={300}
                    height={300}
                    onClick={() => {
                      setShowLoader(true);
                      router.push(
                        { pathname: `/courses/${data.id}` },
                        "/courses/" + data.id
                      );
                    }}
                  />
                  <div className="p-3">
                    <h3
                      className="text-black sm:text-sm xs:text-[10px] font-semibold cursor-pointer"
                      onClick={() => {
                        setShowLoader(true);
                        router.push(
                          { pathname: `/courses/${data.id}` },
                          "/courses/" + data.id
                        );
                      }}
                    >
                      {data.title.length > 50
                        ? data.title.slice(0, 50) + "..."
                        : data.title}
                    </h3>
                    <p className="flex items-center sm:text-xs xs:text-[9px] gap-1 mb-3 mt-1">
                      <FaUserTie className="text-secondary " />
                      {data.author.fullName}
                    </p>

                    <h3 className="font-bold sm:text-lg xs:text-[13px] flex items-center pb-3 z-50">
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "GBP",
                          currencyDisplay: "narrowSymbol",
                          minimumFractionDigits: 2,
                        }).format(parseFloat(data.price).toFixed(3))}
                      </span>
                      <button
                        className="flex items-center gap-1 border bg-secondary text-white hover:opacity-90 duration-300 sm:py-1 sm:px-2 xs:py-1 xs:px-1 text-[11px] rounded-md ml-auto"
                        onClick={() => {
                          addToCart(data, (err) => {
                            if (err) {
                              setToast(`Already in your cart`, "info");
                            } else {
                              setToast(`Added to cart.`, "success");
                              window.scrollTo(0, 0);
                            }
                          });
                        }}
                      >
                        {" "}
                        <BsCart3 className="sm:text-[17px] xs:text-[11px]" />
                      </button>
                    </h3>
                  </div>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="flex mt-5 mb-12 min-h-screen">
          <p className="text-center text-sm text-slate-400">
            No course in your course wishlist
          </p>
        </div>
      )}
        </div>
      </section>
     

      <Footer />
    </div>
  );
}

export default Wishlist;
