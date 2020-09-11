import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AreasCoopunionService } from '../../services/areas.coopunion.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalAreasComponent } from '../../shared/components/modal-areas/modal-areas.component';
import { SwalService } from '../../services/swal.service';

@Component({
  selector: 'app-area-coopunion',
  templateUrl: './area-coopunion.component.html',
  styleUrls: ['./area-coopunion.component.css']
})
export class AreaCoopunionComponent implements OnInit {

  displayedColumns: string[] = ['area', 'tools'];
  dataSource = new MatTableDataSource<any>([]);


  constructor(private _areaCoopunion:AreasCoopunionService,
              public dialog: MatDialog,
              private swalService:SwalService) { }

  ngOnInit(): void {
    this._areaCoopunion.getAreas().subscribe(data => this.dataSource = new MatTableDataSource(data));
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
        this._areaCoopunion.saveArea(result).subscribe(resp => {
          this._areaCoopunion.getAreas().subscribe(data => this.dataSource = new MatTableDataSource(data));
        });
      }
    });
  }

  addArea() {
    this.openDialog({nombre:''});
  }

  delArea(area) {
    this.swalService.confirmRemove(()=>{
      this._areaCoopunion.delArea(area).subscribe(resp => {
        this._areaCoopunion.getAreas().subscribe(data => this.dataSource = new MatTableDataSource(data));
      });
    });

  }

}

