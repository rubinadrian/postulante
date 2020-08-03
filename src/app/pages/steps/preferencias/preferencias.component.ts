import { Component, OnInit } from '@angular/core';
import { AreasCoopunionService } from 'src/app/services/areas.coopunion.service';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'step-preferencias',
  templateUrl: './preferencias.component.html',
  styleUrls: ['./preferencias.component.css']
})
export class PreferenciasComponent implements OnInit {
  formStepPreferencias:FormGroup;
  areas = [];
  areasCtrls = [];

  dataPreferencias = [];

  constructor(
    public _formBuilder:FormBuilder,
    public _areasCoopunionService:AreasCoopunionService,
  ) {

    this.formStepPreferencias = this._formBuilder.group({
      preferencias: this._formBuilder.array([])
    });

    this._areasCoopunionService.getAreas().subscribe(resp => {
      this.areas = resp;
      this.crearPreferenciasControles();
      if(this.dataPreferencias) {
        this.setDataPreferencias();
      }
    });

  }

  ngOnInit(): void {}

  public setFormValues(data:any) {
    this.dataPreferencias = data.preferencias||[];
    this.setDataPreferencias();
  }

  setDataPreferencias() {
    this.dataPreferencias.forEach(dp => {
      let chk = this.areasCtrls.find(ctrl => ctrl.id===dp.id);
      if(chk) {chk.chkboxCtrl.setValue(true);}
    });
  }

  get preferencias() {
    return this.formStepPreferencias.get('preferencias') as FormArray;
  }

  crearPreferenciasControles() {
    this.areasCtrls =   this.areas.map((area) => {
        let c = this._formBuilder.control(this.getValor(area.id));
        this.preferencias.controls.push(c);
        return {...area, chkboxCtrl:c};
    });
  }

  getValor(id: number):boolean{
    if(this.dataPreferencias.length > 0) {
      return this.dataPreferencias.find(v => v.id === id)?.valor;
    }
    return false;
  }

  public getPreferenciasSeleccionadas() {
    return this.areasCtrls.filter(a => a.chkboxCtrl.value).map(a => a.id);
  }

}
