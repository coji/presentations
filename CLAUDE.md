# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for managing technical presentation slides using Slidev (Vue-based presentation framework). Each presentation is an independent package in the `/slides/` directory, managed by PNPM workspaces and Turbo for coordinated builds.

## Development Commands

### Root Level Commands

- `pnpm run build` or `pnpm run build:slides` - Build all presentations using Turbo
- `pnpm run export` - Export all presentations to PDF

### Individual Presentation Commands

Navigate to any presentation directory (e.g., `/slides/2025-02-04_introduction_to_conform/`) and run:
- `pnpm dev` - Start development server (typically on localhost:3030)
- `pnpm build` - Build presentation with custom base path to `/dist/`
- `pnpm export` - Export presentation to PDF

## Architecture

### Directory Structure

- `/slides/` - Individual presentation projects (date-prefixed: YYYY-MM-DD_topic)
- `/dist/` - Build output for all presentations
- Each presentation contains:
  - `slides.md` - Main presentation content in Slidev Markdown format
  - `package.json` - Individual project configuration
  - `public/images/` - Static assets and images
  - `components/` - Vue components (optional)
  - `snippets/` - Code examples (optional)

### Build System

- **Turbo**: Orchestrates builds across all presentation packages
- **PNPM workspaces**: Manages dependencies and enables monorepo structure
- **Slidev**: Converts Markdown to interactive HTML presentations
- Build outputs use base paths for deployment (e.g., `/presentation-name/`)

### Deployment

- Configured for Vercel deployment with rewrite rules in `vercel.json`
- Each presentation gets its own route: `/presentation-name/`
- All presentations build to `/dist/` directory

## Development Workflow

1. **Create new presentation**: Make directory in `/slides/` with format `YYYY-MM-DD_topic-name`
2. **Set up package.json**: Copy from existing presentation and update name/build paths
3. **Write content**: Create `slides.md` using Slidev Markdown syntax
4. **Add assets**: Place images in `public/images/` directory
5. **Develop**: Use `pnpm dev` in presentation directory for live preview
6. **Build**: Use root-level `pnpm run build` to build all presentations

## Key Technologies

- **Slidev**: Vue-based presentation framework
- **Vue 3**: For custom components and interactivity
- **Turbo**: Monorepo build orchestration
- **PNPM**: Package management with workspace support
- **Vercel**: Deployment platform
