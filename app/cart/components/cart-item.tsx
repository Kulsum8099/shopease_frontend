"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

interface CartItemProps {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  color?: string
  maxStock?: number
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

export function CartItem({ 
  id, 
  name, 
  price, 
  image, 
  quantity, 
  color, 
  maxStock = 10,
  onUpdateQuantity, 
  onRemove 
}: CartItemProps) {

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > maxStock) {
      toast.error(`Cannot add more. Only ${maxStock} items available in stock.`);
      return;
    }
    if (newQuantity < 1) {
      onRemove(id);
      return;
    }
    onUpdateQuantity(id, newQuantity);
  };

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 truncate">{name}</h3>
          {color && <p className="text-sm text-gray-500">Color: {color}</p>}
          <p className="font-semibold text-gray-900">৳{price.toFixed(2)}</p>
          {maxStock && maxStock <= 5 && (
            <p className="text-xs text-orange-600 font-medium">Only {maxStock} left in stock!</p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end space-y-3">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            className="h-8 w-8"
          >
            <Minus size={14} />
          </Button>

          <span className="w-8 text-center font-medium">{quantity}</span>

          <Button
            variant="outline"
            size="icon"
            disabled={quantity >= maxStock}
            onClick={() => handleQuantityChange(quantity + 1)}
            className="h-8 w-8"
          >
            <Plus size={14} />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(id)}
          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
