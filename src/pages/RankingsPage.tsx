import { useState } from "react";
import { Trophy, RefreshCw } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRankings, useGenerateRankings } from "@/hooks/useRankings";
import { useCycles } from "@/hooks/useCycles";

const classColor = (c: string | null) => {
  if (!c) return "bg-muted text-muted-foreground";
  if (c === "Outstanding") return "bg-accent/15 text-accent";
  if (c === "Distinction") return "bg-primary/10 text-primary";
  if (c === "First Class") return "bg-secondary/20 text-secondary";
  if (c === "Second Class") return "bg-warning/15 text-warning";
  if (c === "Pass") return "bg-muted text-muted-foreground";
  return "bg-destructive/15 text-destructive";
};

const rankBadge = (rank: number | null) => {
  if (rank === 1) return "badge-rank-gold";
  if (rank === 2) return "badge-rank-silver";
  if (rank === 3) return "badge-rank-bronze";
  return "badge-rank bg-muted text-muted-foreground";
};

const RankingsPage = () => {
  const { data: cycles } = useCycles();
  const [selectedCycle, setSelectedCycle] = useState<string>("");
  const { data: rankings, isLoading } = useRankings(selectedCycle);
  const generateRankings = useGenerateRankings();

  return (
    <PageLayout
      title="Rankings"
      subtitle="Auto-generated student rankings with rule-based logic"
      actions={
        <div className="flex items-center gap-3">
          <Select value={selectedCycle} onValueChange={setSelectedCycle}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Select cycle..." /></SelectTrigger>
            <SelectContent>
              {cycles?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} ({c.semester} {c.academic_year})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCycle && (
            <Button onClick={() => generateRankings.mutate(selectedCycle)} disabled={generateRankings.isPending}>
              <RefreshCw className={`w-4 h-4 mr-2 ${generateRankings.isPending ? "animate-spin" : ""}`} />
              Generate Rankings
            </Button>
          )}
        </div>
      }
    >
      {!selectedCycle ? (
        <div className="text-center py-20 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">Select an evaluation cycle to view rankings</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="data-table-header w-20">Rank</TableHead>
                <TableHead className="data-table-header">Student</TableHead>
                <TableHead className="data-table-header">Department</TableHead>
                <TableHead className="data-table-header">Total Marks</TableHead>
                <TableHead className="data-table-header">Percentage</TableHead>
                <TableHead className="data-table-header">GPA</TableHead>
                <TableHead className="data-table-header">Classification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : !rankings?.length ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No rankings yet. Add scores and click "Generate Rankings".</TableCell></TableRow>
              ) : (
                rankings.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell><span className={rankBadge(r.rank)}>{r.rank}</span></TableCell>
                    <TableCell className="font-medium">{r.students?.first_name} {r.students?.last_name}</TableCell>
                    <TableCell className="text-muted-foreground">{r.students?.department}</TableCell>
                    <TableCell className="font-mono">{r.total_marks}</TableCell>
                    <TableCell className="font-mono font-semibold">{r.percentage}%</TableCell>
                    <TableCell className="font-mono">{r.gpa}</TableCell>
                    <TableCell><Badge className={classColor(r.classification)}>{r.classification}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </PageLayout>
  );
};

export default RankingsPage;
