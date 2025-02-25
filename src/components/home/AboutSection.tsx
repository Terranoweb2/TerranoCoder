export default function AboutSection() {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
            <p className="text-lg text-gray-700 mb-4">
              Depuis plus de 20 ans, nous parcourons le monde à la recherche des
              meilleures fèves de cacao. Notre passion pour le chocolat nous a
              menés dans les régions les plus reculées d'Amérique du Sud et
              d'Afrique.
            </p>
            <p className="text-lg text-gray-700">
              Nous travaillons directement avec des producteurs locaux qui
              partagent notre engagement pour la qualité et le développement
              durable.
            </p>
          </div>
          <div className="relative h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600"
              alt="Plantation de cacao"
              className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
