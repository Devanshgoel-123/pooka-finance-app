/* eslint-disable @typescript-eslint/no-unused-vars */
import { io, Socket } from "socket.io-client";
import dotenv from "dotenv";
import { useEffect } from "react";
import { DepositParams, PositionParams } from "@/store/types/types";
dotenv.config();
export const useSocketConnection = () => {
  console.log("The websocket error is", process.env.NEXT_PUBLIC_SERVER_URL);
  const socketURL = process.env.NEXT_PUBLIC_SERVER_URL;
  useEffect(() => {
    if (!socketURL) {
      console.error("WebSocket URL not defined");
      return;
    }
    const socket_connections: Socket = io(
      `${process.env.NEXT_PUBLIC_SERVER_URL}`,
      {
        transports: ["websocket"],
      }
    );
    if (!socket_connections) {
    }
    socket_connections.on("connect", () => {
        console.log("port connected")
    });

    socket_connections.on("open_position", (data) => {
      console.log("The received data", data);
    });

    socket_connections.on("deposit_collateral", (data) => {
      console.log("Received deposit_collateral event:", data);
    });

    socket_connections.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socket_connections.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    return () => {
      socket_connections.disconnect();
    };
  }, [socketURL]);
};
