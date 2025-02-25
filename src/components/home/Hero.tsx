import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative h-[600px] w-full bg-brown-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1481391319762-47dff72954d9?q=80&w=1200")',
          opacity: 0.6,
        }}
      />
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Produits de Cacao Premium
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          Découvrez notre sélection de fèves de cacao et de produits de haute
          qualité provenant directement de fermes durables
        </p>
        <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
          Découvrir nos Produits
        </Button>
      </div>
    </div>
  );
}
