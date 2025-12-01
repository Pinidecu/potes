import React, { useEffect, useState } from "react";
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
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { ImageSlideshow } from "./ImageSlideshow";
import { bannerImages, reviews } from "../data/sampleData";
import { makeQuery } from "../utils/api";
import { useSnackbar } from "notistack";
import MapSelector from "./MapSelector";

interface Salad {
  _id: string
  name: string
  description: string
  base: any[]
  price: number
  image: string
  type: "Ensalada" | "Tarta" | "Bebida" | "Postre"
}

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [salads, setSalads] = useState<Salad[]>([])
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const loadSalads = async () => {
    await makeQuery(
      null,
      "getSalads",
      {},
      enqueueSnackbar,
      (data) => {
        setSalads(data)
      },
      setLoading,
    )
  }

  useEffect(() => {
    loadSalads();
  }, [])

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
              <img src={`/LogoText.png?t=${Date.now()}`} alt="Logo" className="w-auto h-32" />
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

          {loading && (
            <div className="text-center text-gray-600 mb-6">Cargando...</div>
          )}

          {salads.length === 0 && !loading && (
            <div className="text-center text-gray-600 mb-6">
              No hay ensaladas disponibles en este momento.
            </div>
          )}

          {(salads.length > 0 && !loading) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {salads
              .filter(salad => salad.type === 'Ensalada')
              .map((salad) => (
                <div
                  key={salad._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={salad.image || "/placeholder.svg"}
                    alt={salad.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {salad.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{salad.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        ${salad.price}
                      </span>
                      <Link
                        to={"/menu"}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <span>Ir al menú</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Section */}
<div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Nuestras Tartas
          </h2>

          {loading && (
            <div className="text-center text-gray-600 mb-6">Cargando...</div>
          )}

          {salads.length === 0 && !loading && (
            <div className="text-center text-gray-600 mb-6">
              No hay tartas disponibles en este momento.
            </div>
          )}

          {(salads.length > 0 && !loading) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {salads
              .filter(salad => salad.type === 'Tarta')
              .map((salad) => (
                 <div
                key={salad._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                <img
                  src={salad.image || "/placeholder.svg"}
                  alt={salad.name}
                  className="w-full h-48 object-cover"
                />

                {/* Contenedor principal en columna */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Contenido superior */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {salad.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{salad.description}</p>
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Ingredientes base:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {salad.base.map((ingredient) => (
                          <span
                            key={ingredient._id}
                            className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full"
                          >
                            {ingredient.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bloque inferior SIEMPRE abajo */}
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-green-600">
                      ${salad.price}
                    </span>
                      <Link
                        to={"/menu"}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <span>Ir al menú</span>
                      </Link>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
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
