import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  Layers,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { AnnotationOverlay, QuestionGrade, QuestionOcrData, StudentSubmission } from '../types/grading';
import { renderSamplePage } from '../utils/testPaperRenderer';

interface ExamViewerAnnotatedProps {
  submission: StudentSubmission;
  selectedQuestionId: string | null;
  onSelectQuestion: (questionId: string) => void;
  showAnnotations: boolean;
  onToggleAnnotations: () => void;
  showOcrZones: boolean;
  onToggleOcrZones: () => void;
}

export const ExamViewerAnnotated: React.FC<ExamViewerAnnotatedProps> = ({
  submission,
  selectedQuestionId,
  onSelectQuestion,
  showAnnotations,
  onToggleAnnotations,
  showOcrZones,
  onToggleOcrZones
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [paperImages, setPaperImages] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Khởi tạo ảnh bài thi (Ảnh thực tế đã tải lên hoặc ảnh mẫu CAO_TAI)
  useEffect(() => {
    if (
      submission.pages &&
      submission.pages.length > 0 &&
      submission.pages.some((p) => p.imageUrl && p.imageUrl.startsWith('data:image'))
    ) {
      setPaperImages(submission.pages.map((p) => p.imageUrl));
    } else {
      const p1 = renderSamplePage(1);
      const p2 = renderSamplePage(2);
      setPaperImages([p1, p2]);
    }
    setCurrentPageIndex(0);
  }, [submission.id, submission.pages]);

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(2.5, Math.max(0.6, prev + delta)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
    setRotation(0);
  };

  // Lọc chú thích thuộc trang hiện tại
  const currentAnnotations = (submission.questionGrades || []).flatMap((q) =>
    (q.annotations || []).filter((a) => a.pageIndex === currentPageIndex).map(ann => ({
      ...ann,
      questionId: q.questionId
    }))
  );

  // Lọc vùng OCR thuộc trang hiện tại
  const currentOcrZones = (submission.ocrData || []).filter(
    (item) => item.pageIndex === currentPageIndex
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-200 select-none">
      {/* Top Toolbar */}
      <div className="bg-slate-800 text-white px-4 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 text-xs">
        {/* Page Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-700 px-2 py-1 rounded-md">
          <button
            onClick={() => setCurrentPageIndex(0)}
            disabled={currentPageIndex === 0}
            className="p-0.5 hover:bg-slate-600 rounded disabled:opacity-30 cursor-pointer"
            title="Trang trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-200">
            Trang {currentPageIndex + 1} / {paperImages.length || 2}
          </span>
          <button
            onClick={() => setCurrentPageIndex(1)}
            disabled={currentPageIndex === 1}
            className="p-0.5 hover:bg-slate-600 rounded disabled:opacity-30 cursor-pointer"
            title="Trang sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAnnotations}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              showAnnotations ? 'bg-blue-600 text-white font-medium' : 'bg-slate-700 text-slate-300'
            }`}
            title="Bật/Tắt hiển thị điểm xanh và lỗi đỏ trên bài thi"
          >
            {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Lớp chú thích</span>
          </button>

          <button
            onClick={onToggleOcrZones}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
              showOcrZones ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-700 text-slate-300'
            }`}
            title="Bật/Tắt viền vùng câu nhận dạng OCR"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vùng OCR</span>
          </button>
        </div>

        {/* Zoom & Rotation controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-300 text-center w-11">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white ml-1"
            title="Xoay ảnh 90°"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
            title="Mặc định kích thước"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas / Image Paper Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-4 relative"
      >
        <div
          className="relative transition-transform duration-150 shadow-2xl rounded-sm bg-white"
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transformOrigin: 'center center',
            width: '800px',
            height: '1133px'
          }}
        >
          {/* Ảnh bài nộp của học sinh */}
          {paperImages[currentPageIndex] && (
            <img
              src={paperImages[currentPageIndex]}
              alt={`Bài thi trang ${currentPageIndex + 1}`}
              className="w-full h-full object-contain pointer-events-none"
            />
          )}

          {/* Lớp phủ chú thích (Annotations Overlay) */}
          {showAnnotations && (
            <div className="absolute inset-0 pointer-events-auto">
              {/* Trang 1: Điểm số to ở ô ĐIỂM SỐ */}
              {currentPageIndex === 0 && (
                <div
                  className="absolute cursor-pointer transition-transform hover:scale-105"
                  style={{
                    left: '5.5%',
                    top: '12.8%',
                    width: '15%',
                    height: '5%'
                  }}
                  title="Tổng điểm bài thi đã được làm tròn"
                >
                  <span className="font-bold text-3xl sm:text-4xl text-red-600 drop-shadow-xs">
                    {submission.roundedTotalScore}
                  </span>
                </div>
              )}

              {/* Trang 1: Lời nhận xét của thầy cô ở ô trên đầu */}
              {currentPageIndex === 0 && (
                <div
                  className="absolute text-blue-900 font-sans text-[11px] leading-tight px-1 font-medium pointer-events-none"
                  style={{
                    left: '22%',
                    top: '13.2%',
                    width: '74%',
                    height: '4.8%'
                  }}
                >
                  <p className="line-clamp-2">
                    {submission.generalFeedback?.combinedNote ||
                      'Cần xem lại quy tắc tìm thành phần chưa biết khi có ngoặc lồng nhau ở câu 2b. Chú ý cách giải phương trình dạng lũy thừa ở câu 2c: đưa về cùng cơ số chứ không lấy lũy thừa chia cho cơ số.'}
                  </p>
                </div>
              )}

              {/* Các thẻ điểm từng ý (Màu xanh) và Lỗi sai (Màu đỏ) */}
              {currentAnnotations.map((ann) => {
                const isSelected = selectedQuestionId === ann.questionId;
                const isError = ann.severity === 'danger' || ann.type === 'error_callout';
                const isScoreBadge = ann.type === 'score_badge';

                return (
                  <div
                    key={ann.id}
                    onClick={() => ann.questionId && onSelectQuestion(ann.questionId)}
                    className={`absolute z-10 cursor-pointer transition-all duration-200 ${
                      isSelected ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 shadow-md' : 'hover:scale-105'
                    }`}
                    style={{
                      left: `${ann.box.x}%`,
                      top: `${ann.box.y}%`,
                      minWidth: `${ann.box.width}%`
                    }}
                    title={`Bấm để xem và sửa tiêu chí của câu này`}
                  >
                    {isScoreBadge ? (
                      // Tag điểm xanh cạnh bài làm (vd: +0.625đ, +1.25đ)
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-600 font-bold text-[11px] px-1.5 py-0.5 rounded shadow-xs flex items-center justify-center whitespace-nowrap">
                        {ann.text}
                      </div>
                    ) : isError ? (
                      // Khung lỗi đỏ kèm giải thích ngắn gọn
                      <div className="bg-red-50 text-red-700 border border-red-500 font-semibold text-[10px] leading-tight p-1.5 rounded shadow-sm max-w-[210px]">
                        <div className="whitespace-pre-line font-sans">{ann.text}</div>
                      </div>
                    ) : (
                      // Cảnh báo vàng / nghi vấn
                      <div className="bg-amber-50 text-amber-900 border border-amber-500 font-semibold text-[10px] p-1.5 rounded shadow-sm">
                        {ann.text}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Lớp hiển thị vùng nhận dạng OCR */}
          {showOcrZones && (
            <div className="absolute inset-0 pointer-events-none">
              {currentOcrZones.map((ocr) => {
                const isSelected = selectedQuestionId === ocr.questionId;
                return (
                  <div
                    key={ocr.questionId}
                    className={`absolute border-2 rounded-xs transition-all pointer-events-auto cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-500/10'
                        : ocr.hasAmbiguity
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-indigo-400/40 hover:border-indigo-600 hover:bg-indigo-500/10'
                    }`}
                    style={{
                      left: `${ocr.detectedZone.x}%`,
                      top: `${ocr.detectedZone.y}%`,
                      width: `${ocr.detectedZone.width}%`,
                      height: `${ocr.detectedZone.height}%`
                    }}
                    onClick={() => onSelectQuestion(ocr.questionId)}
                    title={`Vùng bài làm: ${ocr.questionNumber}`}
                  >
                    <span className="absolute -top-4 left-1 text-[9px] font-bold px-1 rounded bg-slate-800 text-white">
                      {ocr.questionNumber}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Helper Bar */}
      <div className="bg-slate-800 text-slate-400 px-4 py-1.5 text-[11px] flex items-center justify-between border-t border-slate-700">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Điểm đạt (Xanh)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
            Lỗi sai & Giải thích (Đỏ)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
            Cần kiểm tra (Cam)
          </span>
        </div>
        <div>
          <span>Bấm vào chú thích hoặc câu hỏi để sửa</span>
        </div>
      </div>
    </div>
  );
};
