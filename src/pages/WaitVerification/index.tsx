import { Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="bg-[#121212] text-white">
      <div className="flex flex-col h-screen items-center justify-center m-auto">
        <div className="rounded-full bg-teal-500 p-4 h-48 w-48 flex items-center justify-center">
          <div className="rounded-full bg-teal-700 p-4 h-32 w-32 flex items-center justify-center">
            <Mail size={48} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col items-center my-3 text-xl font-light">
          <span>Verification Email has been sent.</span>
          <span>Please verify your email to proceed!</span>
        </div>
      </div>
    </div>
  );
};

export default Index;
