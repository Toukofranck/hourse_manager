import React from 'react';
import { Link } from '@inertiajs/react';
import { MapPin, Calendar, Users, Star, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">HouseRent</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-primary-600 transition">Fonctionnalités</a>
              <a href="#properties" className="text-gray-600 hover:text-primary-600 transition">Propriétés</a>
              <a href="#contact" className="text-gray-600 hover:text-primary-600 transition">Contact</a>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/api-login" className="text-gray-600 hover:text-primary-600 transition font-medium">
                Connexion
              </Link>
              <Link href="/api-register" className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-600 text-white rounded-lg hover:shadow-lg transition">
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Trouvez votre <span className="bg-gradient-to-r from-primary-500 to-secondary-600 bg-clip-text text-transparent">maison parfaite</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Découvrez des milliers de propriétés disponibles à la location. Faites votre réservation en quelques clics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/properties" className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 flex items-center justify-center gap-2">
                  Parcourir les propriétés
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button className="px-8 py-4 border-2 border-primary-200 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition">
                  En savoir plus
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-2xl transform rotate-1 blur-xl opacity-20"></div>
                <div className="relative bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 border border-primary-200">
                  <div className="space-y-4">
                    <div className="h-48 bg-gradient-to-br from-primary-300 to-secondary-300 rounded-xl"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi nous choisir ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Une plateforme de location d'exception avec des services haut de gamme
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MapPin, title: 'Localisation Précise', desc: 'Trouvez des propriétés près de vous' },
              { icon: Calendar, title: 'Réservation Facile', desc: 'Réservez en quelques secondes' },
              { icon: Users, title: 'Service Client', desc: 'Support 24h/24, 7j/7' },
              { icon: Star, title: 'Avis Vérifiés', desc: 'Consultez les avis des locataires' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="relative p-8 bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl opacity-0 group-hover:opacity-5 transition"></div>
                  <div className="relative">
                    <div className="inline-block p-3 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg mb-4">
                      <Icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1000+</div>
              <p className="text-primary-100">Propriétés listées</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <p className="text-primary-100">Utilisateurs satisfaits</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.8★</div>
              <p className="text-primary-100">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="properties" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-16 border border-primary-200">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Prêt à commencer ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Consultez nos dernières propriétés disponibles ou créez un compte pour bénéficier de fonctionnalités exclusives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/properties" className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                  Voir les propriétés
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="/api-register" className="px-8 py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-8 w-8 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg"></div>
                <span className="text-lg font-bold text-white">HouseRent</span>
              </div>
              <p className="text-sm text-gray-400">La plateforme n°1 de location de propriétés en ligne.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">À propos</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Carrières</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Conditions</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 HouseRent. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
