import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Plus, Trash2, Check, FileText } from 'lucide-react';
import { Exam, ExamRubric, RubricQuestion } from '../types/grading';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  rubric: ExamRubric;
  exam: Exam;
  onUpdateRubric: (updated: ExamRubric) => void;
  onAiGenerateRubric: () => void;
  isAiGenerating: boolean;
}

export const RubricModal: React.FC<RubricModalProps> = ({
  isOpen,
  onClose,
  rubric,
  exam,
  onUpdateRubric,
  onAiGenerateRubric,
  isAiGenerating
}) => {
  if (!isOpen) return null;

  // Tính tổng điểm thực tế của toàn bộ tiêu chí
  const calculatedTotal = rubric.questions.reduce((sum, q) => {
    const qSum = q.criteria.reduce((cSum, c) => cSum + c.maxScore, 0);
    return sum + (q.criteria.length > 0 ? qSum : q.maxScore);
  }, 0);

  const roundedCalculatedTotal = Math.round(calculatedTotal * 1000) / 1000;
  const isSumValid = Math.abs(roundedCalculatedTotal - exam.totalMaxScore) < 0.001;

  const handleApproveRubric = () => {
    onUpdateRubric({
      ...rubric,
      isApprovedByTeacher: true,
      approvedAt: new Date().toLocaleString('vi-VN'),
      approvedBy: 'Thầy Nguyễn Văn Toàn',
      version: rubric.version + 1
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">HƯỚNG DẪN CHẤM & THANG ĐIỂM (BAREM TIÊU CHÍ)</h2>
              <p className="text-xs text-slate-400">
                Phiên bản {rubric.version} • {rubric.isApprovedByTeacher ? 'Đã được giáo viên phê duyệt' : 'Bản dự thảo (Chờ duyệt)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification banner */}
        <div className={`p-3.5 border-b text-xs flex items-center justify-between ${
          isSumValid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            {isSumValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <div>
              <span className="font-bold">
                Kiểm tra tổng điểm tiêu chí: {roundedCalculatedTotal} / {exam.totalMaxScore} điểm
              </span>
              <p className="text-[11px] mt-0.5">
                {isSumValid
                  ? 'Tổng điểm các tiêu chí khớp hoàn toàn với điểm tối đa của đề thi.'
                  : 'Cảnh báo: Tổng điểm các tiêu chí chưa bằng 10.0đ. Cần điều chỉnh lại trước khi chấm.'}
              </p>
            </div>
          </div>

          <button
            onClick={onAiGenerateRubric}
            disabled={isAiGenerating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isAiGenerating ? 'AI đang lập barem...' : 'AI đề xuất dự thảo barem'}</span>
          </button>
        </div>

        {/* Questions & Criteria List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {rubric.questions.map((q) => (
            <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-xs">
                    {q.questionNumber}
                  </span>
                  <span className="font-semibold text-slate-900 text-xs">{q.title}</span>
                </div>
                <div className="font-bold text-xs text-blue-800">
                  Tối đa: {q.maxScore}đ
                </div>
              </div>

              {/* Standard Solution */}
              {q.standardSolution && (
                <div className="text-[11px] bg-white p-2 rounded border border-slate-200 text-slate-700 font-mono">
                  <span className="font-sans font-bold text-slate-500 block mb-0.5">Lời giải mẫu:</span>
                  {q.standardSolution}
                </div>
              )}

              {/* Criteria */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Các tiêu chí thành phần:
                </span>
                {q.criteria.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 px-1 rounded">
                        {c.code}
                      </span>
                      <span className="text-slate-800">{c.description}</span>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0 ml-2">
                      {c.maxScore}đ
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-600">
            {rubric.isApprovedByTeacher ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="w-4 h-4" /> Đã duyệt bởi {rubric.approvedBy} ({rubric.approvedAt})
              </span>
            ) : (
              <span className="text-amber-700 font-medium">
                Vui lòng kiểm tra và duyệt barem trước khi chấm.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Đóng
            </button>

            {!rubric.isApprovedByTeacher && (
              <button
                onClick={handleApproveRubric}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                Phê duyệt hướng dẫn chấm
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
