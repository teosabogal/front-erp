import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentModel } from 'src/app/models/StudentModel';
import { ServiceService } from 'src/app/services/service.service';
import { StudentService } from 'src/app/services/students/student-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-students',
  templateUrl: './create-students.component.html',
  styleUrls: ['./create-students.component.scss']
})
export class CreateStudentsComponent implements OnInit {
  @Input() estudiante: StudentModel = new StudentModel();
  @Input() mostrar: boolean = true;

  public copy!: string;
  showAge:any;
  f = new Date();
  fecha:any = (this.f.getFullYear()) + "-" + 0 + (this.f.getMonth() +1) + "-" +  this.f.getDate();

  constructor(private _student: StudentService, private modal: NgbModal) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    if (f.invalid) {
      Swal.fire({
        icon: "error",
        title: "Campos vacíos!",
        text: "Por favor llene todos los campos.",
      });
      return;
    }

    if (this.estudiante?.fecha_nacimiento && this.fecha <= this.estudiante.fecha_nacimiento) {
      Swal.fire({
        icon: "error",
        title: "Datos invalidos!",
        text: "La fecha de nacimiento no puede ser mayor o igual a la fecha actual.",
      });
      return;
    }

    this.validarEdadxExperiencia();
    if(this.estudiante?.experiencia && this.showAge<this.estudiante.experiencia){
      Swal.fire({
        icon: "error",
        title: "Datos invalidos!",
        text: "La experiencia adquirida no puede ser igual o mayor a su edad.",
      });
      return;
    }

    Swal.fire({
      icon: "info",
      title: "Guardando información",
      text: "Espere un momento por favor...",
    });

    Swal.showLoading();

    if (this.mostrar) {
      this._student.createStudent(this.estudiante).subscribe((resp) => {
        Swal.fire({
          icon: "success",
          title: "Guardado correctamente!",
        });
        f.reset();
      });
    } else {
      this._student.updateStudent(this.estudiante).subscribe((resp) => {
        Swal.fire({
          icon: "success",
          title: "Editado correctamente!",
        });
        this.modal.dismissAll();
      });
    }
  }

  validarEdadxExperiencia() {
    if (this.estudiante?.fecha_nacimiento) {
      const convertAge = new Date(this.estudiante.fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - convertAge.getTime());
      this.showAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      this.showAge = null;
      Swal.fire({
        icon: "error",
        title: "Datos invalidos!",
        text: "La fecha de nacimiento no está definida.",
      });
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
