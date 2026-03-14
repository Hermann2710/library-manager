import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { CookieBanner } from "@/components/navigation/cookie-banner";
import { Toaster } from "sonner";

/**
 * HomeLayout Component.
 * Defines the public structural shell of the application.
 * Ensures the Footer stays at the bottom and manages global floating UI elements.
 */
export default function HomeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Sticky or static Navigation bar 
                Positioned at the top of the viewport.
            */}
            <Navbar />

            {/* Main content area 
                'flex-1' ensures this section expands to push the footer to the bottom
                even when the page content is short.
            */}
            <main className="flex-1 animate-in fade-in duration-700">
                {children}
            </main>

            {/* Global site footer 
                Contains links to legal pages like CGU, Privacy, and Cookies.
            */}
            <Footer />

            {/* Dynamic floating components 
                CookieBanner: Handles GDPR compliance.
                Toaster: Displays system notifications with rich colors at the top-right.
            */}
            <CookieBanner />
        </div>
    );
}