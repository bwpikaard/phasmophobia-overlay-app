/* eslint-disable no-console */
/* eslint-disable multiline-comment-style */
import {
    app, BrowserWindow, globalShortcut, Menu, Tray,
} from "electron";
import {overlayWindow} from "electron-overlay-window";
import http from "http";
import {platform} from "os";
import {join} from "path";
import {pathToFileURL} from "url";

import {IpcMessages} from "../common/ipc-messages";

if (platform() === "linux") {
    app.disableHardwareAcceleration();
}

let window: BrowserWindow;

function createOverlayWindow(): void {
    window = new BrowserWindow({
        title: "Phasmoverlay",
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: false,
            preload: join(__dirname, "src/preload.js"),
        },
        fullscreenable: true,
        skipTaskbar: true,
        frame: false,
        show: false,
        transparent: true,
        resizable: true,
        focusable: false,
    });

    const localUrl = pathToFileURL(join(__dirname, "index.html"));
    localUrl.search = "view=overlay";
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    window.loadURL(localUrl.toString());

    window.webContents.openDevTools({mode: "detach", activate: false});

    window.setIgnoreMouseEvents(true);

    let vis = false;
        
    globalShortcut.register("F2", () => {
        vis = !vis;
        window.webContents.send(IpcMessages.TOGGLE_VISIBILITY, vis);
    });

    overlayWindow.attachTo(window, "Untitled - Notepad");
}

let tray: Tray;

if (!app.requestSingleInstanceLock()) app.quit();
else {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    app.whenReady().then(() => {
        createOverlayWindow();

        tray = new Tray(join(__dirname, "..", "resources", "icon.ico"));
          
        if (process.platform === "win32") {
            // eslint-disable-next-line @typescript-eslint/unbound-method
            tray.on("balloon-click", tray.popUpContextMenu);
        }
          
        const menu = Menu.buildFromTemplate([
            {
                label: "Quit",
                click: (): void => { app.quit() },
            },
        ]);
          
        tray.setToolTip("Phasmophobia Overlay");
        tray.setContextMenu(menu);


        const PORT = 21982;
        const server = http.createServer((req, res) => {
            console.log(req.url);
            res.end("Yes!");
        });
        server.listen(PORT);
        console.log(`http://localhost:${PORT}`);
    });
}
