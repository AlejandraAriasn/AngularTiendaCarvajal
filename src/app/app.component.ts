import { Component } from '@angular/core';
import { Router } from '@angular/router';
import  {AutenticacionService} from './Services/Autenticacion.services'
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TiendaCarvajal';

  VisibleLogin:any;

  constructor(private _router: Router,private service:AutenticacionService){
   
  }
  ngOnInit() {
    if(localStorage.getItem("userName")!==null && localStorage.getItem("userName")!==undefined){
      this._router.navigateByUrl('/disponibles');
    }else{
      if (this.service.isloggedin()) {
        if (localStorage.getItem("CantidadCarrito") != null)
        this._router.navigateByUrl('/disponibles');
      }  else{
        this._router.navigateByUrl('/login');
      }  
     
    }
  }
}

