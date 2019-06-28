import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../base-component';
import { AuthenticationService } from '../../../services/authentication.service';

@Component({
    selector: 'kc-two-factor',
    templateUrl: './two-factor.component.html',
    styleUrls: ['./two-factor.component.sass']
})
export class TwoFactorComponent extends BaseComponent implements OnInit {

    @Output('saved') saved: EventEmitter<any> = new EventEmitter();

    public user: any;
    public settings: any;
    public twoFACode: string;

    constructor(public kcAuthService: AuthenticationService) {
        super(kcAuthService);
    }

    ngOnInit() {
        super.ngOnInit();

        return this.authService.getLoggedInUser().then(user => {
            this.user = user;
            return
        }).then(() => {
            this.authService.generateTwoFactorSettings().then(settings => {
                this.settings = settings;
            });
        });
    }

    public verifyCode() {
        this.authService.authenticateNewTwoFactor(this.twoFACode, this.settings.secret)
            .then(res => {
                console.log(res);
            });
    }

}
