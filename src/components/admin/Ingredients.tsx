"use client"

import type React from "react"

import { act, useEffect, useState } from "react"
import { makeQuery } from "../../utils/api"

interface Ingredient {
  _id: string
  name: string
  priceAsExtra: number
  precioDescuento: number
  active: boolean
  type: "base" | "vegetal" | "premium" | "proteina" | "aderezo" | "extra"
}

export default function IngredientsPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    priceAsExtra: "",
    precioDescuento: "",
    type: "base" as Ingredient["type"],
  })
  const [snackbar, setSnackbar] = useState<{
    message: string
    variant: "error" | "success" | "info" | "warning"
  } | null>(null)

  const showSnackbar = (message: string, options?: { variant: "error" | "success" | "info" | "warning" }) => {
    setSnackbar({ message, variant: options?.variant || "info" })
    setTimeout(() => setSnackbar(null), 3000)
  }

  const loadIngredients = async () => {
    await makeQuery(
      null,
      "getIngredients",
      {},
      showSnackbar,
      (data) => {
        setIngredients(data)
      },
      setLoading,
    )
  }

  useEffect(() => {
    loadIngredients()
  }, [])

  const handleCreateOpen = () => {
    setFormData({ name: "", priceAsExtra: "", precioDescuento: "", type: "base" })
    setIsCreateModalOpen(true)
  }

  const handleEditOpen = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      priceAsExtra: ingredient.priceAsExtra.toString(),
      precioDescuento: ingredient.precioDescuento.toString(),
      type: ingredient.type,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteOpen = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient)
    setIsDeleteModalOpen(true)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.priceAsExtra || !formData.precioDescuento) {
      showSnackbar("Complete los campos obligatorios", { variant: "error" })
      return
    }

    await makeQuery(
      null,
      "createIngredient",
      {
        name: formData.name,
        priceAsExtra: Number.parseFloat(formData.priceAsExtra),
        precioDescuento: Number.parseFloat(formData.precioDescuento),
        type: formData.type,
      },
      showSnackbar,
      () => {
        showSnackbar("Ingrediente creado exitosamente", { variant: "success" })
        setIsCreateModalOpen(false)
        loadIngredients()
      },
      setLoading,
    )
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.priceAsExtra || !formData.precioDescuento) {
      showSnackbar("Complete los campos obligatorios", { variant: "error" })
      return
    }

    await makeQuery(
      null,
      "updateIngredient",
      {
        id: selectedIngredient?._id,
        name: formData.name,
        priceAsExtra: Number.parseFloat(formData.priceAsExtra),
        precioDescuento: Number.parseFloat(formData.precioDescuento),
        type: formData.type,
      },
      showSnackbar,
      () => {
        showSnackbar("Ingrediente actualizado exitosamente", { variant: "success" })
        setIsEditModalOpen(false)
        loadIngredients()
      },
      setLoading,
    )
  }

  const handleChangeStatus = async (ingredient: Ingredient) => {
    await makeQuery(
      null,
      "updateIngredient",
      {
        id: ingredient._id,
        active: !ingredient.active,
      },
      showSnackbar,
      () => {
        showSnackbar(
          `Ingrediente ${!ingredient.active ? "activado" : "desactivado"} exitosamente`,
          { variant: "success" },
        )
        loadIngredients()
      },
      setLoading,
    )
  }

  const handleDelete = async () => {
    if (!selectedIngredient) return

    await makeQuery(
      null,
      "deleteIngredient",
      selectedIngredient._id,
      showSnackbar,
      () => {
        showSnackbar("Ingrediente eliminado exitosamente", { variant: "success" })
        setIsDeleteModalOpen(false)
        loadIngredients()
      },
      setLoading,
    )
  }

  const closeAllModals = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setSelectedIngredient(null)
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      base: "Base",
      vegetal: "Vegetal",
      premium: "Premium",
      proteina: "Proteína",
      aderezo: "Aderezo",
      extra: "Extra",
    }
    return labels[type] || type
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Ingredientes</h1>
            <p className="mt-2 text-gray-600">Gestiona todos los ingredientes disponibles</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            + Nuevo Ingrediente
          </button>
        </div>

        {/* Snackbar */}
        {snackbar && (
          <div
            className={`fixed right-6 top-6 z-50 rounded-lg px-6 py-4 shadow-lg ${
              snackbar.variant === "error"
                ? "bg-red-600 text-white"
                : snackbar.variant === "success"
                  ? "bg-green-600 text-white"
                  : snackbar.variant === "warning"
                    ? "bg-yellow-600 text-white"
                    : "bg-blue-600 text-white"
            }`}
          >
            {snackbar.message}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Table */}
        {!loading && (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio Extra</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio Descuento</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ingredients.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No hay ingredientes disponibles. Crea uno nuevo para comenzar.
                    </td>
                  </tr>
                ) : (
                  ingredients.map((ingredient) => (
                    <tr key={ingredient._id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ingredient.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${ingredient.priceAsExtra.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${ingredient.precioDescuento.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{getTypeLabel(ingredient.type)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleChangeStatus(ingredient)}
                            className={
                              `rounded-md px-4 py-2 text-sm font-medium text-white transition-colors ${
                                ingredient.active ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
                              }`
                            }
                          >
                            {ingredient.active ? "Desactivar" : "Activar"}
                          </button>
                          <button
                            onClick={() => handleEditOpen(ingredient)}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleDeleteOpen(ingredient)}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                          
                           
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Crear Ingrediente</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Tomate"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Precio Extra *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceAsExtra}
                    onChange={(e) => setFormData({ ...formData, priceAsExtra: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Precio Descuento *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precioDescuento}
                    onChange={(e) => setFormData({ ...formData, precioDescuento: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Ingredient["type"] })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="base">Base</option>
                    <option value="vegetal">Vegetal</option>
                    <option value="premium">Premium</option>
                    <option value="proteina">Proteína</option>
                    <option value="aderezo">Aderezo</option>
                    <option value="extra">Extra</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Creando..." : "Crear"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Editar Ingrediente</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Tomate"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Precio Extra *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceAsExtra}
                    onChange={(e) => setFormData({ ...formData, priceAsExtra: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Precio Descuento *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.precioDescuento}
                    onChange={(e) => setFormData({ ...formData, precioDescuento: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Tipo *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Ingredient["type"] })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="base">Base</option>
                    <option value="vegetal">Vegetal</option>
                    <option value="premium">Premium</option>
                    <option value="proteina">Proteína</option>
                    <option value="aderezo">Aderezo</option>
                    <option value="extra">Extra</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAllModals}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Confirmar Eliminación</h2>
              <p className="mb-6 text-gray-600">
                ¿Estás seguro de que deseas eliminar el ingrediente{" "}
                <span className="font-semibold text-gray-900">{selectedIngredient?.name}</span>? Esta acción no se puede
                deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
