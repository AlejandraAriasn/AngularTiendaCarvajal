import { Component, OnInit,ViewChild } from '@angular/core';
import { GestionTiendaService } from '../Services/GestionTienda.service';
import {AutenticacionService} from '../Services/Autenticacion.services'
import { Router } from '@angular/router';
@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  ListaTopMas:any;
  ListaTopMenos:any;
  TipoUsuario:any;
  
  constructor(private service:GestionTiendaService,private ValidaSesion:AutenticacionService,private _router: Router) { }

  ngOnInit(): void {

    if (localStorage.getItem("usuario") !== null && localStorage.getItem("usuario") !== undefined) {
      if ( localStorage.getItem("TipoUsuario")?.toLowerCase() === "admin") {
        this.ConsultarMasVendidos();
      this.ConsultarMenosVendidos();
          this._router.navigateByUrl('/reportes');
        } else {
          this._router.navigateByUrl('/disponibles');
        }
      }else{
        this._router.navigateByUrl('/login');
      }
  
   
  
   
  }

  ConsultarMasVendidos(){
  
     this.service.ConsultarTopVentasMas().subscribe((data: {}) => {
      this.ListaTopMas = data;      
      });
  }

  ConsultarMenosVendidos(){
  
    this.service.ConsultarTopVentasMenos().subscribe((data: {}) => {
     this.ListaTopMenos = data;      
     });
 }

}
