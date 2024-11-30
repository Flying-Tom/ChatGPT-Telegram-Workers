// ../../../vite.config.shared.ts
import * as path from "node:path";
import { nodeResolve } from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/@rollup+plugin-node-resolve@15.3.0_rollup@4.26.0/node_modules/@rollup/plugin-node-resolve/dist/es/index.js";
import cleanup from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/rollup-plugin-cleanup@3.2.1_rollup@4.26.0/node_modules/rollup-plugin-cleanup/dist/rollup-plugin-cleanup.js";
import { nodeExternals } from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/rollup-plugin-node-externals@7.1.3_rollup@4.26.0/node_modules/rollup-plugin-node-externals/dist/index.js";
import { defineConfig } from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/vite@5.4.11_@types+node@22.9.0/node_modules/vite/dist/node/index.js";
import checker from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/vite-plugin-checker@0.8.0_eslint@9.14.0_optionator@0.9.4_stylelint@16.10.0_typescript@5.6.3___wbfwqxypcy347n5zzldsmiy54e/node_modules/vite-plugin-checker/dist/esm/main.js";
import dts from "file:///home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/node_modules/.pnpm/vite-plugin-dts@4.3.0_@types+node@22.9.0_rollup@4.26.0_typescript@5.6.3_vite@5.4.11_@types+node@22.9.0_/node_modules/vite-plugin-dts/dist/index.mjs";
function createShareConfig(options) {
  const plugins = [
    nodeResolve({
      browser: false,
      preferBuiltins: true
    }),
    cleanup({
      comments: "none",
      extensions: ["js", "ts"]
    }),
    checker({
      typescript: true
    })
  ];
  if (options.types) {
    plugins.push(
      dts({
        rollupTypes: true
      })
    );
  }
  if (options.nodeExternals) {
    const exclude = new Array();
    if (options.excludeMonoRepoPackages) {
      exclude.push(/^@chatgpt-telegram-workers\/.+/);
    }
    plugins.push(
      nodeExternals({
        exclude
      })
    );
  }
  return defineConfig({
    plugins,
    build: {
      target: "esnext",
      lib: {
        entry: path.resolve(options.root, "src/index"),
        fileName: "index",
        formats: ["es"]
      },
      sourcemap: true,
      minify: false,
      outDir: path.resolve(options.root, "dist")
    }
  });
}

