/* eslint-disable @typescript-eslint/no-unused-vars */
import { io, Socket } from "socket.io-client";
import dotenv from "dotenv";
import { useEffect, useRef, useState } from "react";
import { ClosePositionParams, DepositParams, PositionParams, WithdrawPositionParams } from "@/store/types/types";
dotenv.config();
export const useSocketConnection = () => {
  const [renderElement, setRenderElement]=useState<string | undefined>(undefined);
  const [element, setElement]=useState<"deposit" | "close" | "trade" | "withdraw" | null>(null);
  const positionParams = useRef<PositionParams>({
    perpName: undefined,
    leverage: undefined,
    collateral: undefined,
    positionType: undefined,
  });

  const depositParams=useRef<DepositParams>({
    chainName:undefined,
    collateral:undefined,
    payToken:undefined
  });

  const withdrawParams=useRef<WithdrawPositionParams>({
    withdrawAmount:undefined
  });

  const closePositionParams=useRef<ClosePositionParams>({
    perpName:undefined
  })

  
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
      positionParams.current=data.position;
      setElement("trade")
    });

    socket_connections.on("close_position", (data) => {
      console.log("The received data", data);
      closePositionParams.current=data.position;
      setElement("close")
    })

    socket_connections.on("withdraw_amount", (data) => {
      console.log("The received data withdrawal amount", data);
     withdrawParams.current=data.position;
      setElement("withdraw")
    });

    socket_connections.on("deposit_collateral", (data) => {
      console.log("Received deposit_collateral event:", data);
      depositParams.current=data.position;
      setElement("deposit")
    });

    socket_connections.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    socket_connections.on("connect_error", (err) => {
      console.log("Connection error:", err);
    });

    return () => {
      socket_connections.disconnect();
    };
  }, [socketURL]);

  return {
    positionParams,
    depositParams,
    withdrawParams,
    closePositionParams,
    element
  }
};
