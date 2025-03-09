import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Cliente } from 'src/models/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private clientes: Cliente[] = [];
  private storageKey = 'clientes';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.clientes = (await this.storage.get(this.storageKey)) || [];
  }

  async getClientes(): Promise<Cliente[]> {
    return this.clientes;
  }

  async addCliente(cliente: Cliente) {
    this.clientes.push(cliente);
    await this.storage.set(this.storageKey, this.clientes);
  }

  async updateCliente(clienteEditado: Cliente) {
    const index = this.clientes.findIndex(c => c.id === clienteEditado.id);
    if (index > -1) {
      this.clientes[index] = clienteEditado;
      await this.storage.set(this.storageKey, this.clientes);
    }
  }

  async aumentarSaldo(clienteId: number, monto: number) {
    const index = this.clientes.findIndex(c => c.id === clienteId);
    if (index > -1) {
      this.clientes[index].saldo += monto;
      await this.storage.set(this.storageKey, this.clientes);
    }
  }
  

  async deleteCliente(id: number) {
    this.clientes = this.clientes.filter(c => c.id !== id);
    await this.storage.set(this.storageKey, this.clientes);
  }
}
