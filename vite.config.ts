// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
	cloudflare: false,
	tanstackStart: {
		prerender: {
			enabled: true,
		},
		pages: [
			{ path: "/" },
			{ path: "/about" },
			{ path: "/categories" },
			{ path: "/contact" },
			{ path: "/gallery" },
			{ path: "/menu" },
			{ path: "/reviews" },
			{ path: "/services" },
			{ path: "/admin" },
			{ path: "/terms-and-conditions" },
			{ path: "/privacy-policy" },
			{ path: "/cancellation-and-refund" },
			{ path: "/shipping-and-delivery" },
		],
	},
});
