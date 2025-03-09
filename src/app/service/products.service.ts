// 1. Modelo de Producto
export interface Producto {
    id: number;
    nombre: string;
    precio: number;
    imagen: string;
}

// 2. Servicio para manejar productos en almacenamiento local
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; // ✅ Agregamos la importación faltante

@Injectable({ providedIn: 'root' })
export class ProductoService {
    private productos: Producto[] = [];
    private storageKey = 'productos';

    constructor(private storage: Storage) {
        this.init();
    }

    async init() {
        await this.storage.create();
        this.productos = (await this.storage.get(this.storageKey)) || [];
    }

    async getProductos(): Promise<Producto[]> {
        return this.productos;
    }

    async addProducto(producto: Producto) {
        this.productos.push(producto);
        await this.storage.set(this.storageKey, this.productos);
    }

    async updateProducto(productoEditado: Producto): Promise<boolean> {
        const index = this.productos.findIndex(p => p.id === productoEditado.id);
        if (index > -1) {
            this.productos[index] = productoEditado;
            await this.storage.set(this.storageKey, this.productos);
            return true; // ✅ Confirmamos que se actualizó
        }
        return false; // ❌ Si no se encontró el producto
    }

    async deleteProducto(id: number): Promise<boolean> {
        const index = this.productos.findIndex(p => p.id === id);
        if (index > -1) {
          this.productos.splice(index, 1); // Elimina el producto del array
          await this.storage.set(this.storageKey, this.productos); // Guarda los cambios
          return true; // ✅ Eliminación exitosa
        }
        return false; // ❌ No se encontró el producto
      }
      
}
