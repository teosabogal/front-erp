import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StudentModel } from 'src/app/models/StudentModel';
import { environment } from 'src/environments/environment';

const URL = environment.url;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  createStudent(s: StudentModel) {
    return this.http.post(`${URL}/students`, s);
  }


  updateStudent(s: StudentModel) {
    return this.http.put(`${URL}/students`, s);
  }


  deleteStudent(s: StudentModel) {
    return this.http.post(`${URL}/delete_students`, s);
  }

  checkStudentId(id: string) {
    return this.http.get<boolean>(`${URL}/students/${id}`);
  }

  getStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>(`${URL}/students`);
  }


  getSearchStudent(e: string) {
    const infoToken = {
      e: e,
    };
    return this.http.post<StudentModel[]>(`${URL}/buscar_estudiante`, infoToken);
  }
}
