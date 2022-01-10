/* eslint-disable no-console */
import type {IpcRendererEvent} from "electron";
import {ipcRenderer} from "electron";
import React, {useEffect, useState} from "react";
import {render} from "react-dom";
import type {Socket} from "socket.io-client";
import {io} from "socket.io-client";

import {IpcMessages} from "../common/ipc-messages";

enum EvidenceState {
    UNKNOWN = "UNKNOWN",
    CHECKED = "CHECKED",
    EXCLUDED = "EXCLUDED",
}

interface EvidenceStates {
    EMF5: EvidenceState;
    Fingerprints: EvidenceState;
    GhostWriting: EvidenceState;
    FreezingTemperatures: EvidenceState;
    DOTSPRojector: EvidenceState;
    GhostOrb: EvidenceState;
    SpiritBox: EvidenceState;
}

const ROOM_ID = "thisisaroom";

// eslint-disable-next-line func-style
const Overlay: React.FC = function() {
    const [, setEvidenceState] = useState<EvidenceStates>({
        EMF5: EvidenceState.UNKNOWN,
        Fingerprints: EvidenceState.UNKNOWN,
        GhostWriting: EvidenceState.UNKNOWN,
        FreezingTemperatures: EvidenceState.UNKNOWN,
        DOTSPRojector: EvidenceState.UNKNOWN,
        GhostOrb: EvidenceState.UNKNOWN,
        SpiritBox: EvidenceState.UNKNOWN,
    });
    const [vis, setVis] = useState<boolean>(false);
    const [socket, setSocket] = useState<Socket>();
    const [roomId] = useState<string>(ROOM_ID);

    useEffect(() => {
        console.log("run!");
        const newSocket = io("http://localhost:3001", {rejectUnauthorized: false, transports: ["websocket"] });
        setSocket(newSocket);

        newSocket.on("connect", () => { console.log("connected!") });
        newSocket.on("connect_error", e => { console.log("couldn't connect!", e) });

        newSocket.on("updateStates", (states: EvidenceStates): void => {
            setEvidenceState(states);
        });

        return (): void => { newSocket.disconnect() };
    }, []);

    useEffect(() => {
        if (!roomId || !socket) return;

        socket.emit("joinRoom", roomId);

        socket.on("connect", () => {
            socket.emit("joinRoom", roomId);
        });
    }, [roomId, socket]);

    useEffect(() => {
        document.body.style.margin = "0";
        ipcRenderer.on(IpcMessages.TOGGLE_VISIBILITY, (_: IpcRendererEvent, visi: boolean) => { setVis(visi) });
    }, []);

    if (vis) return <>
        <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            boxSizing: "border-box",
            fontFamily: "sans-serif",
        }}>
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "50px",
            }}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    color: "white",
                }}>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>1</span>
                        EMF Level 5
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>2</span>
                        Fingerprints
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>3</span>
                        Ghost Writing
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>4</span>
                        Freezing Temperatures
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>5</span>
                        D.O.T.S. Projector
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>6</span>
                        Ghost Orb
                    </div>
                    <div style={{marginBottom: "4px"}}>
                        <span style={{
                            display: "inline-block",
                            width: "18px",
                            borderRadius: "3px",
                            backgroundColor: "#545454",
                            padding: "2px",
                            textAlign: "center",
                            marginRight: "5px",
                        }}>7</span>
                        Spirit Box
                    </div>
                </div>
            </div>
        </div>
    </>;

    return <></>;
};

render(<Overlay />, document.getElementById("app"));

export default Overlay;
