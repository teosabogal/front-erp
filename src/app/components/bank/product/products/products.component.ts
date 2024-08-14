import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductModel } from 'src/app/models/ProductModel';
import { ServiceService } from 'src/app/services/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  product: ProductModel = new ProductModel();
  pArray: ProductModel[] = [];
  filteredArray: ProductModel[] = [];
  paginatedArray: ProductModel[] = [];
  cargando = false;
  resultsPerPage = 5;
  currentPage = 1;
  totalPages = 1;

  constructor(private _services: ServiceService, private modalService: NgbModal) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.cargando = true;
    this._services.getProducts().subscribe((resp:any) => {
      console.log(resp)
      if (resp) {
        this.pArray = resp;
        this.filteredArray = this.pArray;
        this.totalPages = Math.ceil(this.filteredArray.length / this.resultsPerPage);
        this.updatePaginatedArray();
      }
      this.cargando = false;
    });
  }

  searchProduct(nombre: string) {
    this.filteredArray = this.pArray.filter(p =>
      p.name?.toLowerCase().includes(nombre.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredArray.length / this.resultsPerPage);
    this.updatePaginatedArray();
  }

  updatePaginatedArray() {
    const start = (this.currentPage - 1) * this.resultsPerPage;
    const end = start + this.resultsPerPage;
    this.paginatedArray = this.filteredArray.slice(start, end);
  }

  onResultsPerPageChange() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredArray.length / this.resultsPerPage);
    this.updatePaginatedArray();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedArray();
    }
  }

  open(content: any, p: ProductModel) {
    this.product = p;
    this.modalService.open(content, { size: 'lg' });
  }

  delete(p: ProductModel) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-warning',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    });


   swalWithBootstrapButtons.fire({

      text: "¿Estás seguro de eliminar el producto " + p.name + " ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          icon: "info",
          title: "Guardando información",
          text: "Espere un momento por favor...",
        });

        Swal.showLoading();
        this._services.deleteProduct(p).subscribe((resp) => {
          this.getProducts();
          swalWithBootstrapButtons.fire(
            'Eliminado correctamente!',
            'El producto ha sido eliminado.',
            'success'
          );
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Por poco elimina el producto ' + p.name +  ' :)',
          'error'
        );
      }
    });
  }

}
