import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PizzeriaapiService } from '../pizzeriaapi.service';
import { VentaCliente } from '../pizzeria-exam';

@Component({
  selector: 'app-consulta-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consulta-ventas.html'
})
export class ConsultaVentas implements OnInit {
  // Variables separadas para evitar cruces entre días y meses
  filtroDia: string = 'lunes';
  filtroMes: string = 'enero';
  tipoConsulta: 'dia' | 'mes' = 'dia';

  ventas: VentaCliente[] = [];
  totalAcumulado: number = 0;
  detalleSeleccionado: any[] = [];
  mostrarModalDetalle: boolean = false;

  constructor(private pizzeriaService: PizzeriaapiService) {}

  ngOnInit(): void {
    this.consultarVentasPorDia();
  }

  consultarVentasPorDia(): void {
    this.tipoConsulta = 'dia';
    this.pizzeriaService.getVentasPorDia(this.filtroDia).subscribe({
      next: (res) => {
        this.ventas = res.ventas;
        this.totalAcumulado = res.total_acumulado;
      },
      error: (err) => console.error('Error al consultar ventas por día:', err)
    });
  }

  consultarVentasPorMes(): void {
    this.tipoConsulta = 'mes';
    this.pizzeriaService.getVentasPorMes(this.filtroMes).subscribe({
      next: (res) => {
        this.ventas = res.ventas;
        this.totalAcumulado = res.total_acumulado;
      },
      error: (err) => alert('Ingresa un mes válido (ej. enero, febrero, etc.)')
    });
  }

  verDetalle(idpedido: number): void {
    this.pizzeriaService.getDetallePedido(idpedido).subscribe({
      next: (res) => {
        this.detalleSeleccionado = res.detalles;
        this.mostrarModalDetalle = true;
      },
      error: (err) => console.error('Error al obtener detalle del pedido:', err)
    });
  }

  cerrarModal(): void {
    this.mostrarModalDetalle = false;
  }
}