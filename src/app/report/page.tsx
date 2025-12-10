// src/app/report/page.tsx

import { createServerSupabaseClient } from '@/lib/supabase/server';
import ReportForm from './ReportForm';

export default async function ReportPage() {

    const supabase = createServerSupabaseClient(); // Pass to client

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <p>Please log in to submit a report.</p>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-red-700">Report Water-Related Issue</h1>
            <ReportForm userId={user.id} />
        </div>
    );
}