import { Toaster } from "@/userinterface/components/ui/sonner";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/userinterface/components/@shared/theme/theme-provider";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

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
      <body className={roboto.variable}>
        <Script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="1523"
          strategy="afterInteractive"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
