import Image from "next/image";
import React, { useEffect, useState } from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface ImageInputProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  error?: any;
  defaultImages?: string[];
  required?: boolean;
}

const ImageInput: React.FC<ImageInputProps> = ({
  label,
  name,
  register,
  error,
  defaultImages = [],
  required = false,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (defaultImages.length > 0) {
      setImagePreviews(defaultImages);
    }
  }, [defaultImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previewUrls);
  };

  return (
    <div className="flex flex-col gap-2 col-span-1">
      <label className="text-gray-800 font-medium">{label}</label>
      <div className="w-full flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-primary focus:outline-none">
        <input
          id={name}
          type="file"
          accept="image/jpeg, image/png"
          multiple // Allow multiple file selection
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
          {imagePreviews.length > 0
            ? "Change Images"
            : "Click or Drag to Upload Images"}
        </label>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <Image
                  src={preview}
                  alt={`Image Preview ${index + 1}`}
                  className="w-32 h-32 object-cover rounded-md"
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">
          {error.message || "Images are required"}
        </p>
      )}
    </div>
  );
};

export default ImageInput;
