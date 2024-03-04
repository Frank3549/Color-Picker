# Fetch Practical

This application was created with create-next-app: `npx create-next-app@latest`.

Additional development dependencies installed with:

```
npm install -D jest jest-environment-jsdom husky lint-staged prettier eslint-config-prettier @testing-library/react @testing-library/jest-dom
```

Tools for mocking fetch installed with

```
npm install -D fetch-mock-jest node-fetch@2.6.7
```

Note we needed to pin the `node-fetch` version due to breaking changes when used with Jest in newer versions.

To use the AirBnB rules

```
npx install-peerdeps --dev eslint-config-airbnb
npm install -S prop-types
```
