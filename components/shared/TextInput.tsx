"use client";
import React from "react";
import { Controller } from "react-hook-form";
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface IDescription {
  name: string;
  labelName: string;
  control: any;
  errors: any;
  setValue: Function;
  required?: boolean;
}

const modules = {
  toolbar: [
    [{ size: [] }],
    ["bold", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
  ],
};

const formats = ["size", "bold", "underline", "list"];

const TextInput: React.FC<IDescription> = ({
  name,
  labelName,
  control,
  errors,
  setValue,
  required,
}) => {
  const handleChange = (content: string) => {
    setValue(content);
  };
  return (
    <div className="w-full">
      <div className="mb-1 w-full">
        <label className="text-sm w-full font-normal pb-2 text-brandPrimary">
          {labelName}: {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      <div className="w-full">
        <Controller
          name={name}
          control={control}
          rules={{ required: `${labelName} is required` }}
          render={({ field }) => (
            <div className="h-[240px]">
              <ReactQuill
                style={{ height: "200px" }}
                theme="snow"
                value={field.value || ""}
                onChange={(content) => {
                  field.onChange(content);
                  handleChange(content);
                }}
                modules={modules}
                formats={formats}
                placeholder={`Write here ${name}...`}
              />
            </div>
          )}
        />
        {errors[name] && (
          <span className="text-red-500 text-sm mt-1 ">
            {errors[name].message}
          </span>
        )}
      </div>
    </div>
  );
};

export default TextInput;
