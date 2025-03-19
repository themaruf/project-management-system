import { Routes } from '@angular/router';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { ProjectFormComponent } from './components/project-form/project-form.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects', 
    component: ProjectListComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/new', 
    component: ProjectFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/edit/:id', 
    component: ProjectFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:id', 
    component: ProjectDetailsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectId/tasks/new', 
    component: TaskFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'projects/:projectId/tasks/edit/:id', 
    component: TaskFormComponent,
    canActivate: [AuthGuard]
  }
];
