import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DashboardService } from '../../services/dashboard.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    HttpClientModule,
  ],
  providers: [DashboardService, HttpClientModule],
})
export class DashboardComponent implements OnInit {
  projectStats = {
    total: 0,
    planning: 0,
    inProgress: 0,
    completed: 0,
  };

  taskStats = {
    total: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
  };

  recentProjects: any[] = [];

  randomFact: string | null = null;
  factError: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  async ngOnInit() {
    await this.loadDashboardData();
    this.loadRandomFact();
  }

  async loadDashboardData() {
    try {
      const data: any = await this.dashboardService.getDashboardStats();
      console.log('Dashboard data:', data);

      if (data && data.projectStats) {
        this.projectStats = {
          total: data.projectStats.total || 0,
          planning: data.projectStats.planning || 0,
          inProgress: data.projectStats.inProgress || 0,
          completed: data.projectStats.completed || 0,
        };
      }

      if (data && data.taskStats) {
        this.taskStats = {
          total: data.taskStats.total || 0,
          todo: data.taskStats.todo || 0,
          inProgress: data.taskStats.inProgress || 0,
          completed: data.taskStats.completed || 0,
        };
      }

      if (data && data.recentProjects) {
        this.recentProjects = data.recentProjects;
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  private loadRandomFact() {
    this.dashboardService.getRandomFact()
      .then((response: any) => {
        this.randomFact = response?.fact || "Couldn't load interesting fact";
        this.factError = null;
      })
      .catch((error) => {
        console.error('Fact fetch error:', error);
        this.factError = "Failed to load fun fact";
        this.randomFact = null;
      });
  }
}
