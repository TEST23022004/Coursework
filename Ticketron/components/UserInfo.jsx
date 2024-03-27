"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
export default function UserInfo() {
  const { data: session } = useSession();
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
          <button
            onClick={() => signOut()}
            className="animate-slideDown outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold mr-2 rounded-full w-24 sm:w-24 h-8 sm:h-8 mx-auto flex justify-center items-center text-xs sm:text-base"
          >
            Log Out
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-transperent rounded-lg p-8 sm:p-8 text-white text-center animate-slideDown">
          <p className="text-4xl sm:text-4xl mb-4 sm:mb-4">
            Welcome <span className="font-bold">{session?.user?.name}</span>
          </p>
          <div className="mb-4 flex flex-col items-center">
            <p className="text-xl sm:text-xl mb-4 sm:mb-4">
              Create your ticket here
            </p>
            <FontAwesomeIcon
              icon={faArrowDown}
              className="text-white w-4 h-4 animate-bounce"
            />
          </div>
          <Link href="/contactpage">
            <button className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-60 sm:w-60 h-12 sm:h-12 mx-auto flex justify-center items-center text-sm sm:text-base">
              Create Ticket
            </button>
          </Link>
          <p className="text-xl sm:text-xl mt-4 mb-4">or</p>
          <Link href="/ticketlistpage">
            <button className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-60 sm:w-60 h-12 sm:h-12 mx-auto flex justify-center items-center text-sm sm:text-base">
              View Created Tickets
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
