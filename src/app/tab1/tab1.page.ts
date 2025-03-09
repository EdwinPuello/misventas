import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Producto, ProductoService } from '../service/products.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  productos: Producto[] = [];

  constructor(private productoService: ProductoService, private alertCtrl: AlertController) {}

  async ngOnInit() {
    this.productos = await this.productoService.getProductos();
  }

  async ionViewWillEnter() {
    await this.cargarProductos(); // Se ejecuta cada vez que el usuario entra al tab
  }

  async cargarProductos() {

  setTimeout(async () => {
    this.productos = await this.productoService.getProductos();
  }, 500 );
  }

  async eliminarProducto(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que quieres eliminar este producto?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const eliminado = await this.productoService.deleteProducto(id);
            if (eliminado) {
              this.productos = await this.productoService.getProductos();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  

  async agregarProducto() {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Producto',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre' },
        { name: 'precio', type: 'number', placeholder: 'Precio' },
        { name: 'imagen', type: 'text', placeholder: 'URL Imagen' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            const nuevoProducto: Producto = {
              id: Date.now(),
              nombre: data.nombre,
              precio: parseFloat(data.precio),
              imagen: data.imagen
            };
            await this.productoService.addProducto(nuevoProducto);
            this.productos = await this.productoService.getProductos();
          }
        }
      ]
    });
    await alert.present();
  }

  async editarProducto(producto: Producto) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Producto',
      cssClass: 'custom-alert', 
      inputs: [
        { name: 'nombre', type: 'text', value: producto.nombre, placeholder: 'Nombre' },
        { name: 'precio', type: 'number', value: producto.precio.toString(), placeholder: 'Precio' },
        { name: 'imagen', type: 'text', value: producto.imagen, placeholder: 'URL Imagen' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async data => {
            const productoEditado: Producto = {
              ...producto,
              nombre: data.nombre,
              precio: parseFloat(data.precio),
              imagen: data.imagen
            };
            await this.productoService.updateProducto(productoEditado);
            this.productos = await this.productoService.getProductos();
          }
        }
      ]
    });
    await alert.present();
  }
}
