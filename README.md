# 🖥️ DI Computer

A study project about **Dependency Injection** with [NestJS](https://nestjs.com). The idea: build an entire computer out of parts injected into one another, to get a hands-on feel for how Nest's DI container resolves a dependency tree.

## The idea

Every computer part is a Nest module (`service` + `module`), and they fit together into an injection tree:

```
PowerService
   ├── CpuService
   ├── DiskService
   ├── MemoryService
   ├── GpuService
   └── NetworkService
          │
          ▼
  MotherboardService   (aggregates the status of every part above)
          │
          ▼
 OperatingSystemService (boot/shutdown, processes, orchestrates everything)
          │
          ▼
   ComputerController   (exposes it all over HTTP)
```

Every part depends on `PowerService` to function (no power, no `supplyPower()`, the service refuses the operation) — a simple way to see a shared dependency injected across multiple providers.

## Modules

| Module | What it does |
|---|---|
| `power/` | The power source. Turns on/off, tracks watts supplied. Everything else depends on it. |
| `cpu/` | Arithmetic operations (`compute`, `multiply`, `divide`, `execute`, `benchmark`), tracks executed cycles. |
| `disk/` | An in-memory mini file system: `write`/`read`/`delete`/`list`/`format`. |
| `memory/` | Allocates/frees simulated RAM blocks, with a total capacity limit. |
| `gpu/` | Renders "scenes" and computes FPS based on complexity. |
| `network/` | Connect/disconnect from a network and `ping` a host. |
| `motherboard/` | No logic of its own — just aggregates the status of Cpu/Disk/Memory/Gpu/Network/Power. Shows how several providers compose into one "hub" service. |
| `operating-system/` | The top layer: `boot()`/`shutdown()` and process management (each process really allocates memory via `MemoryService`). |
| `computer/` | The HTTP controller that injects everything and exposes the routes. |

## Running it

```bash
npm install
npm run start:dev
```

The API comes up on `http://localhost:3000`.

## Tests

```bash
npm run test       # unit
npm run test:e2e   # end-to-end
npm run test:cov   # coverage
```

## Trying the API

There's a ready-made collection at [`postman/DI-Computer.postman_collection.json`](postman/DI-Computer.postman_collection.json) — import it into Postman and you get every route organized by part (System, CPU, Memory, Disk, GPU, Network), with sample bodies included.

Suggested flow to try it out:

1. `POST /computer/boot` — turns the system on (runs the motherboard's POST check)
2. `GET /computer/status` — see the status of every part
3. `POST /computer/processes` — spawn a process (really allocates memory)
4. `GET /computer/cpu/benchmark?iterations=1000` — run a benchmark
5. `POST /computer/network/connect` followed by `GET /computer/network/ping?host=...`

## What to look at here

- Constructor injection (`constructor(private cpuService: CpuService)`) at every layer
- Module `imports`/`exports` controlling what's visible to whom
- Providers as shared singletons (everyone injecting `PowerService` talks to the same instance)
- Hierarchical composition: `ComputerController` doesn't even need to know the `Motherboard` exists behind `OperatingSystemService`
- Tests using `Test.createTestingModule` to assemble the provider tree by hand, without spinning up the whole app
