import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleComponent } from '../../../components/title/title.component';
import { ButtonComponent } from '../../../components/button/button.component';
import { ProgressBarLoaderComponent } from '../../../components/progress-bar-loader/progress-bar-loader.component';
import { Activity, Client, ClientUpdate } from '../../../types';
// import { mockClients } from '../../../mock';
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
import { ClientService } from '../../../services/client-service';
import { MessageToastService } from '../../../services/message-toast-service';
import { error } from 'console';
import { Subject, takeUntil } from 'rxjs';

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
export class DetailClientComponent implements OnInit, OnDestroy {
  loading = signal<boolean>(true);
  tabSelected = signal<TabValue>(0);
  client = signal<Client | null>(null);
  isClientEditing = signal<boolean>(false);
  formGroup: FormGroup | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private messageService: MessageToastService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.clientService
      .getClientById(id)
      .pipe(takeUntil(this.destroy$)) // corta la subscripción al destruir el componente
      .subscribe({
        next: (data) => {
          console.log(data);
          this.loading.set(false);
          this.client.set(data);
        },
        error: (err) => {
          this.loading.set(false);
          this.messageService.onError(err);
        },
      });
  }

  onChangeTab(value: TabValue) {
    this.tabSelected.set(value);
  }

  async onSaveProfile() {
    console.log('llego a editar perfil');
    let client: ClientUpdate = {
      name: this.formGroup?.get('name')?.value,
      lastName: this.formGroup?.get('lastName')?.value,
      dni: this.formGroup?.get('dni')?.value,
      age: parseInt(this.formGroup?.get('age')?.value),
      gender: this.formGroup!.get('gender')?.value,
      email: this.formGroup!.get('email')?.value,
      phone: this.formGroup!.get('phone')?.value,
      photo: this.formGroup!.get('photo')?.value,
      birthDate: formattedDate(this.formGroup!.get('birthDate')?.value),
      isActive: this.formGroup!.get('isActive')?.value,
      isInsured: this.formGroup!.get('isInsured')?.value,
      activities: this.formGroup!.get('activities')?.value.map((activity: any) => ({
        id: activity.id,
        activityName: activity.activityName,
        attendedLocation: activity.attendedLocation,
        attendedDays: activity.attendedDays,
        goal: activity.goal,
        creationDate: activity.creationDate,
      })),
      healthData: {
        id: this.formGroup!.get('healthData.id')?.value,
        healthInsurance: this.formGroup!.get('healthData.healthInsurance')
          ?.value,
        weight: parseFloat(this.formGroup!.get('healthData.weight')?.value),
        height: parseFloat(this.formGroup!.get('healthData.height')?.value),
        currentStudies: this.formGroup!.get('healthData.currentStudies')
          ?.value,
        studyImages: this.formGroup!.get('healthData.studyImages')?.value,
        bloodPressure: this.formGroup!.get('healthData.bloodPressure')?.value,
        diseases: this.formGroup!.get('healthData.diseases')?.value,
        medications: this.formGroup!.get('healthData.medications')?.value,
        boneIssues: this.formGroup!.get('healthData.boneIssues')?.value,
        smoker: this.formGroup!.get('healthData.smoker')?.value,
      },
    };

    this.clientService.updateClient(this.client()!.id, client).subscribe(() => {console.log('Cliente actualizado')});
    //TODO: ACTUALIZAR CLIENTE TESTEADO
  }

  onCancelEditProfile() {
    this.isClientEditing.set(false);
    this.formGroup = null;
  }

  onEditProfile() {
    this.isClientEditing.set(true);
    this.formGroup = new FormGroup({
      name: new FormControl(this.client()!.name),
      lastName: new FormControl(this.client()!.lastName),
      dni: new FormControl(this.client()!.dni),
      age: new FormControl(this.client()!.age),
      gender: new FormControl(this.client()!.gender),
      email: new FormControl(this.client()!.email),
      phone: new FormControl(this.client()!.phone),
      birthDate: new FormControl(formattedDate(this.client()!.birthDate), [
        Validators.pattern(/^\d{2}\/\d{2}\/\d{2}$/), // valida formato dd/mm/yy
      ]),
      //creationDate: new FormControl(this.client()!.creationDate),
      isActive: new FormControl(this.client()!.isActive),
      photo: new FormControl(this.client()!.photo),
      isInsured: new FormControl(this.client()!.isInsured),
      activities: new FormArray(
        this.client()!.activities.map(
          (activity) =>
            new FormGroup({
              id: new FormControl(activity.id),
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
        id: new FormControl(this.client()!.healthData.id),
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
