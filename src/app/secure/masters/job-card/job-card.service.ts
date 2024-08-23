// src/app/job-card/job-card.service.ts
import { Injectable } from '@angular/core';
import { CRUDService, BaseService } from '@app-core'; // Adjust import paths as needed
import { JobCard } from '@app-models' // Adjust import path as needed

@Injectable({
  providedIn: 'root' // Make sure the service is provided at the root level
})
export class JobCardService extends CRUDService<JobCard> {
  constructor(private _baseService: BaseService) {
    super(_baseService, 'job-cards'); // Ensure 'job-cards' matches your API endpoint
  }
}
