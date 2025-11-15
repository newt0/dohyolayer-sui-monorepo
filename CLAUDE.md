# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for a Sui blockchain project, currently in early setup phase. The repository is structured to support:
- Multiple frontend applications (`apps/web/` and `apps/lp/`)
- Sui Move smart contracts (`contracts/`)
- Project documentation (`docs/`)

## Repository Structure

```
sha256-sui-monorepo/
├── apps/           # Frontend applications (placeholder)
│   ├── web/        # Main web application
│   └── lp/         # Landing page/liquidity pool application
├── contracts/      # Sui Move smart contracts
└── docs/           # Project documentation
```

## Current State

The repository is currently in initial setup phase with placeholder directories. When developing:

1. **Frontend Applications**: The `apps/` directory is prepared for web applications. These will likely use a modern JavaScript/TypeScript framework (Next.js, React, etc.).

2. **Smart Contracts**: The `contracts/` directory is ready for Sui Move smart contracts. These will need the Sui SDK and toolchain.

3. **Documentation**: The `docs/` directory contains project planning materials including:
   - `project-proposal.md` - Project specifications
   - `pitch-script.md` - Project pitch/presentation
   - `brand-copy.md` - Brand and messaging guidelines

## Development Setup

Since the project is in early stages, setup instructions will be added as the codebase develops. Future setup will likely include:

- Sui CLI installation and configuration for smart contract development
- Node.js/npm/yarn/pnpm for frontend applications
- Monorepo tooling (Turborepo, Nx, or similar)

## Notes for Future Development

- This appears to be a blockchain project on Sui, likely involving SHA256 functionality based on the repository name
- The monorepo structure suggests multiple frontend applications sharing smart contract logic
- When adding build/test commands, update this file with the specific toolchain choices made
