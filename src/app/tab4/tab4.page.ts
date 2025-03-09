import { Component, OnInit } from '@angular/core';
import { Venta, VentaService } from '../service/venta.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  ventas: Venta[] = [];

  constructor(private ventaService: VentaService,private alertCtrl: AlertController) {}

  async ngOnInit() {
    this.obtenerVentas();
  }

  async obtenerVentas() {
    setTimeout(async () => {
      this.ventas = await this.ventaService.getVentas();
      // Ordenar las ventas por fecha (de más reciente a más antigua)
      this.ventas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    }, 500);
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
