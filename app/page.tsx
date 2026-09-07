import { SiteHeader } from "./components/layout/Header";
import { SiteFooter } from "./components/layout/Footer";
import AccueilPage from "./components/acueil/Accueil";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-nexora-bg text-white">
        <AccueilPage />
      </main>
      <SiteFooter />
    </>
  );
}