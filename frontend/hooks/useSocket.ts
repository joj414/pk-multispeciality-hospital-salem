"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<{ event: string; data: any } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Connected to SmartCare Flow WebSocket");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected from SmartCare Flow WebSocket");
      setIsConnected(false);
    });

    // List of real-time operational events
    const events = [
      "patient.registered",
      "appointment.created",
      "appointment.updated",
      "queue.updated",
      "bed.updated",
      "bed.allocated",
      "bed.released",
      "notification.created",
      "simulation.step"
    ];

    events.forEach((evt) => {
      socket.on(evt, (data) => {
        setLastEvent({ event: evt, data });
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    lastEvent
  };
}