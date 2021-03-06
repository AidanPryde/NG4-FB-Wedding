import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Router } from '@angular/router';
import { moveIn, fallIn } from '../app-routing.animation';

class Details {
  $key: string;

  constructor(
    public name: string,
    public email: string
  ) { }
}

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
    animations: [moveIn(), fallIn()],
    host: {'[@moveIn]': ''}
})

export class SignupComponent implements OnInit {

    state: '';
    error: any;

    name: string;
    email: string;
    password: string;

    constructor(public afd: AngularFireDatabase, public afa: AngularFireAuth, private router: Router) {

    }

    onSubmit(formData) {
        if (formData.valid) {
            console.log('auth service >> signup >> sent form data valid', formData.value.email, formData.value.password);
            this.afa.auth
            .createUserWithEmailAndPassword(
                formData.value.email,
                formData.value.password
            ).then(() => {
                console.log('auth service >> signup >> user created');
                this.afa.auth.currentUser
                .updateProfile({
                    displayName: formData.value.name,
                    photoURL: ''
                })
                .then(() => {
                    console.log('auth service >> signup >> name added');

                    this.afd.list('/user/' + this.afa.auth.currentUser.uid + '/details')
                    .push(
                        new Details(formData.value.name, formData.value.email)
                    ).then((what) => {
                        console.log(what);
                        console.log('database service >> update >> name added, redirect to home');
                        this.router.navigate(['/home'])
                    })
                    .catch((err) => {
                        console.log('database service >> update >> name adding error');
                        this.error = err;
                    });
                })
                .catch((err) => {
                    console.log('auth service >> signup >> name adding error');
                    this.error = err;
                });
            }).catch((err) => {
                console.log('auth service >> signup >> user create error');
                this.error = err;
            })
        }
    }

    ngOnInit() {
    }

}
