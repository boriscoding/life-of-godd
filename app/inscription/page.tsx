import { SiteHeader } from "../components/layout/Header";
import { SiteFooter } from "../components/layout/Footer";
import InscriptionForm from "@/app/inscrire";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <SiteHeader />
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <InscriptionForm />
      </main>
      <SiteFooter />
    </div>
  );
}