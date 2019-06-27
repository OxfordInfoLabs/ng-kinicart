import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { BaseComponent } from '../../base-component';

@Component({
    selector: 'kc-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.sass'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent extends BaseComponent implements OnInit {

    @Input() loginRoute: string;

    public email: string;
    public password: string;
    public loading = false;
    public twoFA = false;
    public twoFACode: string;
    public twoFAError = false;

    constructor(private router: Router,
                kcAuthService: AuthenticationService) {
        super(kcAuthService);
    }

    ngOnInit() {
        super.ngOnInit();
        return Promise.resolve(true);
    }

    public login() {
        if (this.email && this.password) {
            this.loading = true;
            return this.authService.login(this.email, this.password)
                .then((res: any) => {
                    this.loading = false;
                    if (res.step === '2FA') {
                        this.twoFA = true;
                        return true;
                    } else {
                        return this.router.navigate([this.loginRoute || '/']);
                    }
                })
                .catch(err => {
                    this.loading = false;
                    console.log('** ERROR ** -> ', err);
                });
        }
    }

    public checkUsername() {
        this.authService.doesUserExist(this.email).then(res => {
        });
    }

    public authenticate() {
        this.loading = true;
        if (this.twoFACode) {
            this.authService.authenticateTwoFactor(this.twoFACode)
                .then(user => {
                    this.loading = false;
                    this.router.navigate([this.loginRoute || '/']);
                })
                .catch(error => {
                    this.twoFAError = true;
                    this.loading = false;
                });
        }
    }

}
