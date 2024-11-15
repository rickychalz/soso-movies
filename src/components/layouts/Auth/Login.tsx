
import LoginForm from "./LoginForm";


interface LoginProps {
  onRegister: () => void;
  onForgotPassword: () => void;

  onClose:()=>void;
  onRedirect:()=>void;
}

const Login = ({ onRegister, onForgotPassword, onClose, onRedirect }: LoginProps) => {


  return (
    <div className="flex flex-col justify-between items-center">
      <div className="text-center font-normal text-2xl mb-6">
        {" "}
       Login!
      </div>
      <div className="flex flex-col w-full px-8">
        <LoginForm onClose={onClose} onRedirect={onRedirect}/>
      </div>
      <div className="text-center flex items-center mt-6 mb-2">
        {" "}
        Don't have an account ?{" "}
        <span className="mx-1 underline cursor-pointer font-semibold text-teal-600" onClick={onRegister}>
          Register!
        </span>
      </div>
      <div className="text-center flex items-center">
        {" "}
        Forgot password ?{" "}
        <span
          className="mx-1 underline cursor-pointer text-teal-600"
          onClick={onForgotPassword}
        >
          Reset password!
        </span>
      </div>
    </div>
  );
};

export default Login;
