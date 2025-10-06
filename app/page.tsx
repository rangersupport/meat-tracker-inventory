"use client"

import { useState } from "react"
import { format } from "date-fns"

type InventoryItem = {
  id: string
  productName: string
  weight: number
  unit: "kg" | "lbs"
  category: string
  dateAdded: Date
  expiryDate: Date
  lotNumber: string
  status: "fresh" | "warning" | "expired"
}

export default function MeatInventoryTracker() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      productName: "Carne de Res Premium",
      weight: 150.5,
      unit: "kg",
      category: "Res",
      dateAdded: new Date(2025, 0, 10),
      expiryDate: new Date(2025, 2, 15),
      lotNumber: "LOT-001",
      status: "fresh",
    },
    {
      id: "2",
      productName: "Carne de Cerdo",
      weight: 45.0,
      unit: "kg",
      category: "Cerdo",
      dateAdded: new Date(2025, 0, 8),
      expiryDate: new Date(2025, 1, 20),
      lotNumber: "LOT-002",
      status: "warning",
    },
    {
      id: "3",
      productName: "Pechuga de Pollo",
      weight: 200.0,
      unit: "kg",
      category: "Pollo",
      dateAdded: new Date(2025, 0, 12),
      expiryDate: new Date(2025, 1, 25),
      lotNumber: "LOT-003",
      status: "fresh",
    },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
    productName: "",
    weight: "",
    unit: "kg" as "kg" | "lbs",
    category: "",
    expiryDate: "",
    lotNumber: "",
  })

  const addInventoryItem = () => {
    if (!newItem.productName || !newItem.weight) return

    const item: InventoryItem = {
      id: Date.now().toString(),
      productName: newItem.productName,
      weight: Number.parseFloat(newItem.weight),
      unit: newItem.unit,
      category: newItem.category,
      dateAdded: new Date(),
      expiryDate: new Date(newItem.expiryDate),
      lotNumber: newItem.lotNumber,
      status: "fresh",
    }

    setInventory([...inventory, item])
    setShowAddModal(false)
    setNewItem({
      productName: "",
      weight: "",
      unit: "kg",
      category: "",
      expiryDate: "",
      lotNumber: "",
    })
  }

  const convertWeight = (weight: number, from: "kg" | "lbs", to: "kg" | "lbs") => {
    if (from === to) return weight
    if (from === "kg" && to === "lbs") return weight * 2.20462
    return weight / 2.20462
  }

  const totalWeight = inventory.reduce((sum, item) => sum + convertWeight(item.weight, item.unit, "kg"), 0)
  const warningItems = inventory.filter((item) => item.status === "warning").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-red-950 to-stone-900">
      <div className="max-w-7xl mx-auto p-6">
        <header className="bg-gradient-to-r from-red-900 to-amber-700 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-4xl">
                ⚖️
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">MeatTracker</h1>
                <p className="text-amber-100">Sistema de Inventario Inteligente by Comercializadora CasaBlanca</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 text-red-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center gap-2 shadow-lg"
            >
              <span className="text-xl">➕</span>
              Agregar Producto
            </button>
          </div>
        </header>

        <nav className="bg-white/10 backdrop-blur rounded-2xl p-2 mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "dashboard" ? "bg-amber-500 text-red-950 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="text-xl">📈</span> Panel Principal
          </button>
          <button
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "inventory" ? "bg-amber-500 text-red-950 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="text-xl">📦</span> Inventario
          </button>
          <button
            onClick={() => setActiveTab("add-weight")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === "add-weight" ? "bg-amber-500 text-red-950 shadow-lg" : "text-white hover:bg-white/10"
            }`}
          >
            <span className="text-xl">⚖️</span> Registrar Peso
          </button>
        </nav>

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-800 to-red-900 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">📦</span>
                  <span className="text-3xl font-bold">{inventory.length}</span>
                </div>
                <h3 className="text-lg font-semibold">Total Productos</h3>
                <p className="text-white text-sm">En inventario actual</p>
              </div>

              <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">⚖️</span>
                  <span className="text-3xl font-bold">{totalWeight.toFixed(1)}</span>
                </div>
                <h3 className="text-lg font-semibold">Total Peso (kg)</h3>
                <p className="text-white text-sm">Peso total en inventario</p>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-5xl">⚠️</span>
                  <span className="text-3xl font-bold">{warningItems}</span>
                </div>
                <h3 className="text-lg font-semibold">Alertas</h3>
                <p className="text-white text-sm">Productos por vencer</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
              <div className="space-y-3">
                {inventory.slice(0, 5).map((item) => (
                  <div key={item.id} className="bg-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-950/20 rounded-lg flex items-center justify-center text-2xl">
                        📦
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{item.productName}</h3>
                        <p className="text-gray-300 text-sm">
                          {item.weight} {item.unit} - Lote: {item.lotNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-300 text-sm">{format(item.dateAdded, "dd/MM/yyyy")}</p>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          item.status === "fresh"
                            ? "bg-green-500/20 text-green-300"
                            : item.status === "warning"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : "bg-red-500/20 text-red-300"
                        }`}
                      >
                        {item.status === "fresh" ? "Fresco" : item.status === "warning" ? "Por vencer" : "Vencido"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                />
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-white font-semibold">Producto</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Peso</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Categoría</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Fecha Ingreso</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Vencimiento</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Lote</th>
                      <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 text-white font-medium">{item.productName}</td>
                        <td className="px-6 py-4 text-gray-300">
                          {item.weight} {item.unit}
                          <span className="text-xs text-gray-400 ml-2">
                            ({convertWeight(item.weight, item.unit, item.unit === "kg" ? "lbs" : "kg").toFixed(2)}{" "}
                            {item.unit === "kg" ? "lbs" : "kg"})
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300">{item.category}</td>
                        <td className="px-6 py-4 text-gray-300">{format(item.dateAdded, "dd/MM/yyyy")}</td>
                        <td className="px-6 py-4 text-gray-300">{format(item.expiryDate, "dd/MM/yyyy")}</td>
                        <td className="px-6 py-4 text-gray-300">{item.lotNumber}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === "fresh"
                                ? "bg-green-500/20 text-green-300"
                                : item.status === "warning"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {item.status === "fresh" ? "Fresco" : item.status === "warning" ? "Alerta" : "Vencido"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "add-weight" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Registrar Nuevo Peso</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Nombre del Producto</label>
                  <input
                    type="text"
                    value={newItem.productName}
                    onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                    placeholder="Ej: Carne de Res Premium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-2">Peso</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newItem.weight}
                      onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                      placeholder="150.5"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-2">Unidad</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as "kg" | "lbs" })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-800"
                    >
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="lbs">Libras (lbs)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Categoría</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-800"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="Res">Res</option>
                    <option value="Cerdo">Cerdo</option>
                    <option value="Pollo">Pollo</option>
                    <option value="Cordero">Cordero</option>
                    <option value="Embutidos">Embutidos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-800"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Número de Lote</label>
                  <input
                    type="text"
                    value={newItem.lotNumber}
                    onChange={(e) => setNewItem({ ...newItem, lotNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                    placeholder="LOT-001"
                  />
                </div>

                <button
                  onClick={addInventoryItem}
                  className="w-full bg-gradient-to-r from-red-900 to-amber-700 text-white py-4 rounded-xl font-bold hover:from-red-800 hover:to-amber-600 transition-all shadow-lg"
                >
                  Agregar al Inventario
                </button>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-white mb-6">Agregar Producto Rápido</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={newItem.productName}
                  onChange={(e) => setNewItem({ ...newItem, productName: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                />
                <div className="flex gap-4">
                  <input
                    type="number"
                    placeholder="Peso"
                    value={newItem.weight}
                    onChange={(e) => setNewItem({ ...newItem, weight: e.target.value })}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-800"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value as "kg" | "lbs" })}
                    className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-red-800"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 rounded-xl text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      addInventoryItem()
                    }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-900 to-amber-700 rounded-xl text-white font-semibold hover:from-red-800 hover:to-amber-600 transition-all"
                  >
                    Agregar
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