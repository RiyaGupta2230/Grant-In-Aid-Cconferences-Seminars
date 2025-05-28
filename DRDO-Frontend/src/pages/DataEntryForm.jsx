import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

const DataEntryForm = () => {
  const [formData, setFormData] = useState({
    dateOpened: '',
    subject: '',
    letterNo: '',
    dated: '',
    commentsBy: '',
    comments: '',           // Added comments field
    status: '',
    amountSanctioned: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://drdo-backend-production.up.railway.app/api/form/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Form submitted successfully!');
        setFormData({
          dateOpened: '',
          subject: '',
          letterNo: '',
          dated: '',
          commentsBy: '',
          comments: '',        // Reset comments
          status: '',
          amountSanctioned: '',
        });
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to submit form'));
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="p-8 max-w-3xl mx-auto flex-grow">
        <h2 className="text-2xl font-semibold mb-6 text-[#02447C]">Enter Grant-In-Aid Conference/Seminar Record</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            name="dateOpened"
            placeholder="Date of Opened"
            value={formData.dateOpened}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="letterNo"
            placeholder="Letter No."
            value={formData.letterNo}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="date"
            name="dated"
            placeholder="Dated"
            value={formData.dated}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <input
            type="text"
            name="commentsBy"
            placeholder="Comments Given By"
            value={formData.commentsBy}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <textarea
            name="comments"
            placeholder="Comments"
            value={formData.comments}
            onChange={handleChange}
            className="border p-2 w-full resize-none"
            rows={4}
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="border p-2 w-full"
          >
            <option value="">Select Status</option>
            <option value="Recommended">Recommended</option>
            <option value="Non-recommended">Non-recommended</option>
          </select>
          <input
            type="number"
            name="amountSanctioned"
            placeholder="Amount Sanctioned (in Rs.)"
            value={formData.amountSanctioned}
            onChange={handleChange}
            className="border p-2 w-full"
          />
          <button
            type="submit"
            className="bg-[#02447C] text-white px-4 py-2 rounded hover:bg-[#035a8c] transition"
          >
            Submit
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default DataEntryForm;
