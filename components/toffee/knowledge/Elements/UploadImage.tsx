import { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { validImageInputTypes } from "@/lib/upload/util";
import { Trash2 } from 'lucide-react';
import { RiImageAddLine } from "../../icons/AddImageLine";
interface ImageUploadProps {
  value: string | null;
  onChange: (src: string | null) => void;
  setFile: Dispatch<SetStateAction<File | null>>;
}
const UploadImage = ({
  onChange,
  value,
  setFile,
}: ImageUploadProps) => {
  return (
    <div
      className="h-64 w-full rounded-lg"
    >
      {value ? (
        <div className="relative w-full">
        <Image
          src={value}
          alt="Background"
          className="h-64 w-full rounded-lg object-cover"
          width={0}
          height={0}
          sizes="100vw"
        />
        <div className="absolute top-5 right-5 bg-bg-3 text-icon-3 p-2 rounded-lg cursor-pointer" onClick={()=>onChange(null)}><Trash2 className="h-6 w-6"/></div>
        </div>
      ) : (
        <label
          htmlFor="file-input"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-white/10 bg-[#121212] hover:bg-[#272626]"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <RiImageAddLine className="text-icon-3 w-6 h-6 mb-4"/>
            <p className="mb-2 text-text-sub">
              Add an image for your knowledge pack
            </p>
            <p className="text-sm text-text-tertiary">
              Recommended size 260x300. 400KB max
            </p>
          </div>
          <input
            type="file"
            id="file-input"
            onChange={async (e) => {
              const file = e.target.files![0];
              const fileBlob = file as Blob;
              const tempUrl = URL.createObjectURL(fileBlob);
              setFile(e.target.files![0]);
              onChange(tempUrl);
              e.target.value = "";
            }}
            accept={validImageInputTypes.join(", ")}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default UploadImage;
