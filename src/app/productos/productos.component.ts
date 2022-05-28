import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { GestionTiendaService } from '../Services/GestionTienda.service';
import { Producto } from "src/Interfaces/Producto"
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AutenticacionService } from '../Services/Autenticacion.services'
import { Router } from '@angular/router';
@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  ListarProductosXcod: any = [];
  ListarTodo: any = [];
  IdRecordProductoEliminar: any;
  Base64IMG: any;

  @ViewChild("modalOpcionEliminarProducto") modalOpcionEliminarProducto: ElementRef;

  modalOptions: NgbModalOptions = {};
  constructor(private _snackBar: MatSnackBar, private _router: Router, private ValidaSesion: AutenticacionService, private service: GestionTiendaService, private http: HttpClient, private toastr: ToastrService, private modalService: NgbModal) { }

  ngOnInit(): void {
//     let tipous = localStorage.getItem("TipoUsuario");
// console.log(tipous);
//     if (localStorage.getItem("userName") !== null && localStorage.getItem("userName") !== undefined) {
//       if (tipous === "Admin") {
//         this._router.navigateByUrl('/productos');
//       } else {
//         this._router.navigateByUrl('/disponibles');
//       }
//     } else {
//       this._router.navigateByUrl('/login');
//     }

if (localStorage.getItem("usuario") !== null && localStorage.getItem("usuario") !== undefined) {
      if ( localStorage.getItem("TipoUsuario")?.toLowerCase() === "admin") {
          this._router.navigateByUrl('/productos');
        } else {
          this._router.navigateByUrl('/disponibles');
        }
      }else{
        this._router.navigateByUrl('/login');
      }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  GuardarCambios() {
    console.log("entre")
    var CodProd = <HTMLInputElement>document.getElementById("txtCodProducto");
    var txtNombreProducto = <HTMLInputElement>document.getElementById("txtNombreProducto");
    var txtDescripcion = <HTMLInputElement>document.getElementById("txtDescripcion");
    var txtPrecio = <HTMLInputElement>document.getElementById("txtPrecio");
    var txtCantidadDisponible = <HTMLInputElement>document.getElementById("txtCantidadDisponible");

    if (CodProd.value === "") {
      this.openSnackBar("Debe ingresar el código del producto", "");
      CodProd.focus();
      return;
    }
    if (txtNombreProducto.value === "") {
      this.openSnackBar("Debe ingresar el nombre del producto", "");
      txtNombreProducto.focus();
      return;
    }
    if (txtDescripcion.value === "") {
      this.openSnackBar("Debe ingresar una breve descripción del producto", "");
      txtDescripcion.focus();
      return;
    }
    if (txtPrecio.value === "") {
      this.openSnackBar("Debe ingresar el precio del producto", "");
      txtPrecio.focus();
      return;
    }
    if (txtCantidadDisponible.value === "") {

      this.openSnackBar("Debe ingresar la cantidad disponible del producto", "");
      txtCantidadDisponible.focus();
      return;
    }
    if (this.Base64IMG === "") {
      this.openSnackBar("Debe seleccionar una imagen", "");
      return;
    }


    let Guardado;
    let Info: Producto;
    Info = {
      CodProducto: CodProd.value,
      NombreProducto: txtNombreProducto.value,
      Descripcion: txtDescripcion.value,
      Precio: txtPrecio.value,
      Imagen: this.Base64IMG
    };

    this.service.postRegistrarProducto(Info).subscribe((data: {}) => {
      Guardado = data;
      //registrar en inventario
      if (Guardado != undefined && Guardado != 0) {
        let inven = {
          IdProducto: Guardado,
          CantidadDisponible: txtCantidadDisponible.value
        }
        Guardado = 0;
        this.service.postRegistrarInventario(inven).subscribe((data: {}) => {
          Guardado = data;

          if (Guardado !== 0) {
            this.ListarProductoInsertado(CodProd.value);
            CodProd.value = "";
            txtNombreProducto.value = "";
            txtDescripcion.value = "";
            txtCantidadDisponible.value = "";
            txtPrecio.value = "";
            this.openSnackBar("Se registro el producto", "Cerrar")

          } else {
            this.openSnackBar("Fallo el registro del producto", "Cerrar")
          }
        });

      } else {
        this.openSnackBar("Fallo el registro del producto", "Cerrar")
      }


    });
  }
  CrearObjetoProducto(CodProd: any, nombre: any, Descripcion: any, precio: any, base64: any): Producto {
    return {
      CodProducto: CodProd,
      NombreProducto: nombre,
      Descripcion: Descripcion,
      Precio: precio,
      Imagen: this.Base64IMG
    };
  }

  ConsultarXcodigo() {

    var CodProd = <HTMLInputElement>document.getElementById("txtCodProducto");
    var txtNombreProducto = <HTMLInputElement>document.getElementById("txtNombreProducto");
    var txtDescripcion = <HTMLInputElement>document.getElementById("txtDescripcion");
    var txtPrecio = <HTMLInputElement>document.getElementById("txtPrecio");


    this.ListarProductosXcod = [];
    console.log(CodProd.value);
    if (CodProd.value != "" && CodProd.value != undefined) {
      this.service.ConsultarProductoXCodigo(CodProd.value).subscribe((data: {}) => {
        this.ListarProductosXcod = data;
        if (this.ListarProductosXcod.length > 0) {
          if (this.ListarProductosXcod[0].CodProducto != undefined) {
            txtNombreProducto.value = this.ListarProductosXcod[0].NombreProducto;
            txtDescripcion.value = this.ListarProductosXcod[0].Descripcion;
            txtPrecio.value = this.ListarProductosXcod[0].Precio;
          } else {
            this.openSnackBar("Producto no encontrado", "Cerrar");
          }
        } else {
          this.openSnackBar("Producto no encontrado", "Cerrar");
        }
      });
    } else {

      this.openSnackBar("Ingrese el Codigo del producto", "Cerrar");

    }
  }

  ListarProductoInsertado(Codprod: any) {
    this.ListarTodo = [];
    this.service.ConsultarProductoXCodigo(Codprod).subscribe((data: {}) => {
      this.ListarTodo = data;
    });
  }
  ConsultarTodo() {
    this.ListarTodo = [];
    this.service.ConsultarTodosLosProductos().subscribe((data: {}) => {
      this.ListarTodo = data;


    });
  }

  SeleccionarProductoEliminar(IdRecord: any) {
    this.IdRecordProductoEliminar = "";
    this.IdRecordProductoEliminar = IdRecord;
    this.modalOptions.backdrop = "static";
    this.modalOptions.keyboard = false;
    this.modalOptions.centered = false;
    this.modalOptions.size = "lg";
    this.modalService.open(this.modalOpcionEliminarProducto, this.modalOptions);

  }

  EliminarProducto() {
    let Eliminado;
    this.service.delEliminarProducto(this.IdRecordProductoEliminar).subscribe((data: {}) => {
      Eliminado = data;
      console.log(Eliminado);
    });

  }

  onUploadFinish($event: any) {

    this.Base64IMG = $event.src;
  }


}


