"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type GlovePacket = {
  flex1?: number;
  flex2?: number;
  temp?: number;
  hr?: number;
  spo2?: number;
  serverTime?: number;
  t?: number;
};

export function useGloveData() {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [flex1, setFlex1] = useState<number | null>(null);
  const [flex2, setFlex2] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [spo2, setSpo2] = useState<number | null>(null);
  const [status, setStatus] = useState("WebSocket: Connecting...");
  const [latency, setLatency] = useState<number | null>(null);

  const [history, setHistory] = useState<
    Array<{
      time: string;
      flex1: number | null;
      flex2: number | null;
      temp: number | null;
      hr: number | null;
      spo2: number | null;
    }>
  >([]);

  const lastReceiveRef = useRef<number | null>(null);

  const FLEX1_FLAT = 50;
  const FLEX1_BENT = 1000;
  const FLEX2_FLAT = 50;
  const FLEX2_BENT = 1000;

  const normalizePercent = (value: number, flat: number, bent: number) => {
    let percent = ((value - flat) / (bent - flat)) * 100;
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return percent;
  };

  const percentToAngle = (percent: number) => percent * 0.9;

  const getFlexStatus = (percent: number) => {
    if (percent < 20) return { label: "Relaxed", color: "text-green-600" };
    if (percent < 60) return { label: "Active", color: "text-yellow-600" };
    return { label: "Strong Bend", color: "text-red-600" };
  };

  const getGesture = (f1: number, f2: number) => {
    if (f1 >= 600 && f2 >= 600) return "HELP";
    if (f1 >= 600) return "FOOD";
    if (f2 >= 600) return "WATER";
    if (f1 >= 300 && f1 < 600) return "YES";
    if (f2 >= 300 && f2 < 600) return "NO";
    return "None";
  };

  useEffect(() => {
    const ws = new WebSocket("wss://38ca-209-35-160-191.ngrok-free.app");

    ws.onopen = () => setStatus("WebSocket: Connected");
    ws.onclose = () => setStatus("WebSocket: Disconnected");
    ws.onerror = () => setStatus("WebSocket: Error");

    ws.onmessage = (event) => {
      const now = performance.now();
      const matches = event.data.match(/\{[^}]*\}/g);
      if (!matches) return;

      for (const msg of matches) {
        try {
          const data: GlovePacket = JSON.parse(msg);

          const nextTemp = data.temp ?? null;
          const nextFlex1 = data.flex1 ?? null;
          const nextFlex2 = data.flex2 ?? null;
          const nextHr = data.hr ?? heartRate;
          const nextSpo2 = data.spo2 ?? spo2;

          if (data.temp !== undefined) setTemperature(data.temp);
          if (data.flex1 !== undefined) setFlex1(data.flex1);
          if (data.flex2 !== undefined) setFlex2(data.flex2);
          if (data.hr !== undefined) setHeartRate(data.hr);
          if (data.spo2 !== undefined) setSpo2(data.spo2);

          if (lastReceiveRef.current !== null) {
            setLatency(Number((now - lastReceiveRef.current).toFixed(0)));
          }
          lastReceiveRef.current = now;

          setHistory((prev) => [
            ...prev.slice(-29),
            {
              time: new Date().toLocaleTimeString(),
              flex1: nextFlex1,
              flex2: nextFlex2,
              temp: nextTemp,
              hr: nextHr ?? null,
              spo2: nextSpo2 ?? null,
            },
          ]);
        } catch (error) {
          console.error("Invalid JSON packet:", error);
        }
      }
    };

    return () => ws.close();
  }, [heartRate, spo2]);

  const flex1Percent =
    flex1 !== null ? normalizePercent(flex1, FLEX1_FLAT, FLEX1_BENT) : null;

  const flex2Percent =
    flex2 !== null ? normalizePercent(flex2, FLEX2_FLAT, FLEX2_BENT) : null;

  const flex1Angle =
    flex1Percent !== null ? percentToAngle(flex1Percent) : null;

  const flex2Angle =
    flex2Percent !== null ? percentToAngle(flex2Percent) : null;

  const gesture =
    flex1 !== null && flex2 !== null ? getGesture(flex1, flex2) : "None";

  const asymmetry =
    flex1Percent !== null && flex2Percent !== null
      ? Math.abs(flex1Percent - flex2Percent)
      : null;

  const asymmetryWarning = asymmetry !== null && asymmetry > 30;

  const latest = useMemo(() => history[history.length - 1] ?? null, [history]);

  return {
    temperature,
    flex1,
    flex2,
    heartRate,
    spo2,
    status,
    latency,
    history,
    latest,
    flex1Percent,
    flex2Percent,
    flex1Angle,
    flex2Angle,
    gesture,
    asymmetry,
    asymmetryWarning,
    getFlexStatus,
  };
}
