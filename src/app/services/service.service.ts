import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { map } from "rxjs/operators";
import { ProductModel } from "../models/ProductModel";

const URL = environment.url;

@Injectable({
  providedIn: "root",
})
export class ServiceService {

  constructor(private http: HttpClient) {}


  createProduct(p: ProductModel) {
    return this.http.post(`${URL}/create_producto`, p);
  }


  updateProduct(p: ProductModel) {
    return this.http.put(`${URL}/products`, p);
  }


  deleteProduct(p: ProductModel) {
    return this.http.post(`${URL}/delete_products`, p);
  }

  checkProductId(id: string) {
    return this.http.get<boolean>(`${URL}/products/${id}`);
  }


  getProducts() {
    return this.http.get(`${URL}/products`);
  }

}
