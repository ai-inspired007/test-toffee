import { FC } from "react";
const StepButton: FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
  <div className="bg-gradient-to-r from-[#C28851] to-[#B77536] rounded-full px-4 py-1.5 text-center text-sm text-white font-medium cursor-pointer w-full" onClick={onClick}>
    {text}
  </div>
);
export default StepButton;