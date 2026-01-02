# Contributing to NeuralSense Frontend

Thank you for your interest in contributing to NeuralSense! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help maintain a welcoming environment

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/NeuralSense_Frontend.git
   ```
3. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run development server**

   ```bash
   npm run dev
   ```

3. **Make your changes**

   - Follow the coding standards below
   - Write clean, documented code
   - Test your changes thoroughly

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Avoid `any` type when possible
- Define proper interfaces for data structures
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing

```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

// Avoid
export const Button = (props: any) => {
  return <button {...props} />;
};
```

### Styling

- Use Tailwind CSS utility classes
- Keep custom CSS minimal
- Use the defined color palette from `tailwind.config.ts`
- Maintain consistent spacing and sizing

```typescript
// Good
<div className="px-4 py-2 bg-primary-500 rounded-lg">

// Avoid inline styles
<div style={{ padding: '8px 16px', backgroundColor: '#0ea5e9' }}>
```

### File Organization

```
components/
  - ComponentName.tsx (component file)

app/
  - page.tsx (route pages)
  - layout.tsx (layouts)

lib/
  - api.ts (API client)
  - store.ts (state management)
  - utils.ts (utility functions)

types/
  - index.ts (TypeScript types)
```

### Naming Conventions

- Components: PascalCase (`CameraCapture.tsx`)
- Files: camelCase (`api.ts`, `store.ts`)
- Functions: camelCase (`handleSubmit`, `fetchData`)
- Constants: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- Interfaces: PascalCase with descriptive names (`StressAnalysisResult`)

## Component Guidelines

### Creating New Components

1. **Define clear props interface**

   ```typescript
   interface MyComponentProps {
     title: string;
     onAction: () => void;
     className?: string;
   }
   ```

2. **Add JSDoc comments**

   ```typescript
   /**
    * MyComponent description
    * Handles XYZ functionality
    */
   export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => {
   ```

3. **Use semantic HTML**

   ```typescript
   // Good
   <button aria-label="Submit form" onClick={handleSubmit}>

   // Avoid
   <div onClick={handleSubmit}>
   ```

4. **Handle loading and error states**
   ```typescript
   if (isLoading) return <Loader />;
   if (error) return <ErrorMessage error={error} />;
   ```

## State Management

- Use Zustand stores for global state
- Use React hooks for local component state
- Keep state as close to usage as possible

```typescript
// Global state
import { useAuthStore } from "@/lib/store";

// Local state
const [isOpen, setIsOpen] = useState(false);
```

## API Integration

- Use the centralized API client (`lib/api.ts`)
- Handle errors gracefully
- Show user-friendly error messages
- Implement retry logic for critical operations

```typescript
try {
  const result = await apiClient.analyzeFace(sessionId, imageBlob);
  // Handle success
} catch (error: any) {
  setError(error.message || "An error occurred");
}
```

## Accessibility

- Use semantic HTML elements
- Add proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers

```typescript
<button
  aria-label="Capture photo"
  aria-pressed={isCapturing}
  disabled={!isReady}
>
  Capture
</button>
```

## Testing

Before submitting:

1. Test all user flows manually
2. Test on different screen sizes (mobile, tablet, desktop)
3. Test on different browsers (Chrome, Firefox, Safari, Edge)
4. Verify camera and microphone functionality
5. Check error handling and edge cases

## Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

Examples:

```
feat: add voice recording visualization
fix: resolve camera permission denial issue
docs: update API integration guide
refactor: extract session logic into custom hook
```

## Pull Request Guidelines

1. **Title**: Clear and descriptive
2. **Description**: Explain what and why
3. **Screenshots**: Include for UI changes
4. **Testing**: Describe how you tested
5. **Breaking Changes**: Clearly document if any

## Questions or Issues?

- Open an issue for bugs or feature requests
- Reach out to the maintainers for guidance
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to NeuralSense! 🧠💙
