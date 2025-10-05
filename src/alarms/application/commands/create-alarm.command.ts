export class CreateAlarmCommand {
  constructor(
    public readonly name: string,
    public readonly severity: string,
    public readonly triggeredAt?: Date,
    public readonly entries?: Array<{
      name: string;
      type: string;
    }>,
  ) {}
}
