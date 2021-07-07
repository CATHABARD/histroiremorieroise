import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-unvalidate-user-message',
  templateUrl: './unvalidate-user-message.component.html',
  styleUrls: ['./unvalidate-user-message.component.scss']
})
export class UnvalidateUserMessageComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

  onDemandeMail() {
    this.authService.sendMailNewUser();
    this.router.navigate(['app-accueil']);
  }

  onAnnuler() {
    this.router.navigate(['app-accueil']);
  }
}
