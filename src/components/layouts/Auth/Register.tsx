import RegisterForm from "./RegisterForm";

interface LoginProps {
  onLogin: () => void;
  onClose:()=>void;
  onRedirect:()=>void;
}

const Register = ({ onLogin, onClose, onRedirect }: LoginProps) => {
  return (
    <div className="flex flex-col justify-between items-center">
      <div className="text-center font-normal text-2xl mb-6 font-domine">
        {" "}
        Create an account!
      </div>
      <div className="flex flex-col w-full px-8">
       <RegisterForm onClose={onClose} onRedirect={onRedirect}/>
      </div>
      <div className="text-center flex items-center mt-6 mb-2">
        {" "}
        Already have an account?{" "}
        <span
          className="mx-1 underline cursor-pointer text-teal-600"
          onClick={onLogin}
        >
          Login!
        </span>
      </div>
    </div>
  );
};

export default Register;
