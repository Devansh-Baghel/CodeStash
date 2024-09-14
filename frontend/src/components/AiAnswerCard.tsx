import { Button } from "@nextui-org/react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Markdown from "markdown-to-jsx";
import MarkdownPreview from "@uiw/react-markdown-preview";

export default function AiAnswerCard({ aiAnswer }: { aiAnswer?: string }) {
  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-col text-center">
        <CardTitle className="text-xl">✨ AI Explanation ✨</CardTitle>
      </CardHeader>
      <CardContent className="max-w-[700px]">
        {/* TODO: show button to get ai explanation here */}
        {aiAnswer ? (
          //   <Markdown>{aiAnswer}</Markdown>
          <MarkdownPreview source={aiAnswer} />
        ) : (
          "Generating AI Explanation..."
        )}
      </CardContent>
    </Card>
  );
}
