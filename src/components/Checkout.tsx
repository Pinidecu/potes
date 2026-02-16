"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "../context/CartProvider"
import { makeQuery } from "../utils/api"
import { Trash2, CheckCircle, ShoppingCart, Timer } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useSnackbar } from "notistack"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import MapSelector from "./MapSelector"
import OSMAddressAutocomplete from "./OSMAddressAutocomplete"


export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    location: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Transfer" | "">("")
  const [cashAmount, setCashAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const { enqueueSnackbar } = useSnackbar()

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null); 
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

  const [includeCutlery, setIncludeCutlery] = useState(false);
  const [comments, setComments] = useState("");


  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer.name  || !customer.address || !customer.phone) {
      showNotification("Por favor completá todos los campos requeridos", "error")
      return
    }

    if (!paymentMethod) {
      showNotification("Por favor seleccioná un medio de pago", "error")
      return
    }

    if (paymentMethod === "Cash" && !cashAmount) {
      showNotification("Por favor ingresá con cuánto vas a pagar", "error")
      return
    }

    if (paymentMethod === "Cash" && Number.parseFloat(cashAmount) < getTotal()) {
      showNotification("El monto en efectivo debe ser mayor o igual al total", "error")
      return
    }

    if (cartItems.length === 0) {
      showNotification("Tu carrito está vacío", "error")
      return
    }

    const orderData = {
      cart: cartItems.map((item) => ({
        salad: item.salad._id,
        quantity: item.quantity,
        removedIngredients: item.removedIngredients,
        extra: item.extra.map((ing) => ing._id),
      })),
      totalPrice: getTotal(),
      customer: {
        name: customer.name,
        email: customer.email,
        address: customer.address,
        phone: customer.phone,
        location: customer.location,
      },
      paymentMethod,
      ...(paymentMethod === "Cash" && { cashAmount: Number.parseFloat(cashAmount) }),
      includeCutlery,
      comments
    }

    makeQuery(
      "",
      "createOrder",
      orderData,
      enqueueSnackbar,
      () => {
        clearCart()
        setOrderCompleted(true)
      },
      setIsSubmitting,
    )
  }

  if (orderCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-600 mb-6">
            {paymentMethod ==="Transfer" ? <Timer size={80} className="mx-auto" color="orange" />:<CheckCircle size={80} className="mx-auto" />}
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{paymentMethod ==="Transfer" ?"Pedido pendiente de pago" :"¡Pedido Confirmado!"}</h1>
          <p className="text-gray-600 ">
            {paymentMethod ==="Transfer" ? 'Para confirmar tu pedido debes transferir al alias: ALIASPRUEBA y enviar el comprobante por WhatsApp al numero 3872572264': 'Gracias por tu pedido. Te contactaremos pronto para confirmar la entrega.'}
          </p>
          {paymentMethod ==="Transfer" ? <div className="text-sm text-gray-500 mb-6"><a
                                      href={'https://wa.me/3872572264'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                       <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25D366", fontSize: "50px" }} />
                                    </a>
                                  </div>:null}

          <button
            onClick={() => navigate("/menu")}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Volver al menú
          </button>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <ShoppingCart size={64} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">Agregá algunas ensaladas antes de finalizar tu pedido</p>
          <button
            onClick={() => navigate("/menu")}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Ver menú
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            notification.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Finalizar Pedido</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Resumen de tu pedido</h2>
            <div className="space-y-4">
              {cartItems.map((item, index) => {
                const extrasPrice = item.extra.reduce((sum, ing) => sum + ing.priceAsExtra, 0)
                const itemTotal = (item.salad.price + extrasPrice) * item.quantity

                return (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium">{item.salad.name}</h3>
                        <p className="text-sm text-gray-500">{item.salad.description}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-600 hover:text-red-700 ml-2"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">Base:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.salad.base.map((ingredient) => (
                          <span
                            key={ingredient._id}
                            className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs"
                          >
                            {ingredient.name}
                          </span>
                        ))}
                      </div>

                      {item.removedIngredients && (
                        <div className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Sin:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs line-through">
                              {item.removedIngredients}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {item.extra.length > 0 && (
                      <div className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Extras:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.extra.map((ingredient) => (
                            <span
                              key={ingredient._id}
                              className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                            >
                              {ingredient.name} (+${ingredient.priceAsExtra})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-semibold">${itemTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}

              <div className="flex justify-between items-center text-xl font-bold pt-4">
                <span>Total:</span>
                <span className="text-green-600">${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Datos de entrega</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={customer.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              {/* <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={customer.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div> */}

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  value={customer.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tu número de teléfono"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de entrega *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  value={customer.address}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Calle, número, piso, depto"
                />
              </div>
 
              

              <OSMAddressAutocomplete
                query={customer.address}   // 🔥 lo que escribe el usuario
                onSelect={(coords) => {
                  setCenter(coords);
                  setSelectedLocation(coords);

                  setCustomer((prev) => ({
                  ...prev,
                  location: `${coords.lat},${coords.lng}`,
                }));
                }}
              />
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación (opcional)
                </label>                

                <MapSelector
                  center={center}
                  onSelect={(coords) => {
                    setSelectedLocation(coords);
                    setCenter(null);   // 🔥 evita que el mapa se siga moviendo

                    setCustomer((prev) => ({
                      ...prev,
                      location: `${coords.lat},${coords.lng}`,
                    }));
                  }}
                />

                {customer.location && (
                  <a
                    className="mt-2 text-sm text-green-700 font-medium underline block"
                    href={`https://maps.google.com/?q=${customer.location}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver punto en Google Maps
                  </a>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Medio de pago *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("Cash")
                      setCashAmount("")
                    }}
                    className={`p-4 rounded-lg border-2 transition-all font-medium ${
                      paymentMethod === "Cash"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("Transfer")
                      setCashAmount("")
                    }}
                    className={`p-4 rounded-lg border-2 transition-all font-medium ${
                      paymentMethod === "Transfer"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    Transferencia
                  </button>
                </div>
              </div>

              {paymentMethod === "Cash" && (
                <div>
                  <label htmlFor="cashAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Con cuánto pagás? *
                  </label>
                  <input
                    type="number"
                    id="cashAmount"
                    name="cashAmount"
                    required
                    min={getTotal()}
                    step="0.01"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={`Mínimo $${getTotal().toFixed(2)}`}
                  />
                  {cashAmount && Number.parseFloat(cashAmount) > getTotal() && (
                    <p className="mt-2 text-sm text-green-600">
                      Vuelto: ${(Number.parseFloat(cashAmount) - getTotal()).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-3 mt-4 p-3 border border-gray-200 rounded-lg">
                <input
                  id="includeCutlery"
                  type="checkbox"
                  checked={includeCutlery}
                  onChange={(e) => setIncludeCutlery(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                <label htmlFor="includeCutlery" className="text-sm text-gray-700 select-none">
                  Incluir cubiertos
                </label>
              </div>
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comentarios (opcional)
                </label>
                <textarea
                  id="comments"
                  name="comments"
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Ej: Dejar en portería, tocar timbre B, sin cebolla, etc."
                  maxLength={500}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {comments.length}/500
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  "Confirmar pedido"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
