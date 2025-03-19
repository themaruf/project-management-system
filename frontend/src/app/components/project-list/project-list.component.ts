import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../services/project.service';
import { TaskListComponent } from '../task-list/task-list.component';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatTooltipModule,
    SafeHtmlPipe,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
})
export class ProjectListComponent implements OnInit {
  projects: any[] = [];
  displayedColumns: string[] = ['title', 'description', 'status', 'actions'];
  selectedProject: any = null;

  constructor(
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  pageSize = 10;
  currentPage = 1;
  totalProjects = 0;
  searchTerm = '';
  statusFilter = '';
  statusOptions = ['planning', 'in-progress', 'completed'];

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.projectService.searchProjects({
      page: this.currentPage,
      limit: this.pageSize,
      status: this.statusFilter,
      search: this.searchTerm
    }).subscribe({
      next: (response: any) => {
        this.projects = response.projects || [];
        this.totalProjects = response.total || 0;
      },
      error: (error) => {
        this.snackBar.open('Error loading projects', 'Close', {
          duration: 3000,
        });
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadProjects();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProjects();
  }

  onStatusChange() {
    this.currentPage = 1;
    this.loadProjects();
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          this.snackBar.open('Project deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Error deleting project';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    }
  }
}
