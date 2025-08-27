import { NeoFeedResponse } from "@/types/nasa.types";

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY as string;
const BASE_URL =  process.env.NEXT_PUBLIC_BASE_URL as string;

export const fetchNeoFeed = async (
  startDate: string,
  endDate: string
): Promise<NeoFeedResponse> => {
  const url = `${BASE_URL}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch NEO data");

  return res.json();
};