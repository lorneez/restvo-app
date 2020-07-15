import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from './auth.service';
import { UserData } from './user.service';
import { NetworkService } from './network-service.service';

@Injectable({ providedIn: 'root' })
export class Systemlog {

    constructor(private http: HttpClient,
                public authService: Auth,
                public userData: UserData,
                public networkService: NetworkService) {
    }

    logAppUsage(time) {
        let churches = [];
        if (this.userData && this.userData.user && this.userData.user.churches && this.userData.user.churches.length) {
            churches = this.userData.user.churches.map((c) => c._id);
        }
        return this.http.post(this.networkService.domain + '/api/systemlog/appusage',
            JSON.stringify({time: time, churches: churches}),
            this.authService.httpAuthOptions).toPromise();
    }
}

export class ErrorService implements ErrorHandler {

    constructor(private injector: Injector) {}

    handleError(error: any) {
        const router = this.injector.get(Router);
        if (Error instanceof HttpErrorResponse) {
            console.log(error.status);
        } else {
            console.error('There is an error.');
        }
        router.navigate(['error']);
    }
}
