// src/app/consumption/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server';

import ConsumptionForm from './ConsumptionForm'; // <-- THIS IS THE MISSING IMPORT

export default async function ConsumptionPage() { // Note: Renamed from DashboardPage in your code snippet

    const supabase = createServerSupabaseClient(); 

    // Fetch user data
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <p>Please log in to register consumption.</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Register Water Use</h1>
            {/* Pass the logged-in user ID to the client component */}
            <ConsumptionForm userId={user.id} />
        </div>
    );
}