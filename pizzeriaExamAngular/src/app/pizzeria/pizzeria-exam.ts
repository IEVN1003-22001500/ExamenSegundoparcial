export interface ItemPizza {
  tamano: string;
  precioTamano: number;
  ingredientes: string[];
  numPizzas: number;
  subtotal: number;
}

export interface PedidoGuardar {
  nombre: string;
  direccion: string;
  telefono: string;
  fecha: string;
  total: number;
  dia_semana?: string; 
  mes?: string;        
  detalles: {
    tamano: string;
    ingredientes: string;
    num_pizzas: number;
    subtotal: number;
  }[];
}

export interface VentaCliente {
  id: number; // Perfectamente alineado con tu tabla de MySQL y el backend
  nombre: string;
  direccion: string;
  telefono: string;
  total: number;
  fecha: string;
  dia_semana: string;
  mes: string;
}