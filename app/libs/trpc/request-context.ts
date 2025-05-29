import { getRandomToken } from "~/utils/random";

export type RequestContextArgs = {
  id: string;
};

export class RequestContext {
  id?: string;

  constructor(args: RequestContextArgs) {
    this.id = args.id;
  }

  static async fromRequest(request: Request) {
    return new this({
      id: getRandomToken(),
    });
  }
}
