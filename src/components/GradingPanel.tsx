import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Clock, 
  Save, 
  RefreshCw, 
  FileDown, 
  Edit, 
  Check, 
  HelpCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { Exam, ExamRubric, QuestionGrade, StudentSubmission } from '../types/grading';
import { applyRounding } from '../utils/mathGradingEngine';

interface GradingPanelProps {
  submission: StudentSubmission;
  rubric: ExamRubric;
  exam: Exam;
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
  onUpdateSubmission: (updated: StudentSubmission) => void;
  onApproveSubmission: () => void;
  onExportPdf: () => void;
  onReGrade: () => void;
}

export const GradingPanel: React.FC<GradingPanelProps> = ({
  submission,
  rubric,
  exam,
  selectedQuestionId,
  onSelectQuestion,
  onUpdateSubmission,
  onApproveSubmission,
  onExportPdf,
  onReGrade
}) => {
  const [activeTab, setActiveTab] = useState<'criteria' | 'feedback' | 'audit'>('criteria');
  const [editingOcrId, setEditingOcrId] = useState<string | null>(null);
  const [ocrEditText, setOcrEditText] = useState<string>('');

  const selectedQuestionGrade = submission.questionGrades.find(
    (q) => q.questionId === selectedQuestionId
  ) || submission.questionGrades[0];

  const selectedRubricQ = rubric.questions.find(
    (q) => q.id === selectedQuestionGrade?.questionId
  );

  const selectedOcrData = submission.ocrData.find(
    (o) => o.questionId === selectedQuestionGrade?.questionId
  );

  // Xử lý bắt đầu sửa bản nhận dạng OCR (Bước 5)
  const handleStartEditOcr = (qId: string, currentText: string) => {
    setEditingOcrId(qId);
    setOcrEditText(currentText);
  };

  const handleSaveOcrEdit = (qId: string) => {
    const updatedOcr = submission.ocrData.map((item) => {
      if (item.questionId === qId) {
        return {
          ...item,
          teacherEditedText: ocrEditText,
          isTeacherVerified: true,
          hasAmbiguity: false // Đã được giáo viên hiệu đính
        };
      }
      return item;
    });

    const updated = {
      ...submission,
      ocrData: updatedOcr,
      // Khi giáo viên sửa OCR, cần đánh dấu để kiểm tra lại điểm
      status: 'needs_review' as const,
      history: [
        ...submission.history,
        {
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          action: `Giáo viên sửa bản nhận dạng OCR câu ${selectedQuestionGrade?.questionNumber}`
        }
      ]
    };

    onUpdateSubmission(updated);
    setEditingOcrId(null);
  };

  // Bật/tắt tiêu chí chấm
  const handleToggleCriterion = (criterionId: string, currentAchieved: boolean) => {
    if (!selectedQuestionGrade) return;

    const newAchieved = !currentAchieved;
    const criterionDef = selectedRubricQ?.criteria.find((c) => c.id === criterionId);
    const maxPoints = criterionDef ? criterionDef.maxScore : 0;
    const newPoints = newAchieved ? maxPoints : 0;

    const updatedAssessments = selectedQuestionGrade.criteriaAssessments.map((a) => {
      if (a.criterionId === criterionId) {
        return {
          ...a,
          achieved: newAchieved,
          pointsAwarded: newPoints,
          rationale: newAchieved ? 'Được giáo viên công nhận đạt tiêu chí' : 'Chưa đạt yêu cầu'
        };
      }
      return a;
    });

    const newScoreAwarded = updatedAssessments.reduce((sum, a) => sum + a.pointsAwarded, 0);

    const updatedQuestionGrades = submission.questionGrades.map((q) => {
      if (q.questionId === selectedQuestionGrade.questionId) {
        return {
          ...q,
          scoreAwarded: newScoreAwarded,
          status: newScoreAwarded === q.maxScore ? ('correct' as const) : newScoreAwarded > 0 ? ('partial' as const) : ('wrong' as const),
          criteriaAssessments: updatedAssessments
        };
      }
      return q;
    });

    // Tính lại tổng điểm
    const rawTotal = updatedQuestionGrades.reduce((sum, q) => sum + q.scoreAwarded, 0);
    const roundedTotal = applyRounding(rawTotal, exam.roundingRule);

    onUpdateSubmission({
      ...submission,
      rawTotalScore: rawTotal,
      roundedTotalScore: roundedTotal,
      questionGrades: updatedQuestionGrades,
      history: [
        ...submission.history,
        {
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          action: `Cập nhật tiêu chí ${criterionId} câu ${selectedQuestionGrade.questionNumber}`,
          previousScore: submission.roundedTotalScore,
          newScore: roundedTotal
        }
      ]
    });
  };

  // Giải quyết vùng nghi vấn chữ viết (Tình huống D)
  const handleResolveAmbiguity = (ambiguityId: string, choice: string) => {
    const updatedOcr = submission.ocrData.map((item) => {
      const updatedAmbs = item.ambiguities.map((a) => {
        if (a.id === ambiguityId) {
          return { ...a, resolved: true, selectedMeaning: choice };
        }
        return a;
      });
      return {
        ...item,
        ambiguities: updatedAmbs,
        hasAmbiguity: updatedAmbs.some((a) => !a.resolved)
      };
    });

    onUpdateSubmission({
      ...submission,
      ocrData: updatedOcr,
      reviewFlags: submission.reviewFlags.filter((f) => !f.includes('ký hiệu chưa rõ ràng'))
    });
  };

  const getStatusBadge = () => {
    switch (submission.status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã duyệt
          </span>
        );
      case 'needs_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Cần kiểm tra
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <Clock className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Đang xử lý
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            Chưa chấm
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      {/* Student & Score Header */}
      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{submission.studentName}</h2>
              {getStatusBadge()}
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
              <span>Mã HS: <strong className="text-slate-700">{submission.studentCode}</strong></span>
              <span>Lớp: <strong className="text-slate-700">{submission.className}</strong></span>
              <span>Mã đề: <strong className="text-slate-700">{submission.examCode}</strong></span>
            </div>
          </div>

          {/* Large Score Indicator */}
          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1">
              <span className="text-3xl font-extrabold text-red-600">
                {submission.roundedTotalScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/ {exam.totalMaxScore} điểm</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Điểm thô: <span className="font-mono">{submission.rawTotalScore.toFixed(3)}</span>
            </div>
          </div>
        </div>

        {/* Cảnh báo nghi vấn nếu có */}
        {submission.reviewFlags.length > 0 && (
          <div className="mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold">Mục cần giáo viên kiểm tra trước khi chốt điểm:</span>
              <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
                {submission.reviewFlags.map((flag, idx) => (
                  <li key={idx}>{flag}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 mt-3 -mb-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('criteria')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'criteria'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chi tiết câu & Barem
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'feedback'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Lời nhận xét của thầy cô
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Lịch sử thẩm định
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'criteria' && (
          <>
            {/* Question Quick Selector Grid */}
            <div>
              <label className="text-xs font-bold text-slate-600 mb-2 block uppercase tracking-wider">
                Chọn câu hỏi kiểm tra:
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                {submission.questionGrades.map((q) => {
                  const isSelected = q.questionId === selectedQuestionGrade?.questionId;
                  const isFull = q.scoreAwarded === q.maxScore;
                  const isPartial = q.scoreAwarded > 0 && q.scoreAwarded < q.maxScore;
                  const isZero = q.scoreAwarded === 0;

                  return (
                    <button
                      key={q.questionId}
                      onClick={() => onSelectQuestion(q.questionId)}
                      className={`p-1.5 rounded text-xs font-medium text-center border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400 font-bold'
                          : 'border-slate-200 bg-white hover:bg-slate-100'
                      }`}
                    >
                      <div className="truncate">{q.questionNumber}</div>
                      <div
                        className={`text-[10px] font-bold ${
                          isFull
                            ? 'text-emerald-700'
                            : isPartial
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {q.scoreAwarded}/{q.maxScore}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Question Details */}
            {selectedQuestionGrade && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 shadow-2xs">
                {/* Header of selected question */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedQuestionGrade.questionNumber}: {selectedRubricQ?.title || ''}
                    </h3>
                    <span className="text-xs text-slate-500">
                      Điểm tối đa:{' '}
                      <strong className="text-slate-800">{selectedQuestionGrade.maxScore}đ</strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Điểm đạt:</span>
                    <span className="text-lg font-bold text-blue-700">
                      {selectedQuestionGrade.scoreAwarded}đ
                    </span>
                  </div>
                </div>

                {/* Side-by-side OCR and Standard Solution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Cột trái: Bài giải nhận dạng của học sinh */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-slate-700 flex items-center gap-1">
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                        Bài làm nhận dạng (OCR):
                      </span>
                      {editingOcrId !== selectedQuestionGrade.questionId ? (
                        <button
                          onClick={() =>
                            handleStartEditOcr(
                              selectedQuestionGrade.questionId,
                              selectedOcrData?.teacherEditedText ||
                                selectedOcrData?.rawRecognizedText ||
                                selectedQuestionGrade.studentTranscription
                            )
                          }
                          className="text-[11px] text-blue-600 hover:underline font-semibold"
                        >
                          Hiệu đính
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveOcrEdit(selectedQuestionGrade.questionId)}
                          className="text-[11px] text-emerald-700 hover:underline font-bold"
                        >
                          Lưu
                        </button>
                      )}
                    </div>

                    {editingOcrId === selectedQuestionGrade.questionId ? (
                      <textarea
                        value={ocrEditText}
                        onChange={(e) => setOcrEditText(e.target.value)}
                        className="w-full h-24 p-2 bg-white border border-blue-400 rounded font-mono text-xs focus:outline-hidden"
                      />
                    ) : (
                      <pre className="font-mono text-slate-800 whitespace-pre-line bg-white p-2 rounded border border-slate-200 overflow-x-auto min-h-[60px]">
                        {selectedOcrData?.teacherEditedText ||
                          selectedOcrData?.rawRecognizedText ||
                          selectedQuestionGrade.studentTranscription ||
                          '(Không phát hiện nội dung)'}
                      </pre>
                    )}

                    {/* Vùng nghi vấn nếu có (Tình huống D) */}
                    {selectedOcrData?.ambiguities?.map((amb) => (
                      <div
                        key={amb.id}
                        className="mt-2 p-2 bg-amber-50 border border-amber-300 rounded text-amber-900"
                      >
                        <div className="font-bold flex items-center gap-1 text-[11px]">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                          Ký hiệu không rõ ràng: {amb.locationText}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[11px]">Chọn ý đúng của HS:</span>
                          {amb.possibleMeanings.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleResolveAmbiguity(amb.id, opt)}
                              className="px-2 py-0.5 rounded bg-white border border-amber-400 text-amber-800 hover:bg-amber-100 font-bold"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cột phải: Lời giải chuẩn của barem */}
                  <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3">
                    <span className="font-bold text-blue-900 block mb-1.5">
                      Đáp án & Lời giải chuẩn:
                    </span>
                    <pre className="font-mono text-blue-950 whitespace-pre-line bg-white p-2 rounded border border-blue-200 overflow-x-auto min-h-[60px]">
                      {selectedRubricQ?.standardSolution || 'Xem tiêu chí chi tiết bên dưới.'}
                    </pre>
                    {selectedRubricQ?.alternateSolutions && (
                      <div className="mt-2 text-[11px] text-blue-800">
                        <strong>Cách giải khác: </strong>
                        {selectedRubricQ.alternateSolutions.join('; ')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tiêu chí chấm theo barem (Rubric Criteria Checklist) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Các tiêu chí đánh giá theo barem:
                  </h4>
                  <div className="space-y-2">
                    {selectedQuestionGrade.criteriaAssessments.map((crit) => (
                      <div
                        key={crit.criterionId}
                        className={`p-2.5 rounded-lg border text-xs transition-all flex items-start justify-between gap-3 ${
                          crit.achieved
                            ? 'bg-emerald-50/60 border-emerald-300'
                            : 'bg-red-50/40 border-red-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={crit.achieved}
                            onChange={() => handleToggleCriterion(crit.criterionId, crit.achieved)}
                            className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">
                              <span className="font-mono text-blue-700 mr-1.5">[{crit.code}]</span>
                              {crit.description}
                            </div>
                            <div
                              className={`text-[11px] mt-0.5 ${
                                crit.achieved ? 'text-emerald-700' : 'text-red-700'
                              }`}
                            >
                              {crit.rationale}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-slate-900">
                            {crit.pointsAwarded} / {crit.maxPoints}đ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bước sai đầu tiên và Nhận xét sư phạm */}
                {selectedQuestionGrade.firstFlawedStep && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs">
                    <span className="font-bold text-red-900 block mb-1">
                      Bước sai đầu tiên phát hiện:
                    </span>
                    <p className="text-red-800 font-semibold mb-2">
                      {selectedQuestionGrade.firstFlawedStep}
                    </p>
                    <span className="font-bold text-slate-900 block mb-1">
                      Nhận xét sư phạm & Căn cứ trừ điểm:
                    </span>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedQuestionGrade.mathReasoning}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Tab 2: Nhận xét của thầy cô */}
        {activeTab === 'feedback' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Phiếu nhận xét sư phạm tổng thể (Ghi vào bài thi & Báo cáo)
            </h3>

            {/* Lời nhận xét trên đầu bài */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Lời nhận xét của thầy cô (Hiển thị ở khung trên đầu trang 1):
              </label>
              <textarea
                value={submission.generalFeedback?.combinedNote || ''}
                onChange={(e) =>
                  onUpdateSubmission({
                    ...submission,
                    generalFeedback: {
                      ...submission.generalFeedback,
                      combinedNote: e.target.value
                    }
                  })
                }
                rows={3}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="Nhập nhận xét tổng hợp..."
              />
            </div>

            {/* Điểm làm tốt */}
            <div>
              <label className="text-xs font-bold text-emerald-800 block mb-1">
                1. Điểm làm tốt (Ưu điểm):
              </label>
              <textarea
                value={submission.generalFeedback?.strengths || ''}
                onChange={(e) =>
                  onUpdateSubmission({
                    ...submission,
                    generalFeedback: {
                      ...submission.generalFeedback,
                      strengths: e.target.value
                    }
                  })
                }
                rows={2}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Lỗi cần sửa */}
            <div>
              <label className="text-xs font-bold text-red-800 block mb-1">
                2. Lỗi cần sửa (Khuyết điểm):
              </label>
              <textarea
                value={submission.generalFeedback?.weaknesses || ''}
                onChange={(e) =>
                  onUpdateSubmission({
                    ...submission,
                    generalFeedback: {
                      ...submission.generalFeedback,
                      weaknesses: e.target.value
                    }
                  })
                }
                rows={2}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-red-500 focus:outline-hidden"
              />
            </div>

            {/* Nội dung nên luyện thêm */}
            <div>
              <label className="text-xs font-bold text-blue-800 block mb-1">
                3. Nội dung nên luyện thêm (Định hướng học tập):
              </label>
              <textarea
                value={submission.generalFeedback?.recommendations || ''}
                onChange={(e) =>
                  onUpdateSubmission({
                    ...submission,
                    generalFeedback: {
                      ...submission.generalFeedback,
                      recommendations: e.target.value
                    }
                  })
                }
                rows={2}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Lịch sử thẩm định */}
        {activeTab === 'audit' && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2">
              Nhật ký kiểm duyệt & Thay đổi điểm
            </h3>
            <div className="space-y-2 text-xs">
              {submission.history.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="font-mono text-slate-400 shrink-0">{h.timestamp}</span>
                  <div className="flex-1">
                    <span className="font-medium text-slate-800">{h.action}</span>
                    {h.previousScore !== undefined && h.newScore !== undefined && (
                      <span className="text-slate-500 block text-[11px]">
                        Điểm: {h.previousScore} -&gt; {h.newScore}đ
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
        <button
          onClick={onReGrade}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 transition-colors"
          title="Chạy lại động cơ AI phân tích toán học dựa trên nội dung OCR hiện tại"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Chấm thử lại</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onExportPdf}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Xuất PDF bài này</span>
          </button>

          <button
            onClick={onApproveSubmission}
            disabled={submission.status === 'approved'}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold shadow-xs transition-colors ${
              submission.status === 'approved'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{submission.status === 'approved' ? 'Đã chốt điểm' : 'Duyệt & Chốt điểm'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
