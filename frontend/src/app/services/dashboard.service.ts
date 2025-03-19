import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  async getDashboardStats() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.currentUserValue?.token}`
    });

    return firstValueFrom(this.http.get(`${this.apiUrl}/stats`, { headers }));
  }

  async getRandomFact() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.currentUserValue?.token}`
    });
    
    return firstValueFrom(
      this.http.get(`${environment.apiUrl}/facts/random`, { headers })
    );
  }
}