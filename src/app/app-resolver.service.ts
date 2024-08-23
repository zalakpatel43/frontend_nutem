import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

@Injectable()
export class AppResolver  {
    constructor() { }

    resolve(): Observable<any> {
            return of(null);
    }
}