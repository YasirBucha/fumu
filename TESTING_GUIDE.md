# FuMu Testing & Quality Assurance Guide

This guide covers comprehensive testing procedures for the FuMu AI-powered movie creation application.

## Testing Overview

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Complete user workflow testing
- **Performance Tests**: Load and stress testing
- **Security Tests**: Security vulnerability testing
- **User Acceptance Tests**: Real user scenario testing

### Testing Environments
- **Development**: Local development testing
- **Staging**: Pre-production testing environment
- **Production**: Live production monitoring

## Test Categories

### 1. Unit Testing

#### API Unit Tests
```bash
# Run API unit tests
cd apps/api
npm run test

# Run tests with coverage
npm run test:cov

# Run specific test files
npm run test -- --testNamePattern="AuthService"
```

#### Frontend Unit Tests
```bash
# Run web app unit tests
cd apps/web
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific component tests
npm run test -- --testNamePattern="ProjectCard"
```

### 2. Integration Testing

#### API Integration Tests
```bash
# Test API endpoints
curl -X GET http://localhost:3001/health
curl -X GET http://localhost:3001/ai/models
curl -X POST http://localhost:3001/auth/webhook -d '{"test": "data"}'
```

#### Database Integration Tests
```bash
# Test database connectivity
cd apps/api
npx prisma db push
npx prisma studio

# Test database operations
npm run test:db
```

### 3. End-to-End Testing

#### User Workflow Tests
1. **User Registration/Login**
2. **Project Creation**
3. **Character Creation**
4. **Scene Generation**
5. **Video Processing**
6. **Movie Export**

#### E2E Test Script
```bash
# Run end-to-end tests
npm run test:e2e

# Run specific E2E test suites
npm run test:e2e -- --grep "User Registration"
```

### 4. Performance Testing

#### Load Testing
```bash
# Test API performance
npm run test:load

# Test with different load levels
npm run test:load -- --users 10 --duration 60
npm run test:load -- --users 50 --duration 300
```

#### Stress Testing
```bash
# Test system limits
npm run test:stress

# Test video processing performance
npm run test:video-performance
```

### 5. Security Testing

#### Authentication Testing
- Test JWT token validation
- Test session management
- Test authorization levels
- Test password security

#### API Security Testing
- Test input validation
- Test SQL injection prevention
- Test XSS prevention
- Test CSRF protection

## Test Automation

### 1. Continuous Integration

#### GitHub Actions Workflow
```yaml
name: FuMu CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Run security tests
      run: npm run test:security
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

### 2. Automated Testing Scripts

#### Test Runner Script
```bash
#!/bin/bash
# test-runner.sh - Comprehensive test runner

echo "🧪 Running FuMu Test Suite..."

# Run all test categories
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
npm run test:security

echo "✅ All tests completed!"
```

## Manual Testing Procedures

### 1. User Interface Testing

#### Frontend Testing Checklist
- [ ] **Navigation**: All navigation links work correctly
- [ ] **Forms**: All forms submit and validate properly
- [ ] **Authentication**: Login/logout functionality works
- [ ] **Responsive Design**: UI works on different screen sizes
- [ ] **Accessibility**: UI is accessible to users with disabilities
- [ ] **Error Handling**: Error messages are clear and helpful

#### Browser Compatibility
- [ ] **Chrome**: Latest version
- [ ] **Firefox**: Latest version
- [ ] **Safari**: Latest version
- [ ] **Edge**: Latest version
- [ ] **Mobile Browsers**: iOS Safari, Chrome Mobile

### 2. API Testing

#### API Endpoint Testing
```bash
# Test authentication endpoints
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'

# Test project endpoints
curl -X GET http://localhost:3001/projects \
  -H "Authorization: Bearer your-token"

# Test AI generation endpoints
curl -X POST http://localhost:3001/ai/text-to-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"prompt": "A beautiful sunset over mountains"}'
```

#### API Response Testing
- [ ] **Status Codes**: Correct HTTP status codes returned
- [ ] **Response Format**: Valid JSON responses
- [ ] **Error Handling**: Proper error responses
- [ ] **Authentication**: Protected endpoints require authentication
- [ ] **Rate Limiting**: API rate limits work correctly

### 3. Database Testing

#### Database Operations Testing
```sql
-- Test database connectivity
SELECT 1;

-- Test user creation
INSERT INTO users (email, name, provider) 
VALUES ('test@example.com', 'Test User', 'email');

-- Test project creation
INSERT INTO projects (title, description, userId) 
VALUES ('Test Project', 'Test Description', 'user-id');

-- Test data integrity
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM scenes;
```

#### Database Performance Testing
- [ ] **Query Performance**: Database queries execute quickly
- [ ] **Connection Pooling**: Database connections are managed efficiently
- [ ] **Data Integrity**: Data remains consistent across operations
- [ ] **Backup/Restore**: Database backup and restore procedures work

### 4. Video Processing Testing

#### FFmpeg Testing
```bash
# Test FFmpeg installation
ffmpeg -version

# Test video processing capabilities
ffmpeg -formats | grep mp4
ffmpeg -codecs | grep h264

# Test video composition
npm run test:video-processing
```

#### Video Processing Workflow Testing
- [ ] **Scene Generation**: AI-generated scenes are created correctly
- [ ] **Video Composition**: Multiple scenes are merged into a single video
- [ ] **Export Options**: Different export formats work correctly
- [ ] **Quality Settings**: Different quality levels produce expected results

### 5. AI Services Testing

#### AI Service Integration Testing
```bash
# Test OpenAI service
curl -X POST http://localhost:3001/ai/text-to-image \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"prompt": "Test prompt", "resolution": "1024x1024"}'

