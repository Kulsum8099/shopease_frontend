import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const productsList = [
  {
    category: "Kitchen",
    items: [
      "Trending Now",
      "Standard Kitchen",
      "Luxury Kitchen",
      "Economy Kitchen",
      "Couple Kitchen",
      "Parallel Kitchen",
    ],
  },
  {
    category: "Counter Top",
    items: ["Granite", "Acrylic Solid Surface", "Sintered", "HPL", "CPL"],
  },
  {
    category: "Wadrobes",
    items: [],
  },
  {
    category: "Walk-In Closets",
    items: [],
  },
  {
    category: "Vanities",
    items: [],
  },
  {
    category: "Accessories",
    items: [], 
  },
];

export const ProductDropdown = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryHover = (category: string) => {
    setActiveCategory(category);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div className="relative z-[100]">
      {productsList.map((product) => (
        <div
          key={product.category}
          className="px-4 border-gray-200"
          onMouseEnter={() => handleCategoryHover(product.category)}
          onMouseLeave={handleCategoryLeave}
        >
          <div
            className="flex items-center justify-between hover:bg-[redBrandColor1] hover:text-white hover:translate-x-1 transition-transform duration-300 p-4 w-96 h-12"
            role="button"
            aria-expanded={activeCategory === product.category}
          >
            <div className="font-semibold">{product.category}</div>
            {product.items?.length > 0 && (
              <FaChevronDown
                className={`ml-2 transition-transform duration-300 ${
                  activeCategory === product.category ? "-rotate-90" : ""
                }`}
              />
            )}
          </div>
          {activeCategory === product.category && product.items?.length > 0 && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg z-50 transition-all duration-300 ease-in-out">
              {product.items.map((item, index) => (
                <div
                  key={index}
                  className="hover:text-[redBrandColor1] h-12 p-4 rounded cursor-pointer transition-colors duration-400"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};