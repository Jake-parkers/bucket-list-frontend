import { Injectable } from '@angular/core';
import {LoaderComponent} from '../loader/loader.component';
import { ModalService } from "./modal.service";

@Injectable({
  providedIn: 'root'
})
export class MiscService {

  constructor(private modal: ModalService) { }

  updateUrl(url) {
    window.history.replaceState({}, 'Merchant', url);
  }

  showAlert(message) {
    alert(message);
  }

  hideElement(element) {
    if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
    if (element.classList.contains('show')) {
      element.classList.remove('show');
    }
  }

  showElement(element) {
    if (element.classList.contains('hidden')) {
      element.classList.remove('hidden');
    }
  }

  showLoader() {
    this.modal.init(LoaderComponent, {}, {});
  }

  removeLoader() {
    this.modal.destroy();
  }
}
