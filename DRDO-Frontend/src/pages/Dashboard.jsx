import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { BASE_URL } from "../Config";
import { usePDF } from "react-to-pdf";

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [storedSite, setStoredSite] = useState("drdotwo");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { toPDF, targetRef } = usePDF({
    filename: "record-report.pdf",
    page: { margin: 20, format: "A4" },
  });

  useEffect(() => {
    const site = localStorage.getItem("site") || "drdotwo";
    setStoredSite(site);

    fetch(`${BASE_URL}/api/dashboard/${site}/`)
      .then((res) => res.json())
      .then((data) => setRecords(data))
      .catch((err) => console.error("Failed to fetch records:", err));
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    const record = records.find((r) => r.id === id);
    fetch(`${BASE_URL}/dashboard/update/${record.letterNo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).catch((err) => console.error("Status update failed:", err));
  };

  const handleCommentsChange = (id, newComment) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, comments: newComment } : rec))
    );
  };

  const handleCommentsGivenByChange = (id, newName) => {
    setRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, commentsGivenBy: newName } : rec))
    );
  };

  const handleSendComment = (id) => {
    const record = records.find((r) => r.id === id);
    if (!record.comments.trim() || !record.commentsGivenBy.trim()) {
      return alert("Fill out both comment and comment-by fields.");
    }

    fetch(`${BASE_URL}/dashboard/update/${record.letterNo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comments: record.comments,
        commentsGivenBy: record.commentsGivenBy,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        alert(`Comment sent for Letter No. "${record.letterNo}"`);
        setRecords((prev) =>
          prev.map((rec) =>
            rec.id === id ? { ...rec, comments: "", commentsGivenBy: "" } : rec
          )
        );
      })
      .catch((err) => console.error("Comment update failed:", err));
  };

  const filterRecordsByDate = () => {
    if (!dateRange.start || !dateRange.end) {
      alert("Please select both start and end dates");
      return;
    }

    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    if (startDate > endDate) {
      alert("Start date cannot be after end date");
      return;
    }

    const filtered = records.filter((rec) => {
      const recDate = new Date(rec.dateOfOpened);
      return recDate >= startDate && recDate <= endDate;
    });

    setFilteredRecords(filtered);
    setIsFiltered(true);
  };

  const resetDateFilter = () => {
    setDateRange({ start: "", end: "" });
    setIsFiltered(false);
    setFilteredRecords([]);
  };

  const generatePdf = (record) => {
    setSelectedRecord(record);
    setTimeout(() => {
      toPDF();
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-8 flex-grow overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4 text-[#02447C]">
          Grant-In-Aid Conference/Seminar Records
        </h2>

        {/* Date Filter Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label>From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <label>To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
          </div>
          <button
            onClick={filterRecordsByDate}
            className="bg-[#02447C] text-white px-4 py-1 rounded hover:bg-[#035a8c] transition"
          >
            Filter
          </button>
          {isFiltered && (
            <button
              onClick={resetDateFilter}
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Table */}
        <table className="w-full border text-sm bg-white shadow table-auto min-w-[1300px]">
          <thead className="bg-[#02447C] text-white">
            <tr>
              <th className="border p-2">S.No.</th>
              <th className="border p-2">Date Opened</th>
              <th className="border p-2">Dated</th>
              <th className="border p-2">Letter No</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Amount Sanctioned (in Rs.)</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Comments</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(isFiltered ? filteredRecords : records).map((rec, idx) => (
              <tr key={rec.id} className="hover:bg-blue-50">
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{rec.dateOfOpened || "N/A"}</td>
                <td className="border p-2">{rec.dated || "N/A"}</td>
                <td className="border p-2">{rec.letterNo}</td>
                <td className="border p-2">{rec.subject}</td>
                <td className="border p-2">{rec.amountSanctioned || "N/A"}</td>
                <td className="border p-2">
                  <select
                    value={rec.status}
                    onChange={(e) =>
                      handleStatusChange(rec.id, e.target.value)
                    }
                    className="border rounded px-2 py-1 w-full"
                  >
                    <option value="In Process">In Process</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="border p-2">
                  <div className="flex flex-col gap-1">
                    {rec.comments && (
                      <div className="text-xs p-1 bg-gray-100 rounded">
                        {rec.comments}
                      </div>
                    )}
                    <input
                      type="text"
                      value={rec.comments || ""}
                      onChange={(e) =>
                        handleCommentsChange(rec.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 mb-1"
                      placeholder="New comment"
                    />
                    <input
                      type="text"
                      value={rec.commentsGivenBy || ""}
                      onChange={(e) =>
                        handleCommentsGivenByChange(rec.id, e.target.value)
                      }
                      className="border rounded px-2 py-1 mb-1"
                      placeholder="Comment by"
                    />
                    <button
                      onClick={() => handleSendComment(rec.id)}
                      className="bg-[#02447C] text-white px-3 rounded hover:bg-[#035a8c] transition"
                    >
                      Send
                    </button>
                  </div>
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => generatePdf(rec)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => alert(`Viewing ${rec.letterNo}`)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                    >
                      View
                    </button>
                    <button
                      onClick={() => alert(`Deleting ${rec.letterNo}`)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PDF Template (off-screen) */}
        <div
          ref={targetRef}
          style={{ position: "absolute", left: "-9999px", width: "210mm" }}
          className="p-8 bg-white"
        >
          {selectedRecord && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#02447C]">
                  RECORD REPORT
                </h1>
                <h2 className="text-xl font-semibold">
                  {selectedRecord.subject}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="font-semibold">Letter No:</p>
                  <p>{selectedRecord.letterNo || "N/A"}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-semibold">Status:</p>
                  <p>{selectedRecord.status}</p>
                </div>
              </div>

              {selectedRecord.comments && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold border-b pb-1">
                    Comments:
                  </h3>
                  <p className="whitespace-pre-line mt-2">
                    {selectedRecord.comments}
                  </p>
                </div>
              )}

              <div className="mt-8 text-sm text-gray-500 text-right">
                <p>Generated on: {new Date().toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
