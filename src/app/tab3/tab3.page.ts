import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ClienteService } from '../service/clientes.service';
import { Cliente } from 'src/models/cliente';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = []; // Lista filtrada
  constructor(private clienteService: ClienteService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    await this.cargarClientes();
  }

  async ionViewWillEnter() {
    await this.cargarClientes(); // Cargar clientes cada vez que entremos al tab
  }

  async cargarClientes() {
    setTimeout(async () => {
      this.clientes = await this.clienteService.getClientes();
      this.clientesFiltrados = this.clientes;
    }, 500);
  }

  filtrarClientes(event: any) {
    const texto = event.target.value.toLowerCase();
    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombreCompleto.toLowerCase().includes(texto)
    );
  }

  async agregarCliente() {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Cliente',
      cssClass: 'custom-alert',
      inputs: [
        { name: 'nombreCompleto', type: 'text', placeholder: 'Nombre y Apellido' },
        { name: 'saldo', type: 'number', placeholder: 'Saldo inicial', value: '0' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            const nuevoCliente: Cliente = {
              id: Date.now(),
              nombreCompleto: data.nombreCompleto,
              saldo: parseFloat(data.saldo) || 0
            };
            await this.clienteService.addCliente(nuevoCliente);
            await this.cargarClientes();
          }
        }
      ]
    });
    await alert.present();
  }

  async editarCliente(cliente: Cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Cliente',
      cssClass: 'custom-alert',
      inputs: [
        { name: 'nombreCompleto', type: 'text', value: cliente.nombreCompleto, placeholder: 'Nombre y Apellido' },
        { name: 'saldo', type: 'number', value: cliente.saldo.toString(), placeholder: 'Saldo' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            const clienteEditado: Cliente = {
              ...cliente,
              nombreCompleto: data.nombreCompleto,
              saldo: parseFloat(data.saldo) || 0
            };
            await this.clienteService.updateCliente(clienteEditado);
            await this.cargarClientes();
          }
        }
      ]
    });
    await alert.present();
  }

  async pagarTodo(cliente: Cliente) {
    cliente.saldo = 0;
    await this.clienteService.updateCliente(cliente);
    await this.cargarClientes();
  }
  
  async confirmarPagarTodo(cliente: Cliente) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Pago',
      message: `¿Estás seguro de que quieres poner en $0 el saldo de <strong>${cliente.nombreCompleto}</strong>?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, Pagar',
          handler: async () => {
            await this.pagarTodo(cliente);
          }
        }
      ]
    });
    await alert.present();
  }

  async eliminarCliente(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este cliente?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.clienteService.deleteCliente(id);
            await this.cargarClientes();
          }
        }
      ]
    });
    await alert.present();
  }
}
