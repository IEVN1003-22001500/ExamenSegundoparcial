import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ItemPizza, PedidoGuardar, VentaCliente } from './pizzeria-exam'

@Injectable({
  providedIn: 'root'
})
export class PizzeriaapiService {
  private apiUrl = 'http://127.0.0.1:5000/api/pizzeria';

  // Manejo reactivo de las pizzas agregadas a la tabla temporal
  private detallesSubject = new BehaviorSubject<ItemPizza[]>([]);
  public detalles$ = this.detallesSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get detallesActuales(): ItemPizza[] {
    return this.detallesSubject.value;
  }

  public agregarPizza(item: ItemPizza): void {
    const lista = [...this.detallesSubject.value, item];
    this.detallesSubject.next(lista);
  }

  public quitarPizza(index: number): void {
    const lista = [...this.detallesSubject.value];
    if (index >= 0 && index < lista.length) {
      lista.splice(index, 1);
      this.detallesSubject.next(lista);
    }
  }

  public limpiarOrden(): void {
    this.detallesSubject.next([]);
  }

  public calcularTotalPedido(): number {
    return this.detallesSubject.value.reduce((sum, item) => sum + item.subtotal, 0);
  }

  // Endpoints HTTP
  public guardarPedido(pedido: PedidoGuardar): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  public getVentasPorDia(dia: string): Observable<{ ventas: VentaCliente[]; total_acumulado: number }> {
    return this.http.get<any>(`${this.apiUrl}/ventas/dia/${dia}`);
  }

  public getVentasPorMes(mes: string): Observable<{ ventas: VentaCliente[]; total_acumulado: number }> {
    return this.http.get<any>(`${this.apiUrl}/ventas/mes/${mes}`);
  }

  public getDetallePedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pedidos/${id}`);
  }
}