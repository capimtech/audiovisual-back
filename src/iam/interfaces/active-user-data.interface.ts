import { Role } from '../../users/enums/role.enum';

export interface ActiveUserData {
  /**
   * The "subject" of the token. The value of this property is the user ID
   * that granted this token.
   */
  sub: string;

  /**
   * The subject's (user) email.
   */
  email: string;

  /**
   * The subject's (user) role.
   */
  role: Role;

  /**
   * The subject's (user) image.
   */
  image: string;

  /**
   * Temporary password
   */
  temporaryPassword?: boolean;

  companyId: string;
}
