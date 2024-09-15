/* eslint-disable prettier/prettier */
export class BusinessLogicException extends Error {
  constructor(public message: string, public type: BusinessError) {
    super(message);
    this.name = 'BusinessLogicException';
  }
}

export enum BusinessError {
  NOT_FOUND,
  PRECONDITION_FAILED,
  BAD_REQUEST,
}
