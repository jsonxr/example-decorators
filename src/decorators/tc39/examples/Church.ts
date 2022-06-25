import { table, field } from '../../tc39.js';

@table
export class Church {
  _phone: string | undefined;

  @field
  get phone() {
    return this._phone;
  }
  set phone(val) {}
}
