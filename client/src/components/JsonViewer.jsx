import React from "react";
import { Code2 } from "lucide-react";

export default function JsonViewer({ data }) {
  return (
    <div className="flex-1 min-h-[30vh] flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl p-4">
      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 border-b border-slate-800 pb-2 shrink-0 font-semibold uppercase tracking-wider">
        <Code2 size={13} className="text-cyan-400" /> Active Layout Schema JSON
      </div>
      <div className="flex-1 overflow-auto rounded-lg bg-slate-950/80 p-4 border border-slate-900/60 text-[11px] font-mono text-cyan-400/90 leading-relaxed shadow-inner">
        <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(data, null, 2)}</pre>
      </div>
    </div>
  );
}