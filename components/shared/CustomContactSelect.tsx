import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type props = {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  name: string;
  watch: UseFormWatch<any>;
};

function CustomContactSelect({ register, name, setValue, watch }: props) {
  const { ...registerProps } = register(name);
  const defaultValue = watch(name);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showInput, setShowInput] = useState<boolean>(false);

  const handlegetSelectedValue = (value: string) => {
    console.log("i am value from contact select", value);
    if (value === "Other") {
      setShowInput(true);
      setValue(name, "");
    } else {
      setValue(name, value);
    }
  };

  const options = [
    {
      value: "I'd like to inquire about product availability and pricing.",
      label: "I'd like to inquire about product availability and pricing.",
    },
    {
      value: "Can you provide more details about your customization options?",
      label: "Can you provide more details about your customization options?",
    },
    {
      value: "I need assistance with an order I placed recently.",
      label: "I need assistance with an order I placed recently.",
    },
    {
      value: "Other",
      label: "Other",
    },
  ];

  return (
    <div className="w-full border-b-2 border-b-brandColorSecondary">
      {showInput ? (
        <input
          defaultValue=""
          {...register("message", { required: "Message is required" })}
          className={`w-full py-4 bg-transparent text-lg font-medium text-brandColorSecondary px-1 outline-none placeholder-textSecondary `}
          // placeholder="Message"
        />
      ) : (
        <Select
          onValueChange={handlegetSelectedValue}
          onOpenChange={(open) => {
            setIsOpen(open);
          }}
          {...registerProps}
        >
          <SelectTrigger
            className={`lg:px-1.5 px-1.5 border-none text-lg font-medium  `}
          >
            {/* <SelectValue placeholder="Message" /> */}
            <p
              className={`${
                defaultValue !== "Message"
                  ? "text-brandColorSecondary"
                  : "text-textSecondary"
              }`}
            >
              {defaultValue}
            </p>
            {/* icon */}
            <ChevronDown
              className={`h-7 w-7 opacity-50 ${
                isOpen && "rotate-180"
              } transition-transform duration-300 ease-in-out`}
            />
          </SelectTrigger>
          <SelectContent className=" bg-backgroundColor">
            <div className="border bg-white border-brandColorSecondary">
              {options.map((option, index) => (
                <SelectItem
                  className={`text-lg font-medium text-brandColorSecondary px-3 py-2 border-b border-[#E6E6E6] hover:bg-gray-200 text-wrap ${
                    index === options.length - 1 && "border-b-0"
                  }`}
                  key={index + 1}
                  value={option?.value}
                >
                  {option?.label}
                </SelectItem>
              ))}
            </div>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

export default CustomContactSelect;