# Test Runway service
curl -X POST http://localhost:3001/ai/image-to-video \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"imageUrl": "test-image.jpg", "prompt": "Test video"}'
```

#### AI Service Testing Checklist
- [ ] **API Keys**: All AI service API keys are configured
- [ ] **Response Quality**: AI-generated content meets quality standards
- [ ] **Error Handling**: AI service failures are handled gracefully
- [ ] **Rate Limiting**: AI service rate limits are respected
- [ ] **Cost Monitoring**: AI service usage is monitored

## Quality Assurance Procedures

### 1. Code Quality

#### Code Review Checklist
- [ ] **Code Style**: Code follows established style guidelines
- [ ] **Documentation**: Code is properly documented
- [ ] **Error Handling**: Proper error handling is implemented
- [ ] **Security**: Security best practices are followed
- [ ] **Performance**: Code is optimized for performance

#### Static Analysis
```bash
# Run ESLint
npm run lint

# Run TypeScript compiler
npm run type-check

# Run security audit
npm audit

# Run code quality analysis
npm run quality-check
```

### 2. Performance Quality

#### Performance Metrics
- **API Response Time**: < 500ms for most endpoints
- **Page Load Time**: < 3 seconds for web pages
- **Video Processing Time**: < 5 minutes for 1-minute videos
- **Database Query Time**: < 100ms for most queries

#### Performance Monitoring
```bash
# Monitor API performance
npm run monitor:api

# Monitor database performance
npm run monitor:db

# Monitor video processing performance
npm run monitor:video
```

### 3. Security Quality

#### Security Testing Checklist
- [ ] **Authentication**: User authentication is secure
- [ ] **Authorization**: User permissions are properly enforced
- [ ] **Input Validation**: All user inputs are validated
- [ ] **SQL Injection**: Database queries are protected
- [ ] **XSS Prevention**: Cross-site scripting is prevented
- [ ] **CSRF Protection**: Cross-site request forgery is prevented

#### Security Scanning
```bash
# Run security scan
npm run security-scan

# Check for vulnerabilities
npm audit

# Test for security issues
npm run test:security
```

## Test Data Management

### 1. Test Data Setup

#### Sample Data Creation
```bash
# Create test users
npm run seed:users

# Create test projects
npm run seed:projects

# Create test scenes
npm run seed:scenes

# Create test characters
npm run seed:characters
```

#### Test Data Cleanup
```bash
# Clean up test data
npm run cleanup:test-data

# Reset database
npm run reset:db

# Clear cache
npm run clear:cache
```

### 2. Test Environment Management

#### Environment Setup
```bash
# Setup test environment
npm run setup:test-env

# Start test services
npm run start:test-services

# Stop test services
npm run stop:test-services
```

## Bug Reporting and Tracking

### 1. Bug Report Template

#### Bug Report Format
```
**Bug Title**: Brief description of the bug

**Environment**:
- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120.0]
- Version: [e.g., v1.0.0]

**Steps to Reproduce**:
1. Step 1
2. Step 2
3. Step 3

**Expected Result**: What should happen

**Actual Result**: What actually happens

**Screenshots**: If applicable

**Additional Information**: Any other relevant details
```

### 2. Bug Tracking

#### Bug Priority Levels
- **Critical**: System crashes, data loss, security vulnerabilities
- **High**: Major functionality broken, performance issues
- **Medium**: Minor functionality issues, UI problems
- **Low**: Cosmetic issues, enhancement requests

#### Bug Lifecycle
1. **Reported**: Bug is reported
2. **Confirmed**: Bug is confirmed by QA team
3. **Assigned**: Bug is assigned to developer
4. **Fixed**: Bug is fixed by developer
5. **Verified**: Bug fix is verified by QA team
6. **Closed**: Bug is closed

## Test Reporting

### 1. Test Results Reporting

#### Test Report Template
```
# FuMu Test Report

**Test Date**: [Date]
**Test Environment**: [Environment]
**Test Version**: [Version]

## Test Summary
- Total Tests: [Number]
- Passed: [Number]
- Failed: [Number]
- Skipped: [Number]

## Test Results by Category
- Unit Tests: [Results]
- Integration Tests: [Results]
- E2E Tests: [Results]
- Performance Tests: [Results]
- Security Tests: [Results]

## Issues Found
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

## Recommendations
- [Recommendation 1]
- [Recommendation 2]
- [Recommendation 3]
```

### 2. Quality Metrics

#### Quality Metrics Dashboard
- **Test Coverage**: Percentage of code covered by tests
- **Bug Density**: Number of bugs per thousand lines of code
- **Performance Metrics**: Response times, throughput, resource usage
- **Security Metrics**: Number of vulnerabilities, security test results

## Continuous Improvement

### 1. Test Process Improvement

#### Regular Reviews
- **Weekly**: Review test results and identify patterns
- **Monthly**: Review test process and identify improvements
- **Quarterly**: Comprehensive test strategy review

#### Process Improvements
- **Automation**: Increase test automation coverage
- **Tools**: Evaluate and adopt new testing tools
- **Training**: Provide training on testing best practices
- **Documentation**: Keep testing documentation up to date

### 2. Quality Metrics Improvement

#### Metrics Tracking
- **Trend Analysis**: Track quality metrics over time
- **Benchmarking**: Compare against industry standards
- **Goal Setting**: Set quality improvement goals
- **Progress Monitoring**: Monitor progress toward goals

## Conclusion

This comprehensive testing and quality assurance guide ensures that FuMu maintains high quality standards throughout development and deployment. Regular testing, monitoring, and continuous improvement help deliver a reliable and user-friendly application.

The testing framework covers all aspects of the application from unit tests to end-to-end user workflows, ensuring that FuMu provides a seamless experience for users creating AI-powered movies.
