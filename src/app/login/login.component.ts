import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from '../Services/Autenticacion.services';
import { GestionTiendaService } from '../Services/GestionTienda.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private _router: Router,private service: AutenticacionService,private http: HttpClient, private toastr: ToastrService,private _snackBar: MatSnackBar) { }
  token:any;
  infoUsuario:any=[];
  GuardaInfoUs:any;
  ngOnInit(): void {
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }


  login(){
    var username = <HTMLInputElement>document.getElementById("username");
    var password = <HTMLInputElement>document.getElementById("password");
    this.service.login(username.value,password.value).subscribe((data: {}) => {
      this.token = data;
      console.log("toke");
      console.log(this.token);
      if(this.token!=="" && this.token!==undefined){
        localStorage.setItem('token', this.token);  
        localStorage.setItem("usuario",username.value);
        this.service.ConsultarUsuariosXUsario(username.value).subscribe((data: {}) => {
          this.infoUsuario=data;   
          let tipous;
      
          if(this.infoUsuario[0].TipoUsuario){
            tipous="ADMIN";
          }else{
            tipous="CLIENTE";
          }
          localStorage.setItem("TipoUsuario", tipous)
          localStorage.setItem('InfoUsuario',JSON.stringify( this.infoUsuario));
        });
        this._router.navigateByUrl('/disponibles')
      }else{
        this.openSnackBar("Usuario o contraseña incorrectos","Cerrar");
      }

    });
    
    
  }
}
