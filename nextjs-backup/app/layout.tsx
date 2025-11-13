import "./globals.css";
import { Ubuntu } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeRegistry from "@/components/ThemeRegistry";
import { FinanceProvider } from "@/components/FinanceProvider";
import { AuthProvider } from "@/components/AuthProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "FinTrackrX",
  description: "AI-powered Financial Tracker & Advisor for Indian Households",
};

const ubuntu = Ubuntu({ subsets: ["latin"], weight: ["300","400","500","700"], variable: "--font-ubuntu" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={ubuntu.variable}>
      <head>
        {/* Prevent theme flash by applying dark class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'};if(t==='dark'){document.documentElement.classList.add('dark')}}catch(e){}})();",
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 font-sans">
        <ErrorBoundary>
          <ThemeProvider>
            <ThemeRegistry>
              <AuthProvider>
                <FinanceProvider>
                  <Navbar />
                  <main className="min-h-[calc(100vh-80px)]">{children}</main>
                </FinanceProvider>
              </AuthProvider>
            </ThemeRegistry>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
