import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { CookieBanner } from "@/components/navigation/cookie-banner";
import { Toaster } from "sonner";

/**
 * Main layout for the public-facing side of the application.
 */
export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Navigation collante */}
            <Navbar />

            {/* Contenu principal flexible */}
            <main className="flex-1">
                {children}
            </main>

            {/* Pied de page global */}
            <Footer />

            {/* Composants flottants dynamiques */}
            <CookieBanner />
            <Toaster position="top-right" richColors />
        </div>
    );
}