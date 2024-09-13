import { Character } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/ImageAvatar";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const StartWithCard = ({
  character,
}: {
  character: Partial<Character & { _count: { messages: number } }>;
}) => {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);  
  const [selectedQuestions, setSelectedQuestions] = useState<{id: number | string, question: string}[]>([]);  

  useEffect(() => {  
    fetch('/questions.json')  
      .then(response => response.json())  
      .then(data => {  
        setQuestions(data);  
      });  
  }, []);  

  useEffect(() => {  
    if (questions.length > 0) {  
      selectRandomQuestions();  
    }  
  }, [questions]);  

  const selectRandomQuestions = () => {  
    const shuffled = questions.sort(() => 0.5 - Math.random());  
    const selected = shuffled.slice(0, 3);  
    setSelectedQuestions(selected);  
  };

  const handleQuestionClick = (question: string) => {
    const encodedQuestion = encodeURIComponent(question);
    router.push(`/chat/${character.id}?question=${encodedQuestion}`);
  };

  return (
    <div className="flex flex-col min-w-[360px] rounded-2xl bg-bg-3 gap-6 border border-1 border-white/10">
      <div className="flex flex-col items-center p-4 px-2 pb-0 gap-4">
        <Avatar className="h-[56px] w-[56px]">
          <AvatarImage className="object-cover object-center" src={character.image || "/default.png"} />
        </Avatar>
        <div className="flex flex-col items-center text-center">
          <span className="text-white text-sm font-medium leading-[18px]">{character.name}</span>
          <p className="text-text-additional text-xs leading-[18px]">
            {character && character.description && character.description.length > 50
              ? `${character.description.slice(0, 50)}...`
              : character.description}
          </p>
        </div>
      </div>
      <div className="px-2 pb-2 flex flex-col gap-2 w-full">
        {selectedQuestions.map(q => (  
          <div 
            key={q.id} 
            className="px-4 py-[9px] text-sm font-medium text-text-sub bg-[#2F2F2F] rounded-lg flex justify-between items-center hover:bg-[#474747] transition-colors duration-200 cursor-pointer"
            onClick={() => handleQuestionClick(q.question)}
          >
            <span className="leading-[18px] text-sm font-medium">{q.question}</span>
            <img src="/send-plane-fill.svg" alt="Send" className="w-5 h-5" />
          </div>  
        ))}  
      </div>
    </div>
  )
}
export default StartWithCard