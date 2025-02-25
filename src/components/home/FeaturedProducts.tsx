import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Fèves de Cacao Premium",
    description: "Fèves de cacao d'origine unique d'Équateur",
    price: "24,99 €",
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?q=80&w=400",
  },
  {
    id: 2,
    name: "Poudre de Cacao Bio",
    description: "Poudre de cacao pure 100% non sucrée",
    price: "19,99 €",
    image:
      "https://images.unsplash.com/photo-1610611424854-5e07032143d8?q=80&w=400",
  },
  {
    id: 3,
    name: "Beurre de Cacao",
    description: "Beurre de cacao naturel pour pâtisserie et cosmétiques",
    price: "29,99 €",
    image:
      "https://images.unsplash.com/photo-1606070802327-34ee34f3d118?q=80&w=400",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Produits Vedettes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <p className="text-2xl font-bold text-amber-600">
                  {product.price}
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-amber-600 hover:bg-amber-700">
                  Ajouter au Panier
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
