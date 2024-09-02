import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardLayout } from "@/utils/classnames";
import { allowedLanguages } from "@/utils/constants";

// TODO: in this page add a button below for user to make a request to add more programming language
export default function Languages() {
  return (
    <section className={cn(cardLayout)}>
      <h1 className="mb-4 text-2xl font-bold text-gray-600">
        Popular Languages
      </h1>
      <div className="flex flex-wrap gap-8">
        {allowedLanguages.map((lang) => (
          <Link href={`/?language=${lang}`} key={lang}>
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
      </div>
    </section>
  );
}
