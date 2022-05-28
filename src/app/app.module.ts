import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule,Routes } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { GestionTiendaService } from './Services/GestionTienda.service';
import { AutenticacionService } from './Services/Autenticacion.services';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { ProductosComponent } from './productos/productos.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { ImageUploadModule } from 'angular2-image-upload';
import { ReportesComponent } from './reportes/reportes.component';
const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'reportes', component: ReportesComponent }
];

@NgModule({
  declarations: [
    AppComponent,    
    ListaProductosComponent,  
    NavbarComponent,
    LoginComponent,
    ProductosComponent,
    ReportesComponent
  ],
  imports: [
    ImageUploadModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    MatSnackBarModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgSelectModule, FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [GestionTiendaService,AutenticacionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
