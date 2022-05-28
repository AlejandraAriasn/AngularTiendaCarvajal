import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';


const endpoint = environment.endpoint;

//  const endpoint = 'http://172.20.15.127/WebApiSegura/api/';
const httpOptions = {

};

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
    httpOptions = {
        headers: new HttpHeaders ({
            'Content-Type': 'application-json',
            'x-custom-header' : 'my custom header value',
                    'Access-Control-Allow-Origin': 'my-origin.com'
          })
      };

      constructor(private http: HttpClient) { }

   
      
      isloggedin() {
        if (localStorage.getItem("usuario") != null)
          return true;
    
        return false;
      }
    
      login(userName: any, password: any): Observable<any> {
        let log = {
    
          userName: userName,
          password: password
        }
    
        return this.http.post(endpoint + 'Login/IniciarSesion', log);
    
      }
      ConsultarUsuariosXUsario(NombreUsuario: any): Observable<any> {
        return this.http.get(endpoint + "GestionUsuarios/ObtenerUsuariosXnombreusuario?nombreusuario=" + NombreUsuario, httpOptions)
      }
    
    
}