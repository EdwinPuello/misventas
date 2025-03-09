import { Component, OnInit } from '@angular/core';
import { Venta, VentaService } from '../service/venta.service';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = []; // Lista filtrada para mostrar
  fechaSeleccionada: string = ''; // Fecha seleccionada en formato YYYY-MM-DD
  busquedaCliente: string = ''; // Texto ingresado en el buscador
  mostrarRestablecerFecha: boolean = false; // Mostrar botón para restablecer la fecha

  constructor(private modalController: ModalController,private ventaService: VentaService,private alertCtrl: AlertController) {}

  async ngOnInit() {
    this.obtenerVentas();
  }

  async obtenerVentas() {
    setTimeout(async () => {
      this.ventas = await this.ventaService.getVentas();
      this.ventas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      this.filtrarVentas(); // Aplicar filtro inicial
    }, 500);
  }

    // Restablecer todas las ventas sin filtro de fecha
    restablecerFecha() {
      this.mostrarRestablecerFecha = false;
      this.ventasFiltradas = [...this.ventas];  // Restaurar todas las ventas
    }

    // Filtrar las ventas por la fecha seleccionada
    filtrarPorFecha(event: any) {
      this.mostrarRestablecerFecha = true
      const fechaSeleccionada = event.detail.value;
      this.ventasFiltradas = this.ventas.filter(venta => {
        const fechaVenta = new Date(venta.fecha);
        const fechaSeleccionadaObj = new Date(fechaSeleccionada);
        return (
          fechaVenta.getDate() === fechaSeleccionadaObj.getDate() &&
          fechaVenta.getMonth() === fechaSeleccionadaObj.getMonth() &&
          fechaVenta.getFullYear() === fechaSeleccionadaObj.getFullYear()
        );
      });
      this.modalController.dismiss();  // Cierra el modal
    }

  filtrarVentas() {
    this.ventasFiltradas = this.ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0]; // Convertir a YYYY-MM-DD
      const coincideFecha = this.fechaSeleccionada ? fechaVenta === this.fechaSeleccionada : true;
      const coincideCliente = this.busquedaCliente
        ? venta.clienteNombre.toLowerCase().includes(this.busquedaCliente.toLowerCase())
        : true;

      return coincideFecha && coincideCliente;
    });
  }

  async eliminarVenta(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Está seguro de que desea eliminar esta venta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.ventaService.eliminarVenta(id);
            this.obtenerVentas();
          }
        }
      ]
    });

    await alert.present();
  }
}
