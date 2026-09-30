import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertTriangle, Clock, Users, BarChart3, ArrowRight } from 'lucide-react';
import { StudentSubmission } from '../types/grading';

interface BatchGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmission[];
  activeSubmissionId: string;
  onSelectStudent: (studentId: string) => void;
  onRunBatchGrading: () => void;
  isBatchGrading: boolean;
}

export const BatchGradingModal: React.FC<BatchGradingModalProps> = ({
  isOpen,
  onClose,
  submissions,
  activeSubmissionId,
  onSelectStudent,
  onRunBatchGrading,
  isBatchGrading
}) => {
  if (!isOpen) return null;

  // Thống kê lớp chỉ tính những bài đã duyệt (Mục 8)
  const approvedList = submissions.filter((s) => s.status === 'approved');
  const needsReviewList = submissions.filter((s) => s.status === 'needs_review');
  const pendingList = submissions.filter((s) => s.status === 'pending_approval');
  const notGradedList = submissions.filter((s) => s.status === 'not_graded');

  const avgScore =
    approvedList.length > 0
      ? (approvedList.reduce((acc, cur) => acc + cur.roundedTotalScore, 0) / approvedList.length).toFixed(2)
      : '---';

  const maxScore = approvedList.length > 0 ? Math.max(...approvedList.map((s) => s.roundedTotalScore)) : '---';
  const minScore = approvedList.length > 0 ? Math.min(...approvedList.map((s) => s.roundedTotalScore)) : '---';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">DANH SÁCH HỌC SINH & CHẤM HÀNG LOẠT (LỚP 6A1)</h2>
              <p className="text-xs text-slate-400">
                Xác nhận ghép trang, chấm tự động và thống kê kết quả học tập
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

        {/* Thống kê chuẩn mục 8 */}
        <div className="bg-blue-50/60 p-4 border-b border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Thống kê lớp học (Chỉ tính các bài ĐÃ DUYỆT):
            </span>
            <span className="text-[11px] text-blue-700 font-medium">
              Chờ xử lý/duyệt: <strong>{pendingList.length + needsReviewList.length} bài</strong> | Chưa chấm:{' '}
              <strong>{notGradedList.length} bài</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-white p-2.5 rounded-lg border border-blue-200">
              <span className="text-[11px] text-slate-500 block">Đã chốt duyệt</span>
              <span className="text-xl font-bold text-emerald-700">
                {approvedList.length} / {submissions.length}
              </span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-blue-200">
              <span className="text-[11px] text-slate-500 block">Điểm trung bình</span>
              <span className="text-xl font-bold text-blue-700">{avgScore}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-blue-200">
              <span className="text-[11px] text-slate-500 block">Điểm cao nhất</span>
              <span className="text-xl font-bold text-emerald-600">{maxScore}</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-blue-200">
              <span className="text-[11px] text-slate-500 block">Cần kiểm tra (Cam)</span>
              <span className="text-xl font-bold text-amber-600">{needsReviewList.length}</span>
            </div>
          </div>
        </div>

        {/* Danh sách học sinh */}
        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-2 px-3">Mã HS</th>
                <th className="py-2 px-3">Họ và tên</th>
                <th className="py-2 px-3">Lớp</th>
                <th className="py-2 px-3">Mã đề</th>
                <th className="py-2 px-3">Ghép trang</th>
                <th className="py-2 px-3">Trạng thái</th>
                <th className="py-2 px-3 text-right">Điểm số</th>
                <th className="py-2 px-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map((sub) => {
                const isActive = sub.id === activeSubmissionId;

                return (
                  <tr
                    key={sub.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isActive ? 'bg-blue-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-slate-600">{sub.studentCode}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{sub.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-600">{sub.className}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">{sub.examCode}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                        2 trang ✓
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      {sub.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> Đã duyệt
                        </span>
                      )}
                      {sub.status === 'needs_review' && (
                        <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <AlertTriangle className="w-3 h-3" /> Cần kiểm tra
                        </span>
                      )}
                      {sub.status === 'pending_approval' && (
                        <span className="inline-flex items-center gap-1 text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                          <Clock className="w-3 h-3" /> Chờ duyệt
                        </span>
                      )}
                      {sub.status === 'not_graded' && (
                        <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                          Chưa chấm
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {sub.status === 'not_graded' ? (
                        <span className="text-slate-400 font-mono">---</span>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">
                          {sub.roundedTotalScore}đ
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          onSelectStudent(sub.id);
                          onClose();
                        }}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline"
                      >
                        Mở bài
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Tổng cộng: <strong>{submissions.length} bài thi</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Đóng
            </button>

            <button
              onClick={onRunBatchGrading}
              disabled={isBatchGrading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isBatchGrading ? 'Đang chấm hàng loạt...' : 'Chấm hàng loạt toàn bộ lớp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
