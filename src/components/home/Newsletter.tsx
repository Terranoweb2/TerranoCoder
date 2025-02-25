import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  return (
    <section className="py-16 bg-amber-600">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Restez Informé</h2>
          <p className="text-amber-100 mb-8">
            Inscrivez-vous à notre newsletter pour recevoir nos actualités et
            offres exclusives
          </p>
          <form className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 bg-white"
            />
            <Button className="bg-amber-800 hover:bg-amber-900 text-white">
              S'inscrire
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
