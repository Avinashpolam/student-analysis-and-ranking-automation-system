import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useSubjects() {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("subjects").select("*").order("code");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddSubject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: TablesInsert<"subjects">) => {
      const { data, error } = await supabase.from("subjects").insert(subject).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects"] });
      toast.success("Subject added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
