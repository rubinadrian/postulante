import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog } from '@angular/material/dialog';
import { ModalAreasComponent } from '../../../shared/components/modal-areas/modal-areas.component';
import { SwalService } from '../../../services/swal.service';
import { AreasLaboralesService } from '../../../services/areas.laborales.service';

@Component({
  selector: 'app-area-laboral',
  templateUrl: './area-laboral.component.html',
  styleUrls: ['../abm.styles.css']
})
export class AreaLaboralComponent implements OnInit {

  displayedColumns: string[] = ['area', 'tools'];
  dataSource = new MatTableDataSource<any>([]);


  constructor(private _areasService:AreasLaboralesService,
              public dialog: MatDialog,
              private swalService:SwalService) { }

  ngOnInit(): void {
    this._areasService.getAreasLaborales().subscribe(data => this.dataSource = new MatTableDataSource(data));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(area): void {
    let temp = {...area};
    const dialogRef = this.dialog.open(ModalAreasComponent, {
      width: '500px',
      data: temp
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      if(area.nombre != result.nombre) {
        area.nombre = result.nombre;
        this._areasService.saveArea(result).subscribe(resp => {
          this._areasService.getAreasLaborales().subscribe(data => this.dataSource = new MatTableDataSource(data));
        });
      }
    });
  }

  addArea() {
    this.openDialog({nombre:''});
  }

  delArea(area) {
    this.swalService.confirmRemove(()=>{
      this._areasService.delArea(area).subscribe(resp => {
        this._areasService.getAreasLaborales().subscribe(data => this.dataSource = new MatTableDataSource(data));
      });
    });

  }

}

