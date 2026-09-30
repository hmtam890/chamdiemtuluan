import React from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { StudentSubmission } from '../types/grading';
import { SAMPLE_CAO_TAI_SUBMISSION, CLASS_SUBMISSIONS_DEMO } from '../data/mockData';

interface MandatoryTestScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadScenario: (scenarioId: string) => void;
}

export const MandatoryTestScenariosModal: React.FC<MandatoryTestScenariosModalProps> = ({
  isOpen,
  onClose,
  onLoadScenario
}) => {
  if (!isOpen) return null;

  const SCENARIOS = [
    {
      id: 'scenario-a',
      title: 'Tình huống A — Sai khi giải phương trình lũy thừa',
      equation: '4 . 3^x - 7 = 101',
      studentSteps: `4 . 3^x - 7 = 101\n4 . 3^x = 108\n3^x = 27\nx = 27 : 3 = 9`,
      requirement:
        'Hệ thống phải nhận ra các bước trước dòng cuối là đúng (+0.3đ). Nhận xét: "Em cần viết 27 = 3³, suy ra x = 3; không lấy 27 chia cho 3 để tìm số mũ."',
      expectedResult: 'Điểm: 0.3 / 0.625đ. Chú thích lỗi đỏ tại dòng 4. Không cho 0 điểm cả câu.',
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'scenario-b',
      title: 'Tình huống B — Ngoặc lồng nhau',
      equation: '150 - [60 - (x - 6)] = 110',
      studentSteps: `150 - (x - 6) = 110\n(x - 6) = 150 - 110\n(x - 6) = 40...\nx = 26`,
      requirement:
        'Kiểm tra các dòng thực tế học sinh viết. Nếu đáp số 26 đúng nhưng bước biến đổi sai (bỏ ngoặc sai quy tắc số trừ), tuyệt đối không cho trọn điểm.',
      expectedResult: 'Điểm: 0đ. Chú thích lỗi đỏ: "Sai dòng 1: Chuyển vế bỏ ngoặc sai hoàn toàn quy tắc tìm số trừ (0đ)".',
      badgeColor: 'bg-red-100 text-red-800'
    },
    {
      id: 'scenario-c',
      title: 'Tình huống C — Bài toán thực tế giảm giá',
      equation: '6 vở @ 10k + 4 bút @ 5k + compa @ 25k (HĐ >= 100k giảm 15k)',
      studentSteps: `Biểu thức: 10000 . 6 + 4 . 5000 + 25000 - 15000\nSố tiền phải trả là: 90 000 (đồng)`,
      requirement:
        'Học sinh tính đúng tổng 90.000 đồng nhưng thiếu lập luận điều kiện tổng tiền mua (105.000đ >= 100.000đ) để được giảm giá. Chỉ trừ phần điểm tiêu chí quy định (trừ 0.25đ, cho 1.0đ).',
      expectedResult: 'Điểm: 1.0 / 1.25đ. Chú thích lỗi đỏ: "Thiếu lập luận điều kiện tổng tiền >= 100000đ để được giảm giá (+1.0đ)".',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'scenario-d',
      title: 'Tình huống D — Chữ viết không rõ',
      equation: 'Ký hiệu số mũ: không phân biệt được x² hay x³',
      studentSteps: `Học sinh viết nét mũ 2 hay 3 bị nhòe: 2[?]`,
      requirement:
        'Hệ thống không được tự đoán danh tính hoặc ký hiệu. Đánh dấu vùng nghi vấn màu cam ("Cần kiểm tra") và yêu cầu giáo viên xác nhận trước khi chốt điểm.',
      expectedResult: 'Trạng thái chuyển sang "Cần kiểm tra" (Màu cam). Khoanh vùng nghi vấn trên bài thi.',
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'scenario-e',
      title: 'Tình huống E — Cách giải khác hợp lệ',
      equation: '54 . 38 + 54 . 62 - 400',
      studentSteps: `Học sinh không nhóm phân phối mà nhân trực tiếp: 2052 + 3348 - 400 = 5400 - 400 = 5000`,
      requirement:
        'Công nhận cách giải khác đáp án mẫu nếu hợp lệ và đáp ứng yêu cầu. Cho trọn điểm các tiêu chí tương đương.',
      expectedResult: 'Điểm: 0.625 / 0.625đ (Trọn điểm). Ghi nhận "Cách giải khác hợp lệ".',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-base font-bold">5 TÌNH HUỐNG KIỂM TRA BẮT BUỘC (MỤC 6)</h2>
              <p className="text-xs text-slate-400">
                Thử nghiệm quy tắc toán học, tính điểm công bằng và chú thích sư phạm
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

        {/* Scenarios List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {SCENARIOS.map((s) => (
            <div
              key={s.id}
              className="border border-slate-200 rounded-xl p-4 hover:border-blue-400 transition-all bg-slate-50/50"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badgeColor}`}>
                    {s.title.split('—')[0]}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{s.title}</h3>
                </div>
                <button
                  onClick={() => {
                    onLoadScenario(s.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Nạp & Chấm thử</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mt-3">
                <div className="bg-white p-2.5 rounded border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Đề bài & Bài giải học sinh viết:</span>
                  <div className="font-mono text-slate-800 whitespace-pre-line bg-slate-50 p-2 rounded text-[11px]">
                    {s.studentSteps}
                  </div>
                </div>

                <div className="bg-blue-50/60 p-2.5 rounded border border-blue-200 space-y-1.5">
                  <span className="font-bold text-blue-900 block">Quy tắc sư phạm bắt buộc:</span>
                  <p className="text-blue-950 text-[11px] leading-relaxed">{s.requirement}</p>
                  <div className="pt-1 border-t border-blue-200 text-emerald-800 font-semibold text-[11px]">
                    ✓ Kết quả mong đợi: {s.expectedResult}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
