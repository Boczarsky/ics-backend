import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  saltRounds = 10;
  hash(password: string) {
    return bcrypt.hashSync(password, this.saltRounds);
  }
  compare(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
