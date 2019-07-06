import { Component, OnInit } from '@angular/core';

const docUrl = 'https://documenter.getpostman.com/view/1228628/SVSBurwt';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.href = docUrl;
  }

}
