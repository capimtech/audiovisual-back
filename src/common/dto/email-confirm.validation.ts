import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { SignUpRequesterDto } from '../../iam/authentication/dto/sign-up-requester.dto';

@ValidatorConstraint({ name: 'MatchEmail', async: false })
export class MatchEmailConstraint implements ValidatorConstraintInterface {
  validate(confirmEmail: string, args: ValidationArguments) {
    const object = args.object as SignUpRequesterDto;
    return confirmEmail === object.email;
  }

  defaultMessage() {
    return 'Emails do not match';
  }
}
