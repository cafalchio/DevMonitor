import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function SystemStatus({ allOnline }: { allOnline: boolean }) {
    return (
        <Card className="mb-4">
            <CardContent className="flex items-center justify-between p-3">
                <span className="font-medium">System Status:</span>
                {allOnline ? (
                    <Badge className="bg-green-500 text-white">
                        All Online
                    </Badge>
                ) : (
                    <Badge className="bg-red-500 text-white">
                        Issues Detected
                    </Badge>
                )}
            </CardContent>
        </Card>
    )
}
