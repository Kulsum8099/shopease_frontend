// "use client";

// import { Card as UICard } from "@/components/ui/card";
// import Image from "next/image";
// import Link from "next/link";
// import { FaHeart } from "react-icons/fa";

// const Card = () => {
//   const products = [
//     {
//       id: 1,
//       title: "Soft-Close Cabinet Door",
//       image: "/images/products/soft-close-cabinet-1.png",
//       dimensions: '24" W x 30" H',
//       // link: "/product-details",
//     },
//     {
//       id: 2,
//       title: "Adjustable Lift System",
//       image: "/images/products/adjustable-lift-system-2.png",
//       dimensions: '24" W x 30" H',
//       // link: "/product-details",
//     },
//     {
//       id: 3,
//       title: "Frameless Cabinet Door",
//       image: "/images/products/frameless-cabinet-door-3.png",
//       dimensions: '24" W x 30" H',
//       // link: "/product-details",
//     },
//   ];

//   return (
//     <div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10  mb-10">
//         {products.map((product, index: number) => {
//           return (
//             <div
//               key={index + 1}
//               className="overflow-hidden group relative h-auto cursor-pointer"
//             >
//               <UICard className="bg-transparent">
//                 {/* product image */}
//                 <div className="relative overflow-hidden">
//                   <Image
//                     src={product.image}
//                     alt="image"
//                     width={372}
//                     height={400}
//                     className="w-full h-auto transition-transform duration-500 transform-gpu group-hover:scale-110"
//                   />

//                   {/* overlay */}
//                   <div className="absolute inset-0 z-10 w-full h-auto transition-opacity duration-500 bg-textOptional bg-opacity-0 group-hover:bg-opacity-30" />
//                 </div>

//                 {/* love and view icon */}
//                 <div className="absolute inset-0 flex justify-end items-start z-20 gap-2 p-4">
//                   <div className="w-[48px] h-[48px] text-[24px] bg-graySecondary/80 lg:hover:bg-backgroundColor flex justify-center items-center hover:text-brandColor text-grayLightPrimary lg:hover:text-brandColor">
//                     <FaHeart />
//                   </div>
//                   {/* <div className="w-[48px] h-[48px] text-[24px] bg-graySecondary/80 lg:hover:bg-backgroundColor flex justify-center items-center text-brandColor lg:text-grayLightPrimary lg:hover:text-brandColor">
//                     <IoEye />
//                   </div> */}
//                 </div>

//                 {/* product title  */}
//                 <div className="flex justify-start items-center">
//                   <p className="text-2xl font-bold mt-4">{product.title}</p>
//                 </div>

//                 {/*===== product dimensions ======*/}
//                 {/* <div className="flex justify-start items-center">
//                   <p className="text-sm font-normal text-textOptional">
//                     Dimensions:{" "}
//                     <span className="text-base text-textSecondary font-normal">
//                       {product.dimensions}
//                     </span>
//                   </p>
//                 </div> */}

//                 {/* view product btn */}
//                 <div className="flex justify-start items-center">
//                   <Link
//                     href={`/products/${product?.id}`}
//                     className="z-20 mt-6 py-3 px-8 text-base font-normal bg-text lg:bg-transparent border border-gradientColorOne lg:text-text lg:hover:bg-text lg:hover:text-backgroundColor text-backgroundColor"
//                   >
//                     <p>View Product</p>
//                   </Link>
//                 </div>
//               </UICard>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Card;

"use client";

import { Card as UICard } from "@/components/ui/card";
import { useFetchData } from "@/hooks/useApi";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import NormalLoader from "./loader/NormalLoader";
import { usePathname } from "next/navigation";

const OtherProducts = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const id = pathSegments[pathSegments.length - 1];

  const {
    data: allProductList = [],
    isLoading: isProductLoading,
    error,
  } = useFetchData(["allActiveproducts"], "/v1/product");

  const relatedProducts = allProductList
    .filter((data: any) => data._id !== id)
    .slice(0, 3);

  return (
    <div>
      {isProductLoading ? (
        <NormalLoader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10  mb-10">
          {relatedProducts.map((product: any, index: number) => {
            return (
              <div
                key={index + 1}
                className="overflow-hidden group relative h-auto cursor-pointer"
              >
                <UICard className="bg-transparent">
                  {/* product image */}
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt="image"
                      width={372}
                      height={400}
                      className="w-full h-auto transition-transform duration-500 transform-gpu group-hover:scale-110"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 z-10 w-full h-auto transition-opacity duration-500 bg-textOptional bg-opacity-0 group-hover:bg-opacity-30" />
                  </div>

                  {/* love and view icon */}
                  <div className="absolute inset-0 flex justify-end items-start z-20 gap-2 p-4">
                    <div className="w-[48px] h-[48px] text-[24px] bg-graySecondary/80 lg:hover:bg-backgroundColor flex justify-center items-center hover:text-brandColor text-grayLightPrimary lg:hover:text-brandColor">
                      <FaHeart />
                    </div>
                    {/* <div className="w-[48px] h-[48px] text-[24px] bg-graySecondary/80 lg:hover:bg-backgroundColor flex justify-center items-center text-brandColor lg:text-grayLightPrimary lg:hover:text-brandColor">
                    <IoEye />
                  </div> */}
                  </div>

                  {/* product name  */}
                  <div className="flex justify-start items-center">
                    <p className="text-2xl font-bold mt-4">{product.name}</p>
                  </div>

                  {/*===== product dimensions ======*/}
                  {/* <div className="flex justify-start items-center">
                  <p className="text-sm font-normal text-textOptional">
                    Dimensions:{" "}
                    <span className="text-base text-textSecondary font-normal">
                      {product.dimensions}
                    </span>
                  </p>
                </div> */}

                  {/* view product btn */}
                  <div className="flex justify-start items-center">
                    <Link
                      href={`/products/${product?._id}`}
                      className="z-20 mt-6 py-3 px-8 text-base font-normal bg-text lg:bg-transparent border border-gradientColorOne lg:text-text lg:hover:bg-text lg:hover:text-backgroundColor text-backgroundColor"
                    >
                      <p>View Product</p>
                    </Link>
                  </div>
                </UICard>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OtherProducts;
