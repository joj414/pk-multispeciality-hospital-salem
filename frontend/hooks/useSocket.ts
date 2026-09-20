"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }
  return "http://localhost:5000";
};

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<{ event: string; data: any } | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let socket: Socket | null = null;
    try {
      socket = io(getSocketUrl(), {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        timeout: 5000
      });
    } catch (e) {
      console.warn("Socket initialization error:", e);
      return;
    }

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