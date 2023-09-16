# Developing

- The development branch is `main`.
- All pull requests should be opened against `main`.

## Local development

1. Make sure you have `pnpm` installed
2. Install the dependencies with:\
   `pnpm install`
3. Start developing and watch for code changes:\
   `pnpm dev:sandbox` \
   Thus, you can view the feedback of your changes in the `/examples/sandbox` project.
4. If you want to see how it works in different environments, you can use other projects located 
in the examples folder.

## Regression testing

Run tests: 
`pnpm test`

The project is fully covered by tests, ensuring a high level of confidence that everything works correctly 
after making changes. 

Test-driven development (TDD) is highly effective for this project. During development, you 
can test everything in less than 1 second. Personally, I prefer this approach over making manual requests.
