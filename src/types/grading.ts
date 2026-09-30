export type GradeLevel = '6' | '7' | '8' | '9';

export type RoundingRule = 'none' | '0.1' | '0.25' | '0.5';

export type GradingStatus = 
  | 'not_graded'       // Chưa chấm
  | 'processing'       // Đang xử lý
  | 'needs_review'     // Cần kiểm tra (Màu cam)
  | 'pending_approval' // Chờ duyệt
  | 'approved'         // Đã duyệt (Màu xanh)
  | 'error';           // Lỗi xử lý

export interface BoundingBox {
  x: number;      // % from left (0 - 100)
  y: number;      // % from top (0 - 100)
  width: number;  // % width
  height: number; // % height
}

export interface AnnotationOverlay {
  id: string;
  type: 'score_badge' | 'error_callout' | 'review_warning' | 'total_badge' | 'teacher_note';
  text: string;
  box: BoundingBox;
  pageIndex: number;
  questionId?: string;
  points?: number;
  severity?: 'success' | 'danger' | 'warning';
}

export interface RubricCriterion {
  id: string;
  code: string;               // e.g., '1a.1', '2c.1', '3b.2'
  description: string;        // Miêu tả tiêu chí: 'Nhận dạng đúng 4*3^x = 108'
  maxScore: number;           // Điểm tối đa của tiêu chí (vd: 0.3đ, 0.625đ)
  requiredOrder?: number;
  deductionCascade?: boolean; // Quy tắc lỗi dây chuyền
}

export interface RubricQuestion {
  id: string;
  questionNumber: string;     // e.g. "Câu 1a", "Câu 2c", "Câu 3b"
  part: 'I' | 'II';           // Trắc nghiệm (I) hoặc Tự luận (II)
  title: string;
  maxScore: number;
  correctAnswer?: string;     // Cho trắc nghiệm
  criteria: RubricCriterion[];
  standardSolution?: string;  // Lời giải chuẩn
  alternateSolutions?: string[]; // Các hướng giải khác được chấp nhận
}

export interface ExamRubric {
  id: string;
  examId: string;
  version: number;
  totalScore: number;         // Tổng điểm đề (thường là 10.0đ)
  isApprovedByTeacher: boolean;
  approvedAt?: string;
  approvedBy?: string;
  questions: RubricQuestion[];
}

export interface Exam {
  id: string;
  title: string;              // "Kiểm tra định kỳ Toán 6 - Tuần 04 - Buổi 01"
  gradeLevel: GradeLevel;     // 6
  examCode: string;           // "103"
  durationMinutes: number;    // 45
  totalMaxScore: number;      // 10.0
  roundingRule: RoundingRule; // 0.1 | 0.25 | none
  testPaperText: string;
  createdAt: string;
}

export interface AmbiguousZone {
  id: string;
  questionId: string;
  locationText: string;       // "Dòng 3 - vế phải"
  possibleMeanings: string[]; // ["x²", "x³"]
  selectedMeaning?: string;
  confidence: number;
  resolved: boolean;
  box: BoundingBox;
  pageIndex: number;
}

export interface QuestionOcrData {
  questionId: string;
  questionNumber: string;
  pageIndex: number;
  rawRecognizedText: string;  // Chữ viết học sinh được OCR
  teacherEditedText?: string; // Giáo viên hiệu đính
  detectedZone: BoundingBox;
  hasAmbiguity: boolean;
  ambiguities: AmbiguousZone[];
  isTeacherVerified: boolean;
}

export interface CriterionAssessment {
  criterionId: string;
  code: string;
  description: string;
  achieved: boolean;
  pointsAwarded: number;
  maxPoints: number;
  rationale: string;
}

export interface QuestionGrade {
  questionId: string;
  questionNumber: string;
  maxScore: number;
  scoreAwarded: number;
  status: 'correct' | 'partial' | 'wrong' | 'needs_review';
  studentTranscription: string;
  firstFlawedStep?: string;   // Bước sai đầu tiên
  mathReasoning: string;       // Nhận xét sư phạm, phân tích logic
  isAlternateMethod?: boolean;// Nhận dạng cách giải khác hợp lệ
  criteriaAssessments: CriterionAssessment[];
  teacherOverride?: {
    score?: number;
    comment?: string;
    isOverridden: boolean;
  };
  annotations: AnnotationOverlay[];
}

export interface StudentSubmission {
  id: string;
  studentName: string;
  studentCode: string;
  examCode: string;
  gradeLevel: GradeLevel;
  className: string;
  pages: {
    pageNumber: number;
    imageUrl: string;
    rotation: number;
    isConfirmed: boolean;
  }[];
  pageConfirmedByTeacher: boolean;
  ocrData: QuestionOcrData[];
  status: GradingStatus;
  rawTotalScore: number;
  roundedTotalScore: number;
  questionGrades: QuestionGrade[];
  generalFeedback: {
    strengths: string;        // Điểm làm tốt
    weaknesses: string;       // Lỗi cần sửa
    recommendations: string;  // Nội dung nên luyện thêm
    combinedNote: string;     // Lời nhận xét của thầy cô trên đầu bài
  };
  reviewFlags: string[];      // Các lý do cần kiểm tra (màu cam)
  approvedByTeacher: boolean;
  approvedAt?: string;
  approvedBy?: string;
  history: {
    timestamp: string;
    action: string;
    previousScore?: number;
    newScore?: number;
  }[];
}
