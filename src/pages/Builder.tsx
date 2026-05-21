import React, { useState } from 'react';
import { Save, Play, Download, History, MessageSquare, Terminal as TerminalIcon, AlertCircle, Variable, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { HarnessEngine } from '../lib/harness-engine';

export default function Builder() {
  const [activeTab, setActiveTab] = useState('variables');
  const [testInput, setTestInput] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<string | null>(null);

  // Customization State
  const [variables, setVariables] = useState({
    companyName: 'Acme Corp',
    tone: 'Professional and empathetic',
    productLine: 'SaaS Software'
  });

  const tabs = [
    { id: 'variables', name: 'Variables', icon: Variable },
    { id: 'preview', name: 'Generated Preview', icon: TerminalIcon },
    { id: 'eval', name: 'Evaluation', icon: MessageSquare },
  ];

  const handleTest = async () => {
    if (!testInput.trim()) return;
    setIsEvaluating(true);
    setEvalResult(null);
    try {
      const response = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${generatedPrompt}\n\nUser message: ${testInput}`,
        }),
      });
      const data = await response.json() as { success: boolean; text?: string; error?: { message: string } };
      if (data.success && data.text) {
        setEvalResult(data.text);
      } else {
        setEvalResult(`Error: ${data.error?.message ?? 'Request failed. Please try again.'}`);
      }
    } catch {
      setEvalResult('Network error. Please check your connection and try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const generatedPrompt = `YOU ARE A HIGH-EMPATHY CUSTOMER SUPPORT AGENT FOR ${variables.companyName.toUpperCase()}.

CORE RULES:
1. MAINTAIN A TONE THAT IS ${variables.tone.toUpperCase()}.
2. YOU SUPPORT THE FOLLOWING PRODUCT LINE: ${variables.productLine.toUpperCase()}.
3. NEVER PROMISE REFUNDS WITHOUT APPROVAL.
4. USE THE USER'S PREFERRED NAME.
`;

  const harnessName = 'Customer_Support_L1';
  const harnessVersion = '1.4.2';

  const handleExport = (format: 'txt' | 'json' | 'yaml') => {
    if (format === 'txt') {
      const content = HarnessEngine.toMarkdown(harnessName, harnessVersion, generatedPrompt);
      downloadFile(content, `${harnessName}-v${harnessVersion}.md`, 'text/markdown');
    } else if (format === 'json') {
      const content = HarnessEngine.toJSON(harnessName, harnessVersion, generatedPrompt, variables);
      downloadFile(content, `${harnessName}-v${harnessVersion}.json`, 'application/json');
    } else if (format === 'yaml') {
      const content = HarnessEngine.toYAML(harnessName, harnessVersion, generatedPrompt, variables);
      downloadFile(content, `${harnessName}-v${harnessVersion}.yaml`, 'text/yaml');
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Template Version: v1.4.2</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">Unsaved Instance</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">Customer_Support_L1</h1>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-[#E5E7EB] text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <History size={16} />
            Instance History
          </button>
          <button className="btn-primary flex items-center gap-2 py-2 text-sm shadow-sm">
            <Save size={16} />
            Save Instance
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)] min-h-[600px]">
        {/* Main Editor Area */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="flex gap-1 overflow-x-auto border-b border-[#E5E7EB] pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id ? 'bg-white text-slate-900 border border-[#E5E7EB] shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-transparent border border-transparent'
                }`}
              >
                <tab.icon size={14} />
                {tab.name}
              </button>
            ))}
          </div>

          <div className="card flex-grow flex flex-col p-0 overflow-hidden relative">
            {activeTab === 'variables' && (
              <div className="p-6 flex flex-col gap-6 overflow-y-auto w-full h-full">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Required Variables</h3>
                  <p className="text-xs text-slate-500 mb-4">These define the core behavior of your Harness Instance.</p>

                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Company Name <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={variables.companyName}
                        onChange={(e) => setVariables({...variables, companyName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tone of Voice <span className="text-rose-500">*</span></label>
                      <input
                        type="text"
                        value={variables.tone}
                        onChange={(e) => setVariables({...variables, tone: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Optional Variables</h3>
                  <p className="text-xs text-slate-500 mb-4">Configure specific integrations or product lines.</p>

                  <div className="flex flex-col gap-4">
                     <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Product Line Context</label>
                      <textarea
                        value={variables.productLine}
                        onChange={(e) => setVariables({...variables, productLine: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all resize-none min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#E5E7EB] bg-slate-50">
                  <h3 className="font-bold text-slate-900 text-sm tracking-tight">Compiled System Prompt</h3>
                  <div className="text-[10px] uppercase tracking-widest font-bold text-emerald-600 flex items-center gap-1">
                     <Check size={12} />
                     All variables injected
                  </div>
                </div>
                <textarea
                  readOnly
                  className="w-full flex-grow p-6 bg-white border-none font-mono text-sm leading-relaxed focus:outline-none resize-none text-slate-700"
                  value={generatedPrompt}
                />
              </div>
            )}

            {activeTab === 'eval' && (
              <div className="p-6 flex flex-col items-center justify-center h-full text-center">
                 <AlertCircle size={32} className="text-slate-300 mb-4" />
                 <h3 className="text-base font-bold text-slate-900 mb-2">Evaluation Metrics</h3>
                 <p className="text-sm text-slate-500 max-w-sm">Review quality gate scores and historical test runs for this specific instance configuration.</p>
              </div>
            )}
          </div>
        </div>

        {/* Action/Test Side */}
        <div className="lg:col-span-4 flex flex-col gap-6 h-full">
          <div className="card bg-slate-900 border-slate-800 text-white flex flex-col gap-4 shadow-lg h-3/5 p-5">
            <h3 className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest text-slate-400">
              <Play size={14} className="text-brand" />
              Evaluation Center
            </h3>

            <div className="flex flex-col gap-3 flex-grow h-full">
               <div className="flex-grow flex flex-col">
                <textarea
                  className="w-full flex-grow min-h-[100px] bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-brand/50 transition-all font-mono resize-none"
                  placeholder="Simulate a user query..."
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                />
               </div>

               <button
                onClick={handleTest}
                disabled={isEvaluating}
                className="w-full bg-brand text-white py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
               >
                {isEvaluating ? 'Evaluating...' : 'Run Harness Test'}
               </button>
            </div>

            <AnimatePresence>
              {evalResult && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-[#111827] rounded-lg border border-[#374151] text-xs font-mono leading-relaxed mt-2 overflow-y-auto max-h-[140px]"
                >
                  {evalResult?.startsWith('Error:') || evalResult?.startsWith('Network') ? (
                    <div className="text-rose-400 mb-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                      <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                      Evaluation Failed
                    </div>
                  ) : (
                    <div className="text-emerald-400 mb-2 flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Agent Response
                    </div>
                  )}
                  {evalResult}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="card p-5 flex flex-col gap-4 h-2/5 justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight mb-3">Export Formats</h3>
              <div className="flex flex-col gap-2">
                <ExportItem label="Plain Text Prompt" onClick={() => handleExport('txt')} />
                <ExportItem label="JSON Structure" onClick={() => handleExport('json')} />
                <ExportItem label="YAML Structure" onClick={() => handleExport('yaml')} />
              </div>
            </div>
            <button
              onClick={() => handleExport('json')}
              className="w-full flex items-center justify-center gap-2 border border-[#E5E7EB] py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              <Download size={14} />
              Export Harness Instance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function ExportItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-2 rounded-md border border-transparent hover:border-[#E5E7EB] hover:bg-slate-50 transition-all group cursor-pointer"
    >
      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">{label}</span>
      <Download size={12} className="text-slate-300 group-hover:text-brand" />
    </div>
  );
}
