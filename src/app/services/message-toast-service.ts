import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ApiErrorResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class MessageToastService {
  constructor(private messageService: MessageService) {}

  onInfo(title: string, message: string) {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000,
    });
  }

  onSuccess(title: string, message: string) {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000,
    });
  }


  onError(error: ApiErrorResponse) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.error.message,
      life: 3000,
    });
  }
}
