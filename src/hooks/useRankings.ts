import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { computeRankings, type ScoreEntry } from "@/lib/ranking-engine";
import { toast } from "sonner";

export function useRankings(cycleId?: string) {
  return useQuery({
    queryKey: ["rankings", cycleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rankings")
        .select("*, students(*)")
        .eq("cycle_id", cycleId!)
        .order("rank");
      if (error) throw error;
      return data;
    },
    enabled: !!cycleId,
  });
}

export function useGenerateRankings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cycleId: string) => {
      // Fetch all scores for cycle with subject info
      const { data: scores, error: scoresErr } = await supabase
        .from("scores")
        .select("*, subjects(*)")
        .eq("cycle_id", cycleId);
      if (scoresErr) throw scoresErr;

      // Group by student
      const studentScores = new Map<string, ScoreEntry[]>();
      scores?.forEach((s) => {
        const entries = studentScores.get(s.student_id) || [];
        entries.push({
          student_id: s.student_id,
          marks_obtained: s.marks_obtained,
          max_marks: s.subjects?.max_marks ?? 100,
          credits: s.subjects?.credits ?? 3,
        });
        studentScores.set(s.student_id, entries);
      });

      const rankings = computeRankings(studentScores);

      // Delete existing rankings for this cycle
      await supabase.from("rankings").delete().eq("cycle_id", cycleId);

      // Insert new rankings
      const { error } = await supabase.from("rankings").insert(
        rankings.map((r) => ({
          student_id: r.student_id,
          cycle_id: cycleId,
          total_marks: r.total_marks,
          percentage: r.percentage,
          gpa: r.gpa,
          rank: r.rank,
          classification: r.classification,
        }))
      );
      if (error) throw error;
      return rankings;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rankings"] });
      toast.success("Rankings generated successfully");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
