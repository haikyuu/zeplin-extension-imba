import { defineConfig } from "vite";
import { imba } from "vite-plugin-imba";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [imba()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.imba"),
      name: "zeplinImba",
      // the proper extensions will be added
      fileName: "main",
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
    //   external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        // globals: {
        //   vue: "Vue",
        // },
      },
    },
  },
});
