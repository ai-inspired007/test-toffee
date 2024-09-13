"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { RiMessage3Line } from "@/components/toffee/icons/MessageLine";
import TextareaBlock from "@/components/ui/TextareaBlock";
import { GitCommit, Trash2 } from "lucide-react";
import BotPreview from "../../../BotPreview";
import StepButton from "./StepButton";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import Modal from "@/components/ui/Modal";
import ImportConversation from "./ImportConversation";

export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface Conversation {
  title: string;
  content: QuestionAnswer[];
}

interface CharacterConvProps {
  name: string;
  description: string;
  imageData: string | null;
  setName: (newName: string) => void;
  conversation: Conversation[];
  setConversation: (conversation: Conversation[]) => void;
  advanceFunction: () => void;
  previousFunction: () => void;
  importedConversation: Conversation[];
  setImportedConversation: (importedConversation: Conversation[]) => void;
  seeds: ConversationDetail[];
}
interface ConversationDetail {
  seed: string;
  name: string;
}
const CharacterConversation = ({
  name,
  description,
  imageData,
  setName,
  conversation,
  setConversation,
  advanceFunction,
  previousFunction,
  importedConversation,
  setImportedConversation,
  seeds
}: CharacterConvProps) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [collapse, setCollapse] = useState<boolean>(false);
  const [titleErrors, setTitleErrors] = useState<string[]>(Array(conversation.length).fill(""));
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (convIndex: number, qaIndex: number, field: keyof QuestionAnswer, value: string) => {
    const newConversations = [...conversation];
    newConversations[convIndex].content[qaIndex][field] = value;
    setConversation(newConversations);
  };

  const handleTitleChange = (index: number, value: string) => {
    const newConversations = [...conversation];
    newConversations[index].title = value;
    setConversation(newConversations);

    const newTitleErrors = [...titleErrors];
    if (value.trim().length < 1) {
      newTitleErrors[index] = "Title must be at least 1 character long.";
    } else {
      newTitleErrors[index] = "";
    }
    setTitleErrors(newTitleErrors);
  };

  const addQuestionAnswer = (index: number) => {
    const newConversations = [...conversation];
    newConversations[index].content.push({ question: "", answer: "" });
    setConversation(newConversations);
  };

  const addNewConversation = () => {
    setConversation([...conversation, { title: "New Conversation", content: [{ question: "", answer: "" }] }]);
    setTitleErrors([...titleErrors, ""]);
  };

  const deleteConversation = (index: number) => {
    const newConversations = conversation.filter((_, convIndex) => convIndex !== index);
    setConversation(newConversations);
    const newTitleErrors = titleErrors.filter((_, errIndex) => errIndex !== index);
    setTitleErrors(newTitleErrors);
  };
  const handleImportConversation = (conversation: Conversation) => {
    setImportedConversation([...importedConversation, conversation]);
  };

  const handleRemoveConversation = (title: string) => {
    setImportedConversation(importedConversation.filter(conv => conv.title !== title));
  };

  const parseSeeds = (seeds: ConversationDetail[]): Conversation[] => {
    const conversations: Conversation[] = [];

    seeds.forEach(({ name, seed }) => {
      // Split the seed by lines and filter out empty lines  
      const lines = seed.split('\n').map(line => line.trim()).filter(line => line);

      let currentTitle: string = '';
      let currentResponder: string = '';
      let conversationContent: QuestionAnswer[] = [];

      lines.forEach((line, index) => {
        if (line.toLowerCase().startsWith('conversation')) {
          // Whenever a new conversation marker is found, finalize the previous conversation  
          if (conversationContent.length > 0) {
            conversations.push({
              title: currentTitle || `Conversation with ${currentResponder}`,
              content: conversationContent,
            });
            // Reset for new conversation  
            conversationContent = [];
          }
          currentTitle = line; // Set the new conversation title  
        } else if (line.startsWith("User:")) {
          const question = line.slice("User:".length).trim();
          const nextLine = lines[index + 1] || '';

          if (nextLine) {
            const responderMatch = nextLine.match(/^([^:]+):(.+)$/);
            if (responderMatch) {
              currentResponder = responderMatch[1].trim();
              const answer = responderMatch[2].trim();
              conversationContent.push({ question, answer });
            }
          }
        }
      });

      // Add the last conversation if there is leftover content  
      if (conversationContent.length > 0) {
        conversations.push({
          title: currentTitle || `Conversation with ${currentResponder}`,
          content: conversationContent,
        });
      }
    });

    return conversations;
  };

  const [parsedConversations, setParsedConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // Parse seeds when the component mounts or seeds change  
    setParsedConversations(parseSeeds(seeds));
  }, [seeds]);

  return (
    <div className="mt-5 flex flex-row w-full max-w-[1024px]">
      <div className="flex flex-col items-start mx-5">
        <div className="flex flex-col gap-4">
          <h1 className="sm:text-[32px] text-[20px] font-semibold tracking-[0.075rem] text-white">{"How would your character respond?"}</h1>
          <p className="sm:text-sm text-[13px] text-text-tertiary">Supported formats PNG and JPG, recommended size 260x300. 400KB max</p>
        </div>
        <div className="flex flex-col w-full sm:w-[456px] mt-[30px] gap-7">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-text-tertiary">{"Name"}</span>
            <div className="relative">
              <input
                type="text"
                className="w-full text-[13px] text-text-sub p-1 bg-transparent border border-white/10 outline-none resize-none overflow-hidden rounded-lg px-4 py-3 placeholder-[#767676]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your character's name."
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center mb-4">
              <span className="font-inter text-text-sub font-semibold leading-6">Conversations</span>
              <div className="flex flex-row gap-2 items-center font-inter text-toffee-text-accent font-medium leading-[18px] text-sm" onClick={handleShowModal}>
                <span>Import conversation</span>
                <RiGitRepositoryCommitsLine />
              </div>
              <Modal isOpen={showModal} onClose={handleCloseModal}>
                <ImportConversation
                  conversations={parsedConversations}
                  onImportConversation={handleImportConversation}
                  onRemoveConversation={handleRemoveConversation}
                  importedConversations={importedConversation}
                  onClose={handleCloseModal}
                />
              </Modal>
            </div>
            {conversation.map((conv, convIndex) => (
              <div key={convIndex} className="flex flex-col border border-[#202020] rounded-[7px] px-4 py-3">
                <div className="flex flex-row gap-2 items-center">
                  <RiMessage3Line className="text-icon-3" />
                  <input
                    type="text"
                    className="text-text-sub  text-[13px] leading-5 p-1.5 bg-transparent border border-transparent outline-none focus:ring-0"
                    value={conv.title}
                    onChange={(e) => handleTitleChange(convIndex, e.target.value)}
                    placeholder="Enter conversation title."
                  />
                  <div className="ml-auto flex items-center gap-2">
                    <Trash2 className="text-[#777777] h-6 w-6 cursor-pointer" onClick={() => deleteConversation(convIndex)} />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      className={`w-6 h-6 cursor-pointer ${collapse ? "" : "transform rotate-180"}`}
                      onClick={() => setCollapse(!collapse)}
                    >
                      <path
                        d="M12.0001 10.9451L7.54506 15.4001L6.27246 14.1275L12.0001 8.3999L17.7277 14.1275L16.4551 15.4001L12.0001 10.9451Z"
                        fill="#B1B1B1"
                      />
                    </svg>
                  </div>
                </div>
                {titleErrors[convIndex] && (
                  <div className="text-red-500 text-xs mt-1">{titleErrors[convIndex]}</div>
                )}
                <div
                  className={`flex flex-col gap-[17px] overflow-hidden transition-max-height duration-300 ${collapse ? "max-h-0" : "max-h-screen"}`}
                >
                  {conv.content.map((qa, index) => (
                    <div key={index} className="flex flex-col gap-4 mt-4">
                      <TextareaBlock
                        label="Question"
                        name={`question-${convIndex}-${index}`}
                        value={qa.question}
                        onChange={(value) => handleInputChange(convIndex, index, "question", value)}
                        placeholder="Give the example of a question that a user could ask the character."
                      />
                      <TextareaBlock
                        label="Answer"
                        name={`answer-${convIndex}-${index}`}
                        value={qa.answer}
                        onChange={(value) => handleInputChange(convIndex, index, "answer", value)}
                        placeholder="Enter your response here. Use * to indicate attention or emotion."
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-4 mb-4 py-2 pl-2 pr-3 bg-bg-3 text-text-additional rounded-lg font-medium text-sm w-fit"
                    onClick={() => addQuestionAnswer(convIndex)}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <p>+</p>
                      <p>Add question</p>
                    </div>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-4 mb-4 py-2 pl-2 pr-3 bg-bg-3 text-text-additional rounded-lg font-medium text-sm w-fit"
            onClick={addNewConversation}
          >
            <div className="flex flex-row gap-2 items-center">
              <p>+</p>
              <p>Add New Conversation</p>
            </div>
          </button>
          <div className="w-full mt-8">
            <StepButton onClick={advanceFunction} text="Continue" />
          </div>
        </div>
      </div>
      <div className="ml-auto hidden sm:block mt-5">
        <BotPreview imageData={imageData} user={user} name={name} description={description} />
      </div>
    </div>
  );
};

export default CharacterConversation;