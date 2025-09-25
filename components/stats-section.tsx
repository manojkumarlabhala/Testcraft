"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

const stats = [
  { id: "papers", label: "Papers", target: 8500, suffix: "+" },
  { id: "users", label: "Students", target: 250000, suffix: "+" },
  { id: "tests", label: "Tests Taken", target: 1.2, suffix: "M+", divisor: 1000000 },
  { id: "success", label: "Success Rate", target: 76.5, suffix: "%" },
]

export function StatsSection() {
  // Always start counters at 0 for SSR and client match
  const [counters, setCounters] = useState(stats.map(() => 0));
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    let timers: NodeJS.Timeout[] = [];
    stats.forEach((stat, index) => {
      const increment = stat.target / 50;
      let current = 0;
      timers[index] = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          current = stat.target;
          clearInterval(timers[index]);
        }
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = current;
          return newCounters;
        });
      }, 40);
    });
    return () => timers.forEach(timer => clearInterval(timer));
  }, [hydrated]);

  const formatNumber = (num: number, stat: (typeof stats)[0]) => {
    const value = stat.divisor ? num / stat.divisor : num;
    return Math.floor(value).toLocaleString();
  };

  return (
    <section id="stats-section" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.id} className="p-6 text-center border-border/50">
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {formatNumber(counters[index], stat)}
                {stat.suffix}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
