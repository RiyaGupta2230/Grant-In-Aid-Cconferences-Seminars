// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";

import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Dashboard = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch(`https://drdo-backend-production.up.railway.app/api/dashboard/`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to fetch records:", err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: newStatus } : rec))
    );

    const record = records.find((r) => r.id === id);
    fetch(
      `https://drdo-backend-production.up.railway.app/api/dashboard/update/${record.letterNo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    ).catch((err) => console.error("Status update failed:", err));
  };

  const handleCommentsChange = (id, newComment) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, comments: newComment } : rec))
    );
  };

  const handleCommentsGivenByChange = (id, newName) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, commentsGivenBy: newName } : rec
      )
    );
  };

  const handleSendComment = (id) => {
    const record = records.find((r) => r.id === id);
    if (record.comments.trim() === "") {
      alert("Please enter a comment before sending.");
      return;
    }
    if (record.commentsGivenBy.trim() === "") {
      alert("Please enter the name in 'Comments Given By' before sending.");
      return;
    }

    fetch(
      `https://drdo-backend-production.up.railway.app/api/dashboard/update/${record.letterNo}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comments: record.comments,
          commentsGivenBy: record.commentsGivenBy,
        }),
      }
    )
      .then((res) => res.json())
      .then(() => {
        alert(
          `Comments sent for record with Letter No "${record.letterNo}":\n${record.comments}\nComments Given By: ${record.commentsGivenBy}`
        );
        setRecords((prev) =>
          prev.map((rec) =>
            rec.id === id ? { ...rec, comments: "", commentsGivenBy: "" } : rec
          )
        );
      })
      .catch((err) => console.error("Comment update failed:", err));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-8 flex-grow max-w-full overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[#02447C]">
          Grant-In-Aid Conferences / Seminars Records
        </h2>
        <table className="w-full border text-sm bg-white shadow table-auto min-w-[1200px]">
          <thead className="bg-[#02447C] text-white">
            <tr>
              <th className="border p-2">S.No.</th>
              <th className="border p-2">Date of Opened</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Letter No.</th>
              <th className="border p-2">Dated</th>
              <th className="border p-2">Comments Given By</th>
              <th className="border p-2">Comments</th> {/* Moved here */}
              <th className="border p-2">Status</th>
              <th className="border p-2">Amount Sanction (in Rs.)</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr key={record.id} className="hover:bg-blue-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{record.dateOfOpened}</td>
                <td className="border p-2">{record.subject}</td>
                <td className="border p-2">{record.letterNo}</td>
                <td className="border p-2">{record.dated}</td>
                <td className="border p-2">
                  <input
                    type="text"
                    value={record.commentsGivenBy || ""}
                    onChange={(e) =>
                      handleCommentsGivenByChange(record.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                    placeholder="Comments Given By"
                  />
                </td>
                <td className="border p-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={record.comments || ""}
                      onChange={(e) =>
                        handleCommentsChange(record.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 w-full"
                      placeholder="Add comment"
                    />
                    <button
                      onClick={() => handleSendComment(record.id)}
                      className="bg-[#02447C] text-white px-3 rounded hover:bg-[#035a8c] transition"
                    >
                      Send
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  <select
                    value={record.status}
                    onChange={(e) =>
                      handleStatusChange(record.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="Recommended">Recommended</option>
                    <option value="Non-recommended">Non-recommended</option>
                  </select>
                </td>
                <td className="border p-2">{record.amountSanctioned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
