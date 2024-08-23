import { Dispatch, SetStateAction, useState } from "react";
import UploadCharacterImage from "./CharacterImage";
import { WandDropDown } from "../WandDropDown";
import Modal from "@/components/toffee/Modal";
import Image from "next/image";
import axios from "axios";

type ImageType = "upload" | "generate" | null;
type StyleType = {
  name: string;
  url: string;
}
interface ApiResponse {
  images: string[];
}

export const AddCharacterImage = ({
  advanceFunction,
  setImageData,
  setImageFile,
  imageData,
  imageType,
  setImageType,
  imagePrompt,
  setImagePrompt,
  previousFunction,
}: {
  advanceFunction: () => void;
  imageData: string | null;
  imageType: ImageType;
  setImageType: (imageType: ImageType) => void;
  setImageData: (image: string | null) => void;
  setImageFile: Dispatch<SetStateAction<File | null>>;
  imagePrompt: string;
  setImagePrompt: (newImagePrompt: string) => void;
  previousFunction: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [leaveModal, setLeaveModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const styles: StyleType[] = [
    { name: "Realistic", url: "/styles/realistic.png" },
    { name: "Cartoon", url: "/styles/cartoon.png" },
    { name: "Anime", url: "/styles/anime.png" },
    { name: "Pixel Art", url: "/styles/pixel-art.png" },
    { name: "Watercolor", url: "/styles/watercolor.png" },
    { name: "Oil Painting", url: "/styles/oil-painting.png" },
    { name: "Sketch", url: "/styles/sketch.png" },
    { name: "Pencil", url: "/styles/pencil.png" },
    { name: "Cinematic", url: "/styles/cinematic.png" },
    { name: "Disney", url: "/styles/disney.png" },
    { name: "Fantasy", url: "/styles/fantasy.png" },
    { name: "Waifu", url: "/styles/waifu.png" },
  ];
  const [selectedStyle, setStyle] = useState<StyleType | null>(null);
  const [preselectedStyle, setPreStyle] = useState<StyleType | null>(null);

  const handleStyleChange = (style: StyleType) => {
    if (selectedStyle) {
      setConfirmModal(true)
      setPreStyle(style)
    } else {
      setStyle(style)
    }
  }

  const handleConfirmStyleChange = () => {
    setStyle(preselectedStyle);
    setImagePrompt("");
    setConfirmModal(false);
  }

  const buildFormattedPrompt = (prompt: string, style: StyleType | null) => {
    if (style) {
      return `${prompt} in ${style.name} style`;
    }
    return prompt;
  }

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [base64Images, setBase64Images] = useState<string[]>([]);

  const onGenerateImage = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await axios.post<ApiResponse>("/api/character/generate/ai", { prompt: imagePrompt, type: "image" });
      setIsLoading(false);

      const base64Images = res.data.images;
      const blobUrls = base64Images.map((base64Image: string): string => {
        const base64Data = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;
        const uintArray = new Uint8Array(Buffer.from(base64Data, 'base64'));
        const blob = new Blob([uintArray], { type: 'image/png' });
        return URL.createObjectURL(blob);
      });

      setBase64Images(base64Images);
      setGeneratedImages(blobUrls);

      // Initialize the image data and file with the first image  
      const initialImage = base64Images[0];
      setImageData(blobUrls[0]);

      const initialBase64Data = initialImage.split('base64,')[1];
      const initialUintArray = new Uint8Array(Buffer.from(initialBase64Data, 'base64'));
      const initialBlob = new Blob([initialUintArray], { type: 'image/png' });
      setImageFile(new File([initialBlob], "ai-image.png", { type: 'image/png' }));
    } catch (error) {
      setIsLoading(false);
      console.error("Error generating images:", error);
    }
  };

  const onSelectImage = (index: number) => {
    if (!generatedImages || !base64Images) {
      console.error("Generated images or base64 images are not available.");
      return;
    }

    const selectedBlobUrl = generatedImages[index];
    setImageData(selectedBlobUrl);

    const selectedBase64Data = base64Images[index].split('base64,')[1];
    const selectedUintArray = new Uint8Array(Buffer.from(selectedBase64Data, 'base64'));
    const selectedBlob = new Blob([selectedUintArray], { type: 'image/png' });

    setImageFile(new File([selectedBlob], "ai-image.png", { type: 'image/png' }));
  };

  return (
    <>
      {!isLoading ?
        (imageData && imageType === 'generate' ?
          <div className="flex flex-col sm:items-center h-[90vh] w-full justify-start sm:justify-center">
            <h2 className="sm:text-[32px] text-[20px] font-inter font-bold text-white text-center">Select an image</h2>
            <p className="mt-4 text-[13px] sm:text-sm text-text-tertiary font-inter text-center">Create profile picture with our Ai, Just describe your ideas and bring it in life</p>
            <div className="flex flex-col items-center">
              <Image
                src={imageData}
                alt="Generated Image"
                className="h-[236px] w-[204px] rounded-lg object-cover mt-8"
                width={0}
                height={0}
                sizes="100vw"
              />
              <div className="flex flex-row mt-4">
                {generatedImages && generatedImages.map((image: string, index: number) => (
                  <div key={image} onClick={() => onSelectImage(index)} className="cursor-pointer">
                    <Image src={image} alt="Generated" className="h-[179px] w-[128px] rounded-lg object-cover m-2" width={128} height={179} />
                  </div>
                ))}
              </div>
            </div>
            <button className="w-[220px] mt-8 bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer" onClick={advanceFunction} disabled={isLoading}>
              {"Continue"}
            </button>
          </div>
          : <div className="flex flex-col items-center absolute top-[15.6%] p-5">
            <div className="flex flex-col items-center text-center gap-4">
              <h1 className="sm:text-[32px] text-[20px] font-inter font-bold text-white text-center">
                {imageType === "upload" ? "Add your Character Image" : "Generate picture"}
              </h1>
              <p className="mt-4 text-[13px] sm:text-sm text-text-tertiary font-inter text-center">
                {imageType === "upload" ? "Supported formats PNG and JPG, recommended size 260x300. 400KB max" : "Create profile picture with our Ai, Just describe your ideas and bring it in life"}
              </p>
            </div>
            {imageType === "upload" ?
              <div className="mt-[38px] w-full flex items-center justify-center">
                <UploadCharacterImage
                  onChange={setImageData}
                  value={imageData}
                  setFile={setImageFile}
                />
              </div> :
              <>
                <div className="flex flex-col gap-0 border border-[#202020] rounded-[7px] w-full justify-between mt-8 max-w-[560px]">
                  <div className="relative">
                    <textarea
                      name="prompt"
                      placeholder="Enter your prompt here"
                      className="w-[calc(100%-30px)] text-[13px] text-text-sub px-4 pt-3 pb-2 bg-transparent border-none outline-none resize-none h-fit no-scrollbar placeholder-[#767676]"
                      id=""
                      rows={4}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    <WandDropDown input={buildFormattedPrompt(imagePrompt, selectedStyle)} setInput={setImagePrompt} isImage={true} isTextarea={true} />
                  </div>
                  <span className="text-xs text-text-tertiary bg-bg-3 rounded-b-[7px] px-4 py-1">Generate your image with AI</span>
                </div>
                <div className="flex flex-col items-center w-full mt-12">
                  <span className="text-white font-semibold font-inter text-xl">Choose a style</span>
                  <p className="font-inter text-text-tertiary text-[13px] mt-2 text-center">Create profile picture with our Ai, Just describe your ideas and bring it in life</p>
                  <div className="flex flex-row sm:gap-4 gap-1 flex-wrap max-w-6xl mx-auto w-full mt-4">
                    {styles.map((style, index) => (
                      <div key={index} className={`sm:w-[176px] w-[163px] h-[198px] relative border-2 rounded-2xl overflow-hidden cursor-pointer ${style.name === selectedStyle?.name ? "border-[#BC7F44]" : "border-white/10"}`} onClick={() => handleStyleChange(style)}>
                        <Image src={style.url} alt={style.name} width={176} height={198} className="w-full h-full object-cover " />
                        <div className="absolute inset-0 flex items-end justify-center p-2 bg-gradient-to-t from-[#121212] via-[#12121299] to-[#12121200]">
                          <span className="text-white font-semibold">{style.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            }
            <div className="flex flex-col gap-[32px] mt-8 w-full items-center">
              <button
                className="text-sm text-[#BC7F44] font-medium cursor-pointer"
                onClick={() => {
                  imageType === "upload" ? setImageType("generate") : setLeaveModal(true);
                }}
                disabled={isLoading}
              >
                {imageType === "upload" ? "Back to generation" : "Upload your image instead"}
              </button>

              <button
                className="sm:w-[220px] w-full bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer"
                onClick={imageType === "upload" ? advanceFunction : onGenerateImage}
                disabled={isLoading}
              >
                {"Continue"}
              </button>
            </div>
            <Modal isOpen={leaveModal} onClose={() => false} className="w-full h-full flex items-end sm:items-center justify-center">
              <div className="flex flex-col items-center px-8 py-6 bg-bg-2 sm:rounded-xl rounded-t-xl sm:w-[368px] w-full">
                <div className="text-white font-inter font-medium mt-2">Are you sure that you want leave?</div>
                <p className="text-text-additional font-inter text-[13px] w-[244px] text-center mt-2">If you leave, you lost all your results related to generated images</p>
                <div className="flex flex-col sm:flex-row w-full mt-8 gap-2">
                  <div className="bg-bg-3 rounded-full px=5 py-[9px] font-inter text-text-sub text-sm font-medium w-full sm:w-1/2 text-center cursor-pointer" onClick={() => setLeaveModal(false)}>Cancel</div>
                  <div className="bg-[#DF1C41] rounded-full px=5 py-[9px] font-inter text-white text-sm font-medium w-full sm:w-1/2 text-center cursor-pointer" onClick={() => { setImageType("upload"); setLeaveModal(false); }}>Yes, leave</div>
                </div>
              </div>
            </Modal>
            <Modal isOpen={confirmModal} onClose={() => false} className="w-full h-full flex items-end sm:items-center justify-center">
              <div className="flex flex-col items-center px-8 py-6 bg-bg-2 sm:rounded-xl rounded-t-xl sm:w-[368px] w-full">
                <div className="text-white font-inter font-medium mt-2">Are you sure that you want leave?</div>
                <p className="text-text-additional font-inter text-[13px] w-[244px] text-center mt-2">If you leave, you lost all your results related to generated images</p>
                <div className="flex flex-col sm:flex-row w-full mt-8 gap-2">
                  <div className="bg-bg-3 rounded-full px=5 py-[9px] font-inter text-text-sub text-sm font-medium w-full sm:w-1/2 text-center cursor-pointer" onClick={() => setConfirmModal(false)}>Go back</div>
                  <div className="bg-[#BC7F44] rounded-full px=5 py-[9px] font-inter text-white text-sm font-medium w-full sm:w-1/2 text-center cursor-pointer" onClick={handleConfirmStyleChange}>Confirm</div>
                </div>
              </div>
            </Modal>
          </div>
        )
        :
        <div className="flex flex-col items-center h-[90vh] w-full justify-center">
          <Image src={"/generating.svg"} alt="" className="animate-spin-2" width={91} height={91} />
          <span className="text-white  text-[32px] font-semibold mt-[37px]">Generating a picture</span>
          <p className="text-text-tertiary text-sm  mt-2">Wait couple of seconds until we have been generated pictures for you</p>
        </div>}
    </>
  );
};