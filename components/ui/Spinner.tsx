import { ClipLoader } from "react-spinners";
const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 flex flex-1 items-center justify-center z-50 h-screen w-screen bg-black/80">
      <ClipLoader size={40} color="#FFFFFF" />
    </div>
  );
};

export default Spinner;
