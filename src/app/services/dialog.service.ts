import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormArray } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog,
  ) { }

    /*
      Es para mostrar un modal con un formulario.

      Tenemos un array de formGroup, donde mostraremos los valores en una tabla.
      Supondamos que tenemos el FormGroup de hijo, cada FormGroup tiene los datos de cada hijo.
      Si armamos un FormArray de estos FormGroup, tendremos los datos de todos los hijos en un array.
      Este array lo utilizamos para mostrarlo en una tabla de material y ademas poder modificar o eliminar cada item.
      Para crear/editar cada item, necesitamos mostrar el formulario, mostrando una ventana modal.
      La ventana modal requiere un componente, en este tendremos la estructura html del formulario.
      La tabla de material necesita un DataSource para que se actualize dinamicamente.

      Entonces, el openDialog, abre una ventana modal con un formulario vacio.
      Si recive un FormGroup, se setea el formulario del modal con los valores de este que viene por parametro.
      Cuando el usuario de en el boton aceptar, despues de crear o modificar, pueden pasar dos cosas,
      dependiendo si se recivio o no un formGroup.
      Si "No" se recivio un formgroup, sea agrega al formArray el formulario del dialogo.
      Si se recivio un formGroup, se setea el valor.

     */

  openDialog(formDialog: FormGroup | null = null,
    modalComponent,
    formArray: FormArray,
    dataSource: MatTableDataSource<any>): void {

    const dialogRef = this.dialog.open(modalComponent, {
      width: '350px',
      panelClass: 'custom-dialog-container',
      data: formDialog
    });

    dialogRef.afterClosed().subscribe((result: FormGroup | null) => {
      if (result && !formDialog) {
        formArray.push(result);
      } else if (result && formDialog) {
        formDialog.setValue(result.value);
      }
      dataSource.data = formArray.value;
    });
  }

}
