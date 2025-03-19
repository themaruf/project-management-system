import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TaskListComponent } from '../task-list/task-list.component';
import { ProjectService } from '../../services/project.service';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TaskListComponent,
    SafeHtmlPipe
  ]
})
export class ProjectDetailsComponent implements OnInit {
  project: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProject(id);
    }
  }

  loadProject(id: string) {
    this.projectService.getProject(id).subscribe({
      next: (data) => {
        this.project = data;
      },
      error: () => {
        this.router.navigate(['/projects']);
      }
    });
  }

  goBack() {
    this.router.navigate(['/projects']);
  }
}