# Changelog

All notable changes to Dito will be documented in this file.

## [1.0.0] - 2024

### 🎉 Major Release - Complete UI/UX Overhaul

### Added

#### Enhanced Interactive UI
- Modern ASCII art logo using ANSI Shadow font
- Organized menu structure with visual separators
- Color-coded interface (cyan headers, green success, yellow warnings)
- Creator attribution in banner
- Seamless navigation with "Return to menu" functionality

#### Specialized Analysis Modes
- **Full Project Analysis** - Complete audit of all aspects
- **Security Audit Only** - Focused vulnerability scanning
  - SQL Injection, XSS, CSRF, Secret Leaks, Auth Issues
  - Generates security-specific tests
- **Performance Check** - Bottleneck detection
  - Memory leaks, N+1 queries, Loop inefficiencies, Bundle size
- **Testing Coverage Analysis** - Test strategy evaluation
  - Unit/Integration/E2E tests, Test pyramid, CI/CD integration
- **Code Quality Review** - Structure and best practices audit
  - Code structure, Naming, Documentation, Complexity

#### Interactive Configuration Manager
- **Initialize Dito Config** - Guided setup wizard
  - Choose strictness level with descriptions
  - Automatic default ignore patterns
  - Overwrite protection
- **Adjust Strictness Level** - Change analysis intensity
  - View current setting
  - Select new level (Chill/Standard/Strict)
- **Manage Ignore Patterns** - File exclusion management
  - Add custom patterns
  - Remove specific patterns
  - Reset to defaults
  - View current patterns
- **View Current Settings** - Display active configuration

#### Utility Features
- **View Generated Reports** - List and preview reports
  - Shows file sizes
  - Preview first 500 characters
  - Quick access to results
- **Delete All Reports** - Smart cleanup
  - Finds all Dito-generated files
  - Shows deletion count
  - Supports glob patterns
- **Available CLI Commands** - Comprehensive reference
  - Lists all analysis modes
  - Shows usage examples
  - Quick documentation access

#### Mode-Specific Output
- `dito-security-report.md` for security audits
- `dito-performance-report.md` for performance checks
- `dito-testing-report.md` for testing analysis
- `dito-quality-report.md` for code quality reviews
- Mode-specific fix prompts in `dito-fixes.md`
- Tests generated only for security and full analysis

#### Documentation
- Comprehensive README update with "What's New" section
- Quick Start Guide (QUICK_START.md)
- Upgrade Summary (DITO_UPGRADE_SUMMARY.md)
- Changelog (this file)

### Changed
- Menu structure reorganized into logical categories
  - Analysis Commands
  - Configuration
  - Utilities
  - Help
- Enhanced configuration with interactive prompts
- Improved error messages and user feedback
- Better file organization for generated reports

### Removed
- MCP Servers menu option (not yet implemented)
- DITO.md Management (not needed)
- Generic "Permissions & Security" info page
- Redundant "Analyze specific directory" option

### Fixed
- Configuration file handling
- Report generation for different modes
- Menu navigation flow
- Error handling in interactive mode

### Technical Improvements
- Specialized prompts for each analysis mode
- Mode-specific report naming
- Better separation of concerns
- Improved code organization
- Enhanced user experience with confirmations

## [0.2.0] - Previous Version

### Features
- Basic interactive menu
- Full project analysis
- Debug mode for specific files
- Configuration file support
- Fix prompt generation
- Attack vector test generation

## [0.1.0] - Initial Release

### Features
- Command-line analysis tool
- Groq AI integration
- Basic security scanning
- Report generation
