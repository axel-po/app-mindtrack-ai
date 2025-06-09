import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/@shared/nav/header";
import { ThemeProvider } from "@/components/@shared/theme/theme-provider";

export const metadata = {
  title: "MindTrack AI - Suivez vos habitudes et améliorez votre quotidien",
  description:
    "MindTrack AI vous aide à suivre vos habitudes quotidiennes, noter vos pensées et visualiser vos progrès grâce à des graphiques détaillés.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
