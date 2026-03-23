"use client";

import { useEffect, useState } from "react";

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
  const [temperature, setTemperature] = useState<number | null>(null);
  const [flex1, setFlex1] = useState<number | null>(null);
  const [flex2, setFlex2] = useState<number | null>(null);

  const [heartRate, setHeartRate] = useState<number>(72);
  const [spo2, setSpo2] = useState<number>(98);

  const [status, setStatus] = useState("Connecting...");

  const FLEX1_FLAT = 100;
  const FLEX1_BENT = 1000;
  const FLEX2_FLAT = 100;
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

  // WebSocket data to connect to the bluetooth of arduino
  useEffect(() => {
    const ws = new WebSocket("wss://d62f-209-35-160-191.ngrok-free.app");

    ws.onopen = () => setStatus("Connected");
    ws.onclose = () => setStatus("Disconnected");
    ws.onerror = () => setStatus("Error");

    ws.onmessage = (event) => {
      const matches = event.data.match(/\{[^}]*\}/g);
      if (!matches) return;

      for (const msg of matches) {
        try {
          const data = JSON.parse(msg);

          if (data.temp !== undefined) setTemperature(data.temp);
          if (data.flex1 !== undefined) setFlex1(data.flex1);
          if (data.flex2 !== undefined) setFlex2(data.flex2);
        } catch {
          console.error("Invalid JSON:", msg);
        }
      }
    };

    return () => ws.close();
  }, []);

  // -------- Oximeter Data  --------
  useEffect(() => {
    let t = 0;

    const interval = setInterval(() => {
      t += 0.2;

      const hrBase = 72;
      const hrBreathWave = Math.sin(t) * 3;
      const hrNoise = (Math.random() - 0.5) * 2;

      const newHR = hrBase + hrBreathWave + hrNoise;

      const spo2Base = 98;
      const spo2Noise = (Math.random() - 0.5) * 0.6;

      const newSpO2 = spo2Base + spo2Noise;

      setHeartRate(Number(newHR.toFixed(0)));
      setSpo2(Number(newSpO2.toFixed(1)));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

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

        <div className="flex flex-1 flex-col gap-6 p-6 pt-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Smart Glove Live Monitor</h1>

            <Badge variant="outline">WebSocket: {status}</Badge>
          </div>

          {/* Gesture */}
          <Card className="border-blue-500">
            <CardHeader>
              <CardTitle>Detected Command</CardTitle>
              <CardDescription>Gesture interpretation</CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-4xl font-bold">{gesture}</p>
            </CardContent>
          </Card>

          {/* Vital Signs */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate</CardTitle>
                <CardDescription>Pulse (simulated)</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">-- BPM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SpO₂</CardTitle>
                <CardDescription>Oxygen Saturation</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">-- %</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Temperature</CardTitle>
                <CardDescription>Body temperature</CardDescription>
              </CardHeader>

              <CardContent>
                <p className="text-3xl font-bold">
                  32.05 °C
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Flex Sensors */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Flex Sensor 1</CardTitle>
              </CardHeader>

              <CardContent>
                {flex1Percent !== null ? (
                  <>
                    <p className="text-3xl font-bold">
                      {flex1Percent.toFixed(0)}%
                    </p>

                    <p className="text-sm text-muted-foreground">
                      ≈ {flex1Angle?.toFixed(0)}°
                    </p>

                    <p className={getFlexStatus(flex1Percent).color}>
                      {getFlexStatus(flex1Percent).label}
                    </p>
                  </>
                ) : (
                  "--"
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flex Sensor 2</CardTitle>
              </CardHeader>

              <CardContent>
                {flex2Percent !== null ? (
                  <>
                    <p className="text-3xl font-bold">
                      {flex2Percent.toFixed(0)}%
                    </p>

                    <p className="text-sm text-muted-foreground">
                      ≈ {flex2Angle?.toFixed(0)}°
                    </p>

                    <p className={getFlexStatus(flex2Percent).color}>
                      {getFlexStatus(flex2Percent).label}
                    </p>
                  </>
                ) : (
                  "--"
                )}
              </CardContent>
            </Card>
          </div>

          {asymmetryWarning && (
            <Card className="border-red-500">
              <CardHeader>
                <CardTitle className="text-red-600">
                  ⚠ Uneven Motor Response Detected
                </CardTitle>

                <CardDescription>
                  Significant difference between left and right movement.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
