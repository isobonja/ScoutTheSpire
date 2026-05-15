import Registry from "winreg";

export function getSteamPath(): Promise<string | null> {
  return new Promise((resolve) => {
    const regKey = new Registry({
      hive: Registry.HKCU,
      key: "\\Software\\Valve\\Steam",
    });

    regKey.get("SteamPath", (err, item) => {
      if (err || !item) {
        resolve(null);
        return;
      }

      resolve(item.value);
    });
  });
}