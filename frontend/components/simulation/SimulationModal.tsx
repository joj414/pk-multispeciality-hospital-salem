"use client";

import React from "react";
import { Play, Activity, RefreshCw } from "lucide-react";

interface SimulationModalProps {
  isRunning: boolean;
  stepData: any | null;
  onTriggerSimulation: () => void;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isRunning,
  stepData,
  onTriggerSimulation
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4 text-white shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isRunning ? "bg-amber-500/20 text-amber-400 animate-pulse" : "bg-sky-500/20 text-sky-400"}`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm tracking-wide">Live Hospital Flow Simulation</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Hackathon Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isRunning
                ? stepData?.title || "Simulating acute patient preemption & 3D bed allocation..."
                : "Simulate emergency ambulance arrival, Max-Heap triage escalation, and 3D camera tracking."}
            </p>
          </div>
        </div>

        <button
          onClick={onTriggerSimulation}
          disabled={isRunning}
          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-900/40 flex items-center gap-2 transition hover:scale-105 active:scale-95"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Running Phase {stepData?.step || 1}/6
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              RUN LIVE SIMULATION
            </>
          )}
        </button>
      </div>

      {isRunning && stepData && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-emerald-500 h-1.5 transition-all duration-500"
              style={{ width: `${(stepData.step / (stepData.totalSteps || 6)) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-300 flex items-center justify-between">
            <span className="font-semibold text-amber-400">{stepData.title}</span>
            <span className="text-slate-400 font-mono">Step {stepData.step} of 6</span>
          </div>
          <p className="text-xs text-slate-400 italic">{stepData.description}</p>
        </div>
      )}
    </div>
  );
};