export class CreateClientCommand {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string
  ) {}
}
