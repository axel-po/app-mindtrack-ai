import React from "react";
import { Button } from "@/userinterface/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Header } from "@/userinterface/components/@shared/nav/header";
import {
  BrainCircuit,
  LineChart,
  Sparkles,
  Zap,
  Users,
  Star,
  Quote,
} from "lucide-react";

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
          <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto w-full relative overflow-hidden">
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
                <Link href="/features">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-6 border-indigo-500/20 hover:bg-white/5 transition-colors"
                  >
                    Découvrir les fonctionnalités
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

          {/* Testimonials Section */}
          <section className="py-24 px-6 md:px-12 w-full bg-gradient-to-b from-background/95 to-background relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block mb-3">
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent text-sm font-medium px-4 py-1 rounded-full border border-amber-500/20">
                    TÉMOIGNAGES
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ce que disent nos{" "}
                  <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                    utilisateurs
                  </span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Découvrez comment MindTrack AI a transformé la vie quotidienne
                  de milliers d&apos;utilisateurs à travers le monde.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5 relative">
                  <Quote className="absolute top-6 right-6 size-10 text-amber-500/10" />
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 text-amber-500 fill-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-6 italic">
                    &ldquo;Depuis que j&apos;utilise MindTrack AI, j&apos;ai
                    réussi à établir une routine matinale solide.
                    L&apos;application m&apos;a aidé à rester motivé et à
                    visualiser mes progrès jour après jour.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      M
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Marie L.</p>
                      <p className="text-sm text-foreground/60">
                        Utilisatrice depuis 8 mois
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5 relative md:translate-y-4">
                  <Quote className="absolute top-6 right-6 size-10 text-amber-500/10" />
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 text-amber-500 fill-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-6 italic">
                    &ldquo;Les graphiques de suivi d&apos;humeur ont été
                    révélateurs pour moi. J&apos;ai pu identifier des schémas
                    dans mon bien-être mental et ajuster mes habitudes en
                    conséquence. Un outil incroyable !&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      T
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Thomas R.</p>
                      <p className="text-sm text-foreground/60">
                        Utilisateur depuis 1 an
                      </p>
                    </div>
                  </div>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-amber-500/10 hover:border-amber-500/30 transition-all hover:shadow-xl hover:shadow-amber-500/5 relative">
                  <Quote className="absolute top-6 right-6 size-10 text-amber-500/10" />
                  <div className="flex items-center mb-6">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-4 text-amber-500 fill-amber-500"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-foreground/80 mb-6 italic">
                    &ldquo;La communauté MindTrack est incroyablement motivante.
                    Partager mes objectifs avec d&apos;autres utilisateurs
                    m&apos;a aidé à rester responsable et à célébrer mes petites
                    victoires quotidiennes.&rdquo;
                  </p>
                  <div className="flex items-center">
                    <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      S
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">Sophie D.</p>
                      <p className="text-sm text-foreground/60">
                        Utilisatrice depuis 6 mois
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 text-center">
                <div className="inline-flex items-center bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-amber-500/20">
                  <span className="text-foreground/70 mr-2">Note moyenne:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="size-4 text-amber-500 fill-amber-500"
                      />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold">4.9/5</span>
                  <span className="text-foreground/60 ml-2 text-sm">
                    (basée sur 2,384 avis)
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="py-24 px-6 md:px-12 w-full relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-40 left-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <div className="inline-block mb-3">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-sm font-medium px-4 py-1 rounded-full border border-indigo-500/20">
                    TARIFS TRANSPARENTS
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Choisissez le forfait qui vous{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    correspond
                  </span>
                </h2>
                <p className="text-foreground/70 max-w-2xl mx-auto">
                  Des options flexibles pour tous les besoins. Commencez
                  gratuitement et évoluez à votre rythme.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Gratuit</h3>
                    <p className="text-foreground/70 text-sm">
                      Parfait pour débuter
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">0€</span>
                    <span className="text-foreground/60 ml-1">/mois</span>
                  </div>

                  <ul className="mb-8 flex-grow space-y-4">
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                    <li className="flex items-start text-foreground/50">
                      <svg
                        className="size-5 mr-3 text-foreground/30 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Analyses avancées</span>
                    </li>
                    <li className="flex items-start text-foreground/50">
                      <svg
                        className="size-5 mr-3 text-foreground/30 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <span>Fonctionnalités communautaires</span>
                    </li>
                  </ul>

                  <Link href="/register" className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full rounded-full py-6 border-indigo-500/20 hover:bg-white/5 transition-colors"
                    >
                      Commencer gratuitement
                    </Button>
                  </Link>
                </div>

                {/* Premium Plan - Highlighted */}
                <div className="relative">
                  {/* Highlight effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur-sm opacity-70" />

                  <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20 shadow-xl relative flex flex-col h-full">
                    <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      POPULAIRE
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">Premium</h3>
                      <p className="text-foreground/70 text-sm">
                        Pour les utilisateurs sérieux
                      </p>
                    </div>

                    <div className="mb-6">
                      <span className="text-4xl font-bold">9.99€</span>
                      <span className="text-foreground/60 ml-1">/mois</span>
                    </div>

                    <ul className="mb-8 flex-grow space-y-4">
                      <li className="flex items-start">
                        <svg
                          className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <li className="flex items-start">
                        <svg
                          className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <li className="flex items-start">
                        <svg
                          className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <li className="flex items-start">
                        <svg
                          className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <li className="flex items-start">
                        <svg
                          className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                        <span>Accès à la communauté</span>
                      </li>
                    </ul>

                    <Link href="/register" className="mt-auto">
                      <Button className="w-full rounded-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30">
                        S&apos;abonner maintenant
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Business Plan */}
                <div className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col h-full">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Business</h3>
                    <p className="text-foreground/70 text-sm">
                      Pour les équipes et entreprises
                    </p>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold">24.99€</span>
                    <span className="text-foreground/60 ml-1">/mois</span>
                  </div>

                  <ul className="mb-8 flex-grow space-y-4">
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <span>Tout ce qui est inclus dans Premium</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <span>Jusqu&apos;à 10 utilisateurs</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <span>Tableau de bord d&apos;équipe</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <span>Rapports analytiques avancés</span>
                    </li>
                    <li className="flex items-start">
                      <svg
                        className="size-5 mr-3 text-green-500 flex-shrink-0"
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
                      <span>Support prioritaire</span>
                    </li>
                  </ul>

                  <Link href="/contact" className="mt-auto">
                    <Button
                      variant="outline"
                      className="w-full rounded-full py-6 border-indigo-500/20 hover:bg-white/5 transition-colors"
                    >
                      Nous contacter
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-foreground/60 text-sm">
                  Tous les prix sont en euros (EUR) et incluent la TVA. Annulez
                  à tout moment.
                </p>
                <p className="text-foreground/60 text-sm mt-1">
                  <Link
                    href="/pricing"
                    className="text-indigo-400 hover:underline"
                  >
                    Voir tous les détails des forfaits →
                  </Link>
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-6 md:px-12 w-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-3xl opacity-30" />
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern-grid.svg')] bg-repeat opacity-5" />

            <div className="max-w-7xl mx-auto relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/5 backdrop-blur-md p-10 md:p-16 rounded-3xl border border-white/10 shadow-2xl shadow-indigo-500/10">
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Prêt à transformer vos{" "}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      habitudes quotidiennes
                    </span>
                    ?
                  </h2>
                  <p className="text-lg text-foreground/80 mb-8">
                    Rejoignez plus de 25 000 utilisateurs qui améliorent leur
                    vie jour après jour avec MindTrack AI. Commencez
                    gratuitement dès aujourd&apos;hui.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/register">
                      <Button className="rounded-full px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02] w-full sm:w-auto">
                        Créer un compte gratuit
                        <Zap className="ml-2 size-4" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        variant="outline"
                        className="rounded-full px-8 py-6 border-white/20 bg-white/5 hover:bg-white/10 transition-colors w-full sm:w-auto"
                      >
                        Se connecter
                      </Button>
                    </Link>
                  </div>

                  <p className="text-sm text-foreground/60 mt-6 flex items-center">
                    <svg
                      className="size-4 mr-2 text-green-500"
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
                    Aucune carte de crédit requise
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse" />
                  <div className="relative bg-background/80 backdrop-blur-sm p-1 rounded-2xl border border-white/10">
                    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl overflow-hidden">
                      <div className="aspect-[4/3] w-80 md:w-96 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="size-16 mx-auto mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center">
                              <BrainCircuit className="size-8 text-indigo-500" />
                            </div>
                            <h3 className="font-semibold mb-2">
                              Interface intuitive
                            </h3>
                            <p className="text-sm text-foreground/70 px-6">
                              Visualisez vos progrès en un coup d&apos;œil
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
              <p>© 2023 MindTrack AI. Tous droits réservés.</p>
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
