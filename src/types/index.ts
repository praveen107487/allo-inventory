export type Inventory = {
  warehouseId: string
  warehouseName: string
  totalStock: number
  reservedStock: number
  availableStock: number
}

export type Product = {
  id: string
  name: string
  price: number
  inventories: Inventory[]
}

export type Reservation = {
  id: string
  quantity: number
  status: string
  expiresAt: string
  product: {
    name: string
    price: number
  }
  warehouse: {
    name: string
    city: string
  }
}