import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TablesInsert } from "@/integrations/supabase/types";
import { toast } from "sonner";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("last_name");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: TablesInsert<"students">) => {
      const { data, error } = await supabase.from("students").insert(student).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student added");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
