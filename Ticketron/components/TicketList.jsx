"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
export default function TicketList() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/mod");
        if (!res.ok) {
          throw new Error("Error fetching tickets!");
        }
        const { tickets } = await res.json();
        const userTickets = tickets.filter(
          (ticket) => ticket.email === session?.user?.email
        );
        setTickets(userTickets);
      } catch (error) {
        console.error(error);
        setError("Error fetching tickets!");
      }
    };
    if (session?.user) {
      fetchData();
    }
  }, [session]);
  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/mod", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        throw new Error("Error deleting ticket!");
      }
      const updatedTickets = tickets.filter((ticket) => ticket._id !== id);
      setTickets(updatedTickets);
      setSelectedTicket(null);
    } catch (error) {
      console.error(error);
      setError("Error deleting ticket!");
    }
  };
  if (error) {
    return <div>Error: {error}</div>;
  }
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
        <div className="bg-transparent rounded-lg p-8 sm:p-8 flex flex-col justify-center items-center animate-slideDown">
          <p className="text-4xl sm:text-4xl mb-4 sm:mb-4">Your Tickets</p>
          {tickets.length === 0 ? (
            <p className="text-center text-xl sm:text-xl">No data</p>
          ) : (
            <div className="flex flex-wrap justify-center">
              {tickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black p-4 rounded-lg cursor-pointer relative"
                  style={{ margin: "16px 8px 0", width: "300px" }}
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <p>
                    <span className="font-bold">Title:</span> {ticket.title}
                  </p>
                  <p>
                    <span className="font-bold">Category:</span>{" "}
                    {ticket.category}
                  </p>
                  <p>
                    <span className="font-bold">Name:</span> {ticket.fullname}
                  </p>
                  <p>
                    <span className="font-bold">Email:</span> {ticket.email}
                  </p>
                  <p>
                    <span className="font-bold">Date:</span>{" "}
                    {new Date(ticket.date).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-bold">Status:</span> {ticket.status}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {selectedTicket && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-gradient-to-b from-black to-gray-900 text-white p-12 w-full h-full overflow-y-auto flex flex-col justify-center items-center">
            <p className="text-2xl font-bold mb-4">Ticket Details</p>
            <p>
              <span className="font-bold">Title:</span> {selectedTicket.title}
            </p>
            <p>
              <span className="font-bold">Category:</span>{" "}
              {selectedTicket.category}
            </p>
            <p>
              <span className="font-bold">Name:</span> {selectedTicket.fullname}
            </p>
            <p>
              <span className="font-bold">Email:</span> {selectedTicket.email}
            </p>
            <p>
              <span className="font-bold">Date:</span>{" "}
              {new Date(selectedTicket.date).toLocaleString()}
            </p>
            <p>
              <span className="font-bold">Status:</span> {selectedTicket.status}
            </p>
            <p className="font-bold">Description:</p>
            <div className="overflow-y-auto max-h-36">
              <p>{selectedTicket.message}</p>
            </div>
            <p className="font-bold">Response:</p>
            <div className="overflow-y-auto max-h-36">
              <p>{selectedTicket.response}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleDelete(selectedTicket._id)}
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12 mr-4"
              >
                Delete Ticket
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
