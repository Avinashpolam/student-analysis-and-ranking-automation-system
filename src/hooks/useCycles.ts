import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useCycles() {
  return useQuery({
    queryKey: ["cycles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("evaluation_cycles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cycle: TablesInsert<"evaluation_cycles">) => {
      const { data, error } = await supabase.from("evaluation_cycles").insert(cycle).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cycles"] });
      toast.success("Evaluation cycle created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
