import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { StudentModel } from 'src/app/models/StudentModel';
import { StudentService } from 'src/app/services/students/student-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  estudiante:StudentModel = new StudentModel();
  eArray:StudentModel[]=[];
  filteredArray: StudentModel[] = [];
  paginatedArray: StudentModel[] = [];
  cargando = true;
  resultsPerPage = 5;
  currentPage = 1;
  totalPages = 1;

  constructor(private _services:StudentService, private modalServies:NgbModal) { }

  ngOnInit(): void {
    this.getEstudiantes();
  }

  getEstudiantes(){
    this._services.getStudents().subscribe((resp:StudentModel[])=>{
      this.eArray = resp;
      this.filteredArray = this.eArray;
      this.totalPages = Math.ceil(this.filteredArray.length / this.resultsPerPage);
      this.updatePaginatedArray();
      this.cargando = false;
    });
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

  buscarEstudiantes(nombre: string){
    this._services.getSearchStudent(nombre).pipe(
      map((resp: any) => resp as StudentModel[])
    ).subscribe((resp: StudentModel[]) => {
      this.eArray = resp;
    });
  }

  buscarEstudiantesArray(nombre: string) {
    this.filteredArray = this.eArray.filter(e =>
      e.nombre?.toLowerCase().includes(nombre.toLowerCase())
    );
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.filteredArray.length / this.resultsPerPage);
    this.updatePaginatedArray();
  }

  open(content: any, e:StudentModel){
    this.estudiante=e;
    this.modalServies.open(content,{size:'lg'});
  }

  eliminar(e:StudentModel){
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Estás seguro(a)?',
      text: "Eliminarás el estudiante:" + e.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, deseo hacerlo!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          icon: "info",
          title: "Guardando información",
          text: "Espere un momento por favor...",
        });

        Swal.showLoading();
        this._services.deleteStudent(e).subscribe((resp)=>{

          this.getEstudiantes();
          swalWithBootstrapButtons.fire(
            'Eliminado correctamente!',
            'El estudiante ha sido eliminado.',
            'success'
          );

        });

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Por poco eliminar el estudiante :)',
          'error'
        )
      }
    })
  }

}
