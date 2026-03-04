import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { calculateGrade } from "@/lib/ranking-engine";

export function useScores(cycleId?: string) {
  return useQuery({
    queryKey: ["scores", cycleId],
    queryFn: async () => {
      let query = supabase
        .from("scores")
        .select("*, students(*), subjects(*)")
        .order("created_at", { ascending: false });
      if (cycleId) query = query.eq("cycle_id", cycleId);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!cycleId,
  });
}

export function useAddScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (score: TablesInsert<"scores"> & { max_marks: number }) => {
      const grade = calculateGrade(score.marks_obtained, score.max_marks);
      const { max_marks, ...scoreData } = score;
      const { data, error } = await supabase
        .from("scores")
        .insert({ ...scoreData, grade })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["scores"] });
      toast.success("Score recorded");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
