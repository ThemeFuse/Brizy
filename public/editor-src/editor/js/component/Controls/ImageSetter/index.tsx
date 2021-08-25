// We are doing this hack because index.wp.tsx need to extend ImageSetter class from index.cloud.tsx,
// so earlier we did like this `import ImageSetter from "./index.jsx`,
// but type script doesn't allow to specify the `.ts` extension on import `import ImageSetter from "./index.tsx`.
// Doing `import ImageSetter from "./index` would create an infinite loop for `index.wp.tsx`, as it would try to import
// itself when building WP version.
export * from "./index.cloud";
