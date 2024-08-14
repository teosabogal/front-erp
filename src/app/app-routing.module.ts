import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProductComponent } from './components/bank/product/create-product/create-product.component';
import { ProductsComponent } from './components/bank/product/products/products.component';
import { CreateStudentsComponent } from './components/students/create-students/create-students.component';
import { StudentsComponent } from './components/students/students/students.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: 'home',      component: HomeComponent },
  { path: 'create-product',      component: CreateProductComponent },
  { path: 'products',   component: ProductsComponent },
  { path: 'create-student',      component: CreateStudentsComponent },
  { path: 'students',   component: StudentsComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
