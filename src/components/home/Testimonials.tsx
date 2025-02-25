import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Marie Dubois",
    role: "Chef Pâtissière",
    content:
      "La qualité exceptionnelle de leur cacao a transformé mes créations. Un goût authentique incomparable.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    rating: 5,
  },
  {
    id: 2,
    name: "Pierre Martin",
    role: "Artisan Chocolatier",
    content:
      "Je travaille avec eux depuis des années. Leur engagement pour la qualité et l'éthique est remarquable.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophie Laurent",
    role: "Cliente Passionnée",
    content:
      "Des produits d'exception qui font la différence dans mes recettes maison. Service client impeccable.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Avis de nos Clients
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex items-center space-x-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
