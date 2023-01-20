import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {AccountService} from '../_services/account.service';
import {
  AbstractControl,
  Form,
  FormBuilder,
  FormControl,
  FormGroup,
  Validator,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup;
  maxDate: Date;
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService, private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    })

    this.registerForm.controls.password.valueChanges.subscribe(() => {
      this.registerForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  get registerFormUsernameControl(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  get registerFormPasswordControl() : FormControl{
    return this.registerForm.get('password') as FormControl;
  }

  get registerFormConfirmPasswordControl(): FormControl{
    return this.registerForm.get('confirmPassword') as FormControl;
  }

  get registerFormKnownAsControl(): FormControl{
    return this.registerForm.get('knownAs') as FormControl;
  }

  get registerFormDateOfBirthControl(): FormControl{
    return this.registerForm.get('dateOfBirth') as FormControl;
  }

  get registerFormCityControl(): FormControl{
    return this.registerForm.get('city') as FormControl;
  }

  get registerFormCountryControl(): FormControl{
    return this.registerForm.get('country') as FormControl;
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo]?.value ? null : {missMatch: true}
    }
  }

  register() {
    this.accountService.register(this.registerForm.value).subscribe(response => {
      this.router.navigateByUrl('/members');
    }, error => {
      this.validationErrors = error;
    })
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

}
