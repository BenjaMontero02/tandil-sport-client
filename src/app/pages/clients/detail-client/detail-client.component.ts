import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '../../../components/title/title.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { ProgressBarLoaderComponent } from '../../../components/progress-bar-loader/progress-bar-loader.component';
import { Client } from '../../../types';
import { mockClients } from '../../../mock';
import { formattedDate } from '../../../util/utill';

import { ViewDataClientComponent } from './components/view-data-client/view-data-client.component';
import { EditDataClientComponent } from './components/edit-data-client/edit-data-client.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type TabValue = 0 | 1 | 2;
@Component({
  selector: 'app-detail-client',
  imports: [
    TitleComponent,
    ButtonComponent,
    ProgressBarLoaderComponent,
    ViewDataClientComponent,
    EditDataClientComponent,
  ],
  templateUrl: './detail-client.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailClientComponent implements OnInit {
  loading = signal<boolean>(true);
  constructor(private route: ActivatedRoute) {}
  tabSelected = signal<TabValue>(0);
  client = signal<Client | null>(null);
  isClientEditing = signal<boolean>(false);
  formGroup: FormGroup | null = null;

  ngOnInit() {
     //TODO: OBTENER CLIENTE POR ID
    const id = this.route.snapshot.paramMap.get('id'); // devuelve string | null
    console.log('ID recibido:', id);
    setTimeout(() => {
      this.loading.set(false);
      this.client.set(mockClients[0][8]);
    }, 2000); // Simulando una carga de datos
  }

  onChangeTab(value: TabValue) {
    this.tabSelected.set(value);
  }

  onSaveProfile() {
    console.log('Safe profile clicked');
    console.log('Client data:', this.formGroup);
    //TODO: ACTUALIZAR CLIENTE TESTEADO
  }

  onCancelEditProfile() {
    this.isClientEditing.set(false);
    this.formGroup = null;
  }

  onEditProfile() {
    this.isClientEditing.set(true);
    this.formGroup = new FormGroup({
      firstName: new FormControl(this.client()!.firstName),
      lastName: new FormControl(this.client()!.lastName),
      dni: new FormControl(this.client()!.dni),
      age: new FormControl(this.client()!.age),
      gender: new FormControl(this.client()!.gender),
      email: new FormControl(this.client()!.email),
      phone: new FormControl(this.client()!.phone),
      birthDate: new FormControl(formattedDate(this.client()!.birthDate), [
        Validators.pattern(/^\d{2}\/\d{2}\/\d{2}$/), // valida formato dd/mm/yy
      ]),
      creationDate: new FormControl(this.client()!.creationDate),
      isActive: new FormControl(this.client()!.isActive),
      photo: new FormControl(this.client()!.photo),
      isInsured: new FormControl(this.client()!.isInsured),
      activities: new FormArray(
        this.client()!.activities.map(
          (activity) =>
            new FormGroup({
              activityName: new FormControl(activity.activityName),
              attendedLocation: new FormControl(activity.attendedLocation),
              attendedDays: new FormControl(activity.attendedDays),
              goal: new FormControl(activity.goal),
              creationDate: new FormControl(
                formattedDate(activity.creationDate),
                [
                  Validators.pattern(/^\d{2}\/\d{2}\/\d{2}$/), // valida formato dd/mm/yy
                ]
              ),
            })
        )
      ),
      healthData: new FormGroup({
        healthInsurance: new FormControl(
          this.client()!.healthData.healthInsurance
        ),
        weight: new FormControl(this.client()!.healthData.weight),
        height: new FormControl(this.client()!.healthData.height),
        currentStudies: new FormControl(
          this.client()!.healthData.currentStudies
        ),
        studyImages: new FormControl(this.client()!.healthData.studyImages),
        bloodPressure: new FormControl(this.client()!.healthData.bloodPressure),
        diseases: new FormControl(this.client()!.healthData.diseases),
        medications: new FormControl(this.client()!.healthData.medications),
        boneIssues: new FormControl(this.client()!.healthData.boneIssues),
        smoker: new FormControl(this.client()!.healthData.smoker),
      }),
    });
  }
}
