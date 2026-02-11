import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = "15c7641dff154a93b46efb7ec93caaa6";
const BASE_URL = "https://api.rawg.io/api";

export async function GET() {
  try {
    const response = await axios.get(`${BASE_URL}/genres`, {
      params: { key: API_KEY },
    });
    return NextResponse.json(response.data.results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
}