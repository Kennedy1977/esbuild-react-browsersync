import esbuild from "esbuild";
import browserSync from "browser-sync";
import babel from "esbuild-plugin-babel";
import { fileURLToPath } from "url";
import path from "path";

const bs = browserSync.create();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildOptions = {
  entryPoints: ["src/index.jsx"],
  bundle: true,
  outfile: "dist/bundle.js",
  sourcemap: true,
  minify: true,
  plugins: [
    babel({
      filter: /\.jsx?$/,
      config: {
        presets: [
          ["@babel/preset-env", { targets: "defaults" }],
          ["@babel/preset-react"],
        ],
      },
    }),
  ],
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
};

async function startBuild() {
  try {
    console.log("Starting build...");

    const context = await esbuild.context(buildOptions);

    // Watch for changes
    await context.watch();

    console.log("Watching for changes...");

    // Start BrowserSync server
    bs.init({
      server: {
        baseDir: "./",
      },
      files: ["dist/bundle.js", "index.html"], // Adjust paths as needed
    });

    console.log("BrowserSync started...");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

startBuild().catch((error) => {
  console.error("Failed to start build:", error);
  process.exit(1);
});
