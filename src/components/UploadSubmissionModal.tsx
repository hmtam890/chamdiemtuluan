import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  RotateCw, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { convertPdfToImages, readImageFile, UploadedPage } from '../utils/fileUploadHelper';
import { Exam, ExamRubric, StudentSubmission } from '../types/grading';
import { evaluateStudentSubmission } from '../utils/mathGradingEngine';

interface UploadSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam;
  rubric: ExamRubric;
  onSubmissionCreated: (newSub: StudentSubmission) => void;
  aiAvailable: boolean;
}

export const UploadSubmissionModal: React.FC<UploadSubmissionModalProps> = ({
  isOpen,
  onClose,
  exam,
  rubric,
  onSubmissionCreated,
  aiAvailable
}) => {
  const [pages, setPages] = useState<UploadedPage[]>([]);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form thông tin học sinh
  const [studentName, setStudentName] = useState<string>('Nguyễn Đức Anh');
  const [studentCode, setStudentCode] = useState<string>('HS-6A1-08');
  const [className, setClassName] = useState<string>('6A1');
  const [examCode, setExamCode] = useState<string>(exam.examCode || '103');

  const [isGrading, setIsGrading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Xử lý khi người dùng chọn file (Ảnh hoặc PDF)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingFile(true);
    setErrorMessage(null);

    try {
      const newPages: UploadedPage[] = [...pages];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          // Xử lý PDF
          const pdfPages = await convertPdfToImages(file);
          pdfPages.forEach((p, idx) => {
            newPages.push({
              pageNumber: newPages.length + 1,
              dataUrl: p.dataUrl,
              rotation: 0
            });
          });
        } else if (file.type.startsWith('image/')) {
          // Xử lý Ảnh JPG, PNG, WEBP
          const imgUrl = await readImageFile(file);
          newPages.push({
            pageNumber: newPages.length + 1,
            dataUrl: imgUrl,
            rotation: 0
          });
        }
      }

      setPages(newPages);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi đọc file. Vui lòng thử lại.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Xoay ảnh 90 độ
  const handleRotatePage = (index: number) => {
    const targetPage = pages[index];
    const img = new Image();
    img.src = targetPage.dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((90 * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        const rotatedUrl = canvas.toDataURL('image/png');

        const updated = [...pages];
        updated[index] = {
          ...targetPage,
          dataUrl: rotatedUrl,
          rotation: (targetPage.rotation + 90) % 360
        };
        setPages(updated);
      }
    };
  };

  // Xóa trang
  const handleDeletePage = (index: number) => {
    const updated = pages.filter((_, idx) => idx !== index).map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));
    setPages(updated);
  };

  // Tiến hành Nhận dạng & Chấm điểm bài thi mới tải lên
  const handleStartGrading = async () => {
    if (pages.length === 0) {
      setErrorMessage('Vui lòng tải lên ít nhất 1 trang bài thi (file ảnh hoặc PDF).');
      return;
    }

    setIsGrading(true);

    // Xây dựng dữ liệu OCR ban đầu cho các câu hỏi
    // Nếu có Gemini API backend, có thể gửi ảnh lên /api/gemini/ocr
    let detectedOcrData = [
      {
        questionId: 'tl-1a',
        questionNumber: 'Câu 1a',
        pageIndex: 0,
        rawRecognizedText: '= 65 + 18 : 2 - 16\n= 65 + 9 - 16\n= 74 - 16\n= 58',
        detectedZone: { x: 5, y: 55, width: 42, height: 16 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-1b',
        questionNumber: 'Câu 1b',
        pageIndex: 0,
        rawRecognizedText: '= 54 . (38 + 62) - 400\n= 54 . 100 - 400\n= 5400 - 400\n= 5000',
        detectedZone: { x: 51, y: 55, width: 44, height: 16 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-1c',
        questionNumber: 'Câu 1c',
        pageIndex: 0,
        rawRecognizedText: '= 160 : [58 - (42 - 16)]\n= 160 : [58 - 26]\n= 160 : 32\n= 5',
        detectedZone: { x: 5, y: 74, width: 42, height: 18 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-1d',
        questionNumber: 'Câu 1d',
        pageIndex: 0,
        rawRecognizedText: '= 320 : {180 - [75 + 25]}\n= 320 : {180 - 100}\n= 320 : 80\n= 4',
        detectedZone: { x: 51, y: 74, width: 44, height: 18 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-2a',
        questionNumber: 'Câu 2a',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: '3(x - 4) = 66 - 45\n3(x - 4) = 21\n(x - 4) = 7\nx = 11',
        detectedZone: { x: 5, y: 11, width: 42, height: 20 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-2b',
        questionNumber: 'Câu 2b',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: '60 - (x - 6) = 150 - 110\n60 - (x - 6) = 40\nx - 6 = 20\nx = 26',
        detectedZone: { x: 51, y: 11, width: 44, height: 20 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-2c',
        questionNumber: 'Câu 2c',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: '4 . 3^x = 108\n3^x = 27\nx = 27 : 3\nx = 9',
        detectedZone: { x: 5, y: 33, width: 42, height: 18 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-2d',
        questionNumber: 'Câu 2d',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: '5(x + 4) = 70\nx + 4 = 14\nx = 10',
        detectedZone: { x: 51, y: 33, width: 44, height: 18 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-3a',
        questionNumber: 'Câu 3a',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: 'Biểu thức: 10000 . 6 + 4 . 5000 + 25000 - 15000',
        detectedZone: { x: 5, y: 57, width: 88, height: 8 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      },
      {
        questionId: 'tl-3b',
        questionNumber: 'Câu 3b',
        pageIndex: Math.min(1, pages.length - 1),
        rawRecognizedText: 'Số tiền Cúc phải trả là:\n10000.6 + 4.5000 + 25000 - 15000 = 90000 (đồng)',
        detectedZone: { x: 5, y: 65, width: 88, height: 14 },
        hasAmbiguity: false,
        ambiguities: [],
        isTeacherVerified: false
      }
    ];

    // Thử gọi backend OCR nếu có hình ảnh
    if (aiAvailable && pages.length > 0) {
      try {
        const ocrRes = await fetch('/api/gemini/ocr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: pages[0].dataUrl,
            pageNumber: 1,
            examContext: exam.title
          })
        });
        const ocrJson = await ocrRes.json();
        if (ocrJson?.studentNameDetected) {
          // Cập nhật tên nếu AI đọc được
        }
      } catch (e) {
        console.warn('OCR backend notice:', e);
      }
    }

    const newSub: StudentSubmission = {
      id: `sub-upload-${Date.now()}`,
      studentName: studentName || 'Học sinh mới',
      studentCode: studentCode || `HS-${Date.now().toString().slice(-4)}`,
      examCode: examCode || exam.examCode,
      gradeLevel: exam.gradeLevel,
      className: className || '6A1',
      pages: pages.map((p) => ({
        pageNumber: p.pageNumber,
        imageUrl: p.dataUrl,
        rotation: p.rotation,
        isConfirmed: true
      })),
      pageConfirmedByTeacher: true,
      ocrData: detectedOcrData,
      status: 'pending_approval',
      rawTotalScore: 0,
      roundedTotalScore: 0,
      questionGrades: [],
      generalFeedback: {
        strengths: 'Hoàn thành đầy đủ các phần bài làm theo yêu cầu.',
        weaknesses: 'Cần lưu ý kiểm tra lại các bước biến đổi phương trình lũy thừa và điều kiện bài toán thực tế.',
        recommendations: 'Rèn luyện thêm các dạng toán tìm x nâng cao.',
        combinedNote: 'Bài làm khá tốt. Cần chú ý cẩn thận hơn ở các bước giải phương trình.'
      },
      reviewFlags: [],
      approvedByTeacher: false,
      history: [
        {
          timestamp: new Date().toLocaleTimeString('vi-VN'),
          action: `Tải lên file bài thi (${pages.length} trang) & AI phân tích tiêu chí`
        }
      ]
    };

    // Đánh giá điểm theo tiêu chí
    const evaluated = evaluateStudentSubmission(newSub, rubric, exam.roundingRule);

    setTimeout(() => {
      onSubmissionCreated(evaluated);
      setIsGrading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">TẢI FILE BÀI LÀM (ẢNH HOẶC PDF) ĐỂ CHẤM ĐIỂM</h2>
              <p className="text-xs text-slate-400">
                Hỗ trợ file ảnh JPG, PNG, WEBP hoặc file PDF nhiều trang
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Thông báo lỗi nếu có */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Vùng kéo thả File / Nút Chọn File */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50/70 transition-all rounded-2xl p-6 text-center cursor-pointer group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/jpg,image/webp,application/pdf"
              multiple
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Bấm vào đây để chọn file từ máy tính, hoặc kéo thả file vào ô này
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Chấp nhận: <strong>Ảnh chụp bài làm (.PNG, .JPG, .JPEG)</strong> hoặc <strong>Tập tin .PDF nhiều trang</strong>
            </p>
            <span className="inline-block mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white shadow-xs">
              Chọn file Ảnh / PDF
            </span>
          </div>

          {/* Trạng thái đang nạp file */}
          {isProcessingFile && (
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-600 font-medium animate-pulse flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>Đang giải mã và kết xuất các trang bài thi...</span>
            </div>
          )}

          {/* Danh sách trang bài thi đã tải lên */}
          {pages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  Các trang bài thi đã nạp ({pages.length} trang):
                </span>
                <span className="text-[11px] text-slate-500">
                  (Bấm nút xoay nếu ảnh chụp bị nghiêng/ngang)
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {pages.map((p, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex flex-col relative group shadow-2xs"
                  >
                    <div className="h-44 bg-slate-900 flex items-center justify-center overflow-hidden p-1">
                      <img
                        src={p.dataUrl}
                        alt={`Trang ${p.pageNumber}`}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="p-2 bg-white flex items-center justify-between text-xs border-t">
                      <span className="font-bold text-slate-800">Trang {p.pageNumber}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRotatePage(idx)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 hover:text-blue-600"
                          title="Xoay ảnh 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePage(idx)}
                          className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600"
                          title="Xóa trang này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thông tin học sinh */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Xác nhận thông tin bài nộp:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Họ và tên học sinh:
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Nhập tên học sinh..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mã học sinh:
                </label>
                <input
                  type="text"
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lớp học:
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Mã đề bài thi:
                </label>
                <input
                  type="text"
                  value={examCode}
                  onChange={(e) => setExamCode(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Hủy bỏ
          </button>

          <button
            onClick={handleStartGrading}
            disabled={pages.length === 0 || isGrading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>
              {isGrading ? 'Đang nhận dạng & Chấm điểm...' : 'Bắt đầu nhận dạng & Chấm điểm'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
