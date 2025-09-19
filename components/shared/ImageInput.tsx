import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface ImageInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: any;
  defaultImage?: string;
  required?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label,
  name,
  register,
  error,
  defaultImage,
  required = false,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    if (defaultImage) {
      setImagePreview(defaultImage);
    }
  }, [defaultImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col gap-2 col-span-1">
      <label className="text-gray-800 font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="w-full flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-primary focus:outline-none">
        <input
          id={name}
          type="file"
          accept="image/jpeg, image/png"
          {...register(name, { required })}
          onChange={(e) => {
            handleFileChange(e); // Custom logic for image preview
            register(name).onChange(e); // React Hook Form's onChange
          }}
          className="hidden"
        />
        <label
          htmlFor={name}
          className="cursor-pointer text-primary text-center w-full h-full py-6"
        >
          {imagePreview ? "Change Image" : "Click or Drag to Upload Image"}
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <Image
              src={imagePreview}
              alt="Image Preview"
              className="w-32 h-32 object-cover rounded-md"
              width={200}
              height={200}
            />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error.message || "Image is required"}
        </p>
      )}
    </div>
  );
};

export default ImageInput;
