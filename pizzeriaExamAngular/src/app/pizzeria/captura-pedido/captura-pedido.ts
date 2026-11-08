import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PizzeriaapiService } from '../pizzeriaapi.service';
import { ItemPizza, PedidoGuardar } from '../pizzeria-exam';

@Component({
  selector: 'app-captura-pedido',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './captura-pedido.html'
})
export class CapturaPedido implements OnInit {
  formCliente!: FormGroup;
  formPizza!: FormGroup;

  tamanosDisponibles = [
    { label: 'Chica $40', valor: 'Chica', precio: 40 },
    { label: 'Mediana $80', valor: 'Mediana', precio: 80 },
    { label: 'Grande $120', valor: 'Grande', precio: 120 }
  ];

  constructor(
    private fb: FormBuilder,
    public pizzeriaService: PizzeriaapiService
  ) {}

  ngOnInit(): void {
    const hoy = new Date().toISOString().split('T')[0];

    this.formCliente = this.fb.group({
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      fecha: [hoy, Validators.required]
    });

    this.formPizza = this.fb.group({
      tamano: ['Chica', Validators.required],
      jamon: [false],
      pina: [false],
      champinones: [false],
      numPizzas: [1, [Validators.required, Validators.min(1)]]
    });
  }

  agregarPizza(): void {
    if (this.formPizza.invalid) {
      alert('Ingresa una cantidad válida de pizzas');
      return;
    }

    const valPizza = this.formPizza.value;
    const tamanoSel = this.tamanosDisponibles.find(t => t.valor === valPizza.tamano);
    const precioBase = tamanoSel ? tamanoSel.precio : 40;

    const ingredientesSel: string[] = [];
    let costoIngredientes = 0;

    if (valPizza.jamon) { ingredientesSel.push('Jamón'); costoIngredientes += 10; }
    if (valPizza.pina) { ingredientesSel.push('Piña'); costoIngredientes += 10; }
    if (valPizza.champinones) { ingredientesSel.push('Champiñones'); costoIngredientes += 10; }

    const numPizzas = parseInt(valPizza.numPizzas, 10);
    const subtotal = (precioBase + costoIngredientes) * numPizzas;

    const item: ItemPizza = {
      tamano: valPizza.tamano,
      precioTamano: precioBase,
      ingredientes: ingredientesSel,
      numPizzas: numPizzas,
      subtotal: subtotal
    };

    this.pizzeriaService.agregarPizza(item);

    this.formPizza.patchValue({
      tamano: 'Chica',
      jamon: false,
      pina: false,
      champinones: false,
      numPizzas: 1
    });
  }

  // Método para enviar el pedido completo al servidor Flask
  guardarPedidoFinal(): void {
    if (this.formCliente.invalid) {
      alert('Por favor completa los datos del cliente');
      return;
    }

    const pizzasActuales = this.pizzeriaService.detallesActuales;
    if (pizzasActuales.length === 0) {
      alert('Debes agregar al menos una pizza al pedido');
      return;
    }

    const datosCliente = this.formCliente.value;
    const totalGeneral = this.pizzeriaService.calcularTotalPedido();

    // Mapeamos los items para que 'ingredientes' sea un string separado por comas
    const detallesFormateados = pizzasActuales.map(p => ({
      tamano: p.tamano,
      ingredientes: p.ingredientes.join(', '), // Convierte el array en string ej: "Jamón, Piña"
      num_pizzas: p.numPizzas,
      subtotal: p.subtotal
    }));

    const pedidoAEnviar: PedidoGuardar = {
      nombre: datosCliente.nombre,
      direccion: datosCliente.direccion,
      telefono: datosCliente.telefono,
      fecha: datosCliente.fecha,
      total: totalGeneral,
      detalles: detallesFormateados
    };

    this.pizzeriaService.guardarPedido(pedidoAEnviar).subscribe({
      next: (res) => {
        alert(res.mensaje || 'Pedido guardado con éxito');
        this.pizzeriaService.limpiarOrden();
        this.formCliente.reset({
          fecha: new Date().toISOString().split('T')[0]
        });
      },
      error: (err) => {
        console.error(err);
        alert(err.error?.mensaje || 'Ocurrió un error al guardar el pedido');
      }
    });
  }
}