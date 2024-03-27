"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function ContactForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    category: "Hardware Problem",
    message: "",
    status: "Not Started",
    response: "None",
  });
  const [error, setError] = useState([]);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (session) {
      setFormData((prevData) => ({
        ...prevData,
        fullname: session.user.name,
        email: session.user.email,
      }));
    }
  }, [session]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithUser = {
      ...formData,
      fullname: session?.user?.name || "",
      email: session?.user?.email || "",
    };
    const res = await fetch("api/contact", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formDataWithUser),
    });
    const { msg, success } = await res.json();
    setError(msg);
    setSuccess(success);
    if (success) {
      setFormData({
        fullname: session?.user?.name || "",
        email: session?.user?.email || "",
        title: "",
        category: "Hardware Problem",
        message: "",
        status: "Not Started",
        response: "None",
      });
    }
  };
  const categories = ["Hardware Problem", "Software Problem", "Other"];
  const statuses = ["Not Started", "In Progress", "Done"];
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
          <Link href="/dashboard">
            <button className="animate-slideDown outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold mr-2 rounded-full w-24 sm:w-24 h-8 sm:h-8 mx-auto flex justify-center items-center text-xs sm:text-base">
              Back
            </button>
          </Link>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center text-white">
        <div className="bg-transperent rounded-lg p-8 sm:p-8 text-white text-center animate-slideDown">
          <p className="text-4xl sm:text-4xl mb-4 sm:mb-4">
            Create Your Ticket
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:gap-4 w-full sm:w-full"
          >
            <input
              type="hidden"
              name="fullname"
              value={session?.user?.name || ""}
            />
            <input
              type="hidden"
              name="email"
              value={session?.user?.email || ""}
            />
            <div>
              <label htmlFor="title">Title</label>
              <input
                onChange={handleChange}
                value={formData.title}
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                className="w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                onChange={handleChange}
                name="category"
                id="category"
                value={formData.category}
                className="w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
              >
                {categories?.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="message">Description</label>
              <textarea
                onChange={handleChange}
                value={formData.message}
                className="w-full min-h-20 py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
                id="message"
                name="message"
                placeholder="Describe your problem here..."
              ></textarea>
            </div>
            <input type="hidden" name="status" value={formData.status} />
            <input type="hidden" name="response" value={formData.response} />
            <button
              className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-full h-12 sm:h-12 mx-auto flex justify-center items-center text-sm sm:text-base"
              type="submit"
            >
              Create Ticket
            </button>
          </form>
          <div className="text-center">
            {error &&
              error.map((e, index) => (
                <div
                  key={index}
                  className={`${success ? "text-white" : "text-white"} ${
                    error.length > 0 ? "mt-4" : ""
                  }`}
                >
                  {e}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