// vite.config.ts
var __vite_injected_original_dirname = "/home/cystom/app/cloudflare-workers/ChatGPT-Telegram-Workers/packages/lib/plugins";
var vite_config_default = createShareConfig({
  root: __vite_injected_original_dirname,
  types: true
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vdml0ZS5jb25maWcuc2hhcmVkLnRzIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL2hvbWUvY3lzdG9tL2FwcC9jbG91ZGZsYXJlLXdvcmtlcnMvQ2hhdEdQVC1UZWxlZ3JhbS1Xb3JrZXJzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9jeXN0b20vYXBwL2Nsb3VkZmxhcmUtd29ya2Vycy9DaGF0R1BULVRlbGVncmFtLVdvcmtlcnMvdml0ZS5jb25maWcuc2hhcmVkLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL2N5c3RvbS9hcHAvY2xvdWRmbGFyZS13b3JrZXJzL0NoYXRHUFQtVGVsZWdyYW0tV29ya2Vycy92aXRlLmNvbmZpZy5zaGFyZWQudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgbm9kZVJlc29sdmUgfSBmcm9tICdAcm9sbHVwL3BsdWdpbi1ub2RlLXJlc29sdmUnO1xuaW1wb3J0IGNsZWFudXAgZnJvbSAncm9sbHVwLXBsdWdpbi1jbGVhbnVwJztcbmltcG9ydCB7IG5vZGVFeHRlcm5hbHMgfSBmcm9tICdyb2xsdXAtcGx1Z2luLW5vZGUtZXh0ZXJuYWxzJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IGNoZWNrZXIgZnJvbSAndml0ZS1wbHVnaW4tY2hlY2tlcic7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XG4gICAgcm9vdDogc3RyaW5nO1xuICAgIHR5cGVzPzogYm9vbGVhbjtcbiAgICBub2RlRXh0ZXJuYWxzPzogYm9vbGVhbjtcbiAgICBleGNsdWRlTW9ub1JlcG9QYWNrYWdlcz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTaGFyZUNvbmZpZyhvcHRpb25zOiBPcHRpb25zKTogVXNlckNvbmZpZyB7XG4gICAgY29uc3QgcGx1Z2luczogUGx1Z2luW10gPSBbXG4gICAgICAgIG5vZGVSZXNvbHZlKHtcbiAgICAgICAgICAgIGJyb3dzZXI6IGZhbHNlLFxuICAgICAgICAgICAgcHJlZmVyQnVpbHRpbnM6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBjbGVhbnVwKHtcbiAgICAgICAgICAgIGNvbW1lbnRzOiAnbm9uZScsXG4gICAgICAgICAgICBleHRlbnNpb25zOiBbJ2pzJywgJ3RzJ10sXG4gICAgICAgIH0pLFxuICAgICAgICBjaGVja2VyKHtcbiAgICAgICAgICAgIHR5cGVzY3JpcHQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgIF07XG4gICAgaWYgKG9wdGlvbnMudHlwZXMpIHtcbiAgICAgICAgcGx1Z2lucy5wdXNoKFxuICAgICAgICAgICAgZHRzKHtcbiAgICAgICAgICAgICAgICByb2xsdXBUeXBlczogdHJ1ZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5ub2RlRXh0ZXJuYWxzKSB7XG4gICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSBuZXcgQXJyYXk8UmVnRXhwPigpO1xuICAgICAgICBpZiAob3B0aW9ucy5leGNsdWRlTW9ub1JlcG9QYWNrYWdlcykge1xuICAgICAgICAgICAgZXhjbHVkZS5wdXNoKC9eQGNoYXRncHQtdGVsZWdyYW0td29ya2Vyc1xcLy4rLyk7XG4gICAgICAgIH1cbiAgICAgICAgcGx1Z2lucy5wdXNoKFxuICAgICAgICAgICAgbm9kZUV4dGVybmFscyh7XG4gICAgICAgICAgICAgICAgZXhjbHVkZSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICAgICAgcGx1Z2lucyxcbiAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICAgICAgICBsaWI6IHtcbiAgICAgICAgICAgICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKG9wdGlvbnMucm9vdCwgJ3NyYy9pbmRleCcpLFxuICAgICAgICAgICAgICAgIGZpbGVOYW1lOiAnaW5kZXgnLFxuICAgICAgICAgICAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgICAgICAgICBtaW5pZnk6IGZhbHNlLFxuICAgICAgICAgICAgb3V0RGlyOiBwYXRoLnJlc29sdmUob3B0aW9ucy5yb290LCAnZGlzdCcpLFxuICAgICAgICB9LFxuICAgIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9jeXN0b20vYXBwL2Nsb3VkZmxhcmUtd29ya2Vycy9DaGF0R1BULVRlbGVncmFtLVdvcmtlcnMvcGFja2FnZXMvbGliL3BsdWdpbnNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL2N5c3RvbS9hcHAvY2xvdWRmbGFyZS13b3JrZXJzL0NoYXRHUFQtVGVsZWdyYW0tV29ya2Vycy9wYWNrYWdlcy9saWIvcGx1Z2lucy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9jeXN0b20vYXBwL2Nsb3VkZmxhcmUtd29ya2Vycy9DaGF0R1BULVRlbGVncmFtLVdvcmtlcnMvcGFja2FnZXMvbGliL3BsdWdpbnMvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBjcmVhdGVTaGFyZUNvbmZpZyB9IGZyb20gJy4uLy4uLy4uL3ZpdGUuY29uZmlnLnNoYXJlZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNoYXJlQ29uZmlnKHtcbiAgICByb290OiBfX2Rpcm5hbWUsXG4gICAgdHlwZXM6IHRydWUsXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxZQUFZLFVBQVU7QUFDdEIsU0FBUyxtQkFBbUI7QUFDNUIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sYUFBYTtBQUNwQixPQUFPLFNBQVM7QUFTVCxTQUFTLGtCQUFrQixTQUE4QjtBQUM1RCxRQUFNLFVBQW9CO0FBQUEsSUFDdEIsWUFBWTtBQUFBLE1BQ1IsU0FBUztBQUFBLE1BQ1QsZ0JBQWdCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLElBQ0QsUUFBUTtBQUFBLE1BQ0osVUFBVTtBQUFBLE1BQ1YsWUFBWSxDQUFDLE1BQU0sSUFBSTtBQUFBLElBQzNCLENBQUM7QUFBQSxJQUNELFFBQVE7QUFBQSxNQUNKLFlBQVk7QUFBQSxJQUNoQixDQUFDO0FBQUEsRUFDTDtBQUNBLE1BQUksUUFBUSxPQUFPO0FBQ2YsWUFBUTtBQUFBLE1BQ0osSUFBSTtBQUFBLFFBQ0EsYUFBYTtBQUFBLE1BQ2pCLENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNBLE1BQUksUUFBUSxlQUFlO0FBQ3ZCLFVBQU0sVUFBVSxJQUFJLE1BQWM7QUFDbEMsUUFBSSxRQUFRLHlCQUF5QjtBQUNqQyxjQUFRLEtBQUssZ0NBQWdDO0FBQUEsSUFDakQ7QUFDQSxZQUFRO0FBQUEsTUFDSixjQUFjO0FBQUEsUUFDVjtBQUFBLE1BQ0osQ0FBQztBQUFBLElBQ0w7QUFBQSxFQUNKO0FBQ0EsU0FBTyxhQUFhO0FBQUEsSUFDaEI7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxNQUNSLEtBQUs7QUFBQSxRQUNELE9BQVksYUFBUSxRQUFRLE1BQU0sV0FBVztBQUFBLFFBQzdDLFVBQVU7QUFBQSxRQUNWLFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDbEI7QUFBQSxNQUNBLFdBQVc7QUFBQSxNQUNYLFFBQVE7QUFBQSxNQUNSLFFBQWEsYUFBUSxRQUFRLE1BQU0sTUFBTTtBQUFBLElBQzdDO0FBQUEsRUFDSixDQUFDO0FBQ0w7OztBQzlEQSxJQUFNLG1DQUFtQztBQUV6QyxJQUFPLHNCQUFRLGtCQUFrQjtBQUFBLEVBQzdCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFDWCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
