import React from 'react';
import { Sparkles, FileText, CheckCircle2, AlertTriangle, Download, RefreshCw, Layers, Upload } from 'lucide-react';
import { Exam, RoundingRule } from '../types/grading';

interface HeaderProps {
  exam: Exam;
  onUpdateExam: (exam: Exam) => void;
  aiStatus: { aiAvailable: boolean; model: string; mode: string };
  onOpenUpload: () => void;
  onOpenScenarios: () => void;
  onOpenBatchGrading: () => void;
  onOpenRubric: () => void;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  exam,
  onUpdateExam,
  aiStatus,
  onOpenUpload,
  onOpenScenarios,
  onOpenBatchGrading,
  onOpenRubric,
  onExportExcel
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <span className="font-bold text-lg">∑</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-slate-900 text-lg leading-tight tracking-tight">
                TRỢ LÝ CHẤM TOÁN THCS
              </h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Lớp {exam.gradeLevel}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Chấm tự luận theo tiêu chí • Nhận dạng chữ viết • Xuất chú thích trực quan
            </p>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
          {/* AI Mode Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              aiStatus.aiAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
            title={aiStatus.aiAvailable ? 'Đã kết nối Gemini 3.8 Flash' : 'Đang chạy Chế độ Minh Họa (Chưa có GEMINI_API_KEY)'}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{aiStatus.aiAvailable ? 'Gemini 3.8 Flash' : 'Chế độ Minh Họa'}</span>
          </div>

          {/* Quy tắc làm tròn */}
          <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg text-xs font-medium text-slate-700">
            <span className="text-slate-500">Làm tròn:</span>
            <select
              value={exam.roundingRule}
              onChange={(e) => onUpdateExam({ ...exam, roundingRule: e.target.value as RoundingRule })}
              className="bg-transparent font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="none">Giữ nguyên</option>
              <option value="0.1">0.1 điểm</option>
              <option value="0.25">0.25 điểm</option>
              <option value="0.5">0.5 điểm</option>
            </select>
          </div>

          {/* Primary Action: Tải file Ảnh hoặc PDF */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
            title="Tải lên ảnh chụp bài làm (JPG, PNG) hoặc file PDF để chấm điểm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải bài làm (Ảnh / PDF)</span>
          </button>

          {/* Quick Buttons */}
          <button
            onClick={onOpenScenarios}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>5 Tình huống bắt buộc</span>
          </button>

          <button
            onClick={onOpenBatchGrading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Layers className="w-3.5 h-3.5 text-slate-600" />
            <span>Danh sách lớp (6A1)</span>
          </button>

          <button
            onClick={onOpenRubric}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <FileText className="w-3.5 h-3.5 text-slate-600" />
            <span>Hướng dẫn chấm</span>
          </button>

          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>
    </header>
  );
};
