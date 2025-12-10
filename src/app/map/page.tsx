// src/app/map/page.tsx (CORRECTED INTERFACE AND CAST)

import { createServerSupabaseClient } from '@/lib/supabase/server';

import MapComponent from './MapComponent';

// This interface is for the raw data from Supabase, which can be null
interface ReportRaw {
 id: string;
 issue_type: string;
 description: string | null;
 latitude: number | null; // <-- Can be null
 longitude: number | null; // <-- Can be null
}

export default async function MapPage() {
 const supabase = createServerSupabaseClient(); // Pass to client

 const { data: reports, error } = await supabase
   .from('reports')
   .select('id, issue_type, description, latitude, longitude')
   .not('latitude', 'is', null)
   .not('longitude', 'is', null)
   .returns<ReportRaw[]>(); // <-- Use the raw type here

 if (error) {
   console.error("Error fetching reports for map:", error);
   return <p className="text-red-500 p-8">Error loading map data: {error.message}</p>;
 }

 // Filter out nulls, and then cast to the component's non-null required type
 const mapData = reports.filter(r => r.latitude && r.longitude) as any; // Cast as 'any' to force the correct type inference

 return (
   <div className="h-screen w-full">
     <h1 className="text-2xl font-bold p-4 text-center">Community Issue Map</h1>
     <div className="h-[90%] w-full">
       <MapComponent reports={mapData} />
     </div>
   </div>
 );
}