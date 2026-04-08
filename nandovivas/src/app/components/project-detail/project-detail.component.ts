import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { Project } from '../../interfaces/project';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  project = signal<Project | null>(null);
  backQueryParams = signal<{ category?: string }>({});

  formatText(text: string): string {
    if (/<[a-z][\s\S]*>/i.test(text)) return text;
    return text.replace(/\n/g, '<br>');
  }

  ngOnInit() {
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);

    const data = this.route.snapshot.data['project'];
    this.project.set(data ?? null);

    if (data) {
      const title = `${data.title} — Nando Vivas`;
      const plainDescription = data.description
        ? data.description.replace(/<[^>]*>/g, '').trim()
        : '';
      const description = plainDescription
        ? plainDescription.substring(0, 160)
        : `Graphic design by Nando Vivas — ${data.client}`;
      const image = data.detailImage || data.image;

      this.titleService.setTitle(title);
      this.metaService.updateTag({ name: 'description', content: description });
      this.metaService.updateTag({ property: 'og:title', content: title });
      this.metaService.updateTag({ property: 'og:description', content: description });
      this.metaService.updateTag({ property: 'og:image', content: image });
    }

    const from = this.route.snapshot.queryParamMap.get('from');
    if (from && from !== 'All') {
      this.backQueryParams.set({ category: from });
    }
  }

  ngOnDestroy() {
    this.titleService.setTitle('Nando Vivas — Graphic Designer, Barcelona');
    this.metaService.updateTag({ name: 'description', content: "Barcelona-based graphic designer, illustrator and design instructor. Branding, packaging, editorial and art direction. Let's talk." });
    this.metaService.updateTag({ property: 'og:title', content: 'Nando Vivas — Graphic Designer, Barcelona' });
    this.metaService.updateTag({ property: 'og:description', content: "Barcelona-based graphic designer, illustrator and design instructor. Branding, packaging, editorial and art direction. Let's talk." });
    this.metaService.removeTag("property='og:image'");
  }
}
