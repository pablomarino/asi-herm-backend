export interface Item {
  _id: { $oid: string };
  name: string;
  reference: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
}

export interface Box {
  _id: { $oid: string };
  reference: string;
  size: string;
  location: string;
  itemReference: string; // Referencia a Item
}

export interface OrderItem {
  itemReference: string; // Referencia a Item
  numberItems: number; // Cantidad de items
}

export interface Order {
  _id: { $oid: string };
  reference: string;
  date: Date;
  state: string;
  items: OrderItem[]; // Array de OrderItem
}
