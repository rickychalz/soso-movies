import { Link, useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const RegisterPage = () => {
    const navigate = useNavigate();
    
    const handleRedirect = () => {
        navigate('/'); // Redirect to the home page after login
      };
  return (
    <>
      <section className="bg-[#121212] text-white">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

           
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="w-full">
              

              <div className="flex flex-col justify-between items-center w-full">
                <div className="text-center font-normal text-2xl mb-6 w-full">
                  {" "}
                  Register!
                </div>
                <div className="flex flex-col w-full px-8">
                  <RegisterForm onRedirect={handleRedirect}/>
                </div>
                <div className="text-center flex items-center mt-6 mb-2">
                  {" "}
                  Already have an account ?{" "}
                  <Link to="/login" className="mx-1 underline cursor-pointer font-semibold text-teal-600">
                    Login!
                  </Link>
                </div>
              
              </div>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default RegisterPage;
