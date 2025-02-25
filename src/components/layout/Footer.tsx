import { Facebook, Instagram, Twitter } from "lucide-react";

const navigation = {
  produits: [
    { name: "Fèves de Cacao", href: "#" },
    { name: "Poudre de Cacao", href: "#" },
    { name: "Beurre de Cacao", href: "#" },
    { name: "Nouveautés", href: "#" },
  ],
  entreprise: [
    { name: "À Propos", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Emplois", href: "#" },
    { name: "Presse", href: "#" },
  ],
  support: [
    { name: "Contact", href: "#" },
    { name: "FAQ", href: "#" },
    { name: "Livraison", href: "#" },
    { name: "Retours", href: "#" },
  ],
  legal: [
    { name: "CGV", href: "#" },
    { name: "Confidentialité", href: "#" },
    { name: "Mentions Légales", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <span className="text-2xl font-bold text-amber-600">CacaoFin</span>
            <p className="text-gray-400 text-sm">
              Découvrez l'excellence du cacao à travers notre sélection de
              produits premium issus du commerce équitable.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-amber-600">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-600">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-600">
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white">Produits</h3>
                <ul className="mt-4 space-y-4">
                  {navigation.produits.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-amber-600 text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white">Entreprise</h3>
                <ul className="mt-4 space-y-4">
                  {navigation.entreprise.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-amber-600 text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-white">Support</h3>
                <ul className="mt-4 space-y-4">
                  {navigation.support.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-amber-600 text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-white">
                  Mentions Légales
                </h3>
                <ul className="mt-4 space-y-4">
                  {navigation.legal.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-gray-400 hover:text-amber-600 text-sm"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-400 text-center">
            © 2024 CacaoFin. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
