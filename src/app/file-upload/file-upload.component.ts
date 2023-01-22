import { Component, Input } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from "@angular/forms";
import { of } from "rxjs";

// IMPORTANTE: precisamos registrar esse component no angular, usando um customer provider para que o componente pai enxergue o filho 'angularizado'
@Component({
  selector: "file-upload",
  templateUrl: "file-upload.component.html",
  styleUrls: ["file-upload.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: FileUploadComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: FileUploadComponent,
    },
  ],
})

/*
Para que este componente de upload de imagem seja considerado correto para ser adicionado na validação do form do component create-course-step-2
devemos extender a classe deste componente filho para interface de ControlValueAcessor.

Ele cria uma ponte para que um componente nativo do html consiga ser 'validado' pela api form do angular

Que permitirá que este componente tenha na sua chamada no componente pai a propriedade formcontrolName e os 4 métodos que vem na interface ControlValueAcessor
sejam manipulados pelo form do angular: writeValue, registerOnChange, registerOnTouched e setDisableState.

*/
export class FileUploadComponent implements ControlValueAccessor, Validator {
  @Input()
  requiredFileType: string;

  fileName: string = "";

  fileUploadError = false;

  uploadProgress: number;

  _onChange = (fileName: string) => {};

  _onTouched = () => {};

  _onValidatorChange = () => {};

  _checkFileType = (file: string): Boolean => {
    let error = false;
    if (file.match("jpg") === null && file.match("png") === null) {
      error = true;
    } else {
      error = false;
    }
    return error;
  };

  _disabled: boolean = false;

  _fileUploadSuccess = false;

  constructor(private http: HttpClient) {}

  _onClick(fileUploadElement: HTMLInputElement) {
    this._onTouched();
    //clicar no elemento nativo que recebeu via parametro
    fileUploadElement.click();
  }

  _onFileSelected(event) {
    const file: File = event.target.files[0];

    this.fileName = file.name;

    const formData = new FormData();

    formData.append("thumbnail", file);

    this.fileUploadError = false;

    this.http
      .post("/api/thumbnail-upload", formData, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        catchError((error) => {
          this.fileUploadError = true;
          return of(error);
        }),
        finalize(() => {
          this.uploadProgress = null;
        })
      )
      .subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type == HttpEventType.Response) {
          //nessa função de callback vamos 'emitir' o aviso de que o temos um nome de arquivo para que o pai saiba e vamos usar isso no registerOnChange
          // que espera uma função de callback em sua implementação inicial, por isso criamos o onChange lá em cima antes do constructor.
          this._onChange(this.fileName);
          this._fileUploadSuccess = true;
          this._onValidatorChange();
        }
      });
  }

  // aqui vamos associar o valor do nome do arquivo com o valor a ser lido pela api do angular quando for registrar esse componente filho lá no pai
  writeValue(value: any): void {
    this.fileName = value;
  }

  //aqui vamos enviar o valor do filho para o pai através de uma function de callback
  registerOnChange(onChange: any): void {
    this._onChange = onChange;
  }

  //aqui vamos implementar o método que envia para o form da api o estado de touch para fazer a troca de pristine para touch
  registerOnTouched(onTouched: any): void {
    this._onTouched = onTouched;
  }

  // state disable of input
  setDisabledState(isDisabled: boolean): void {
    this._disabled = isDisabled;
  }

  registerOnValidatorChange(onValidatorChange: () => void): void {
    this._onValidatorChange = onValidatorChange;
  }

  // Adicionar ao componente HTML do filho, a propriedade que permite a API validar se ele está no estado de válido ou não, tornando ele um item required do form
  validate(control: AbstractControl<any, any>): ValidationErrors {
    if (this._fileUploadSuccess) {
      return null;
    }

    // criação do objeto dos erros que serão emitidos
    let errors: any = {};

    console.log(this.fileName && this._checkFileType(this.fileName));

    if (this.fileName && this._checkFileType(this.fileName)) {
      errors.fileType = true;
    }

    //arquivo deu erro ao subir
    if (this.fileUploadError) {
      errors.uploadFailed = true;
    }

    console.log(errors);

    return errors;
  }
}
