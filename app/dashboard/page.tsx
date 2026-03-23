"use client";

import { useEffect, useState, useRef } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Separator } from "@/components/ui/separator";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function Page() {
  // ---------------- STATE ----------------
  const [temperature, setTemperature] = useState<number | null>(null);
  const [flex1, setFlex1] = useState<number | null>(null);
  const [flex2, setFlex2] = useState<number | null>(null);

  const [heartRate, setHeartRate] = useState<number>(72);
  const [spo2, setSpo2] = useState<number>(98);

  const [latency, setLatency] = useState<number | null>(null);
  const [intervalMs, setIntervalMs] = useState<number | null>(null);

  const [status, setStatus] = useState("Connecting...");

  // ✅ FIX: useRef inside component
  const lastReceiveRef = useRef<number | null>(null);

  // ---------------- FLEX CONFIG ----------------
  const FLEX1_FLAT = 300;
  const FLEX1_BENT = 1000;
  const FLEX2_FLAT = 50;
  const FLEX2_BENT = 1000;

  const normalizePercent = (value: number, flat: number, bent: number) => {
    let percent = ((value - flat) / (bent - flat)) * 100;
    return Math.min(100, Math.max(0, percent));
  };

  const percentToAngle = (percent: number) => percent * 0.9;

  const getFlexStatus = (percent: number) => {
    if (percent < 20) return { label: "Relaxed", color: "text-green-600" };
    if (percent < 60) return { label: "Active", color: "text-yellow-600" };
    return { label: "Strong Bend", color: "text-red-600" };
  };

  const getGesture = (f1: number, f2: number) => {
    if (f1 >= 600 && f2 >= 600) return "HELP";
    if (f1 >= 700) return "FOOD";
    if (f2 >= 600) return "WATER";
    if (f1 >= 500 && f1 < 700) return "YES";
    if (f2 >= 300 && f2 < 600) return "NO";
    return "None";
  };

  // ---------------- WEBSOCKET ----------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => setStatus("Connected");
    ws.onclose = () => setStatus("Disconnected");
    ws.onerror = () => setStatus("Error");

    ws.onmessage = (event) => {
      const now = performance.now();

      const matches = event.data.match(/\{[^}]*\}/g);
      if (!matches) return;

      for (const msg of matches) {
        try {
          const data = JSON.parse(msg);

          // SENSOR DATA
          if (data.temp !== undefined) setTemperature(data.temp);
          if (data.flex1 !== undefined) setFlex1(data.flex1);
          if (data.flex2 !== undefined) setFlex2(data.flex2);

          // TRUE LATENCY (Arduino → Web)
          if (lastReceiveRef.current !== null) {
  const interval = now - lastReceiveRef.current;
  setIntervalMs(Number(interval.toFixed(0)));
}

// use interval as your main "latency"
setLatency(intervalMs ?? null);

lastReceiveRef.current = now;

          lastReceiveRef.current = now;
        } catch {
          console.error("Invalid JSON:", msg);
        }
      }
    };

    return () => ws.close();
  }, []);

  // ---------------- FAKE OXIMETER ----------------
  useEffect(() => {
    let t = 0;

    const interval = setInterval(() => {
      t += 0.2;

      const hr = 72 + Math.sin(t) * 3 + (Math.random() - 0.5) * 2;
      const sp = 98 + (Math.random() - 0.5) * 0.6;

      setHeartRate(Number(hr.toFixed(0)));
      setSpo2(Number(sp.toFixed(1)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ---------------- DERIVED ----------------
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

  // ---------------- UI ----------------
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Smart Glove</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Live Monitor</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Smart Glove Live Monitor</h1>
            <Badge variant="outline">WebSocket: {status}</Badge>
          </div>

          {/* Gesture */}
          <Card>
            <CardHeader>
              <CardTitle>Detected Command</CardTitle>
              <CardDescription>Gesture interpretation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{gesture}</p>
            </CardContent>
          </Card>

          {/* Vitals */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{heartRate} BPM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SpO₂</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{spo2}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {temperature !== null ? `${temperature.toFixed(2)} °C` : "--"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Flex */}
          <div className="grid gap-4 md:grid-cols-2">
            {[flex1Percent, flex2Percent].map((flex, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>Flex Sensor {i + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  {flex !== null ? (
                    <>
                      <p className="text-3xl font-bold">{flex.toFixed(0)}%</p>
                      <p className="text-sm text-muted-foreground">
                        ≈ {percentToAngle(flex).toFixed(0)}°
                      </p>
                      <p className={getFlexStatus(flex).color}>
                        {getFlexStatus(flex).label}
                      </p>
                    </>
                  ) : (
                    "--"
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {asymmetryWarning && (
            <Card className="border-red-500">
              <CardHeader>
                <CardTitle className="text-red-600">
                  ⚠ Uneven Movement Detected
                </CardTitle>
              </CardHeader>
            </Card>
          )}
          {/* Responsiveness */}
          <Card>
            <CardHeader>
              <CardTitle>System Responsiveness</CardTitle>
              <CardDescription>Update speed of incoming data</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{intervalMs ?? "--"} ms</p>

              <p className="text-sm text-muted-foreground">
                {intervalMs !== null && intervalMs < 150
                  ? "Real-time"
                  : intervalMs !== null && intervalMs < 300
                    ? "Smooth"
                    : "Delayed"}
              </p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
