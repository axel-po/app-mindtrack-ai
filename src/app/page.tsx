import React from "react";
import { Button } from "@/userinterface/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Header } from "@/userinterface/components/@shared/nav/header";
import { BrainCircuit, LineChart, Sparkles, Zap, Users } from "lucide-react";

export default async function HomePage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <Header />
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
        <main className="flex-1 flex flex-col pt-16">
          {/* Hero Section */}
          <section className="py-24 md:py-32 px-6 md:px-12 mx-auto w-full relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

            <div className="max-w-3xl mx-auto relative z-10">
              <div className="flex items-center justify-center mb-6">
                <span className="bg-indigo-500/10 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full flex items-center">
                  <Sparkles className="size-3.5 mr-1" />
                  Nouvelle version 2.0
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
                Suivez vos{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1 text-white rounded-md">
                    habitudes
                  </span>
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 blur-sm"></span>
                </span>{" "}
                et améliorez votre quotidien.
              </h1>

              <p className="text-lg mb-10 text-foreground/80 max-w-2xl mx-auto text-center">
                MindTrack AI vous aide à suivre vos habitudes quotidiennes,
                noter vos pensées et visualiser vos progrès grâce à des
                graphiques détaillés. Parce que tout ce qui se mesure
                s&apos;améliore.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link href="/login">
                  <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02]">
                    Commencer gratuitement
                    <Zap className="ml-2 size-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full relative">
            {/* Background decorative elements */}
            <div className="absolute top-40 right-20 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />

            <div className="text-center mb-16 relative z-10">
              <div className="inline-block mb-3">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium px-4 py-1 rounded-full border border-indigo-500/20">
                  FONCTIONNALITÉS PREMIUM
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pourquoi choisir{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  MindTrack AI
                </span>
                ?
              </h2>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Des outils puissants conçus par des experts en psychologie pour
                transformer vos habitudes et améliorer durablement votre
                bien-être mental.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-gradient-to-br from-background to-white/5 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-4 rounded-xl inline-block mb-5 relative z-10">
                  <BrainCircuit className="size-7 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 relative z-10">
                  Intelligence artificielle
                </h3>
                <p className="text-foreground/70 mb-4 relative z-10">
                  Notre IA analyse vos habitudes et identifie des modèles pour
                  vous proposer des recommandations personnalisées qui
                  améliorent votre quotidien.
                </p>
                <div className="flex items-center text-xs text-indigo-500 font-medium relative z-10">
                  <span>Explorer cette fonctionnalité</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-background to-white/5 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-4 rounded-xl inline-block mb-5 relative z-10">
                  <LineChart className="size-7 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 relative z-10">
                  Visualisations dynamiques
                </h3>
                <p className="text-foreground/70 mb-4 relative z-10">
                  Des graphiques interactifs et personnalisables pour visualiser
                  vos progrès en temps réel et rester motivé sur le long terme.
                </p>
                <div className="flex items-center text-xs text-indigo-500 font-medium relative z-10">
                  <span>Explorer cette fonctionnalité</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-background to-white/5 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
                <div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 p-4 rounded-xl inline-block mb-5 relative z-10">
                  <Users className="size-7 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 relative z-10">
                  Communauté engagée
                </h3>
                <p className="text-foreground/70 mb-4 relative z-10">
                  Rejoignez une communauté active de plus de 10 000 utilisateurs
                  qui partagent leurs progrès et s&apos;encouragent
                  mutuellement.
                </p>
                <div className="flex items-center text-xs text-indigo-500 font-medium relative z-10">
                  <span>Explorer cette fonctionnalité</span>
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link href="/features">
                <Button
                  variant="outline"
                  className="rounded-full px-8 py-6 border-indigo-500/20 hover:bg-white/5 transition-colors"
                >
                  Découvrir toutes nos fonctionnalités
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24 px-6 md:px-12 w-full relative overflow-hidden">
            {/* Background decorative elements - supprimés */}

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block mb-3">
                  <span className="text-indigo-600 text-sm font-medium px-4 py-1 rounded-full border border-indigo-500/20">
                    TARIFS TRANSPARENTS
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Choisissez le forfait qui vous{" "}
                  <span className="text-indigo-600">correspond</span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Des options flexibles pour tous les besoins. Commencez
                  gratuitement et évoluez à votre rythme.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-8 justify-center relative">
                {/* Free Plan */}
                <div className="group bg-background p-8 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl flex flex-col w-full md:w-80 relative overflow-hidden">
                  <h3 className="text-xl font-bold mb-1 relative z-10">
                    Gratuit
                  </h3>
                  <p className="text-foreground/70 text-sm mb-6">
                    Parfait pour débuter
                  </p>

                  <div className="mb-8 relative z-10">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">0€</span>
                      <span className="text-foreground/60 ml-2">/mois</span>
                    </div>
                  </div>

                  <ul className="mb-8 flex-grow space-y-4 relative z-10">
                    <li className="flex items-center">
                      <svg
                        className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Suivi de 3 habitudes</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Journal quotidien</span>
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Graphiques de base</span>
                    </li>
                  </ul>

                  <Link href="/register" className="mt-auto relative z-10">
                    <Button
                      variant="outline"
                      className="w-full rounded-full py-6 border-indigo-500/20 hover:bg-white/5 transition-colors"
                    >
                      Commencer gratuitement
                    </Button>
                  </Link>
                </div>

                {/* Premium Plan - Highlighted */}
                <div className="relative md:scale-105 z-20 my-4 md:my-0">
                  {/* Bordure simple au lieu d'un dégradé */}
                  <div className="absolute -inset-1.5 border-2 border-indigo-500 rounded-3xl"></div>

                  <div className="group bg-background p-10 rounded-2xl border border-indigo-500/20 shadow-xl relative flex flex-col w-full md:w-80">
                    <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
                      POPULAIRE
                    </div>

                    <h3 className="text-xl font-bold mb-1">Premium</h3>
                    <p className="text-foreground/70 text-sm mb-6">
                      Pour les utilisateurs sérieux
                    </p>

                    <div className="mb-8">
                      <div className="flex items-baseline">
                        <span className="text-5xl font-bold">9.99€</span>
                        <span className="text-foreground/60 ml-2">/mois</span>
                      </div>
                    </div>

                    <ul className="mb-8 flex-grow space-y-4">
                      <li className="flex items-center">
                        <svg
                          className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Habitudes illimitées</span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Journal avancé avec tags</span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Analyses IA personnalisées</span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="size-5 mr-3 text-indigo-500 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>Graphiques interactifs avancés</span>
                      </li>
                    </ul>

                    <Link href="/register" className="mt-auto">
                      <Button className="w-full rounded-full py-6 bg-indigo-600 hover:bg-indigo-500 border-none shadow-lg transition-all hover:shadow-lg hover:scale-[1.02]">
                        S&apos;abonner maintenant
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <p className="text-foreground/60 text-sm">
                  Tous les prix sont en euros (EUR) et incluent la TVA. Annulez
                  à tout moment.
                </p>
                <p className="text-foreground/60 text-sm mt-1">
                  <Link
                    href="/pricing"
                    className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                  >
                    Voir tous les détails des forfaits →
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 md:px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <BrainCircuit className="size-6 text-indigo-500 mr-2" />
                <span className="font-bold">MindTrack AI</span>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-4 justify-center md:justify-end text-sm text-foreground/70">
                <Link
                  href="/about"
                  className="hover:text-indigo-400 transition-colors"
                >
                  À propos
                </Link>
                <Link
                  href="/features"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Fonctionnalités
                </Link>
                <Link
                  href="/pricing"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Tarifs
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Confidentialité
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-indigo-400 transition-colors"
                >
                  Conditions d&apos;utilisation
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
              <p>
                © 2025 MindTrack AI. Tous droits réservés. - Projet annuel ESGI
                M1
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Link
                  href="#"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <svg
                    className="size-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
