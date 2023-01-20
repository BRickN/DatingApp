import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from './../modals/confirm-dialog/confirm-dialog.component';
import { Injectable, EventEmitter } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  bsModalRef?: BsModalRef<ConfirmDialogComponent>;

  constructor(private modalService: BsModalService) { }

  confirm(
    title = 'Confirmation',
    message = 'Are you sure you want to do this?',
    btnOkText = 'Ok',
    btnCancelText = 'Cancel'
  ): Observable<boolean> {
    const config = {
      initialState: {
        title,
        message,
        btnOkText,
        btnCancelText
      }
    }
    this.bsModalRef = this.modalService.show(ConfirmDialogComponent, config);
    return this.bsModalRef.onHidden.pipe(
      map(() => {
        return this.bsModalRef?.content?.result;
      })
    )
  }
}
