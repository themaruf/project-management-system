import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class TaskListComponent implements OnInit {
  @Input() projectId?: string;
  tasks: any[] = [];
  displayedColumns: string[] = ['title', 'description', 'status', 'priority', 'dueDate', 'actions'];

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    if (this.projectId) {
      this.taskService.getProjectTasks(this.projectId).subscribe({
        next: (data: any) => {
          this.tasks = data;
        },
        error: (error) => {
          this.snackBar.open('Error loading tasks', 'Close', { duration: 3000 });
        }
      });
    }
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(id).subscribe({
        next: () => {
          this.loadTasks();
          this.snackBar.open('Task deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Error deleting task', 'Close', { duration: 3000 });
        }
      });
    }
  }
}