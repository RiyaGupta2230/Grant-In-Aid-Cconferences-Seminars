import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { BASE_URL } from '../Config'

const DataEntryForm = () => {
  const [formData, setFormData] = useState({
    dateOpened: '',
    subject: '',
    letterNo: '',
    dated: '',
    commentsBy: '',
    comments: '',
    status: '',
    amountSanctioned: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/form/drdotwo/records`, {
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
          comments: '',
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
          <input type="date" name="dateOpened" value={formData.dateOpened} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="border p-2 w-full" placeholder="Subject" />
          <input type="text" name="letterNo" value={formData.letterNo} onChange={handleChange} className="border p-2 w-full" placeholder="Letter No." />
          <input type="date" name="dated" value={formData.dated} onChange={handleChange} className="border p-2 w-full" />
          <input type="text" name="commentsBy" value={formData.commentsBy} onChange={handleChange} className="border p-2 w-full" placeholder="Comments Given By" />
          <textarea name="comments" value={formData.comments} onChange={handleChange} className="border p-2 w-full resize-none" rows={4} placeholder="Comments" />
          <select name="status" value={formData.status} onChange={handleChange} className="border p-2 w-full">
            <option value="">Select Status</option>
            <option value="Recommended">Recommended</option>
            <option value="Non-recommended">Non-recommended</option>
          </select>
          <input type="number" name="amountSanctioned" value={formData.amountSanctioned} onChange={handleChange} className="border p-2 w-full" placeholder="Amount Sanctioned (in Rs.)" />
          <button type="submit" className="bg-[#02447C] text-white px-4 py-2 rounded hover:bg-[#035a8c]">Submit</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default DataEntryForm;
