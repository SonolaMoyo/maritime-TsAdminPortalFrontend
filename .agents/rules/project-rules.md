# Project Rules

When working on this project (`TsAdminPortalFrontend`), ALWAYS adhere to the following rules:

1. **Mock API Data**: 
   - This frontend application must implement mock API data.
   - This ensures easy replacement and seamless integration of the real backend API once it becomes available.
   - Ensure mock data definitions are well-structured and API service calls simulate network delays if necessary.

2. **Coding Standards & Clean Implementation**:
   - Follow industry-standard best practices and coding standards (TypeScript/React conventions).
   - Ensure clean, readable, and maintainable implementations.

3. **Separation of Concerns**:
   - Create sufficient files and directories to enforce strict separation of concerns.
   - Keep components focused on a single responsibility.
   - Extract logic into custom hooks, utility functions, or service files rather than bloating UI components.

4. **Frontend Theme**:
   - Ensure to use the existing frontend theme.

5. **API Requirement Synchronization (`APIs.md`)**:
   - Whenever subsequent frontend implementations introduce, modify, or deprecate API interactions, endpoints, query parameters (e.g. pagination, sorting, filters), request payloads, or response models, you MUST update `APIs.md` to keep the backend API specifications strictly synchronized and up to date.
