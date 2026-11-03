import type { HyperProtocolName } from "./protocol.js";
import type {
  HyperServerListenOptions,
  InferProtocolServerRequest,
  InferProtocolServerResponse,
  ServerRequestContext,
} from "./receiver.js";

/** Protocol packages add their server namespaces through module augmentation. */
export interface HyperServerProtocols<_Services, _Server> {}

export interface ProtocolRouteContext<P extends HyperProtocolName, Services> {
  readonly request: InferProtocolServerRequest<P>;
  readonly services: Services;
  readonly context: ServerRequestContext;
}

export type ProtocolRouteHandler<P extends HyperProtocolName, Services> = (
  context: ProtocolRouteContext<P, Services>,
) => InferProtocolServerResponse<P> | Promise<InferProtocolServerResponse<P>>;

/** A facade configures a listener; ownership and lifecycle stay with the host. */
export interface ProtocolServerHost<Services, Server> {
  readonly services: Services;
  configure<P extends HyperProtocolName>(
    options: Omit<HyperServerListenOptions<P>, "port" | "host" | "signal">,
  ): Server;
}

export type ProtocolServerFactory = <Services, Server>(
  host: ProtocolServerHost<Services, Server>,
) => object;

/** Path parameters are decoded once, after matching path segments. */
export type RouteParams<Path extends string> = string extends Path
  ? Readonly<Record<string, string>>
  : Path extends `${string}:${infer Param}/${infer Rest}`
    ? Readonly<Record<Param, string>> & RouteParams<Rest>
    : Path extends `${string}:${infer Param}`
      ? Readonly<Record<Param, string>>
      : Readonly<Record<never, string>>;

/** REST request fields come from the registered protocol's augmentation. */
export type RouteContext<
  Services,
  Path extends string = string,
> = InferProtocolServerRequest<"rest"> & {
  readonly params: RouteParams<Path>;
  readonly services: Services;
  readonly context: ServerRequestContext;
};

export type RouteHandler<Services, Path extends string = string> = (
  context: RouteContext<Services, Path>,
) => InferProtocolServerResponse<"rest"> | Promise<InferProtocolServerResponse<"rest">>;

export type ServerMiddleware<Services> = (
  context: RouteContext<Services>,
  next: () => Promise<InferProtocolServerResponse<"rest">>,
) => InferProtocolServerResponse<"rest"> | Promise<InferProtocolServerResponse<"rest">>;

export interface ServerOptions<Services = Record<never, never>> {
  port: number;
  host?: string;
  signal?: AbortSignal;
  /** Application-owned objects; closing the server does not dispose them. */
  services?: Services;
}

/** Authorization runs before the signaling transport allocates peers or reads a body. */
export interface ProtocolSignalOptions<P extends HyperProtocolName, Services> {
  readonly authorize?: (context: {
    readonly request: import("./transport.js").TransportRequest;
    readonly services: Services;
  }) => boolean | Promise<boolean>;
  readonly handler: ProtocolRouteHandler<P, Services>;
}

export interface ProtocolSignalMethods<P extends HyperProtocolName, Services, Server> {
  signal(path: string, options: ProtocolSignalOptions<P, Services>): Server;
}
