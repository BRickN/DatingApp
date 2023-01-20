import {ControlValueAccessor, FormControl, NgControl} from "@angular/forms";
import {Component, Input, Self} from "@angular/core";

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() type = 'text';

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  writeValue(obj: any): void {
  }


}
