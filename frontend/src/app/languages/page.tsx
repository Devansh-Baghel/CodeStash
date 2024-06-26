import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
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
    <section className="flex flex-wrap gap-10">
      {allowedLanguages.map((lang) => (
        <Link href={`/?language=${lang}`}>
          <Card className="h-32 w-32">
            <CardHeader>
              <CardTitle>{lang}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={`https://skillicons.dev/icons?i=${lang}`} alt={lang} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </section>
  );
}
