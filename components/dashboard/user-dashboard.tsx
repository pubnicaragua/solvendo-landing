"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Package, CreditCard, Download, Plus, Edit, Trash2, Monitor, Smartphone, Check } from "lucide-react"

interface User {
  name: string
  email: string
  plan: string
}

interface UserDashboardProps {
  user: User
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "VISA", last4: "4578", isDefault: true },
    { id: 2, type: "VISA", last4: "4578", isDefault: false },
    { id: 3, type: "VISA", last4: "4578", isDefault: false },
  ])

  const [showAddCard, setShowAddCard] = useState(false)
  const [showAddUser, setShowAddUser] = useState(false)
  const [showChangeCard, setShowChangeCard] = useState<number | null>(null)

  const planFeatures = [
    "Límite de 50 empleados",
    "Registra más de 200 productos",
    "Integración API con pasarelas",
    "DTE Ilimitadas",
    "App backoffice",
    "Control de inventario",
  ]

  const handleSetDefaultCard = (cardId: number) => {
    setPaymentMethods((prev) =>
      prev.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      })),
    )
    setShowChangeCard(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resumen de plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {planFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cuenta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar roles
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar sucursales
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Método de pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map((card) => (
                <div key={card.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{card.type}</div>
                    <div className="text-sm text-gray-600">XXXX-XXXX-XXXX-{card.last4}</div>
                    {card.isDefault && <Badge variant="secondary">Tarjeta en uso</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    {!card.isDefault && (
                      <Button variant="outline" size="sm" onClick={() => setShowChangeCard(card.id)}>
                        Usar como principal
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full" onClick={() => setShowAddCard(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar método de pago
              </Button>
            </CardContent>
          </Card>

          {/* App Downloads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Descarga de apps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Backoffice:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="h-4 w-4 mr-2" />
                      Mac
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Monitor className="h-4 w-4 mr-2" />
                      Windows
                    </Button>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">POS:</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Mac
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Windows
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* User Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.plan}</p>
                  <p className="text-2xl font-bold text-blue-600">$53</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add User */}
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" onClick={() => setShowAddUser(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Añade un nuevo usuario
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Card Dialog */}
      <Dialog open={showAddCard} onOpenChange={setShowAddCard}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tarjeta de crédito o débito</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-name">Nombre del titular</Label>
              <Input id="card-name" placeholder="Nombre" />
            </div>
            <div>
              <Label htmlFor="card-number">Número de la tarjeta</Label>
              <Input id="card-number" placeholder="0000-0000-0000-0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="card-expiry">Fecha de vencimiento</Label>
                <Input id="card-expiry" placeholder="MM/AA" />
              </div>
              <div>
                <Label htmlFor="card-cvc">Código de seguridad</Label>
                <Input id="card-cvc" placeholder="CVC" />
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowAddCard(false)}>
              Agregar tarjeta
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name">Nombre completo</Label>
              <Input id="user-name" placeholder="Nombre del usuario" />
            </div>
            <div>
              <Label htmlFor="user-email">Correo electrónico</Label>
              <Input id="user-email" type="email" placeholder="correo@ejemplo.com" />
            </div>
            <div>
              <Label htmlFor="user-role">Rol</Label>
              <Input id="user-role" placeholder="Administrador, Empleado, etc." />
            </div>
            <Button className="w-full" onClick={() => setShowAddUser(false)}>
              Agregar usuario
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Default Card Dialog */}
      {showChangeCard && (
        <Dialog open={!!showChangeCard} onOpenChange={() => setShowChangeCard(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Deseas cambiar esta tarjeta como principal?</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <div className="text-lg font-medium">
                XXXX-XXXX-XXXX-{paymentMethods.find((c) => c.id === showChangeCard)?.last4}
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => setShowChangeCard(null)}>
                  Cancelar cambio
                </Button>
                <Button onClick={() => handleSetDefaultCard(showChangeCard)}>Confirmar cambio</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
