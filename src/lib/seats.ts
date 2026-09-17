import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BATCH } from "@/data/site";

export type SeatState = {
  capacity: number;
  filled: number;
  remaining: number;
  full: boolean;
  loading: boolean;
};

const fallback: SeatState = {
  capacity: BATCH.capacity,
  filled: 0,
  remaining: BATCH.capacity,
  full: false,
  loading: true,
};

/** Live seat availability for the current cohort (paid members only). */
export function useSeats(): SeatState {
  const [state, setState] = useState<SeatState>(fallback);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase.rpc("seat_summary");
      const row = Array.isArray(data) ? data[0] : data;
      if (cancelled) return;
      if (error || !row) {
        setState({ ...fallback, loading: false });
        return;
      }
      const capacity = Number(row.capacity) || BATCH.capacity;
      const filled = Math.min(Number(row.filled) || 0, capacity);
      setState({
        capacity,
        filled,
        remaining: Math.max(capacity - filled, 0),
        full: filled >= capacity || row.status === "full" || row.status === "closed",
        loading: false,
      });
    }

    void load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  return state;
}
