import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const allowedLanguages = [
  "javascript",
  "python",
  "typescript",
  "ruby",
  "java",
  "cpp",
  "go",
  "php",
  "swift",
];

export default function Languages() {
  return (
    <section className="flex flex-wrap gap-8">
      {allowedLanguages.map((lang) => (
        <Link href={`/?language=${lang}`}>
          <Card className="flex h-32 w-32 flex-col items-center justify-center">
            <CardHeader>
              <CardTitle>{lang}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={`https://skillicons.dev/icons?i=${lang}`}
                alt={lang}
                className="h-12 w-12"
              />
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
