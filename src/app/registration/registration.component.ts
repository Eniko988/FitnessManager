import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  public genders: string[] = ["Male","Female"];
  public importantList: string[] = [
  "Toxic Fat reduction",
  "Energy and Endurance",
  "Building Lean Muscle",
  "Healthier Digestive System",
  "Sugar Craving Body",
  "Fitness"]


  public registrationForm!: FormGroup;
  public userIdToUpdate!:number;
  public isUpdateActive: boolean = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router:Router,
    private activatedRoute:ActivatedRoute,
    private toastService: NgToastService){}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: ['']
    });

    this.registrationForm.controls['height'].valueChanges.subscribe(
      res =>{
        this.calculateBmi(res);
      });

      this.activatedRoute.params.subscribe(val => {
        this.userIdToUpdate = val['id'];
        if (this.userIdToUpdate) {
          this.isUpdateActive = true;
          this.api.getRegisteredUserById(this.userIdToUpdate)
            .subscribe({
              next: (res) => {
                this.fillFormToUpdate(res);
              },
              error: (err) => {
                console.log(err);
              }
            })
        }
      })
    }

  submit(){
console.log(this.registrationForm.value)
this.api.postRegistration(this.registrationForm.value)
.subscribe(res=>{
  this.toastService.success({detail:"Success",summary:"User added!",duration:3000})
  this.registrationForm.reset();
})
  }

  update() {
    this.api.updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'User Details Updated Successful', duration: 3000 });
        this.router.navigate(['list']);
        this.registrationForm.reset();
      });
  }


  calculateBmi(value: number){
const weight = this.registrationForm.value.weight;
const height = value;
const bmi = weight / (height * height);

this.registrationForm.controls['bmi'].patchValue(bmi);
switch (true) {
  case bmi < 18.5 : 
    this.registrationForm.controls['bmiResult'].patchValue("Underweight");
    break;
  case (bmi >= 18.5 && bmi < 25): 
    this.registrationForm.controls['bmiResult'].patchValue("Normal");
    break;
  case (bmi >= 25 && bmi < 30) : 
    this.registrationForm.controls['bmiResult'].patchValue("Overweight");
    break;

  default:
    this.registrationForm.controls['bmiResult'].patchValue("Obese");
    break;
}}

  fillFormToUpdate(user: User){
   this.registrationForm.setValue({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile: user.mobile,
    weight: user.weight,
    height: user.height,
    bmi: user.bmi,
    bmiResult: user.bmiResult,
    gender: user.gender,
    requireTrainer: user.requireTrainer,
    package: user.package,
    important: user.important,
    haveGymBefore: user.haveGymBefore,
    enquiryDate: user.enquiryDate
   })
  }

}
