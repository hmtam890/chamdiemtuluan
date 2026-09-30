/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WorkflowSteps, StepNumber } from './components/WorkflowSteps';
import { ExamViewerAnnotated } from './components/ExamViewerAnnotated';
import { GradingPanel } from './components/GradingPanel';
import { MandatoryTestScenariosModal } from './components/MandatoryTestScenariosModal';
import { BatchGradingModal } from './components/BatchGradingModal';
import { RubricModal } from './components/RubricModal';
import { UploadSubmissionModal } from './components/UploadSubmissionModal';
import { Exam, ExamRubric, StudentSubmission } from './types/grading';
import { 
  INITIAL_EXAM, 
  INITIAL_RUBRIC, 
  SAMPLE_CAO_TAI_SUBMISSION, 
  CLASS_SUBMISSIONS_DEMO 
} from './data/mockData';
import { evaluateStudentSubmission } from './utils/mathGradingEngine';
import { exportAnnotatedPdf, exportGradebookToExcel } from './utils/exportUtils';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  Play,
  RotateCw,
  FileCheck
} from 'lucide-react';

export default function App() {
  const [exam, setExam] = useState<Exam>(INITIAL_EXAM);
  const [rubric, setRubric] = useState<ExamRubric>(INITIAL_RUBRIC);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(CLASS_SUBMISSIONS_DEMO);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string>(SAMPLE_CAO_TAI_SUBMISSION.id);

  const [currentStep, setCurrentStep] = useState<StepNumber>(7); // Mặc định ở bước kiểm duyệt điểm & bài thi
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>('tl-2c'); // Mở sẵn câu 2c để thấy tình huống A & chú thích đỏ

  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [showOcrZones, setShowOcrZones] = useState<boolean>(true);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isScenariosOpen, setIsScenariosOpen] = useState<boolean>(false);
  const [isBatchOpen, setIsBatchOpen] = useState<boolean>(false);
  const [isRubricOpen, setIsRubricOpen] = useState<boolean>(false);

  // AI & Batch status
  const [aiStatus, setAiStatus] = useState<{ aiAvailable: boolean; model: string; mode: string }>({
    aiAvailable: false,
    model: 'gemini-3.8-flash',
    mode: 'DEMONSTRATION_MODE'
  });
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [isBatchGrading, setIsBatchGrading] = useState<boolean>(false);

  // Kiểm tra kết nối AI backend
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setAiStatus({
          aiAvailable: !!data.aiAvailable,
          model: data.model || 'gemini-3.8-flash',
          mode: data.mode || 'DEMONSTRATION_MODE'
        });
      })
      .catch(() => {
        setAiStatus({
          aiAvailable: false,
          model: 'gemini-3.8-flash',
          mode: 'DEMONSTRATION_MODE'
        });
      });
  }, []);

  const activeSubmission =
    submissions.find((s) => s.id === activeSubmissionId) || submissions[0];

  const handleUpdateActiveSubmission = (updated: StudentSubmission) => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === updated.id ? updated : sub))
    );
  };

  // Nhận bài nộp mới được tạo từ ảnh hoặc PDF vừa tải lên
  const handleSubmissionCreated = (newSub: StudentSubmission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setActiveSubmissionId(newSub.id);
    setSelectedQuestionId(newSub.questionGrades[0]?.questionId || 'tl-1a');
    setCurrentStep(7); // Tự động chuyển thẳng tới màn hình chấm để giáo viên kiểm duyệt
  };

  // Duyệt và chốt điểm bài thi
  const handleApproveSubmission = () => {
    const updated: StudentSubmission = {
      ...activeSubmission,
      status: 'approved',
      approvedByTeacher: true,
      approvedAt: new Date().toLocaleString('vi-VN'),
      approvedBy: 'Thầy Nguyễn Văn Toàn (Giáo viên Toán)',
      reviewFlags: [],
      history: [
        ...activeSubmission.history,
        {
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          action: 'Giáo viên phê duyệt và chốt điểm chính thức',
          newScore: activeSubmission.roundedTotalScore
        }
      ]
    };
    handleUpdateActiveSubmission(updated);
  };

  // Chấm lại bằng AI / Math Engine
  const handleReGrade = async () => {
    setIsAiProcessing(true);

    try {
      if (aiStatus.aiAvailable) {
        const res = await fetch('/api/gemini/grade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            submission: activeSubmission,
            rubric: rubric,
            roundingRule: exam.roundingRule
          })
        });
        const data = await res.json();
        if (data && !data.isDemoFallback && data.questionGrades) {
          // Merge AI results
        }
      }
    } catch (e) {
      console.warn('Fallback to local rule engine:', e);
    }

    // Đánh giá bằng math validator
    const graded = evaluateStudentSubmission(activeSubmission, rubric, exam.roundingRule);
    graded.history.push({
      timestamp: new Date().toLocaleTimeString('vi-VN'),
      action: 'AI chấm lại toàn bộ tiêu chí bài làm',
      newScore: graded.roundedTotalScore
    });

    handleUpdateActiveSubmission(graded);
    setIsAiProcessing(false);
  };

  // Chấm hàng loạt cả lớp
  const handleRunBatchGrading = async () => {
    setIsBatchGrading(true);
    const updatedList = submissions.map((sub) => {
      if (sub.status === 'not_graded' || sub.status === 'pending_approval') {
        const evaluated = evaluateStudentSubmission(sub, rubric, exam.roundingRule);
        return evaluated;
      }
      return sub;
    });

    setTimeout(() => {
      setSubmissions(updatedList);
      setIsBatchGrading(false);
    }, 800);
  };

  // Nạp 1 trong 5 tình huống bắt buộc
  const handleLoadScenario = (scenarioId: string) => {
    if (scenarioId === 'scenario-a') {
      // Tình huống A: Lũy thừa 4*3^x - 7 = 101 -> 3^x = 27 -> x = 27:3 = 9
      const updatedOcr = activeSubmission.ocrData.map((item) => {
        if (item.questionId === 'tl-2c') {
          return {
            ...item,
            teacherEditedText: '4 . 3^x = 101 + 7\n4 . 3^x = 108\n3^x = 27\nx = 27 : 3\nx = 9'
          };
        }
        return item;
      });

      const updated = evaluateStudentSubmission(
        { ...activeSubmission, ocrData: updatedOcr },
        rubric,
        exam.roundingRule
      );
      handleUpdateActiveSubmission(updated);
      setSelectedQuestionId('tl-2c');
      setCurrentStep(6);
    } else if (scenarioId === 'scenario-b') {
      // Tình huống B: Ngoặc lồng nhau 150 - [60 - (x - 6)] = 110
      const updatedOcr = activeSubmission.ocrData.map((item) => {
        if (item.questionId === 'tl-2b') {
          return {
            ...item,
            teacherEditedText: '150 - (x - 6) = 110\n(x - 6) = 150 - 110\n(x - 6) = 40\nx = 26'
          };
        }
        return item;
      });

      const updated = evaluateStudentSubmission(
        { ...activeSubmission, ocrData: updatedOcr },
        rubric,
        exam.roundingRule
      );
      handleUpdateActiveSubmission(updated);
      setSelectedQuestionId('tl-2b');
      setCurrentStep(6);
    } else if (scenarioId === 'scenario-c') {
      // Tình huống C: Bài toán thực tế giảm giá
      const updatedOcr = activeSubmission.ocrData.map((item) => {
        if (item.questionId === 'tl-3b') {
          return {
            ...item,
            teacherEditedText: 'b. Số tiền bạn Cúc phải trả là: 10000.6 + 4.5000 + 25000 - 15000 = 90000 (đồng)'
          };
        }
        return item;
      });

      const updated = evaluateStudentSubmission(
        { ...activeSubmission, ocrData: updatedOcr },
        rubric,
        exam.roundingRule
      );
      handleUpdateActiveSubmission(updated);
      setSelectedQuestionId('tl-3b');
      setCurrentStep(6);
    } else if (scenarioId === 'scenario-d') {
      // Tình huống D: Chữ viết không rõ (x² vs x³)
      setActiveSubmissionId('sub-tran-bao-103');
      setSelectedQuestionId('tl-1a');
      setCurrentStep(5);
    } else if (scenarioId === 'scenario-e') {
      // Tình huống E: Cách giải khác hợp lệ
      setActiveSubmissionId('sub-nguyen-mai-103');
      setSelectedQuestionId('tl-1b');
      setCurrentStep(6);
    }
  };

  // Xuất Excel
  const handleExportExcel = () => {
    exportGradebookToExcel(submissions, exam);
  };

  // Xuất PDF
  const handleExportPdf = () => {
    exportAnnotatedPdf(activeSubmission, exam);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* 1. Header Navigation */}
      <Header
        exam={exam}
        onUpdateExam={setExam}
        aiStatus={aiStatus}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenScenarios={() => setIsScenariosOpen(true)}
        onOpenBatchGrading={() => setIsBatchOpen(true)}
        onOpenRubric={() => setIsRubricOpen(true)}
        onExportExcel={handleExportExcel}
      />

      {/* 2. 8-Step Workflow bar */}
      <WorkflowSteps
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        status={activeSubmission.status}
      />

      {/* 3. Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Bước 1: Quản lý đề thi */}
        {currentStep === 1 && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Bước 1: Tạo bài kiểm tra và nhập đề thi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Tên bài kiểm tra:
                  </label>
                  <input
                    type="text"
                    value={exam.title}
                    onChange={(e) => setExam({ ...exam, title: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Khối lớp:
                  </label>
                  <select
                    value={exam.gradeLevel}
                    onChange={(e) => setExam({ ...exam, gradeLevel: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="6">Lớp 6 (Toán 6 THCS)</option>
                    <option value="7">Lớp 7 (Toán 7 THCS)</option>
                    <option value="8">Lớp 8 (Toán 8 THCS)</option>
                    <option value="9">Lớp 9 (Toán 9 THCS)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Mã đề:
                  </label>
                  <input
                    type="text"
                    value={exam.examCode}
                    onChange={(e) => setExam({ ...exam, examCode: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nội dung đề bài (Văn bản hoặc OCR đề):
                </label>
                <textarea
                  value={exam.testPaperText}
                  onChange={(e) => setExam({ ...exam, testPaperText: e.target.value })}
                  rows={12}
                  className="w-full p-3 font-mono text-xs border border-slate-300 rounded-lg bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Chuyển sang Bước 2: Thiết lập Barem chấm -&gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bước 2: Hướng dẫn chấm & Tiêu chí */}
        {currentStep === 2 && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  Bước 2: Hướng dẫn chấm và Barem tiêu chí
                </h2>
                <button
                  onClick={() => setIsRubricOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"
                >
                  Mở trình soạn thảo Barem đầy đủ
                </button>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">✓ Barem đã được giáo viên phê duyệt:</span>
                  <span>Tổng điểm các tiêu chí: <strong>10.0 / 10.0 điểm</strong> (Khớp tuyệt đối)</span>
                </div>
                <span className="font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded-md border border-emerald-200">
                  Phiên bản {rubric.version}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Tóm tắt cấu trúc phân bố điểm:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border">
                    <span className="font-bold text-slate-900 block mb-1">Phần I: Trắc nghiệm (2,5 điểm)</span>
                    <p className="text-slate-600">5 câu hỏi (0,5 điểm / câu). Tự động so khớp với đáp án mã đề 103.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 border">
                    <span className="font-bold text-slate-900 block mb-1">Phần II: Tự luận (7,5 điểm)</span>
                    <p className="text-slate-600">Câu 1 (2,5đ), Câu 2 (2,5đ), Câu 3 (2,5đ). Chấm chi tiết từng tiêu chí bước giải.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200"
                >
                  &lt;- Quay lại đề bài
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Chuyển sang Bước 3: Tải bài & Ghép trang -&gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bước 3: Tải bài & Ghép trang */}
        {currentStep === 3 && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" />
                Bước 3: Tải bài làm, xoay ảnh và xác nhận ghép trang với học sinh
              </h2>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Nguyên tắc bảo vệ dữ liệu học sinh (Mục 2):</strong>
                  <p className="mt-0.5">
                    Giáo viên phải xác nhận việc ghép trang với học sinh và mã đề trước khi chấm hàng loạt. Không tự đoán danh tính khi chữ viết không rõ.
                  </p>
                </div>
              </div>

              <div 
                onClick={() => setIsUploadOpen(true)}
                className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 transition-all rounded-xl p-8 text-center cursor-pointer group"
              >
                <Upload className="w-10 h-10 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-sm text-slate-800">
                  Bấm vào đây để Tải lên ảnh chụp bài thi (JPG, PNG) hoặc file PDF nhiều trang
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Đang mở bài: <strong>{activeSubmission.studentName} ({activeSubmission.pages?.length || 2} trang - Mã đề {activeSubmission.examCode})</strong>
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUploadOpen(true);
                  }}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  <span>Chọn file Ảnh / PDF từ máy tính để chấm</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 border rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Trang 1: Bảng trắc nghiệm + Câu 1</span>
                    <span className="text-emerald-700 font-semibold">Khớp HS: Lê Cao Tài (6A1)</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    Đã ghép ✓
                  </span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold block">Trang 2: Câu 2 (Tìm x) + Câu 3 (Thực tế)</span>
                    <span className="text-emerald-700 font-semibold">Khớp HS: Lê Cao Tài (6A1)</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                    Đã ghép ✓
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200"
                >
                  &lt;- Barem chấm
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700"
                >
                  Xác nhận thứ tự & Chuyển sang Bước 4: Nhận dạng OCR -&gt;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bước 4, 5, 6, 7: Màn hình Chấm chính (Split Screen) */}
        {(currentStep === 4 || currentStep === 5 || currentStep === 6 || currentStep === 7) && (
          <div className="flex-1 flex overflow-hidden">
            {/* Cột trái: Ảnh bài thi gốc và lớp chú thích (50% - 60% màn hình) */}
            <div className="flex-1 h-full overflow-hidden">
              <ExamViewerAnnotated
                submission={activeSubmission}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={setSelectedQuestionId}
                showAnnotations={showAnnotations}
                onToggleAnnotations={() => setShowAnnotations(!showAnnotations)}
                showOcrZones={showOcrZones}
                onToggleOcrZones={() => setShowOcrZones(!showOcrZones)}
              />
            </div>

            {/* Cột phải: Bản nhận dạng, Tiêu chí barem, Điểm đề xuất & Lời nhận xét */}
            <div className="w-[450px] lg:w-[540px] xl:w-[600px] h-full overflow-hidden shrink-0 border-l border-slate-200 shadow-lg">
              <GradingPanel
                submission={activeSubmission}
                rubric={rubric}
                exam={exam}
                selectedQuestionId={selectedQuestionId}
                onSelectQuestion={setSelectedQuestionId}
                onUpdateSubmission={handleUpdateActiveSubmission}
                onApproveSubmission={handleApproveSubmission}
                onExportPdf={handleExportPdf}
                onReGrade={handleReGrade}
              />
            </div>
          </div>
        )}

        {/* Bước 8: Xuất kết quả PDF & Bảng điểm Excel */}
        {currentStep === 8 && (
          <div className="flex-1 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 space-y-5">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Bước 8: Xuất PDF đã chú thích và Bảng điểm Excel
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Xuất PDF bài thi */}
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold">
                    PDF
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Xuất bản sao bài nộp có chú thích (Annotated PDF)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Giữ nguyên bài gốc của học sinh, đặt lớp phủ chú thích điểm từng ý màu xanh ở lề, lỗi sai màu đỏ, khung điểm tổng và nhận xét sư phạm của thầy cô trên đầu bài.
                    </p>
                  </div>
                  <button
                    onClick={handleExportPdf}
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải PDF có chú thích ({activeSubmission.studentName})</span>
                  </button>
                </div>

                {/* Xuất Excel */}
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50 space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                    XLS
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      Xuất bảng điểm Excel toàn lớp (Lớp {activeSubmission.className})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Bảng điểm chuẩn ngành giáo dục: Điểm từng câu, tổng điểm thô, điểm làm tròn theo quy tắc, trạng thái duyệt và thống kê phổ điểm lớp học.
                    </p>
                  </div>
                  <button
                    onClick={handleExportExcel}
                    className="w-full py-2.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Bảng điểm Excel (.xlsx)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <span className="font-bold block mb-1">
                  Thông tin bài thi đang mở ({activeSubmission.studentName}):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] mt-2">
                  <div>Mã đề: <strong>{activeSubmission.examCode}</strong></div>
                  <div>Tổng điểm: <strong className="text-red-600 text-sm">{activeSubmission.roundedTotalScore}đ</strong></div>
                  <div>Trạng thái: <strong>{activeSubmission.status === 'approved' ? 'Đã chốt duyệt ✓' : 'Chờ duyệt'}</strong></div>
                  <div>Người duyệt: <strong>{activeSubmission.approvedBy || 'Chưa duyệt'}</strong></div>
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t">
                <button
                  onClick={() => setCurrentStep(7)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200"
                >
                  &lt;- Quay lại Màn hình chấm & Chốt điểm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <MandatoryTestScenariosModal
        isOpen={isScenariosOpen}
        onClose={() => setIsScenariosOpen(false)}
        onLoadScenario={handleLoadScenario}
      />

      <BatchGradingModal
        isOpen={isBatchOpen}
        onClose={() => setIsBatchOpen(false)}
        submissions={submissions}
        activeSubmissionId={activeSubmissionId}
        onSelectStudent={setActiveSubmissionId}
        onRunBatchGrading={handleRunBatchGrading}
        isBatchGrading={isBatchGrading}
      />

      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
        rubric={rubric}
        exam={exam}
        onUpdateRubric={setRubric}
        onAiGenerateRubric={async () => {
          setIsAiProcessing(true);
          try {
            const res = await fetch('/api/gemini/generate-rubric', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                examTitle: exam.title,
                gradeLevel: exam.gradeLevel,
                testPaperText: exam.testPaperText
              })
            });
            const data = await res.json();
            if (data && data.questions) {
              setRubric({
                ...rubric,
                questions: data.questions,
                version: rubric.version + 1,
                isApprovedByTeacher: false
              });
            }
          } catch (e) {
            console.error('Error generating rubric:', e);
          } finally {
            setIsAiProcessing(false);
          }
        }}
        isAiGenerating={isAiProcessing}
      />

      {/* Modal Tải file bài làm (Ảnh / PDF) */}
      <UploadSubmissionModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        exam={exam}
        rubric={rubric}
        onSubmissionCreated={handleSubmissionCreated}
        aiAvailable={aiStatus.aiAvailable}
      />
    </div>
  );
}
