from fastapi import FastAPI
from pydantic import BaseModel
from supabase import create_client, Client
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # you can restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Pydantic Models ----------

class SensorData(BaseModel):
    sensor_id: str
    value: float
    reading_type: str = "flow"


class Report(BaseModel):
    user_id: str
    issue_type: str
    description: str = None
    latitude: float = None
    longitude: float = None


class WaterEntry(BaseModel):
    user_id: str
    amount_liters: float
    notes: str = None


# ---------- Routes ----------

@app.post("/sensor-data")
def receive_sensor_data(data: SensorData):
    res = supabase.table("sensor_readings").insert({
        "sensor_id": data.sensor_id,
        "value": data.value,
        "reading_type": data.reading_type
    }).execute()
    
    return {"status": "success", "data": res.data}


@app.post("/report")
def create_report(report: Report):
    res = supabase.table("reports").insert({
        "user_id": report.user_id,
        "issue_type": report.issue_type,
        "description": report.description,
        "latitude": report.latitude,
        "longitude": report.longitude
    }).execute()
    
    return {"status": "success", "data": res.data}


@app.post("/water")
def add_water_entry(entry: WaterEntry):
    res = supabase.table("water_consumption").insert({
        "user_id": entry.user_id,
        "amount_liters": entry.amount_liters,
        "notes": entry.notes
    }).execute()
    
    return {"status": "success", "data": res.data}


@app.get("/")
def root():
    return {"message": "SAPO API is running"}
