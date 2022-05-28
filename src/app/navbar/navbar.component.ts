
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { GestionTiendaService } from '../Services/GestionTienda.service';
import { HttpClient } from '@angular/common/http';
import { DetalleCarrito } from '../Interfaces/carrito.module';
import { DetalleCompra } from 'src/Interfaces/DetalleCompra'
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  ListarTodo: any;
  Total: number = 0;
  InfoUsuario: any;
  TipoMensaje:any;
  Mensaje:any;
  DetalleCompra: DetalleCompra[] = [];
  TipoUsuario:any;
  @ViewChild("modalMiCarrito") modalMiCarrito: ElementRef;
  modalOptions: NgbModalOptions = {};
  constructor(private _router: Router,private service: GestionTiendaService, private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal, private _snackBar: MatSnackBar) { }


  ngOnInit(): void {
    
    this.TipoUsuario=localStorage.getItem("TipoUsuario");
  
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  AbrirModalCompras() {
    
    this.modalOptions.backdrop = "static";
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = false;
    this.modalOptions.size = "lg";
    this.modalService.open(this.modalMiCarrito, this.modalOptions);
    let liosta = localStorage.getItem('carritoActual');


    this.ListarTodo = JSON.parse(localStorage.getItem('carritoActual') || '{}');
    this.InfoUsuario = JSON.parse(localStorage.getItem('InfoUsuario') || '{}');

    for (var i = 0; i < this.ListarTodo.length; i++) {
      let Cantidad: number = this.ListarTodo[i].Cantidad
      let Precio: number = this.ListarTodo[i].Precio
      this.Total = this.Total + Cantidad * Precio;
    }

  }
  EliminarDelcarrito(id: any) {

    for (var i = 0; i < this.ListarTodo.length; i++) {
      if (this.ListarTodo[i].IdRecordProducto == id) {
        this.ListarTodo.splice(i, 1);
        break;
      }
    }
    //Recalcular Total
    this.Total = 0;
    for (var i = 0; i < this.ListarTodo.length; i++) {
      let Cantidad: number = this.ListarTodo[i].Cantidad
      let Precio: number = this.ListarTodo[i].Precio
      this.Total = this.Total + Cantidad * Precio;
    }
    localStorage.setItem('carritoActual', JSON.stringify(this.ListarTodo));
  }
  anadirDetalle(detalle: DetalleCompra) {
    this.DetalleCompra.push(detalle);
  }
  CerrarModalCarrito(){
    this.modalService.dismissAll(this.modalMiCarrito);
    this.Mensaje="";
    this.TipoMensaje=1;
  }
  ConfirmarCompra() {
    //Crear Encabezado Compra
    this.InfoUsuario = JSON.parse(localStorage.getItem('InfoUsuario') || '{}');
    this.ListarTodo = JSON.parse(localStorage.getItem('carritoActual') || '{}');
    let Detalle: any = [];
    if (this.ListarTodo.length > 0) {
      if (this.ListarTodo.length > 0) {

        let Encabezado: any = {
          "IdUsuario": this.InfoUsuario[0].IdRecord,
          "SubTotal": this.Total,
          "Impuestos": 0,
          "Total": this.Total
        }
        let IdRecordEncabezado: any;
        this.service.RegistrarEncabezadoCompra(Encabezado).subscribe((data: {}) => {
          IdRecordEncabezado = data;

          if (IdRecordEncabezado != "" && IdRecordEncabezado != 0) {
            //Cosntruir detalle compra      
            let CantidadItemsCompra=this.ListarTodo.length;
            let CantidadExitosos=0;
            let ResulGuardadoItem;
            for (var i = 0; i < this.ListarTodo.length; i++) {
              let inserDeta: any = {
                "IdRecordEncabezado": IdRecordEncabezado,
                "IdProducto": this.ListarTodo[i].IdRecordProducto,
                "Cantidad": this.ListarTodo[i].Cantidad,
                "PrecioCompraUnidad": this.ListarTodo[i].Precio,
                "Descuento": 0
              }
              this.service.postRegistrarDetalleCompra(inserDeta).subscribe((datares: {}) => {
                ResulGuardadoItem = datares;
                
              });
              if (ResulGuardadoItem!=0 && ResulGuardadoItem!=""){
                CantidadExitosos=CantidadExitosos+1;
              }
            }

        
            if(CantidadItemsCompra===CantidadExitosos){
              //Compra Exitosa
              this.TipoMensaje=2;
              this.ListarTodo=[];
              this.Total=0;
              localStorage.setItem('carritoActual', JSON.stringify(this.ListarTodo));
              

            }else{
              //Error generando la compra
              this.Mensaje="Se presento un error generando la compra";
              this.TipoMensaje=3;
            }


          }

        });

      }
    }else{
      this.TipoMensaje=3;
      this.Mensaje="EL carrito de compras se encuentra vacio";
      
    }
  }

  CerrarSesion(){
    localStorage.clear();
    this._router.navigateByUrl('/login');
  }
}
