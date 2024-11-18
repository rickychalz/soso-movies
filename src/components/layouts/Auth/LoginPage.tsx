import { Link, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import useAuthStore from "@/store/auth-context";


interface DecodedJwt extends JwtPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;  // Google's unique user ID
}

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleRedirect = () => {
    navigate("/"); // Redirect to the home page after login
  };

  const responseMessage = (response: CredentialResponse) => {
    const { credential } = response;

    if (!credential) {
      // Handle the case where credential is undefined
      console.error("Google login failed: No credential provided");
      return;
    }

    const decoded: DecodedJwt = jwtDecode(credential); // Decode the Google credential JWT

    // Send the necessary data to your backend API
    fetch('http://localhost:8000/api/users/google-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: decoded.email,
        name: decoded.name,
        avatar: decoded.picture,
        googleId: decoded.sub,  // Google's unique user ID
      }),
    })
      .then((res) => res.json())
      .then(async (data) => {
        
        // Handle success (store the token, navigate, etc.)
        login(data);
        console.log(data);
        handleRedirect();
      })
      .catch((error) => {
        console.error("Google login failed", error);
      });
  };

  const errorMessage = () => {
    console.error("Google login failed");
  };

  return (
    <>
      <section className="bg-[#121212] text-white h-screen">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1617195737496-bc30194e3a19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6 w-full">
            <div className="w-full">
              <div className="flex flex-col justify-between items-center w-full">
                <div className="text-center font-normal text-2xl mb-6 w-full">
                  {" "}
                  Login!
                </div>
                <div className="flex flex-col w-full px-8">
                  <LoginForm onRedirect={handleRedirect} />
                </div>
                <div className="my-4">
                  <GoogleLogin
                    onSuccess={responseMessage}
                    onError={errorMessage}
                  />
                </div>
                <div className="text-center flex items-center mt-6 mb-2">
                  {" "}
                  Don't have an account ?{" "}
                  <Link
                    to="/register"
                    className="mx-1 underline cursor-pointer font-semibold text-teal-600"
                  >
                    Register!
                  </Link>
                </div>
                <div className="text-center flex items-center">
                  {" "}
                  Forgot password ?{" "}
                  <span className="mx-1 underline cursor-pointer text-teal-600">
                    Reset password!
                  </span>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>
    </>
  );
};

export default LoginPage;
