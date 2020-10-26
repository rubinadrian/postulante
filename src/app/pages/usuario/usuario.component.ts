import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SwalService } from 'src/app/services/swal.service';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  displayedColumns: string[] = ['name','email','phone','tools'];
  dataSource = new MatTableDataSource<any>([]);
  form:FormGroup;
  setBy = 'email';


  constructor(private _formBuilder:FormBuilder,
              private _usuarioService:UsuariosService,
              private  swalService:SwalService) {
    this.form = this._formBuilder.group({
      email: ['', Validators.email],
      phone: ['', Validators.minLength(10)],
    });
  }

  ngOnInit(): void {
    this._usuarioService.getUsers().subscribe(resp => this.dataSource = new MatTableDataSource(resp));
  }

  changeSetBy() {
    this.form.reset();
  }

  setAdmin() {

    if(this.setBy == 'email') {
      this.sendSetAdmin({email:this.form.value.email});
    } else
    if(this.setBy == 'phone') {
      let phone = this.form.value.phone;
      phone = phone.replace(/\s/,'');
      phone = phone.replace(/^\+549/,'');
      phone = phone.replace(/^\+54/,'');
      phone = '+549' + phone;
      this.sendSetAdmin({phone});
    }
  }

  sendSetAdmin(data) {
    this._usuarioService.setAdmin(data).subscribe((resp:any) => {
      if(resp.ok) {
        this._usuarioService.getUsers().subscribe(resp => this.dataSource = new MatTableDataSource(resp));
        return this.swalService.saveSuccessful();
      }
      return this.swalService.error('Error', 'No se encontro el usuario, deberia primero iniciar sesion en la pagina');
    });
  }

  delAdmin(id) {
    if(confirm('Este usuario dejara de ser administrador, seguro?')) {
      this._usuarioService.delAdmin(id).subscribe(resp => {
        this._usuarioService.getUsers().subscribe(resp => this.dataSource = new MatTableDataSource(resp));
      });
    }
  }

}

