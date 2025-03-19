import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../services/project.service';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    QuillModule,
  ],
})
export class ProjectFormComponent implements OnInit {
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image'],
      ['clean'],
    ],
  };
  projectForm: FormGroup;
  isEditMode = false;
  projectId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.projectForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['planning', Validators.required],
    });
  }

  ngOnInit() {
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.isEditMode = true;
      this.loadProject();
    }
  }

  loadProject() {
    if (this.projectId) {
      this.projectService.getProject(this.projectId).subscribe({
        next: (project: any) => {
          this.projectForm.patchValue(project);
        },
        error: (error) => {
          this.snackBar.open('Error loading project', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/projects']);
        },
      });
    }
  }

  onSubmit() {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      const operation = this.isEditMode
        ? this.projectService.updateProject(this.projectId!, projectData)
        : this.projectService.createProject(projectData);

      operation.subscribe({
        next: () => {
          this.snackBar.open(
            `Project ${this.isEditMode ? 'updated' : 'created'} successfully`,
            'Close',
            { duration: 3000 }
          );
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          this.snackBar.open(
            `Error ${this.isEditMode ? 'updating' : 'creating'} project`,
            'Close',
            { duration: 3000 }
          );
        },
      });
    }
  }
}
