import { Character } from "@prisma/client";
import { BotAvatar } from "@/components/BotAvatar";
import React, { useEffect, useState } from 'react';  
const StartWithCard = ({
  character,
}: {
  character: Partial<Character & { _count: { messages: number } }>;
}) => {
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
  return (
    <div className="flex flex-col min-w-[360px] rounded-2xl bg-bg-3">
      <div className="flex flex-row px-4 py-[18px] gap-4 items-center">
        <BotAvatar image={character.image || "/default.png"} size={8} />
        <div className="flex flex-col">
          <span className="text-white text-sm font-medium">{character.name}</span>
          <p className="text-text-additional font-inter text-xs">{character && character.description && character.description.length > 25
            ? `${character.description.slice(0, 25)}...`
            : character.description}</p>
        </div>
      </div>
      <div className="px-2 flex flex-col gap-1 w-full mb-2">
        {selectedQuestions.map(q => (  
          <div key={q.id} className="px-4 py-2.5 font-inter text-sm font-medium text-text-sub bg-[#2F2F2F] rounded-lg">{q.question}</div>  
        ))}  
      </div>
    </div>
  )
}
export default StartWithCard