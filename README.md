# @hyperttp/types

> Universal, protocol-agnostic core types for the Hyperttp ecosystem.
> Универсальные протокол-независимые типы ядра экосистемы Hyperttp.

## What is this / Что это

`@hyperttp/types` — это **только типы** (declaration-only). Пакет не содержит реализации и не знает про конкретные протоколы. Здесь нет методов `get`/`post`/`call` — они добавляются протокольными пакетами через module augmentation.

## Architecture / Архитектура

```
┌─────────────────────────────────────────────────────────────┐
│ @hyperttp/types            IHyperCore (send/registerSender/… │
│  (universal types)         + SendRequest/UniversalResponse/  │
│                            + HyperSender/HyperReceiver/…     │
│                            + HyperProtocol/RequestContext/…  │
│                            + HyperTransport/TransportRequest │
│                              /TransportResponse)             │
└───────────────▲─────────────────────────────────────────────┘
                │ declare module "@hyperttp/types"
                │
┌───────────────┴─────────────────────────────────────────────┐
│ @hyperttp/rest      RestSender + HTTP-типы                   │
│ @hyperttp/grpc      GrpcSender (protobuf → JSON)             │
│ …other protocols                                            │
└───────────────▲─────────────────────────────────────────────┘
                │ peer / optional dependency
┌───────────────┴─────────────────────────────────────────────┐
│ @hyperttp/transport-node  · undici · bun  (dumb network I/O,│
│    реализуют HyperTransport)                                 │
└─────────────────────────────────────────────────────────────┘
```

Three layers / три слоя:

1. **Core types (`@hyperttp/types`)** — protocol-agnostic contract:
    `IHyperCore`, `SendRequest`, `UniversalResponse`, `HyperSender`, `HyperReceiver`,
    `HyperProtocol`, `RequestContext`, `SenderRegistry`, `ReceiverRegistry`, `ProtocolRegistry`,
    `HyperPlugin`, `HyperClientOptions`, `HyperttpError`, `HyperStats`/`RequestMetrics`,
    `RetryOptions`, `HyperAdapter`, `HyperTransport`/`TransportRequest`/`TransportResponse`.

2. **Protocol packages (`@hyperttp/rest`, `@hyperttp/grpc`, …)** — protocol semantics.
   A package may provide a `HyperSender`, a `HyperReceiver`, or both, and augment
   `IHyperCore` with its own methods. The runtime core provides the transport to senders
   during `send()`, dispatches `core.get()`-style calls through the sender's `methods`
   surface, and routes incoming transport requests through receivers.

3. **Transports (`@hyperttp/transport-node/-undici/-bun`)** — **dumb** network I/O.
   Concrete implementations of the `HyperTransport` interface. They only speak HTTP
   (method/url/headers/body) and return a raw response (status + headers + raw body payload).
   They do **not** parse or interpret protocol payloads — that is the sender's or receiver's job.
   One transport serves all protocols (gRPC also runs over HTTP/2).

### gRPC → JSON

A gRPC sender encodes protobuf messages as JSON and sends them over a regular HTTP transport
(gRPC JSON transcoding / Connect-style). No dedicated gRPC transport is required.

## Usage / Использование

```ts
import { HyperClient } from "@hyperttp/core";      // runtime core
import { RestSender } from "@hyperttp/rest";       // brings type augmentation + sender
import "@hyperttp/rest";                            // optional: ensure augmentation is in scope

const client = new HyperClient({ senders: [new RestSender()] });

const res = await client.get("https://api.example.com/users/1"); // typed via augmentation
const raw = await client.send({ protocol: "rest", input: { /* … */ } });
```

## Customizing / Кастомизация

Протоколы и сетевой ввод/вывод можно переопределить через опции клиента:

```ts
const client = new HyperClient({
  senders: [new RestSender()],
  customSender: new MyRestSender(),      // передаётся runtime-ядру
  customTransport: new MockTransport(),  // передаётся runtime-ядру
});
```

- `customSender` — передаёт кастомный сендер протокола; правила его использования определяет runtime-ядро.
- `customTransport` — передаёт реализацию `HyperTransport`; поведение при отсутствии опции определяет runtime-ядро.

`customSender` supplies a custom protocol sender and `customTransport` supplies a
`HyperTransport` implementation; the runtime core defines how it uses either option.

## Module augmentation contract / Контракт аугментации

Protocol packages plug into the universal core by augmenting `@hyperttp/types`
(so the core type stays clean and dependency-free):

```ts
// @hyperttp/rest/src/index.ts
import type { IHyperCore, HyperClientOptions } from "@hyperttp/types";
import type { HttpResponse, RequestInterface } from "./http.js";

declare module "@hyperttp/types" {
  interface IHyperCore {
    get<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    post<T = unknown>(req: RequestInterface | string, body?: unknown, signal?: AbortSignal): Promise<HttpResponse<T>>;
    // …
  }
  interface HyperClientOptions {
    rest?: RestSenderOptions;
  }
}
```

Rules / правила:

- Augmentation adds **types only** — the runtime must provide the actual method
  (see `HyperSender.methods` below).
- A client-side protocol package must export its `HyperSender` implementation and expose the
  protocol method surface via `HyperSender.methods` so the runtime core can dispatch:
  ```ts
  const restSender = {
    protocol: "rest",
    methods: { get, post, put, patch, delete, head, options },
    prepare(req, ctx) { /* … */ },
     send(prepared, transport, ctx) { /* … */ },
    parse(raw, ctx) { /* … */ },
  };
  ```
- For the runtime to accept augmented methods, the concrete `HyperCore` class should use
  a `Proxy`/index-signature dispatch instead of a strict `implements IHyperCore` check.

## Contributing a protocol / Свой протокол

1. Implement `HyperSender`, `HyperReceiver`, or both (sender phases: `prepare` → `send` → `parse`; receiver phases: `receive` → `handle` → `respond`).
2. Define protocol-specific types in your package (REST: `Method`, `RequestInterface`,
   `HttpResponse`…; gRPC: service/message types…).
3. Augment `IHyperCore` (and `HyperClientOptions`) with `declare module "@hyperttp/types"` as needed.
4. Re-export everything; consumers `import "@hyperttp/rest"` to activate client-side augmentations.

## Notes / Примечания

- HTTP-specific types (`Method`, `HttpResponse`, `StealthOptions`, …) deliberately
  **do not live here** — they belong to `@hyperttp/rest` and are provided through
  the core only via augmentation.
- Protocol-agnostic transport types (`TransportRequest`, `TransportResponse`,
  `HyperTransport`) **do live here**: transports are "dumb" network I/O and have
  no protocol semantics, so they belong to the universal core.
- Bump `@hyperttp/core`, `@hyperttp/transport-*` peer-dependencies to `@hyperttp/types@^0.3.0`
  when releasing this breaking change.
