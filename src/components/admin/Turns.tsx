"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Select from "react-select"
import { makeQuery } from "../../utils/api"

interface Turn {
  _id: string
  name: string
  startTime: string
  available: boolean
}

const filterAvailabilityOptions = [
  { value: "all", label: "Todos" },
  { value: "true", label: "Disponibles" },
  { value: "false", label: "No disponibles" },
]

export default function TurnsPage() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [loading, setLoading] = useState(false)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [selectedTurn, setSelectedTurn] = useState<Turn | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    available: true,
  })

  const [snackbar, setSnackbar] = useState<{
    message: string
    variant: "error" | "success" | "info" | "warning"
  } | null>(null)

  const [searchName, setSearchName] = useState("")
  const [filterAvailability, setFilterAvailability] = useState<{ value: string; label: string } | null>({
    value: "all",
    label: "Todos",
  })

  const showSnackbar = (message: string, options?: { variant: "error" | "success" | "info" | "warning" }) => {
    setSnackbar({ message, variant: options?.variant || "info" })
    setTimeout(() => setSnackbar(null), 3000)
  }

  const loadTurns = async () => {
    await makeQuery(
      null,
      "getTurns",
      {
        name: searchName || undefined,
        available: filterAvailability && filterAvailability.value !== "all" ? filterAvailability.value : undefined,
      },
      showSnackbar,
      (data) => setTurns(data),
      setLoading,
    )
  }

  useEffect(() => {
    loadTurns()
  }, [searchName, filterAvailability])

  const handleCreateOpen = () => {
    setFormData({ name: "", startTime: "", available: true })
    setIsCreateModalOpen(true)
  }

  const handleEditOpen = (turn: Turn) => {
    setSelectedTurn(turn)
    setFormData({
      name: turn.name,
      startTime: turn.startTime,
      available: turn.available,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteOpen = (turn: Turn) => {
    setSelectedTurn(turn)
    setIsDeleteModalOpen(true)
  }

  const closeAllModals = () => {
    setIsCreateModalOpen(false)
    setIsEditModalOpen(false)
    setIsDeleteModalOpen(false)
    setSelectedTurn(null)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.startTime) {
      showSnackbar("Complete los campos obligatorios (nombre y hora inicio)", { variant: "error" })
      return
    }

    await makeQuery(
      null,
      "createTurn",
      {
        name: formData.name,
        startTime: formData.startTime,
        available: formData.available,
      },
      showSnackbar,
      () => {
        showSnackbar("Turno creado exitosamente", { variant: "success" })
        setIsCreateModalOpen(false)
        loadTurns()
      },
      setLoading,
    )
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTurn) return

    if (!formData.name || !formData.startTime) {
      showSnackbar("Complete los campos obligatorios (nombre y hora inicio)", { variant: "error" })
      return
    }

    await makeQuery(
      null,
      "updateTurn",
      {
        id: selectedTurn._id,
        name: formData.name,
        startTime: formData.startTime,
        available: formData.available,
      },
      showSnackbar,
      () => {
        showSnackbar("Turno actualizado exitosamente", { variant: "success" })
        setIsEditModalOpen(false)
        loadTurns()
      },
      setLoading,
    )
  }

  const handleDelete = async () => {
    if (!selectedTurn) return

    await makeQuery(
      null,
      "deleteTurn",
      selectedTurn._id,
      showSnackbar,
      () => {
        showSnackbar("Turno eliminado exitosamente", { variant: "success" })
        setIsDeleteModalOpen(false)
        loadTurns()
      },
      setLoading,
    )
  }

  const sortedTurns = [...turns].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Turnos</h1>
            <p className="mt-2 text-gray-600">Gestiona los turnos disponibles para los pedidos</p>
          </div>
          <button
            onClick={handleCreateOpen}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            + Nuevo Turno
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full sm:w-64 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="w-full sm:w-64">
            <Select
              options={filterAvailabilityOptions}
              value={filterAvailability}
              onChange={(option) => setFilterAvailability(option)}
              placeholder="Filtrar por disponibilidad"
            />
          </div>
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

        {/* Loading */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Hora inicio</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Disponible</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedTurns.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No hay turnos cargados. Crea uno nuevo para comenzar.
                    </td>
                  </tr>
                ) : (
                  sortedTurns.map((turn) => (
                    <tr key={turn._id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{turn.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{turn.startTime}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            turn.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {turn.available ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditOpen(turn)}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteOpen(turn)}
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
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Crear Turno</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Turno 1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Hora inicio *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="availableCreate"
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="availableCreate" className="text-sm font-medium text-gray-900">
                    Disponible
                  </label>
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
        {isEditModalOpen && selectedTurn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-6 text-2xl font-bold text-gray-900">Editar Turno</h2>
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Turno 1"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900">Hora inicio *</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    id="availableEdit"
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="availableEdit" className="text-sm font-medium text-gray-900">
                    Disponible
                  </label>
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

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">Confirmar Eliminación</h2>
              <p className="mb-6 text-gray-600">
                ¿Estás seguro de que deseas eliminar el turno{" "}
                <span className="font-semibold text-gray-900">{selectedTurn?.name}</span>? Esta acción no se puede deshacer.
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