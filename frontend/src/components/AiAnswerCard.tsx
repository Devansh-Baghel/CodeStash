import { Button } from "@nextui-org/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function AiAnswerCard({ aiAnswer }: { aiAnswer?: string }) {
  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-col text-center">
        <CardTitle className="text-xl">✨ AI Explanation ✨</CardTitle>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-10">
        {/* TODO: show button to get ai explanation here */}
        {aiAnswer ? aiAnswer : "Generating AI Explanation..."}
      </CardContent>
    </Card>
  );
}
