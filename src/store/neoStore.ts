import { create } from "zustand";
import { fetchNeoFeed } from "@/api/nasaApi";
import { NeoFeedResponse } from "@/types/nasa.types";

interface NeoStoreState {
  data: NeoFeedResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: (startDate: string, endDate: string) => Promise<void>;
}

export const useNeoStore = create<NeoStoreState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchNeoFeed(startDate, endDate);
      set({ data, loading: false });
      //eslint-disable-next-line
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));
