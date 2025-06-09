import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col pt-16">
        <section className="py-20 md:py-32 px-6 md:px-12 max-w-7xl mx-auto w-full text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Suivez vos{" "}
              <span className="bg-indigo-600 text-white px-2">habitudes</span>{" "}
              et améliorez votre quotidien.
            </h1>

            <p className="text-lg mb-8 text-foreground/80 max-w-2xl mx-auto">
              MindTrack AI vous aide à suivre vos habitudes quotidiennes, noter
              vos pensées et visualiser vos progrès grâce à des graphiques
              détaillés. Parce que tout ce qui se mesure s&apos;améliore.
            </p>

            <div className="mt-8">
              <Link href="/login">
                <Button className="rounded-full px-8 py-6 bg-indigo-600 hover:bg-indigo-700">
                  Commencer gratuitement
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
