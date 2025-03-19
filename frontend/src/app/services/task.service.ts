import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    const token = this.authService.currentUserValue?.token;
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  getTasks() {
    return this.http.get(`${environment.apiUrl}/tasks`, this.getHeaders());
  }

  getTask(id: string) {
    return this.http.get(
      `${environment.apiUrl}/tasks/${id}`,
      this.getHeaders()
    );
  }

  getProjectTasks(projectId: string) {
    return this.http.get(
      `${environment.apiUrl}/tasks/project/${projectId}`,
      this.getHeaders()
    );
  }

  createTask(task: any) {
    return this.http.post(
      `${environment.apiUrl}/tasks`,
      task,
      this.getHeaders()
    );
  }

  updateTask(id: string, task: any) {
    return this.http.put(
      `${environment.apiUrl}/tasks/${id}`,
      task,
      this.getHeaders()
    );
  }

  deleteTask(id: string) {
    return this.http.delete(
      `${environment.apiUrl}/tasks/${id}`,
      this.getHeaders()
    );
  }
}
