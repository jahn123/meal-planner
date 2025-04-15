import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export default function PlanView() {
  return (
    <div>
      <Card className='card'>
        <CardHeader>
          <CardTitle className=''>$planName</CardTitle>
        </CardHeader>
        <CardContent>
          hello
        </CardContent>
      </Card>
    </div>
  );
}