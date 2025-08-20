import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  ShoppingBag,
  UtensilsCrossed,
  Leaf,
  Heart,
  Truck,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageSlideshow } from "./ImageSlideshow";
import { bannerImages, reviews } from "../data/sampleData";

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Leaf className="text-green-600" size={40} />,
      title: "Ingredientes Frescos",
      description:
        "Seleccionamos los mejores vegetales y proteínas diariamente",
    },
    {
      icon: <Heart className="text-red-500" size={40} />,
      title: "Saludable y Delicioso",
      description:
        "Combinamos sabor y nutrición en cada ensalada que preparamos",
    },
    {
      icon: <Truck className="text-blue-600" size={40} />,
      title: "Delivery Rápido",
      description: "Llevamos tu ensalada fresca directo a tu puerta",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex justify-center items-center gap-4 mb-6">
              <UtensilsCrossed size={60} />
              <h1 className="text-6xl font-bold">Potes</h1>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Las ensaladas más frescas y deliciosas de la ciudad. Ingredientes
              naturales, sabores auténticos, directo a tu mesa.
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-3"
            >
              <ShoppingBag size={24} />
              Hacé tu pedido
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ¿Por qué elegir Potes?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="relative bg-gradient-to-r from-green-50 to-green-100 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                En Potes, cada ensalada es un
                <span className="text-green-600"> momento fresco.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Descubrí el sabor auténtico de ingredientes frescos y naturales.
                Personalizá tu ensalada perfecta con más de 15 ingredientes
                premium.
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
              >
                Hacé tu pedido
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ImageSlideshow images={bannerImages} />
            </motion.div>
          </div>
        </div>
      </section>
      {/* Gallery Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestras Ensaladas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <img
              src="https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada César"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada Mediterránea"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada Proteica"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
      {/* Gallery Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestras tartas
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <img
              src="https://images.pexels.com/photos/1213710/pexels-photo-1213710.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada César"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada Mediterránea"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
            <img
              src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
              alt="Ensalada Proteica"
              className="rounded-lg shadow-md hover:shadow-xl transition-shadow w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
      {/* Info Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Horario */}
            <div className="bg-green-50 p-6 rounded-lg text-center">
              <Clock className="text-green-600 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Horario de atención
              </h3>
              <div className="text-gray-600">
                <p>Lun - Vie: 8:00 - 22:00</p>
                <p>Sábados: 9:00 - 23:00</p>
                <p>Domingos: 10:00 - 21:00</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <MapPin className="text-blue-600 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Ubicación del local
              </h3>
              <div className="text-gray-600">
                <p>Av. Corrientes 1234</p>
                <p>Buenos Aires, Argentina</p>
                <p>Tel: (011) 1234-5678</p>
              </div>
            </div>

            {/* Cómo hacer tu pedido */}
            <div className="bg-orange-50 p-6 rounded-lg col-span-full md:col-span-2">
              <div className="text-center mb-4">
                <ShoppingBag
                  className="text-orange-600 mx-auto mb-4"
                  size={40}
                />
                <h3 className="text-xl font-semibold mb-6 text-gray-800">
                  Cómo hacer tu pedido
                </h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">
                    1
                  </div>
                  <p>Elegí tu ensalada favorita del menú</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">
                    2
                  </div>
                  <p>Personalizá agregando o quitando ingredientes</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600 font-bold">
                    3
                  </div>
                  <p>Completá tus datos y confirmá el pedido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-gray-600">
              Miles de personas ya eligieron Potes para una alimentación más
              saludable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {review.customerName.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="font-semibold text-gray-900">
                      {review.customerName}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Final */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para disfrutar de una ensalada deliciosa?
          </h2>
          <p className="text-xl mb-8">
            Hacé tu pedido ahora y recibilo fresco en tu puerta
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-white text-green-600 px-10 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg inline-flex items-center gap-3"
          >
            <ShoppingBag size={28} />
            Empezar mi pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
