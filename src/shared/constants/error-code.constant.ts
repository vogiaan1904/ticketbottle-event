export enum ErrorCodeEnum {
  EventNotFound = 10000,

  OrganizerNotFound = 11000,
}

export const ErrorCode = Object.freeze<Record<ErrorCodeEnum, [string, number]>>({
  [ErrorCodeEnum.EventNotFound]: ['Event not found', 400],
  [ErrorCodeEnum.OrganizerNotFound]: ['Organizer not found', 400],
});
