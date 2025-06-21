# Welcome to React Router!

## Prerequisities

Make sure you have all these things installed

- docker
- node
- make
- docker-compose

## Getting Started

### Install the dependencies:

```bash
pnpm install
```

### Development:

run services needed for development

```bash
make services
```

next, in separate cli, run

```bash
cp .env.example .env
```

after all the services are running, run

```bash
pnpm dev
```
