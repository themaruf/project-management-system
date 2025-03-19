import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders() {
    const token = this.authService.currentUserValue?.token;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getProjects() {
    return this.http.get(`${environment.apiUrl}/projects`, this.getHeaders());
  }

  getProject(id: string) {
    return this.http.get(`${environment.apiUrl}/projects/${id}`, this.getHeaders());
  }

  createProject(project: any) {
    return this.http.post(`${environment.apiUrl}/projects`, project, this.getHeaders());
  }

  updateProject(id: string, project: any) {
    return this.http.put(`${environment.apiUrl}/projects/${id}`, project, this.getHeaders());
  }

  deleteProject(id: string) {
    return this.http.delete(`${environment.apiUrl}/projects/${id}`, this.getHeaders());
  }

  searchProjects(params: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      const value = params[key as keyof typeof params];
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value.toString());
      }
    });
  
    return this.http.get(`${environment.apiUrl}/projects/search`, {
      ...this.getHeaders(),
      params: httpParams
    });
  }
}