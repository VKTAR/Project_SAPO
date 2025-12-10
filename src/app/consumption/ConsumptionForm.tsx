// src/app/consumption/ConsumptionForm.tsx (Client Component)
'use client'

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client'; // Use client-side Supabase

// Simple type for the component props
interface ConsumptionFormProps {
  userId: string;
}

export default function ConsumptionForm({ userId }: ConsumptionFormProps) {
  const [amount, setAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (amount === '' || amount <= 0) {
      setMessage("Please enter a valid water amount in liters.");
      setLoading(false);
      return;
    }

    // Direct insertion into the water_consumption table
    const { error: insertError } = await supabase
      .from('water_consumption')
      .insert({
        user_id: userId,
        amount_liters: amount,
        notes: notes || null,
      });

    setLoading(false);

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      setMessage(`Failed to save consumption: ${insertError.message}`);
    } else {
      setMessage('Consumption registered successfully!');
      setAmount('');
      setNotes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg shadow-md max-w-lg mx-auto bg-white">
      {/* Tailwind CSS for styling */}
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Amount (Liters)
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes (e.g., Shower, Cooking)
        </label>
        <input
          id="notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Consumption'}
      </button>

      {message && (
        <p className={`mt-3 text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}