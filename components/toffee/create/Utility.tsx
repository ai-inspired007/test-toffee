"use client";
import React, { useState, useRef, useEffect } from "react";
import { X } from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Category, KnowledgePack, Tag } from "@prisma/client";
import { useRouter } from "next/navigation";
import { AddCharacterImage } from "./Elements/AddCharacterImage";
import { CharacterInformation } from "./Elements/CharacterInformation";
import { CharacterConfig } from "./Elements/CharacterConfig";
import { CharacterAddons } from "./Elements/CharacterAddons";
import axios from "axios";

type SlideDirection = "backwards" | "forwards";

const UtilityCreate = ({
  categorielist,
  addons
}: {
  categorielist: { id: string, name: string, tags: Tag[] }[];
  addons: KnowledgePack[];
}) => {
  const steps = ["Image", "General", "Configuration", "Knowledge"];
  const [step, setSlideNumber] = useState(0);
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageData, setImageData] = useState<string | null>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<Category["id"]>(categorielist[0].id);
  const [characterTags, setCharacterTags] = useState<string[]>([]);
  const [greeting, setGreeting] = useState("");
  const [instructions, setInstructions] = useState("");
  const [seed, setSeed] = useState("");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [connectedCandies, setConnectedCandies] = useState<KnowledgePack[]>([]);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const slideDirectionRef = useRef<SlideDirection>("forwards");
  const [categories, setCategories] = useState(categorielist);
  const [addedCategory, setAddedCategory] = useState<{ id: string, name: string, tags: Tag[] } | null>(null); 

  useEffect(() => {
    console.log(imageFile)
    console.log(imageData)
  }, [imageFile, imageData]);
  const validateStep = (currentStep: number) => {  
    let newErrors: Record<string, string> = {};  
  
    switch (currentStep) {  
      case 0:  
        if (!imageData) newErrors.imageData = "Image is required.";  
        break;  
      case 1:  
        if (!name) newErrors.name = "Name is required.";  
        if (!description) newErrors.description = "Description is required.";  
        if (!categoryId) newErrors.categoryId = "Category is required.";  
        break;  
      case 2:  
        if (!greeting) newErrors.greeting = "Greeting is required.";  
        if (!instructions) newErrors.instructions = "Instructions are required.";  
        if (!seed) newErrors.seed = "Seed is required.";  
        break;  
      default:  
        return true;  
    }  
  
    if (Object.keys(newErrors).length > 0) {  
      Object.values(newErrors).forEach((error) => {  
        toast.error(error as string, {  
          theme: "colored",  
          hideProgressBar: true,  
          autoClose: 1500,  
        });  
      });  
      setErrors(newErrors);  
      return false;  
    }  
  
    setErrors({});  
    return true;  
  };  

  const advanceStep = () => {  
    if (validateStep(step)) {  
      slideDirectionRef.current = "forwards";  
      setSlideNumber(step + 1);  
    }  
  };  
  async function createCharacter() {
    const formData = new FormData();
    if (imageFile)
      formData.append("imgFile", imageFile);
    let mainData = {
      name,
      description,
      instructions,
      seed,
      categoryId: addedCategory ? "" : categoryId,
      addedCategory,
      greeting,
      tags: Array.from(characterTags),
      addons: Array.from(connectedCandies.map((item)=>item.id))
    }
    formData.append("data", JSON.stringify(mainData));
    const response = await fetch("/api/character", {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      // alert("Character created successfully!");
      router.refresh();
      router.push(`/models`);
      
    } else {
      // alert("Failed to create character.");
      console.error(response.status, response.statusText);
      toast.error("Something went wrong. Your character has been flagged by the moderation system. If you believe this isn't the case, and the error persists, contact a developer.", {  
        theme: "colored",  
        hideProgressBar: true,  
        autoClose: 1500,  
      })
    }
  }

  return (
    <div className="h-screen w-full p-2 overflow-y-auto no-scrollbar">
      <ToastContainer />
      <div className="flex flex-col rounded-2xl bg-bg-2 w-full min-h-full items-center justify-start relative p-6">
        <X className="text-icon-3 bg-bg-3 rounded-full p-1.5 h-9 w-9 cursor-pointer absolute top-6 right-6" />
        <div className="w-full flex justify-center items-center">
          <div className="flex flex-row rounded-full bg-black p-0.5 text-white gap-0.5">
            {steps.map((item, index) =>
              <div key={index} className={`flex flex-row items-center ${index === step && "bg-[#BC7F44] rounded-full p-0.5"}`}>
                <div className={index < step ? "bg-bg-3 rounded-full w-7 h-7 flex items-center justify-center" : "w-6 h-6 flex items-center justify-center bg-black rounded-full"}>{index + 1}</div>
                {index === step && <div className="text-xs px-2">{item}</div>}
              </div>
            )}
          </div>
        </div>
        <div className="no-scrollbar flex h-full w-full flex-col gap-6 overflow-x-visible items-center">
          {step === 0 &&
            <AddCharacterImage
              imageData={imageData}
              setImageData={setImageData}
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              setImageFile={setImageFile}
              advanceFunction={advanceStep}
              previousFunction={() => router.push("/create")}
            />
          }
          {step === 1 && (
            <CharacterInformation
              advanceFunction={advanceStep}
              previousFunction={() => {
                slideDirectionRef.current = "backwards";
                setSlideNumber(0);
              }}
              imageData={imageData}
              categories={categories}
              setCategories={setCategories}
              categoryId={categoryId}
              description={description}
              name={name}
              addedCategory={addedCategory}
              setAddedCategory={setAddedCategory}
              characterTags={characterTags}
              setCharacterTags={setCharacterTags}
              setCategoryId={setCategoryId}
              setDescription={setDescription}
              setName={setName}
            />
          )}
          {step === 2 && (
            <CharacterConfig
              imageData={imageData}
              description={description}
              name={name}
              greeting={greeting}
              setGreeting={setGreeting}
              instructions={instructions}
              setInstructions={setInstructions}
              seed={seed}
              setSeed={setSeed}
              advanceFunction={advanceStep}
              previousFunction={() => {
                slideDirectionRef.current = "backwards";
                setSlideNumber(1);
              }}
            />
          )}
          {step === 3 && (
            <CharacterAddons
              isSubmitLoading={isSubmitLoading}
              advanceFunction={() => {
                setIsSubmitLoading(true);  
                createCharacter();  
                setIsSubmitLoading(false);
              }}
              previousFunction={() => setSlideNumber(2)}
              description={description}
              imageData={imageData}
              name={name}
              connectedCandies={connectedCandies}
              setConnectedCandies={setConnectedCandies}
              addons={addons}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UtilityCreate;