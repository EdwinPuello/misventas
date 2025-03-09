import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Producto, ProductoService } from '../service/products.service';
import { Cliente } from 'src/models/cliente';
import { ClienteService } from '../service/clientes.service';
import { VentaService } from '../service/venta.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  productos: Producto[] = [];
  clientes: Cliente[] = [];
  productosSeleccionados: Producto[] = [];
  clienteSeleccionado: Cliente | null = null;

  constructor(
    private productoService: ProductoService,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private alertCtrl: AlertController
  ) {}

  
  async ngOnInit() {
   this.getInfo();
  }

  getInfo(){
    setTimeout(async () => {
      this.productos = await this.productoService.getProductos();
      this.clientes = await this.clienteService.getClientes();
    }, 1000);
  }

  quitarProducto(productoAEliminar: Producto) {
    this.productosSeleccionados = this.productosSeleccionados.filter(
      producto => producto.id !== productoAEliminar.id
    );
  }

  filtro: string = '';

productosFiltrados() {
  return this.productos.filter(producto =>
    producto.nombre.toLowerCase().includes(this.filtro.toLowerCase())
  );
}

get totalVenta(): number {
  return this.productosSeleccionados.reduce((sum, prod) => sum + prod.precio, 0);
}

  
  seleccionarProducto(producto: Producto) {
    this.productosSeleccionados.push(producto);
  }

  seleccionarCliente(cliente: Cliente) {
    this.clienteSeleccionado = cliente;
  }

  async realizarVenta() {
    if (!this.clienteSeleccionado || this.productosSeleccionados.length === 0) {
      const alerta = await this.alertCtrl.create({
        header: 'Error',
        message: 'Debe seleccionar un cliente y al menos un producto.',
        buttons: ['OK']
      });
      await alerta.present();
      return;
    }

    const total = this.productosSeleccionados.reduce((sum, prod) => sum + prod.precio, 0);

    const totalFormateado = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(total);

    const confirmacion = await this.alertCtrl.create({
      header: 'Confirmar Venta',
      message: `¿Desea vender ${this.productosSeleccionados.length} productos a ${this.clienteSeleccionado.nombreCompleto} por un total de ${totalFormateado} Pesos?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: async () => {
            this.getInfo()
            await this.ventaService.addVenta(
              this.clienteSeleccionado!.id,
              this.clienteSeleccionado!.nombreCompleto,
              this.productosSeleccionados
            );
            this.productosSeleccionados = [];
            setTimeout(() => {
              this.clienteSeleccionado = null;
            });
          }
        }
      ]
    });

    await confirmacion.present();
  }
}
