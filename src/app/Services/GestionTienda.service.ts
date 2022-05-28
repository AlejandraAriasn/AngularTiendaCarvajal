import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import{Producto} from 'src/Interfaces/Producto'
import{DetalleCompra} from 'src/Interfaces/DetalleCompra'


const endpoint = environment.endpoint;

//  const endpoint = 'http://172.20.15.127/WebApiSegura/api/';
const httpOptions = {

};

@Injectable({
  providedIn: 'root'
})

export class GestionTiendaService {
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"

    })
  };

  constructor(private http: HttpClient) { }


  ListarProductosDisponibles(): Observable<any> {
    return this.http.get(endpoint + "GestioInventario/ListarProductosDisponibles", httpOptions)
  }
  ListarProductosDisponiblesXNombre(busqueda: any): Observable<any> {
    return this.http.get(endpoint + "GestioInventario/ListarProductosXNombre?Busqueda=" + busqueda, httpOptions)
  }

 
  //Modulo gestion Productos
  ConsultarProductoXCodigo(CodProducto: any): Observable<any> {
    return this.http.get(endpoint + "GestionProductos/ObtenerProductosXCodigo?CodProducto=" + CodProducto, httpOptions)
  }
  ConsultarTodosLosProductos(): Observable<any> {
    return this.http.get(endpoint + "GestionProductos/ObtenerProductos", httpOptions)
  }


  postRegistrarProducto(Info:Producto): Observable<any> {
    
    return this.http.post(endpoint + 'GestionProductos/RegistrarProducto',   Info,httpOptions);
  }

  postRegistrarInventario(Info:any): Observable<any> {
    
    return this.http.post(endpoint + 'GestioInventario/RegistrarInventario',   Info,httpOptions);
  }

  delEliminarProducto(ID: any) {

    return this.http.delete(endpoint + 'GestionProductos/EliminarProducto?ID='+ ID,httpOptions);
  }
  
  //Registrar Compra
  RegistrarEncabezadoCompra(Encabezado:any): Observable<any> {
    
    return this.http.post(endpoint + 'GestionCompra/RegistrarEncabezado', Encabezado ,httpOptions);
  }
  postRegistrarDetalleCompra(Detalle:any): Observable<any> {
    
    return this.http.post(endpoint + 'GestionDetalleCompra/RegistrarDetalle', Detalle ).pipe();
  }

 //Reportes
 ConsultarTopVentasMas(): Observable<any> {
  return this.http.get(endpoint + "ReporteTopVentas/GenerarReporteTopMas", httpOptions)
}
ConsultarTopVentasMenos(): Observable<any> {
  return this.http.get(endpoint + "ReporteTopVentas/GenerarReporteTopMenos", httpOptions)
}

}

