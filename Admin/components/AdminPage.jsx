"use client";
import { useState, useEffect } from "react";
export default function AdminPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [formData, setFormData] = useState({
    status: "Not Started",
    response: "None",
  });
  const [success, setSuccess] = useState(false);
  const statuses = ["Not Started", "In Progress", "Done"];
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { msg, success } = await res.json();
    setError(msg);
    setSuccess(success);
    if (success) {
      setFormData({
        status: "Not Started",
        response: "None",
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/mod");
        if (!res.ok) {
          throw new Error("Error fetching tickets!");
        }
        const { tickets } = await res.json();
        setTickets(tickets);
      } catch (error) {
        console.error(error);
        setError("Error fetching tickets!");
      }
    };
    fetchData();
  }, []);
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
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetch("/api/mod", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        throw new Error("Error updating ticket status!");
      }
      const updatedTicket = { ...selectedTicket, status };
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error(error);
      setError("Error updating ticket status!");
    }
  };
  const handleRespondSubmit = async () => {
    try {
      const res = await fetch("/api/mod", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedTicket._id,
          response: formData.response,
        }),
      });
      if (!res.ok) {
        throw new Error("Error responding to ticket!");
      }
      const updatedTicket = { ...selectedTicket, response: formData.response };
      setSelectedTicket(updatedTicket);
      setFormData((prevData) => ({
        ...prevData,
        response: "",
      }));
    } catch (error) {
      console.error(error);
      setError("Error responding to ticket!");
    }
  };
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black to-gray-900">
      <div className="flex-1 flex justify-center items-center text-white">
        <div className="bg-transparent rounded-lg p-8 sm:p-8 flex flex-col justify-center items-center animate-slideDown">
          <p className="text-4xl sm:text-4xl mb-4 sm:mb-4">All Tickets</p>
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
          <div className="bg-gradient-to-b from-black to-gray-900 text-white p-8 w-full h-full overflow-y-auto flex flex-col justify-center items-center">
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
            <div className="overflow-y-auto">
              <p>{selectedTicket.message}</p>
            </div>
            <p className="font-bold">Response:</p>
            <div className="overflow-y-auto">
              <p>{selectedTicket.response}</p>
            </div>
            <div className="w-full">
              <label className="font-bold" htmlFor="response">
                Response:
              </label>
              <textarea
                onChange={handleChange}
                value={formData.response}
                className="min-h-28 w-full py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base resize-none"
                id="response"
                name="response"
                placeholder="Type your response here..."
              ></textarea>
            </div>
            <select
              name="status"
              id="status"
              value={selectedTicket.status}
              onChange={(e) =>
                setSelectedTicket({
                  ...selectedTicket,
                  status: e.target.value,
                })
              }
              className="w-60 py-2 px-4 bg-white text-black rounded-md text-sm sm:text-base"
            >
              {statuses?.map((status, index) => (
                <option key={index} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <div className="flex justify-start mt-4">
              <button
                onClick={handleRespondSubmit}
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12"
              >
                Submit Response
              </button>
              <button
                onClick={() =>
                  handleUpdateStatus(selectedTicket._id, selectedTicket.status)
                }
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12 ml-4"
              >
                Update Status
              </button>
              <button
                onClick={() => handleDelete(selectedTicket._id)}
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12 ml-4"
              >
                Delete Ticket
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="outline outline-white hover:outline-black bg-black hover:bg-white text-white hover:text-black font-bold rounded-full w-36 sm:w-36 h-12 sm:h-12 ml-4"
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
