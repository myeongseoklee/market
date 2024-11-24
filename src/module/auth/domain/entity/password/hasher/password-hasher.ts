import * as bcrypt from 'bcrypt';
import { IPasswordHasher } from './password-hasher.interface';

export class PasswordHasher implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  hash(plaintext: string): string {
    const salt = bcrypt.genSaltSync(this.SALT_ROUNDS);
    return bcrypt.hashSync(plaintext, salt);
  }

  compare(plaintext: string, hashed: string): boolean {
    return bcrypt.compareSync(plaintext, hashed);
  }
}
