import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModel } from 'src/app/models/ProductModel';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  @Input() product = new ProductModel();
  @Input() mostrar: boolean = true;

  public copy!: string;
  f = new Date();
  //fecha:any = (this.f.getFullYear()) + "-" + 0 + (this.f.getMonth() +1) + "-" +  this.f.getDate();

  fecha: any = this.f.getFullYear() + "-" + ('0' + (this.f.getMonth() + 1)).slice(-2) + "-" + ('0' + this.f.getDate()).slice(-2);
  minDate!: string;

  constructor(private _services: ServiceService, public modal: NgbModal) {}

  ngOnInit() {
    this.minDate = this.fecha;
  }

  checkId(id: string, f: NgForm) {
    this._services.checkProductId(id).subscribe(exists => {
      if (exists) {
        f.controls['id'].setErrors({ exists: true });
      }
    });
  }

  // Al reutilizar este componente valido de que componente lo estoy llamando y así ejecuto los metodos correspondientes.

  onSubmit(f: NgForm) {

    Swal.showLoading();

    if (this.mostrar) {
      this._services.createProduct(this.product).subscribe((resp) => {
        Swal.fire({
          icon: "success",
          title: "Guardado correctamente!",
        });
        f.reset();
      });
    } else {
      this._services.updateProduct(this.product).subscribe((resp) => {
        Swal.fire({
          icon: "success",
          title: "Editado correctamente!",
        });
        this.modal.dismissAll();
      });
    }
  }

  resetForm(f: NgForm){
    f.reset();
  }

  updateRevisionDate() {
    if (this.product.date_release) {
      const releaseDate = new Date(this.product.date_release);
      const revisionDate = new Date(releaseDate);
      revisionDate.setFullYear(releaseDate.getFullYear() + 1);
      this.product.date_revision = revisionDate.toISOString().split('T')[0];
    }
  }

  keyPress(event: any) {
        const pattern = /[0-9]/;
        const inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
          // invalid character, prevent input
          event.preventDefault();
        }
  }

}
