import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ContactForm } from 'src/app/core/models/ContactForm.model';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-add-contact',
  templateUrl: './template/add-contact.page.html',
  styleUrls: ['./styles/add-contact.page.scss'],
  standalone: false
})
export class AddContactPage implements OnInit {
  form: ContactForm = {
    name: '',
    phone: '',
    message: '',
    allowCall: true,
    allowSms: true,
    allowLocation: false,
    allowPhoto: false,
    type: 'Emergencia'
  };

  editingIndex: number | null = null;

  constructor(
    private contactService: ContactService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const indexParam = params['index'];
      if (indexParam !== undefined && !isNaN(indexParam)) {
        this.editingIndex = parseInt(indexParam, 10);
        const existing = this.contactService.get(this.editingIndex);
        if (existing) {
          this.form = { ...existing };
        }
      } else {
        this.form = {
          ...this.form,
          ...params
        };
      }
    });
  }

  public saveContact(): void {
    if (this.editingIndex !== null) {
      this.contactService.update(this.editingIndex, this.form);
    } else {
      this.contactService.add(this.form);
    }

    this.router.navigate(['../'], { relativeTo: this.route });
  }

  public cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
