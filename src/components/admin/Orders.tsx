"use client"

import { useState, useEffect, useMemo } from "react"
import { makeQuery } from "../../utils/api"
import Select from "react-select"
import { useSnackbar } from "notistack"
import { ChevronDown, Phone } from "lucide-react" 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface Ingredient {
  _id: string
  name: string
  priceAsExtra: number
  type: string
}

interface Salad {
  _id: string
  name: string
  description?: string
  price: number
  image: string
}

interface CartItem {
  salad: string
  quantity: number
  removedIngredients: string
  extra: string[]
}

interface Customer {
  name: string 
  address: string
  phone: string
  location?: string
}

interface Order {
  _id: string
  cart: {
    salad: Salad | string
    quantity: number
    removedIngredients: string
    extra: (Ingredient | string)[]
  }[]
  totalPrice: number
  customer: Customer
  status: "Pending" | "In Progress" | "Shipped" | "Delivered" | "Cancelled"
  createdAt?: string
  updatedAt?: string
  paymentMethod: "Cash" | "Transfer"
  cashAmount?: number
}

const statusOptions = [
  { value: "Pending", label: "Pendiente" },
  { value: "In Progress", label: "En Progreso" },
  { value: "Shipped", label: "Enviado" },
  { value: "Delivered", label: "Entregado" },
  { value: "Cancelled", label: "Cancelado" },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [salads, setSalads] = useState<Salad[]>([])
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const { enqueueSnackbar } = useSnackbar()


  const [filter, setFilter] = useState<"today" | "week" | "all">("today");

  // Form state
  const [formData, setFormData] = useState<{
    cart: CartItem[]
    totalPrice: number
    customer: Customer
    status: string
  }>({
    cart: [{ salad: "", quantity: 1, extra: [], removedIngredients: "" }],
    totalPrice: 0,
    customer: { name: "",   address: "", phone: "" },
    status: "Pending",
  })

  const [expandedSections, setExpandedSections] = useState<{
    Pending: boolean
    "In Progress": boolean
    Shipped: boolean
    Delivered: boolean
  }>({
    Pending: true,
    "In Progress": true,
    Shipped: false,
    Delivered: false,
  })

  useEffect(() => {
    fetchOrders()
    fetchSalads()
    fetchIngredients()
  }, [])

  const fetchOrders = async () => {
    await makeQuery(
      null,
      "getOrders",
      {},
      enqueueSnackbar,
      (data) => {
        setOrders(data)
      },
      setLoading,
    )
  }

  const fetchSalads = async () => {
    await makeQuery(
      null,
      "getSalads",
      {},
      enqueueSnackbar,
      (data) => {
        setSalads(data)
      },
      undefined,
    )
  }

  const fetchIngredients = async () => {
    await makeQuery(
      null,
      "getIngredients",
      {},
      enqueueSnackbar,
      (data) => {
        setIngredients(data)
      },
      undefined,
    )
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const resetForm = () => {
    setFormData({
      cart: [{ salad: "", quantity: 1, extra: [], removedIngredients: "" }],
      totalPrice: 0,
      customer: { name: "",  address: "", phone: "" },
      status: "Pending",
    })
  }

  const handleCreate = async () => {
    if (!formData.customer.name ||  !formData.customer.address || !formData.customer.phone) {
      showNotification("Por favor completa todos los campos del cliente", "error")
      return
    }

    if (formData.cart.length === 0 || !formData.cart[0].salad) {
      showNotification("Por favor agrega al menos una ensalada al carrito", "error")
      return
    }

    await makeQuery(
      null,
      "createOrder",
      formData,
      enqueueSnackbar,
      () => {
        showNotification("Orden creada exitosamente", "success")
        setShowCreateModal(false)
        resetForm()
        fetchOrders()
      },
      setLoading,
    )
  }

  const handleEdit = async () => {
    if (!selectedOrder || !formData.customer.name ||   !formData.customer.address) {
      showNotification("Por favor completa todos los campos del cliente", "error")
      return
    }

    if (formData.cart.length === 0 || !formData.cart[0].salad) {
      showNotification("Por favor agrega al menos una ensalada al carrito", "error")
      return
    }

    await makeQuery(
      null,
      "updateOrder",
      {
        id: selectedOrder._id,
        ...formData,
      },
      enqueueSnackbar,
      () => {
        showNotification("Orden actualizada exitosamente", "success")
        setShowEditModal(false)
        setSelectedOrder(null)
        resetForm()
        fetchOrders()
      },
      setLoading,
    )
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    await makeQuery(
      null,
      "updateOrder",
      { id: orderId, status: newStatus },
      enqueueSnackbar,
      () => {
        showNotification("Estado de la orden actualizado exitosamente", "success")
        fetchOrders()
      },
      setLoading,
    )
  }

  const handleDelete = async () => {
    if (!selectedOrder) return

    await makeQuery(
      null,
      "deleteOrder",
      selectedOrder._id,
      enqueueSnackbar,
      () => {
        showNotification("Orden eliminada exitosamente", "success")
        setShowDeleteModal(false)
        setSelectedOrder(null)
        fetchOrders()
      },
      setLoading,
    )
  }

  const openEditModal = (order: Order) => {
    setSelectedOrder(order)
    setFormData({
      cart: order.cart.map((item) => ({
        salad: typeof item.salad === "string" ? item.salad : item.salad._id,
        removedIngredients: item.removedIngredients,
        quantity: item.quantity,
        extra: item.extra.map((e) => (typeof e === "string" ? e : e._id)),
      })),
      totalPrice: order.totalPrice,
      customer: order.customer,
      status: order.status,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (order: Order) => {
    setSelectedOrder(order)
    setShowDeleteModal(true)
  }

  const addCartItem = () => {
    setFormData({
      ...formData,
      cart: [...formData.cart, { salad: "", quantity: 1, extra: [], removedIngredients: "" }],
    })
  }

  const removeCartItem = (index: number) => {
    const newCart = formData.cart.filter((_, i) => i !== index)
    setFormData({ ...formData, cart: newCart })
  }

  const updateCartItem = (index: number, field: keyof CartItem, value: any) => {
    const newCart = [...formData.cart]
    newCart[index] = { ...newCart[index], [field]: value }
    setFormData({ ...formData, cart: newCart })
  }

  const getSaladName = (salad: Salad | string): string => {
    if (typeof salad === "string") return "N/A"
    return salad.name
  }

  const getIngredientNames = (extras: (Ingredient | string)[]): string => {
    return extras.map((e) => (typeof e === "string" ? "N/A" : e.name)).join(", ") || "Ninguno"
  }

  const formatDate = (date?: string): string => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const toggleSection = (status: "Pending" | "In Progress" | "Shipped" | "Delivered") => {
    setExpandedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }))
  }

  const getOrdersByStatus = (status: "Pending" | "In Progress" | "Shipped" | "Delivered") => {
    return filteredOrders.filter((order) => order.status === status)
  }

  const statusSections = [
    { key: "Pending" as const, label: "Pendiente", color: "bg-yellow-50 border-yellow-200" },
    { key: "In Progress" as const, label: "Preparando", color: "bg-blue-50 border-blue-200" },
    { key: "Shipped" as const, label: "Enviando", color: "bg-purple-50 border-purple-200" },
    { key: "Delivered" as const, label: "Entregado", color: "bg-green-50 border-green-200" },
    { key: "Cancelled" as const, label: "Cancelado", color: "bg-red-50 border-red-200" },
  ]



  const getFilteredOrders = () => {
    const now = new Date();

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (filter === "today") {
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      if (filter === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // domingo

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        return orderDate >= startOfWeek && orderDate < endOfWeek;
      }

      return true; // "all"
    });
  };

  const filteredOrders = getFilteredOrders();


   // MÉTRICAS calculadas en base a filteredOrders
  const metrics = useMemo(() => {
    const cantidad = filteredOrders.length;
     const totalPedidos = filteredOrders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.totalPrice, 0);
    const totalEfectivo = filteredOrders
      .filter((o) => o.paymentMethod === "Cash" && o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.totalPrice, 0);
    const totalTransferencia = filteredOrders
      .filter((o) => o.paymentMethod === "Transfer" && o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.totalPrice, 0);

    return {
      cantidad,
      totalPedidos,
      totalEfectivo,
      totalTransferencia,
    };
  }, [filteredOrders]);


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Órdenes</h1>
          <button
            onClick={() => {
              resetForm()
              setShowCreateModal(true)
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Nueva Orden
          </button>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setFilter("today")}
            className={`px-4 py-2 rounded ${
              filter === "today"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Hoy
          </button>

          <button
            onClick={() => setFilter("week")}
            className={`px-4 py-2 rounded ${
              filter === "week"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Semana actual
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Todo
          </button>
        </div>

        {/* MÉTRICAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-600">Cantidad de pedidos</h3>
          <p className="text-xl font-bold">{metrics.cantidad}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-600">Total de pedidos</h3>
          <p className="text-xl font-bold">${metrics.totalPedidos}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-600">Total en efectivo</h3>
          <p className="text-xl font-bold">${metrics.totalEfectivo}</p>
        </div>

        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-600">Total en transferencia</h3>
          <p className="text-xl font-bold">${metrics.totalTransferencia}</p>
        </div>
      </div>


        {/* Notification */}
        {notification && (
          <div
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Cargando órdenes...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No hay órdenes registradas</div>
        ) : (
          <div className="space-y-4">
            {statusSections.map((section) => {
              const statusOrders = getOrdersByStatus(section.key)
              const isExpanded = expandedSections[section.key]

              return (
                <div key={section.key} className={`bg-white rounded-lg shadow border-2 ${section.color}`}>
                  {/* Section Header - Clickable to toggle */}
                  <button
                    onClick={() => toggleSection(section.key)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-gray-900">{section.label}</h2>
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {statusOrders.length}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Orders Table - Collapsible */}
                  {isExpanded && statusOrders.length > 0 && (
                    <div className="border-t border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cliente
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Carrito
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pago
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {statusOrders.map((order) => (
                              <tr key={order._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                  <div className="text-sm font-medium text-gray-900">{order.customer.name}</div>
                                  {/* <div className="text-sm text-gray-500">{order.customer.email}</div> */}
                                  <div className="text-sm text-gray-500">{order.customer.phone}</div>                                   
                                  <div className="text-sm text-gray-500"><a
                                      href={'https://wa.me/' + order.customer.phone}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                       <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25D366", fontSize: "24px" }} />
                                    </a>
                                  </div>
                                  <div className="text-sm text-gray-500">{order.customer.address}</div>
                                  {order.customer.location && (
                                    <a
                                      href={order.customer.location}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      Ver ubicación
                                    </a>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900">
                                    {order.cart.map((item, idx) => (
                                      <div key={idx} className="mb-2">
                                        <span className="font-medium">{getSaladName(item.salad)}</span>
                                        <span className="text-gray-500"> x{item.quantity}</span>
                                        {item.extra.length > 0 && (
                                          <div className="text-xs text-gray-500 ml-2">
                                            Extras: {getIngredientNames(item.extra)}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                  ${order.totalPrice.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                  <Select
                                    value={statusOptions.find((opt) => opt.value === order.status)}
                                    onChange={(option) => updateStatus(order._id, option?.value || order.status)}
                                    options={statusOptions}
                                    menuPortalTarget={document.body}
                                    styles={{
                                      control: (base) => ({
                                        ...base,
                                        borderColor: "gray",
                                        "&:hover": {
                                          borderColor: "blue",
                                        },
                                      }),
                                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                  />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {order.paymentMethod === "Cash" ? (
                                    <div>Efectivo (${order.cashAmount?.toFixed(2)})</div>
                                  ) : (
                                    order.paymentMethod === "Transfer" ? <div>Transferencia</div> :<div>Vacio</div>
                                  )} 
                                </td>
                                <td className="px-6 py-4 text-sm font-medium  text-center ">
                                  <div className="flex flex-col gap-1 ">
                                    <button
                                    onClick={() => openEditModal(order)}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(order)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Eliminar
                                  </button>  
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Empty state when section is expanded but has no orders */}
                  {isExpanded && statusOrders.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500 border-t border-gray-200">
                      No hay órdenes en este estado
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Nueva Orden</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={formData.customer.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, name: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.customer.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@ejemplo.com"
                      />
                    </div> */}

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                      <input
                        type="text"
                        value={formData.customer.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dirección de entrega"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <input
                        type="text"
                        value={formData.customer.location || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, location: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ubicación (Link de Google Maps)"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                      <input
                        type="text"
                        value={formData.customer.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número de teléfono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Carrito</h3>
                    <button
                      onClick={addCartItem}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      + Agregar Item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.cart.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                          {formData.cart.length > 1 && (
                            <button
                              onClick={() => removeCartItem(index)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ensalada *</label>
                            <Select
                              value={
                                item.salad
                                  ? {
                                      value: item.salad,
                                      label: salads.find((s) => s._id === item.salad)?.name || "Seleccionar",
                                    }
                                  : null
                              }
                              onChange={(option) => updateCartItem(index, "salad", option?.value || "")}
                              options={salads.map((salad) => ({
                                value: salad._id,
                                label: `${salad.name} - $${salad.price}`,
                              }))}
                              placeholder="Seleccionar ensalada"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: "#d1d5db",
                                  "&:hover": { borderColor: "#d1d5db" },
                                }),
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {item.removedIngredients}
                            </label>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                            <Select
                              isMulti
                              value={ingredients
                                .filter((ing) => item.extra.includes(ing._id))
                                .map((ing) => ({
                                  value: ing._id,
                                  label: `${ing.name} (+$${ing.priceAsExtra})`,
                                }))}
                              onChange={(selected) =>
                                updateCartItem(index, "extra", selected ? selected.map((s) => s.value) : [])
                              }
                              options={ingredients.map((ing) => ({
                                value: ing._id,
                                label: `${ing.name} (+$${ing.priceAsExtra})`,
                              }))}
                              placeholder="Seleccionar extras..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: "#d1d5db",
                                  "&:hover": { borderColor: "#d1d5db" },
                                }),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Price and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio Total *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({ ...formData, totalPrice: Number.parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                    <Select
                      value={{ value: formData.status, label: formData.status }}
                      onChange={(option) => setFormData({ ...formData, status: option?.value || "Pending" })}
                      options={[
                        { value: "Pending", label: "Pending" },
                        { value: "In Progress", label: "In Progress" },
                        { value: "Shipped", label: "Shipped" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#d1d5db",
                          "&:hover": { borderColor: "#d1d5db" },
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear Orden
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Editar Orden</h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Cliente</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                      <input
                        type="text"
                        value={formData.customer.name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, name: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nombre del cliente"
                      />
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.customer.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, email: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="email@ejemplo.com"
                      />
                    </div> */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección *</label>
                      <input
                        type="text"
                        value={formData.customer.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, address: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Dirección de entrega"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <input
                        type="text"
                        value={formData.customer.location || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, location: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ubicación (Link de Google Maps)"
                      />

                      {formData.customer.location?.includes("https://maps.google.com") && (
                        <button
                          className="mt-2 text-blue-600 hover:underline text-sm"
                          onClick={() => window.open(formData.customer.location, "_blank")}
                        >
                          Ver en Google Maps
                        </button>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                      <input
                        type="text"
                        value={formData.customer.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            customer: { ...formData.customer, phone: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Número de teléfono"
                      />
                    </div>
                  </div>
                </div>

                {/* Cart Items */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Carrito</h3>
                    <button
                      onClick={addCartItem}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      + Agregar Item
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.cart.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-medium text-gray-900">Item {index + 1}</h4>
                          {formData.cart.length > 1 && (
                            <button
                              onClick={() => removeCartItem(index)}
                              className="text-red-600 hover:text-red-900 text-sm"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ensalada *</label>
                            <Select
                              value={
                                item.salad
                                  ? {
                                      value: item.salad,
                                      label: salads.find((s) => s._id === item.salad)?.name || "Seleccionar",
                                    }
                                  : null
                              }
                              onChange={(option) => updateCartItem(index, "salad", option?.value || "")}
                              options={salads.map((salad) => ({
                                value: salad._id,
                                label: `${salad.name} - $${salad.price}`,
                              }))}
                              placeholder="Seleccionar ensalada"
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: "#d1d5db",
                                  "&:hover": { borderColor: "#d1d5db" },
                                }),
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateCartItem(index, "quantity", Number.parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {item.removedIngredients}
                            </label>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Extras</label>
                            <Select
                              isMulti
                              value={ingredients
                                .filter((ing) => item.extra.includes(ing._id))
                                .map((ing) => ({
                                  value: ing._id,
                                  label: `${ing.name} (+$${ing.priceAsExtra})`,
                                }))}
                              onChange={(selected) =>
                                updateCartItem(index, "extra", selected ? selected.map((s) => s.value) : [])
                              }
                              options={ingredients.map((ing) => ({
                                value: ing._id,
                                label: `${ing.name} (+$${ing.priceAsExtra})`,
                              }))}
                              placeholder="Seleccionar extras..."
                              styles={{
                                control: (base) => ({
                                  ...base,
                                  borderColor: "#d1d5db",
                                  "&:hover": { borderColor: "#d1d5db" },
                                }),
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Price and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Precio Total *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.totalPrice}
                      onChange={(e) => setFormData({ ...formData, totalPrice: Number.parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                    <Select
                      value={{ value: formData.status, label: formData.status }}
                      onChange={(option) => setFormData({ ...formData, status: option?.value || "Pending" })}
                      options={[
                        { value: "Pending", label: "Pending" },
                        { value: "In Progress", label: "In Progress" },
                        { value: "Shipped", label: "Shipped" },
                        { value: "Delivered", label: "Delivered" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderColor: "#d1d5db",
                          "&:hover": { borderColor: "#d1d5db" },
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedOrder(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmar Eliminación</h2>
                <p className="text-gray-600 mb-6">
                  ¿Estás seguro de que deseas eliminar la orden de <strong>{selectedOrder.customer.name}</strong>? Esta
                  acción no se puede deshacer.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false)
                      setSelectedOrder(null)
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
