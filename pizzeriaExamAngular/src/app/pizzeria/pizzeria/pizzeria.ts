import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapturaPedido } from '../captura-pedido/captura-pedido';
import { DetallePedido } from '../detalle-pedido/detalle-pedido';
import { ConsultaVentas } from '../consulta-ventas/consulta-ventas';

@Component({
  selector: 'app-pizzeria',
  standalone: true,
  imports: [CommonModule, CapturaPedido, DetallePedido, ConsultaVentas],
  templateUrl: './pizzeria.html'
})
export class Pizzeria {
  @ViewChild(CapturaPedido) capturaComponent!: CapturaPedido;
}