# Contributing to FuMu

Thank you for your interest in contributing to FuMu! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Redis (for job queue)
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/fumu.git
   cd fumu
   ```

2. **Run Setup Script**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

3. **Manual Setup (Alternative)**
   ```bash
   pnpm install --recursive
   cp env.example .env
   # Edit .env with your configuration
   pnpm build
   ```

## 🏗️ Project Structure

```
fumu/
├── apps/
│   ├── web/                  # Next.js web application
│   ├── mobile/               # React Native mobile app
│   └── api/                  # NestJS backend API
├── packages/
│   ├── shared/               # Shared utilities and types
│   └── ui/                   # Reusable UI components
├── prisma/                   # Database schema and migrations
├── docs/                     # Documentation
└── scripts/                  # Build and deployment scripts
```

## 🔧 Development Workflow

### Available Scripts

```bash
# Development
pnpm dev              # Start all development servers
pnpm dev:web          # Start web app only
pnpm dev:api          # Start API server only
pnpm dev:mobile       # Start mobile app only

# Database
pnpm db:migrate       # Run database migrations
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio

# Building
pnpm build            # Build all applications
pnpm build:web        # Build web app
pnpm build:api        # Build API server

# Testing
pnpm test             # Run all tests
pnpm test:web         # Run web app tests
pnpm test:api         # Run API tests

# Linting
pnpm lint             # Lint all code
pnpm lint:fix         # Fix linting issues
```

### Development Guidelines

1. **Conservative and Gradual**
   - Work carefully and gradually
   - Implement features step by step
   - Test thoroughly before submitting

2. **Code Quality**
   - Follow existing code patterns
   - Write clean, readable code
   - Add appropriate comments
   - Use TypeScript for type safety

3. **Testing**
   - Write tests for new features
   - Ensure all tests pass
   - Test on multiple platforms if applicable

4. **Documentation**
   - Update documentation for new features
   - Add JSDoc comments for functions
   - Update README if needed

## 📝 Pull Request Process

### Before Submitting

1. **Check PRD**: Ensure your changes align with the Product Requirements Document
2. **Run Tests**: Make sure all tests pass
3. **Lint Code**: Fix any linting issues
4. **Update Documentation**: Update relevant documentation
5. **Test Thoroughly**: Test your changes extensively

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] PRD compliance verified
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: Maintainers review code quality and functionality
3. **Testing**: Manual testing by maintainers
4. **Approval**: Maintainer approval required for merge

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Try to reproduce the bug
3. Check documentation and PRD

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., macOS, Windows, Linux]
- Node.js version: [e.g., 18.17.0]
- Browser: [e.g., Chrome 91] (for web issues)

**Screenshots**
If applicable, add screenshots

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why this feature would be useful

**Proposed Solution**
How you think this feature should work

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Any other relevant information
```

## 🏷️ Issue Labels

- `bug`: Something isn't working
- `feature`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: medium`: Medium priority issue
- `priority: low`: Low priority issue

## 📋 Coding Standards

### TypeScript

- Use strict mode
- Prefer interfaces over types for object shapes
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### React/Next.js

- Use functional components with hooks
- Prefer TypeScript over JavaScript
- Use proper prop types and interfaces
- Follow React best practices

### NestJS

- Use decorators properly
- Follow dependency injection patterns
- Use proper error handling
- Add validation using class-validator

### Database

- Use Prisma for database operations
- Write efficient queries
- Use proper indexing
- Follow database naming conventions

## 🚀 Release Process

1. **Version Bumping**: Update version numbers
2. **Changelog**: Update CHANGELOG.md
3. **Testing**: Run full test suite
4. **Documentation**: Update documentation
5. **Release**: Create GitHub release

## 📞 Getting Help

- **Discord**: [Join our community](https://discord.gg/fumu)
- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check the docs folder
- **PRD**: Reference the Product Requirements Document

## 📄 License

By contributing to FuMu, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to FuMu! 🎬✨
