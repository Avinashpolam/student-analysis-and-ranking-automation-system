import { format } from "date-fns";
import { History } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuditLogs } from "@/hooks/useAuditLogs";

const actionColor = (action: string) => {
  if (action === "INSERT") return "bg-accent/15 text-accent";
  if (action === "UPDATE") return "bg-secondary/20 text-secondary";
  if (action === "DELETE") return "bg-destructive/15 text-destructive";
  return "bg-muted text-muted-foreground";
};

const AuditPage = () => {
  const { data: logs, isLoading } = useAuditLogs();

  return (
    <PageLayout title="Audit Log" subtitle="Track all changes for compliance reporting">
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="data-table-header">Timestamp</TableHead>
              <TableHead className="data-table-header">Action</TableHead>
              <TableHead className="data-table-header">Table</TableHead>
              <TableHead className="data-table-header">Record ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !logs?.length ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <History className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>No audit records yet. Changes will appear here automatically.</p>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {format(new Date(log.performed_at), "MMM dd, yyyy HH:mm:ss")}
                  </TableCell>
                  <TableCell><Badge className={actionColor(log.action)}>{log.action}</Badge></TableCell>
                  <TableCell className="font-medium capitalize">{log.table_name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{log.record_id?.slice(0, 8)}...</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default AuditPage;
