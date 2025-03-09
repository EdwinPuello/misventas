import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Producto } from './products.service';
import { ClienteService } from './clientes.service';


export interface Venta {
  id: number | string | any
  clienteId: number;
  clienteNombre: string;
  productos: Producto[];
  total: number;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventas: Venta[] = [];
  private storageKey = 'ventas';

  constructor(private storage: Storage, private clienteService: ClienteService) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.ventas = (await this.storage.get(this.storageKey)) || [];
  }

  async getVentas(): Promise<Venta[]> {
    return this.ventas;
  }

  async eliminarVenta(id: string) {
    this.ventas = this.ventas.filter((venta:any) => venta.id !== id);
  }

  async addVenta(clienteId: number, clienteNombre: string, productos: Producto[]) {
    const total = productos.reduce((sum, prod) => sum + prod.precio, 0);
    const nuevaVenta: Venta = {
      id: Date.now(),
      clienteId,
      clienteNombre,
      productos,
      total,
      fecha: new Date().toISOString()
    };

    this.ventas.push(nuevaVenta);
    await this.storage.set(this.storageKey, this.ventas);

    // Actualizar el saldo del cliente
    await this.clienteService.aumentarSaldo(clienteId, total);
  }
}
