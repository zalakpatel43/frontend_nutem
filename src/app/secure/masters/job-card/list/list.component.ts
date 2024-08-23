// import { Component, OnInit } from '@angular/core';
// import { JobCardService } from '../job-card.service';
// import { JobCard } from '../../models/job-card.model';

// @Component({
//   selector: 'app-job-card-list',
//   templateUrl: './list.component.html',
// })
// export class JobCardListComponent implements OnInit {
//   jobCards: JobCard[] = [];

//   constructor(private jobCardService: JobCardService) { }

//   ngOnInit() {
//     this.loadJobCards();
//   }

//   loadJobCards() {
//     this.jobCardService.getJobCards().subscribe(data => {
//       this.jobCards = data;
//     });
//   }
// }
