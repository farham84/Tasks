import { NextResponse } from "next/server";
import axios from "axios";

const API_KEY = "15c7641dff154a93b46efb7ec93caaa6";
const BASE_URL = "https://api.rawg.io/api";

// نام تابع حتما باید GET باشد (با حروف بزرگ)
export async function GET(request: Request) {
  try {
    // 1. دریافت پارامترهای جستجو از URL (مثلا page, search و غیره)
    const { searchParams } = new URL(request.url);
    const queryParams: any = {};
    
    searchParams.forEach((value, key) => {
      queryParams[key] = value;
    });

    // 2. اضافه کردن API Key به پارامترها
    queryParams.key = API_KEY;

    // 3. ارسال درخواست به RAWG
    const response = await axios.get(`${BASE_URL}/games`, {
      params: queryParams,
    });

    // 4. بازگرداندن داده‌ها به فرانت‌اند
    return NextResponse.json(response.data);

  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from RAWG" }, 
      { status: 500 }
    );
  }
}