"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(["All fields are necessary!"]);
      return;
    }
    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const { user } = await resUserExists.json();
      if (user) {
        setError(["User already exists!"]);
        return;
      }
      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed!");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black to-gray-900">
      <div className="sticky top-0 z-10 w-full animate-slideDown">
        <div className="bg-black text-white py-12 sm:py-12 flex justify-between items-center relative">
          <h1 className="absolute inset-x-0 text-center text-6xl sm:text-6xl font-semibold text-white animate-slideDown">
            Ticketron
          </h1>
        </div>
        <div className="bg-gray-900 text-white py-6 sm:py-6 flex justify-between items-center h-6 relative">
          <div className="ml-2 flex flex-col items-start text-xs sm:text-sm animate-slideDown">
            <span className="text-white">
              Name: <span className="font-bold">{session?.user?.name}</span>
            </span>
            <span className="text-white">
              Email: <span className="font-bold">{session?.user?.email}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center text-white">
        <div className="bg-transperent rounded-lg p-8 sm:p-8 text-white text-center animate-slideDown">
          <p className="text-4xl sm:text-4xl mb-4 sm:mb-4">Welcome!</p>
          <p className="text-xl sm:text-xl mb-4 sm:mb-4">
            Please register to continue
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 sm:gap-4 w-full sm:w-96"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
            />
            <button className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-full h-12 sm:h-12 mx-auto flex justify-center items-center text-sm sm:text-base">
              Register
            </button>
            <div className="text-center">
              {error &&
                error.map((e, index) => (
                  <div key={index} className="text-white">
                    {e}
                  </div>
                ))}
            </div>
            <Link className="text-sm text-center" href={"/"}>
              Already have an account? <span className="underline">Login</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
