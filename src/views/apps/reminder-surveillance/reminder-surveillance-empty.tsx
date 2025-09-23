import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export const ReminderSurveillanceEmpty = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="p-10 text-center space-y-2">
        <AlertTriangle className="mx-auto h-8 w-8 opacity-60" />
        <div className="text-base font-medium">Tidak ada data yang cocok</div>
        <div className="text-sm text-muted-foreground">
          Coba ubah filter atau kata kunci pencarian.
        </div>
      </CardContent>
    </Card>
  );
};
