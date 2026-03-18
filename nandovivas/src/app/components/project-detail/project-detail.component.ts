import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  project = signal<Project | null>(null);
  backQueryParams = signal<{ category?: string }>({});

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    const data = this.route.snapshot.data['project'];
    this.project.set(data ?? null);

    const from = this.route.snapshot.queryParamMap.get('from');
    if (from && from !== 'All') {
      this.backQueryParams.set({ category: from });
    }
  }
}
