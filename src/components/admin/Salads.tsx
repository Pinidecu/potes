"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { makeQuery } from "../../utils/api"
import Select, { MultiValue } from "react-select"

const filterTypeOptions = [
    { value: "all", label: "Todos" },
    { value: "Ensalada", label: "Ensalada" },
    { value: "Tarta", label: "Tarta" },
]

type Option = { value: string; label: string }

interface Ingredient {
    _id: string
    name: string
    priceAsExtra: number
    type: "base" | "vegetal" | "premium" | "proteina" | "aderezo" | "extra"
}

interface Salad {
    _id: string
    name: string
    description: string
    base: any[]
    price: number
    image: string
    type: "Ensalada" | "Tarta"
}

export default function SaladsPage() {
    const [salads, setSalads] = useState<Salad[]>([])
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [loading, setLoading] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedSalad, setSelectedSalad] = useState<Salad | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        base: [] as string[],
        price: "",
        type: "Ensalada",
        image: null as File | null,
    })
    const [snackbar, setSnackbar] = useState<{
        message: string
        variant: "error" | "success" | "info" | "warning"
    } | null>(null)

    const [searchName, setSearchName] = useState("")
    const [filterType, setFilterType] = useState<{ value: string; label: string } | null>(
        { value: "all", label: "Todos" }
    )

    const showSnackbar = (message: string, options?: { variant: "error" | "success" | "info" | "warning" }) => {
        setSnackbar({ message, variant: options?.variant || "info" })
        setTimeout(() => setSnackbar(null), 3000)
    }

    const loadSalads = async () => {
        await makeQuery(
            null,
            "getSalads",
            {
                name: searchName || undefined,
                type: filterType && filterType.value !== "all" ? filterType.value : undefined,
            },
            showSnackbar,
            (data) => {
                setSalads(data)
            },
            setLoading,
        )
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

    useEffect(() => {
        loadSalads()
    }, [searchName, filterType]);

    const handleCreateOpen = () => {
        setFormData({ name: "", description: "", base: [], price: "", image: "" })
        setIsCreateModalOpen(true)
    }

    const handleEditOpen = (salad: Salad) => {
        setSelectedSalad(salad)
        console.log(salad)
        setFormData({
            name: salad.name,
            description: salad.description,
            base: salad.base.map((item) => item._id.toString()),
            price: salad.price.toString(),
            image: salad.image,
            type: salad.type || "Ensalada",
        })
        setIsEditModalOpen(true)
    }

    const handleDeleteOpen = (salad: Salad) => {
        setSelectedSalad(salad)
        setIsDeleteModalOpen(true)
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.price || formData.base.length === 0) {
            showSnackbar("Complete los campos obligatorios (nombre, precio y al menos una base)", { variant: "error" })
            return
        }

        const formDataToSend = new FormData()
        formDataToSend.append("name", formData.name)
        formDataToSend.append("description", formData.description)
        formDataToSend.append("price", formData.price)
        formDataToSend.append("base", JSON.stringify(formData.base))
        formDataToSend.append("type", formData.type)
        if (formData.image) formDataToSend.append("image", formData.image)

        await makeQuery(
            null,
            "createSalad",
            formDataToSend,
            showSnackbar,
            () => {
                showSnackbar("Ensalada creada exitosamente", { variant: "success" })
                setIsCreateModalOpen(false)
                loadSalads()
            },
            setLoading,
        )
    }

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.price || formData.base.length === 0) {
            showSnackbar("Complete los campos obligatorios (nombre, precio y al menos una base)", { variant: "error" })
            return
        }

        const imageToSend = formData.image instanceof File ? formData.image : null

        if (!selectedSalad) return

        const formDataToSend = new FormData()
        formDataToSend.append("id", selectedSalad._id)
        formDataToSend.append("name", formData.name)
        formDataToSend.append("description", formData.description)
        formDataToSend.append("base", JSON.stringify(formData.base))
        formDataToSend.append("price", Number.parseFloat(formData.price).toString())
        formDataToSend.append("type", formData.type)
        if (imageToSend) formDataToSend.append("image", imageToSend)

        await makeQuery(
            null,
            "updateSalad",
            { id: selectedSalad._id, form: formDataToSend },
            showSnackbar,
            () => {
                showSnackbar("Ensalada actualizada exitosamente", { variant: "success" })
                setIsEditModalOpen(false)
                loadSalads()
            },
            setLoading,
        )
    }

    const handleDelete = async () => {
        if (!selectedSalad) return

        await makeQuery(
            null,
            "deleteSalad",
            selectedSalad._id,
            showSnackbar,
            () => {
                showSnackbar("Ensalada eliminada exitosamente", { variant: "success" })
                setIsDeleteModalOpen(false)
                loadSalads()
            },
            setLoading,
        )
    }

    const closeAllModals = () => {
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        setIsDeleteModalOpen(false)
        setSelectedSalad(null)
    }

    const baseOptions: Option[] = ingredients
        .map((ing) => ({ value: ing._id, label: ing.name }))


    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Ensaladas</h1>
                        <p className="mt-2 text-gray-600">Gestiona todas las ensaladas del menú</p>
                    </div>
                    <button
                        onClick={handleCreateOpen}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        + Nueva Ensalada
                    </button>
                </div>

                {/* Filtros */}

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    {/* filtro por nombre */}
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="Buscar por nombre..."
                        className="w-full sm:w-64 rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    {/* filtro por tipo */}
                    <div className="w-full sm:w-64">
                        <Select
                            options={filterTypeOptions}
                            value={filterType}
                            onChange={(option) => setFilterType(option)}
                            placeholder="Filtrar por tipo"
                        />
                    </div>
                </div>

                {/* Snackbar */}
                {snackbar && (
                    <div
                        className={`fixed right-6 top-6 z-50 rounded-lg px-6 py-4 shadow-lg ${snackbar.variant === "error"
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
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Descripción</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Precio</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Base</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {salads.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            No hay ensaladas disponibles. Crea una nueva para comenzar.
                                        </td>
                                    </tr>
                                ) : (
                                    salads.map((salad) => (
                                        <tr key={salad._id} className="transition-colors hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{salad.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {salad.description || <span className="italic text-gray-400">Sin descripción</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">${salad.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {salad.base.length > 0 ? `${salad.base.length} ingrediente(s)` : <span className="italic text-gray-400">Sin base</span>}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditOpen(salad)}
                                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteOpen(salad)}
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
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Crear Ensalada</h2>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Ensalada César"
                                    />
                                </div>

                                {/* Type salad */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Tipo *</label>
                                    <Select
                                        options={filterTypeOptions.filter(option => option.value !== 'all')}
                                        value={filterTypeOptions.find(option => option.value === formData.type)}
                                        onChange={(option) => setFormData(prev => ({ ...prev, type: option ? option.value : 'Ensalada' }))}
                                        placeholder="Selecciona el tipo de ensalada"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descripción de la ensalada"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Precio *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Imagen *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />

                                    <p className="mt-1 text-sm text-gray-500">Formato: .jpg, .jpeg, .png</p>

                                    {formData.image && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-sm font-medium text-gray-900">Vista previa:</p>
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Vista previa"
                                                className="max-h-48 w-auto rounded-md border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Base (Ingredientes) *</label>
                                    <Select<Option, true>
                                        isMulti
                                        options={baseOptions}
                                        value={baseOptions.filter((o) => formData.base.includes(o.value))}
                                        onChange={(selected: MultiValue<Option>) =>
                                            setFormData((prev) => ({ ...prev, base: selected.map((s) => s.value) }))
                                        }
                                    />
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
                        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                            <h2 className="mb-6 text-2xl font-bold text-gray-900">Editar Ensalada</h2>
                            <form onSubmit={handleEdit} className="space-y-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Nombre *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Ej: Ensalada César"
                                    />
                                </div>

                                {/* Type salad */}

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Tipo de Ensalada *</label>
                                    <Select
                                        options={filterTypeOptions.filter(option => option.value !== 'all')}
                                        value={filterTypeOptions.find(option => option.value === formData.type)}
                                        onChange={(option) => setFormData(prev => ({ ...prev, type: option ? option.value : 'Ensalada' }))}
                                        placeholder="Selecciona el tipo de ensalada"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Descripción</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Descripción de la ensalada"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Precio *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Imagen *</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
                                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                    />

                                    <p className="mt-1 text-sm text-gray-500">Formato: .jpg, .jpeg, .png</p>
                                    {formData.image && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-sm font-medium text-gray-900">Vista previa:</p>
                                            <img
                                                src={typeof formData.image === "string" ? formData.image : URL.createObjectURL(formData.image)}
                                                alt="Vista previa"
                                                className="max-h-48 w-auto rounded-md border border-gray-300"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-900">Base (Ingredientes) *</label>
                                    <Select<Option, true>
                                        isMulti
                                        options={baseOptions}
                                        value={baseOptions.filter((o) => formData.base.includes(o.value))}
                                        onChange={(selected: MultiValue<Option>) =>
                                            setFormData((prev) => ({ ...prev, base: selected.map((s) => s.value) }))
                                        }
                                    />
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
                                ¿Estás seguro de que deseas eliminar la ensalada{" "}
                                <span className="font-semibold text-gray-900">{selectedSalad?.name}</span>? Esta acción no se puede
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
