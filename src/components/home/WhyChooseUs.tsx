import { Check } from "lucide-react";

const features = [
  {
    title: "Qualité Premium",
    description: "Sélection rigoureuse des meilleures fèves de cacao",
  },
  {
    title: "Commerce Équitable",
    description: "Partenariats directs avec les producteurs locaux",
  },
  {
    title: "Agriculture Durable",
    description: "Pratiques respectueuses de l'environnement",
  },
  {
    title: "Traçabilité Totale",
    description: "Suivi complet de la fève à la tablette",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi Nous Choisir ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-amber-50 rounded-lg">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
