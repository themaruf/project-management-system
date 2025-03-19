import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: string | null = null;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['todo', Validators.required],
      priority: ['medium', Validators.required],
      dueDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('projectId');
    this.taskId = this.route.snapshot.paramMap.get('id');
    
    if (this.taskId) {
      this.isEditMode = true;
      this.loadTask();
    }
  }

  loadTask() {
    if (this.taskId) {
      this.taskService.getTask(this.taskId).subscribe({
        next: (task: any) => {
          this.taskForm.patchValue({
            ...task,
            dueDate: new Date(task.dueDate)
          });
        },
        error: (error) => {
          this.snackBar.open('Error loading task', 'Close', { duration: 3000 });
          this.router.navigate(['/projects', this.projectId]);
        }
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid && this.projectId) {
      const taskData = {
        ...this.taskForm.value,
        project: this.projectId
      };
  
      const operation = this.isEditMode
        ? this.taskService.updateTask(this.taskId!, taskData)
        : this.taskService.createTask(taskData);
  
      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Task ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/projects', this.projectId]);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} task`,
            'Close',
            { duration: 3000 }
          );
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/projects', this.projectId]);
  }
}