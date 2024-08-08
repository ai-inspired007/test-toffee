import React from "react";

interface ProgressBarProps {
  percentage: number;
  value: string;
  max: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, value, max }) => {
  const isTextOutside = percentage < 10; // Threshold for text placement; adjust as necessary

  return (
    <div className="flex flex-col w-full">
      <span className="text-text-tertiary  text-sm mb-2">Storage limits</span>
      <div className="w-full h-10 relative">
        <div className={`border-r border-[#966730] h-full text-white relative ${isTextOutside ? 'flex' : ''}`} style={{ width: `${percentage}%` }}>
          {isTextOutside ? (
            <span className="absolute text-sm font-medium  text-nowrap -right-14 -top-1">
              {value}
            </span>
          ) : (<span className="absolute text-sm font-medium  text-nowrap right-1 -top-1">
            {value}
          </span>)}
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-xl h-2">
        <div className=" bg-gradient-to-r from-[#966730] to-[#B99366] h-full rounded-l-xl" style={{ width: `${percentage}%` }}></div>
      </div>
      <div className="w-full flex justify-between text-text-tertiary mt-3">
        <span>0 MB</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default ProgressBar