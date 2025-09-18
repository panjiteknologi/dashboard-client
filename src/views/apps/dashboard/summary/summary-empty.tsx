import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const SummaryEmpty = ({ errorMessage }: { errorMessage?: string }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-10 text-center space-y-2">
        <AlertTriangle className="mx-auto h-8 w-8 opacity-60" />
        <div className="text-base font-medium">Data tidak ada</div>
        <div className="text-sm text-muted-foreground">
          {errorMessage ?? "Coba refresh atau ubah filter pencarian."}
        </div>
      </CardContent>
    </Card>
  );
};
