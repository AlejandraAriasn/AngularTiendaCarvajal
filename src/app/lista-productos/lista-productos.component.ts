import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GestionTiendaService } from '../Services/GestionTienda.service';
import { ToastrService } from "ngx-toastr";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DetalleCarrito } from '../Interfaces/carrito.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import{AutenticacionService} from '../Services/Autenticacion.services'
import { Router } from '@angular/router';
@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {
  listaproductosactivos: any = [];
  TipoUsuario:any;
  addcar: any = [];
  Micarritolocal: any = "";
  constructor(private service: GestionTiendaService, private _snackBar: MatSnackBar,private _router: Router,private ValidaSesion:AutenticacionService, private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal) {

  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  ngOnInit(): void {
    if (this.ValidaSesion.isloggedin()) {
      if (localStorage.getItem("CantidadCarrito") != null)
      this._router.navigateByUrl('/disponibles');
      this.TipoUsuario=localStorage.getItem("TipoUsuario");
    }  else{
      this._router.navigateByUrl('/login');
    } 

   
    
    
    this.CargarProceso();
  }
  CargarProceso() {
    this.listaproductosactivos = [];
    this.service.ListarProductosDisponibles().subscribe((data: {}) => {
      this.listaproductosactivos = data;
      console.log(this.listaproductosactivos);

    });
  }

  onChangeProducto($event: any) {
    this.listaproductosactivos = [];
    this.service.ListarProductosDisponiblesXNombre($event.NombreProducto).subscribe((data: {}) => {
      this.listaproductosactivos = data;
      console.log(this.listaproductosactivos);

    });
  }

  getStringValue(value: string) {
    return value;
  }
  nuevoArticulo(IdRecordProducto: any, NombreProducto: any, Descripcion: any, Precio: any, CantidadDisponible: any): void {
  if (localStorage.getItem("TipoUsuario")?.toLocaleLowerCase()==="cliente"){
    var CantidadAgregada = <HTMLInputElement>document.getElementById("txtCantidad" + IdRecordProducto);
    //this.addcar = localStorage.getItem('datos3') ;   
    if (CantidadAgregada.value !== "0") {
      if (Number(CantidadAgregada.value) > Number(CantidadDisponible)) {
        this.openSnackBar("La cantidad a comprar supera las existencias disponibles", "Cerrar");
      } else {
        this.addcar.push(this.CrearArticulo(IdRecordProducto, NombreProducto, Descripcion, Precio, CantidadAgregada.value));
        localStorage.setItem('carritoActual', JSON.stringify(this.addcar));

        this.Micarritolocal = localStorage.getItem('carritoActual');
        this.openSnackBar("Producto agregado al carrito", "Cerrar");
        CantidadAgregada.value = "0";
      }
    } else {
      this.openSnackBar("Ingrese la cantidad de productos que desea agregar", "Cerrar");
    }
  }else{
    this.openSnackBar("No tiene permisos para realizar compras", "Cerrar");
  }

  }


  CrearArticulo(IdRecordProducto: any, NombreProducto: any, Descripcion: any, Precio: any, Cantidad: any): DetalleCarrito {
    return {
      IdRecordProducto: IdRecordProducto,
      NombreProducto: NombreProducto,
      Descripcion: Descripcion,
      Precio: Precio,
      Cantidad: Cantidad
    };
  }


}
