import { Component } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "trackerDesk";
  init = false;
  //taxistas: Observable<any[]>;
  taxistas: Taxista[] = [];
  lat: number;
  lng: number;
  siguiendoA: any = null;
  siguiendoNombre: string = null;

  constructor(db: AngularFirestore) {
    //observable de taxistas,,cuando aparece uno nuevo se dispara un evento automaticamente
    // this.taxistas = db.collection('usuarios').valueChanges();

    //otra forma de hacerlo
    db.collection("usuarios")
      .valueChanges()
      .subscribe((data: Taxista[]) => {
        //se dispara cada vez que hay un cambio en los registros
        this.taxistas = data;
        if (!this.init) {
          this.lat = data[0].lat;
          this.lng = data[0].lng;
          this.init = true;
        }
        if (this.siguiendoA) {
          //recorremos todos los taxistas
          data.forEach(taxista => {
            //si es el taxista que estoy siguiendo ubicamos el marcador en la poscion del taxista a seguir
            if (taxista.clave === this.siguiendoA) {
              this.lat = taxista.lat;
              this.lng = taxista.lng;
            }
          });
        }
      });
  }
  seguir(taxista: Taxista) {
    console.log("seguir a taxista");
    console.log(taxista);
    this.siguiendoA = taxista.clave;
    this.siguiendoNombre = taxista.nombre;
    this.lng = taxista.lng;
    this.lat = taxista.lat;
  }
  dejarDeSeguir(){
    this.siguiendoA = null;
    this.siguiendoNombre = null;
  }
}

interface Taxista {
  nombre: string;
  clave: string;
  lat: number;
  lng: number;
}
