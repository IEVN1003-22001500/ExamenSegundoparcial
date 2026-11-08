import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { PizzeriaapiService } from '../pizzeriaapi.service';
import { PedidoGuardar } from '../pizzeria-exam';

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-pedido.html'
})
export class DetallePedido {
  @Input() formClienteParent!: FormGroup;
  indexSeleccionado: number = -1;

  constructor(public pizzeriaService: PizzeriaapiService) {}

  seleccionarFila(i: number): void {
    this.indexSeleccionado = i;
  }

  quitar(): void {
    if (this.indexSeleccionado >= 0) {
      this.pizzeriaService.quitarPizza(this.indexSeleccionado);
      this.indexSeleccionado = -1;
    } else {
      alert('Selecciona una fila de la tabla para quitar');
    }
  }

  terminar(): void {
    if (!this.formClienteParent || this.formClienteParent.invalid) {
      alert('Ingresa Nombre, Dirección y Teléfono del cliente');
      return;
    }

    const detalles = this.pizzeriaService.detallesActuales;
    if (detalles.length === 0) {
      alert('No has agregado ninguna pizza al pedido');
      return;
    }

    const totalCalculado = this.pizzeriaService.calcularTotalPedido();
    const datosCliente = this.formClienteParent.value;

    // Corrección de comillas invertidas en el confirm
    const confirmacion = confirm(`¿Confirmar pedido de ${datosCliente.nombre} por un total de $${totalCalculado}?`);
    if (!confirmacion) return;

    const payload: PedidoGuardar = {
      nombre: datosCliente.nombre,
      direccion: datosCliente.direccion,
      telefono: datosCliente.telefono,
      fecha: datosCliente.fecha,
      total: totalCalculado,
      detalles: detalles.map(item => ({
        tamano: item.tamano,
        ingredientes: item.ingredientes.length > 0 ? item.ingredientes.join(', ') : 'Sin ingredientes extra',
        num_pizzas: item.numPizzas,
        subtotal: item.subtotal
      }))
    };

    this.pizzeriaService.guardarPedido(payload).subscribe({
      next: () => {
        // Corrección de comillas invertidas en el alert
        alert(`¡Pedido guardado correctamente!\nImporte total a pagar: $${totalCalculado}`);
        this.pizzeriaService.limpiarOrden();
        this.formClienteParent.reset();
      },
      error: (err) => {
        console.error(err);
        alert('Ocurrió un error al guardar el pedido');
      }
    });
  }
}