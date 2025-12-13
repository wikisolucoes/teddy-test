export class UpdateClientCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly email?: string,
    public readonly cpf?: string,
    public readonly phone?: string
  ) {}
}
