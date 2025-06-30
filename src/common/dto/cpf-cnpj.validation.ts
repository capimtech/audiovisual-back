import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsValidCpfCnpj', async: false })
export class IsValidCpfCnpjConstraint implements ValidatorConstraintInterface {
  validate(cpfCnpj: string): boolean {
    if (!cpfCnpj) return false;

    cpfCnpj = cpfCnpj.replace(/[^\d]+/g, '');

    if (cpfCnpj.length === 11) {
      if (/^(\d)\1+$/.test(cpfCnpj)) return false;

      let sum;
      let remainder;
      sum = 0;
      for (let i = 1; i <= 9; i++) {
        sum += parseInt(cpfCnpj.substring(i - 1, i)) * (11 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpfCnpj.substring(9, 10))) return false;

      sum = 0;
      for (let i = 1; i <= 10; i++) {
        sum += parseInt(cpfCnpj.substring(i - 1, i)) * (12 - i);
      }
      remainder = (sum * 10) % 11;
      if (remainder === 10 || remainder === 11) remainder = 0;
      if (remainder !== parseInt(cpfCnpj.substring(10, 11))) return false;

      return true;
    } else if (cpfCnpj.length === 14) {
      if (/^(\d)\1+$/.test(cpfCnpj)) return false;

      let length = cpfCnpj.length - 2;
      let numbers = cpfCnpj.substring(0, length);
      const digits = cpfCnpj.substring(length);
      let sum = 0;
      let pos = length - 7;

      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
      }
      let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== parseInt(digits.charAt(0))) return false;

      length = length + 1;
      numbers = cpfCnpj.substring(0, length);
      sum = 0;
      pos = length - 7;
      for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
      }
      result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
      if (result !== parseInt(digits.charAt(1))) return false;

      return true;
    }
    return false;
  }

  defaultMessage(): string {
    return 'CPF or CNPJ is not valid';
  }
}
