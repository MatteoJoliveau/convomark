export abstract class BaseEntity {
  protected constructor(data?: Partial<BaseEntity>) {
    Object.assign(this, data);
  }
}
