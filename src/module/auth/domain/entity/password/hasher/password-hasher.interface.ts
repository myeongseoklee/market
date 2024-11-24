export interface IPasswordHasher {
  hash(plaintext: string): string;
  compare(plaintext: string, hashed: string): boolean;
}
