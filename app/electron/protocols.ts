import { app, protocol } from 'electron'
import path from 'node:path'
import fs from 'fs';
import { getSteamPath } from './utils';

export function initializeProtocols() {
  protocol.handle("asset", async (request) => {
    try {
      const url = new URL(request.url);

      // Example:
      // asset://badges/ELITE.png
      // hostname = "badges"
      // pathname = "/ELITE.png"

      const relativePath = path.normalize(
        path.join(url.hostname, url.pathname)
      );

      const cacheRoot = path.join(
        app.getPath("userData"),
        "asset_cache"
      );

      const filePath = path.join(
        cacheRoot,
        relativePath
      );

      console.log("Asset path:", filePath);

      // Prevent path traversal attacks
      if (!filePath.startsWith(cacheRoot)) {
        return new Response("Forbidden", {
          status: 403,
        });
      }

      try {
        await fs.promises.access(filePath);
      } catch {
        return new Response("Not found", {
          status: 404,
        });
      }

      const data = await fs.promises.readFile(filePath);

      const ext = path.extname(filePath).toLowerCase();

      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
      };

      return new Response(data, {
        headers: {
          "Content-Type":
            mimeTypes[ext] ||
            "application/octet-stream",
        },
      });
    } catch (err) {
      console.error("Asset protocol error", err);

      return new Response("Internal error", {
        status: 500,
      });
    }
  });

  protocol.handle(
    "steam-avatar",
    async (request) => {
      try {
        const steamPath = await getSteamPath();

        if (!steamPath) {
          return new Response("Steam not found", {
            status: 404,
          });
        }

        const url = new URL(request.url);

        const safeName = path.basename(
          url.pathname
        );

        const filePath = path.join(
          steamPath,
          "config",
          "avatarcache",
          safeName
        );

        if (!fs.existsSync(filePath)) {
          return new Response("Not found", {
            status: 404,
          });
        }

        const data =
          await fs.promises.readFile(filePath);

        return new Response(data, {
          headers: {
            "Content-Type": "image/png",
          },
        });
      } catch (err) {
        console.error(
          "Steam avatar protocol error",
          err
        );

        return new Response("Internal error", {
          status: 500,
        });
      }
    }
  );
}