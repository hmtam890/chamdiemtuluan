import React from 'react';
import { 
  FileEdit, 
  ListChecks, 
  UploadCloud, 
  ScanText, 
  Edit3, 
  Bot, 
  CheckSquare, 
  FileDown 
} from 'lucide-react';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface WorkflowStepsProps {
  currentStep: StepNumber;
  onSelectStep: (step: StepNumber) => void;
  status: string;
}

const STEPS = [
  { id: 1, title: 'Đề kiểm tra', desc: 'Nhập & tạo đề', icon: FileEdit },
  { id: 2, title: 'Barem chấm', desc: 'Duyệt tiêu chí', icon: ListChecks },
  { id: 3, title: 'Tải bài làm', desc: 'Ghép trang & HS', icon: UploadCloud },
  { id: 4, title: 'Nhận dạng OCR', desc: 'Phát hiện chữ viết', icon: ScanText },
  { id: 5, title: 'Sửa nhận dạng', desc: 'Hiệu đính ký hiệu', icon: Edit3 },
  { id: 6, title: 'AI đề xuất điểm', desc: 'Phân tích bước giải', icon: Bot },
  { id: 7, title: 'Kiểm duyệt điểm', desc: 'Điều chỉnh & chốt', icon: CheckSquare },
  { id: 8, title: 'Xuất kết quả', desc: 'PDF & Excel', icon: FileDown },
];

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ currentStep, onSelectStep, status }) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[780px] gap-2">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isPassed = currentStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id as StepNumber)}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-50 text-blue-800 ring-1 ring-blue-500 font-semibold'
                  : isPassed
                  ? 'text-slate-700 hover:bg-slate-100 font-medium'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step.id}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-semibold">{step.title}</div>
                <div className="text-[10px] text-slate-500">{step.desc}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
