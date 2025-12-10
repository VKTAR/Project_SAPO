// src/app/report/ReportForm.tsx (Content Added)
'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface ReportFormProps {
  userId: string;
}

const ISSUE_TYPES = [
    { value: 'fuga', label: 'Leak (Fuga)' },
    { value: 'contaminacion', label: 'Contamination (Contaminación)' },
    { value: 'baja_presion', label: 'Low Pressure (Baja Presión)' },
    { value: 'otro', label: 'Other (Otro)' },
];

export default function ReportForm({ userId }: ReportFormProps) {
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0].value);
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lon, setLon] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (description.length < 10) {
        setMessage("Please provide a more detailed description.");
        setLoading(false);
        return;
    }

    const { error: insertError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        issue_type: issueType,
        description: description,
        latitude: lat || null,
        longitude: lon || null,
      });

    setLoading(false);

    if (insertError) {
      setMessage(`Failed to submit report: ${insertError.message}`);
    } else {
      setMessage('Issue reported successfully! Thank you for your participation.');
      setDescription('');
      setLat('');
      setLon('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md max-w-lg mx-auto bg-white">
      
      <div className="mb-4">
        <label htmlFor="issue_type" className="block text-sm font-medium text-gray-700">Issue Type</label>
        <select
          id="issue_type"
          value={issueType}
          onChange={(e) => setIssueType(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
        >
          {ISSUE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Detailed Description</label>
        <textarea
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
        ></textarea>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude (Optional)</label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={lat}
            onChange={(e) => setLat(parseFloat(e.target.value) || '')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude (Optional)</label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={lon}
            onChange={(e) => setLon(parseFloat(e.target.value) || '')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-red-500 focus:border-red-500 p-2 border"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Report'}
      </button>

      {message && (
        <p className={`mt-3 text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}