import { Directive, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: 'ngx-markdown-editor',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorValueAccessorDirective),
      multi: true,
    },
  ],
})
export class MarkdownEditorValueAccessorDirective implements ControlValueAccessor {
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private editorInstance: any; // Čuvamo instancu editora

  // Poziva se kada Angular želi da postavi vrednost u editor
  writeValue(value: string): void {
    if (this.editorInstance) {
      this.editorInstance.setValue(value || '');
    }
  }

  // Registrujemo funkciju koja se poziva kada vrednost u editoru promeni
  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  // Registrujemo funkciju koja se poziva kada editor izgubi fokus
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Angular šalje signal da li treba da onemogućimo editor
  setDisabledState?(isDisabled: boolean): void {
    if (this.editorInstance) {
      this.editorInstance.setDisabledState(isDisabled);
    }
  }

  // Povezujemo instancu editora
  editorCreated(instance: any): void {
    this.editorInstance = instance;

    // Postavljamo promenu vrednosti iz editora ka Angular formi
    this.editorInstance.onChange = (value: string) => {
      this.onChange(value);
    };

    // Postavljamo da Angular zna da je kontrola dodirnuta
    this.editorInstance.onTouched = () => {
      this.onTouched();
    };
  }
}
