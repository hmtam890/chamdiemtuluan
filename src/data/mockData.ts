import { Exam, ExamRubric, StudentSubmission } from '../types/grading';

export const INITIAL_EXAM: Exam = {
  id: 'exam-toan6-t4',
  title: 'PHIẾU KIỂM TRA ĐỊNH KỲ TOÁN 6 - TUẦN 04 - BUỔI 01',
  gradeLevel: '6',
  examCode: '103',
  durationMinutes: 45,
  totalMaxScore: 10.0,
  roundingRule: '0.1',
  createdAt: '2026-09-28',
  testPaperText: `PHIẾU KIỂM TRA ĐỊNH KỲ TOÁN 6 - TUẦN 04 - BUỔI 01
Chủ đề: Thứ tự thực hiện các phép tính - Mã đề: 103
Thời gian làm bài: 45 phút

PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (2,5 điểm - Mỗi câu 0,5 điểm)
Câu 1. Khi thực hiện phép tính trong biểu thức không có dấu ngoặc, thứ tự nào sau đây là đúng?
A. Nhân, chia -> Cộng, trừ -> Lũy thừa
B. Cộng, trừ -> Nhân, chia -> Lũy thừa
C. Lũy thừa -> Cộng, trừ -> Nhân, chia
D. Lũy thừa -> Nhân, chia -> Cộng, trừ
Câu 2. Dấu ngoặc nào được thực hiện cuối cùng trong biểu thức có nhiều loại ngoặc?
A. {}        B. ()        C. []        D. Tùy ý thứ tự
Câu 3. Kết quả của phép tính 40 - 4 * 6 + 5 là:
A. 221       B. 21        C. 15        D. 29
Câu 4. Giá trị của biểu thức 6 * 2^3 - 27 : 3^2 là:
A. 42        B. 41        C. 45        D. 51
Câu 5. Giá trị của biểu thức 150 : [25 + (15 - 10)] là:
A. 10        B. 6         C. 3         D. 5

PHẦN II. TỰ LUẬN (7,5 điểm)
Câu 1 (2,5 điểm). Thực hiện phép tính (hợp lý nếu có thể):
a) 65 + 18 : 2 - 2^4
b) 54 * 38 + 54 * 62 - 400
c) 160 : [58 - (42 - 2^3 * 2)]
d) 320 : {180 - [75 + (11 - 6)^2]}

Câu 2 (2,5 điểm). Tìm số tự nhiên x, biết:
a) 45 + 3(x - 4) = 66
b) 150 - [60 - (x - 6)] = 110
c) 4 * 3^x - 7 = 101
d) 5(x + 4) - 25 = 38 + 32

Câu 3 (2,5 điểm). Bài toán thực tế:
Bạn Cúc đi nhà sách mua: 6 quyển vở giá 10 000 đồng/quyển, 4 cây bút gel giá 5 000 đồng/cây và 1 bộ compa - êke giá 25 000 đồng. Nhà sách có chính sách giảm giá 15 000 đồng cho hóa đơn mua hàng có tổng giá trị từ 100 000 đồng trở lên.
a) (1,25 điểm) Hãy viết một biểu thức số thể hiện số tiền bạn Cúc phải trả.
b) (1,25 điểm) Tính cụ thể số tiền bạn Cúc phải trả cho nhà sách sau khi được giảm giá.`
};

export const INITIAL_RUBRIC: ExamRubric = {
  id: 'rubric-toan6-t4',
  examId: 'exam-toan6-t4',
  version: 1,
  totalScore: 10.0,
  isApprovedByTeacher: true,
  approvedAt: '2026-09-28 08:30',
  approvedBy: 'Thầy Nguyễn Văn Toàn',
  questions: [
    // Phần I: Trắc nghiệm (2.5đ)
    {
      id: 'tn-1',
      questionNumber: 'Câu 1 (TN)',
      part: 'I',
      title: 'Thứ tự thực hiện phép tính không có ngoặc',
      maxScore: 0.5,
      correctAnswer: 'D',
      criteria: [
        { id: 'tn1-c1', code: 'TN.1', description: 'Chọn đúng đáp án D (Lũy thừa -> Nhân, chia -> Cộng, trừ)', maxScore: 0.5 }
      ]
    },
    {
      id: 'tn-2',
      questionNumber: 'Câu 2 (TN)',
      part: 'I',
      title: 'Thứ tự ngoặc trong biểu thức',
      maxScore: 0.5,
      correctAnswer: 'A', // Hoặc C theo chuẩn SGK () -> [] -> {}
      criteria: [
        { id: 'tn2-c1', code: 'TN.2', description: 'Chọn đúng đáp án A (Thực hiện ngoặc nhọn {} sau cùng)', maxScore: 0.5 }
      ]
    },
    {
      id: 'tn-3',
      questionNumber: 'Câu 3 (TN)',
      part: 'I',
      title: 'Tính 40 - 4*6 + 5',
      maxScore: 0.5,
      correctAnswer: 'B',
      criteria: [
        { id: 'tn3-c1', code: 'TN.3', description: 'Chọn đúng đáp án B (Kết quả 21)', maxScore: 0.5 }
      ]
    },
    {
      id: 'tn-4',
      questionNumber: 'Câu 4 (TN)',
      part: 'I',
      title: 'Tính 6*2^3 - 27:3^2',
      maxScore: 0.5,
      correctAnswer: 'C',
      criteria: [
        { id: 'tn4-c1', code: 'TN.4', description: 'Chọn đúng đáp án C (Kết quả 45)', maxScore: 0.5 }
      ]
    },
    {
      id: 'tn-5',
      questionNumber: 'Câu 5 (TN)',
      part: 'I',
      title: 'Tính 150 : [25 + (15 - 10)]',
      maxScore: 0.5,
      correctAnswer: 'D',
      criteria: [
        { id: 'tn5-c1', code: 'TN.5', description: 'Chọn đúng đáp án D (Kết quả 5)', maxScore: 0.5 }
      ]
    },

    // Phần II: Tự luận - Câu 1 (2.5đ)
    {
      id: 'tl-1a',
      questionNumber: 'Câu 1a',
      part: 'II',
      title: '65 + 18 : 2 - 2^4',
      maxScore: 0.625,
      criteria: [
        { id: '1a-1', code: '1a.1', description: 'Tính lũy thừa 2^4 = 16 và phép chia 18:2 = 9', maxScore: 0.325 },
        { id: '1a-2', code: '1a.2', description: 'Thực hiện cộng trừ từ trái sang phải, ra đáp số = 58', maxScore: 0.3 }
      ],
      standardSolution: '= 65 + 9 - 16 = 74 - 16 = 58'
    },
    {
      id: 'tl-1b',
      questionNumber: 'Câu 1b',
      part: 'II',
      title: '54 * 38 + 54 * 62 - 400',
      maxScore: 0.625,
      criteria: [
        { id: '1b-1', code: '1b.1', description: 'Áp dụng tính chất phân phối đặt 54 * (38 + 62)', maxScore: 0.325 },
        { id: '1b-2', code: '1b.2', description: 'Tính 54 * 100 - 400 = 5400 - 400 = 5000', maxScore: 0.3 }
      ],
      standardSolution: '= 54 * (38 + 62) - 400 = 54 * 100 - 400 = 5400 - 400 = 5000',
      alternateSolutions: ['Thực hiện tính trực tiếp từng tích: 2052 + 3348 - 400 = 5400 - 400 = 5000 (vẫn cho điểm trọn vẹn nếu đúng)']
    },
    {
      id: 'tl-1c',
      questionNumber: 'Câu 1c',
      part: 'II',
      title: '160 : [58 - (42 - 2^3 * 2)]',
      maxScore: 0.625,
      criteria: [
        { id: '1c-1', code: '1c.1', description: 'Tính trong ngoặc tròn: 2^3 * 2 = 16, 42 - 16 = 26', maxScore: 0.325 },
        { id: '1c-2', code: '1c.2', description: 'Tính trong ngoặc vuông 58 - 26 = 32 và chia 160 : 32 = 5', maxScore: 0.3 }
      ],
      standardSolution: '= 160 : [58 - (42 - 16)] = 160 : [58 - 26] = 160 : 32 = 5'
    },
    {
      id: 'tl-1d',
      questionNumber: 'Câu 1d',
      part: 'II',
      title: '320 : {180 - [75 + (11 - 6)^2]}',
      maxScore: 0.625,
      criteria: [
        { id: '1d-1', code: '1d.1', description: 'Tính ngoặc tròn (11-6)^2 = 5^2 = 25; ngoặc vuông 75+25 = 100', maxScore: 0.325 },
        { id: '1d-2', code: '1d.2', description: 'Tính ngoặc nhọn 180 - 100 = 80; chia 320 : 80 = 4', maxScore: 0.3 }
      ],
      standardSolution: '= 320 : {180 - [75 + 25]} = 320 : {180 - 100} = 320 : 80 = 4'
    },

    // Phần II: Tự luận - Câu 2 (2.5đ)
    {
      id: 'tl-2a',
      questionNumber: 'Câu 2a',
      part: 'II',
      title: '45 + 3(x - 4) = 66',
      maxScore: 0.625,
      criteria: [
        { id: '2a-1', code: '2a.1', description: 'Chuyển vế tìm 3(x - 4) = 66 - 45 = 21', maxScore: 0.3 },
        { id: '2a-2', code: '2a.2', description: 'Tìm x - 4 = 21:3 = 7 và suy ra x = 11', maxScore: 0.325 }
      ],
      standardSolution: '3(x - 4) = 21 => x - 4 = 7 => x = 11'
    },
    {
      id: 'tl-2b',
      questionNumber: 'Câu 2b',
      part: 'II',
      title: '150 - [60 - (x - 6)] = 110 (Ngoặc lồng nhau)',
      maxScore: 0.625,
      criteria: [
        { id: '2b-1', code: '2b.1', description: 'Xác định đúng số trừ: 60 - (x - 6) = 150 - 110 = 40', maxScore: 0.325 },
        { id: '2b-2', code: '2b.2', description: 'Tìm tiếp x - 6 = 60 - 40 = 20 và suy ra x = 26', maxScore: 0.3 }
      ],
      standardSolution: '60 - (x - 6) = 150 - 110 => 60 - (x - 6) = 40 => x - 6 = 20 => x = 26'
    },
    {
      id: 'tl-2c',
      questionNumber: 'Câu 2c',
      part: 'II',
      title: '4 * 3^x - 7 = 101 (Phương trình lũy thừa)',
      maxScore: 0.625,
      criteria: [
        { id: '2c-1', code: '2c.1', description: 'Chuyển vế tính 4 * 3^x = 108', maxScore: 0.15 },
        { id: '2c-2', code: '2c.2', description: 'Tìm 3^x = 108 : 4 = 27', maxScore: 0.15 },
        { id: '2c-3', code: '2c.3', description: 'Đưa về cùng cơ số: 3^x = 3^3 suy ra x = 3 (Không lấy 27 : 3)', maxScore: 0.325 }
      ],
      standardSolution: '4 * 3^x = 108 => 3^x = 27 => 3^x = 3^3 => x = 3'
    },
    {
      id: 'tl-2d',
      questionNumber: 'Câu 2d',
      part: 'II',
      title: '5(x + 4) - 25 = 38 + 32',
      maxScore: 0.625,
      criteria: [
        { id: '2d-1', code: '2d.1', description: 'Tính vế phải 38 + 32 = 70 và chuyển vế 5(x + 4) = 70 + 25 hoặc tính chính xác', maxScore: 0.3 },
        { id: '2d-2', code: '2d.2', description: 'Tìm đúng x', maxScore: 0.325 }
      ],
      standardSolution: '5(x + 4) = 70 => x + 4 = 14 => x = 10 (theo đề gốc học sinh giải)'
    },

    // Phần II: Tự luận - Câu 3 (2.5đ)
    {
      id: 'tl-3a',
      questionNumber: 'Câu 3a',
      part: 'II',
      title: 'Biểu thức thể hiện số tiền bạn Cúc phải trả',
      maxScore: 1.25,
      criteria: [
        { id: '3a-1', code: '3a.1', description: 'Viết đúng biểu thức tiền mua các món: 10000 * 6 + 5000 * 4 + 25000', maxScore: 0.75 },
        { id: '3a-2', code: '3a.2', description: 'Trừ đi 15000 giảm giá: 10000*6 + 5000*4 + 25000 - 15000', maxScore: 0.5 }
      ],
      standardSolution: 'Biểu thức: 10 000 * 6 + 5 000 * 4 + 25 000 - 15 000'
    },
    {
      id: 'tl-3b',
      questionNumber: 'Câu 3b',
      part: 'II',
      title: 'Tính số tiền phải trả sau khi giảm giá',
      maxScore: 1.25,
      criteria: [
        { id: '3b-1', code: '3b.1', description: 'Lập luận điều kiện tổng tiền mua (105 000đ >= 100 000đ) để được giảm giá', maxScore: 0.25 },
        { id: '3b-2', code: '3b.2', description: 'Tính đúng tổng số tiền phải trả: 90 000 đồng và ghi đơn vị rõ ràng', maxScore: 1.0 }
      ],
      standardSolution: 'Tổng giá trị hóa đơn trước giảm: 6*10000 + 4*5000 + 25000 = 105 000 (đồng).\nVì 105 000 >= 100 000 đồng nên bạn Cúc được giảm 15 000 đồng.\nSố tiền bạn Cúc phải trả là: 105 000 - 15 000 = 90 000 (đồng).'
    }
  ]
};

// Submission thực tế từ CAO_TAI_8.1.pdf
export const SAMPLE_CAO_TAI_SUBMISSION: StudentSubmission = {
  id: 'sub-cao-tai-103',
  studentName: 'Lê Cao Tài',
  studentCode: 'HS-6A1-03',
  examCode: '103',
  gradeLevel: '6',
  className: '6A1',
  pages: [
    {
      pageNumber: 1,
      imageUrl: '/sample_page_1.png', // Sẽ được fallback vẽ canvas chuẩn sắc nét
      rotation: 0,
      isConfirmed: true
    },
    {
      pageNumber: 2,
      imageUrl: '/sample_page_2.png',
      rotation: 0,
      isConfirmed: true
    }
  ],
  pageConfirmedByTeacher: true,
  status: 'approved',
  rawTotalScore: 8.1,
  roundedTotalScore: 8.1,
  reviewFlags: [],
  approvedByTeacher: true,
  approvedAt: '2026-09-28 10:15',
  approvedBy: 'Thầy Nguyễn Văn Toàn',
  generalFeedback: {
    strengths: 'Nắm chắc thứ tự thực hiện phép tính cơ bản ở Câu 1; tính toán nhẩm lũy thừa và phối hợp tính nhanh tốt; làm đúng bài toán thực tế.',
    weaknesses: 'Câu 2b: Chuyển vế sai quy tắc khi có dấu ngoặc vuông lồng nhau. Câu 2c: Nhầm lẫn phép chia cơ số khi tìm số mũ của lũy thừa (3^x = 27 lấy 27:3). Câu 3b: Quên ghi lập luận so sánh tổng tiền với 100.000đ để hưởng khuyến mãi.',
    recommendations: 'Ôn tập lại kỹ năng giải phương trình lũy thừa dạng a^x = b (đưa về cùng cơ số). Luyện tập các bài tìm x có ngoặc lồng nhau từ trong ra ngoài hoặc quy tắc số trừ.',
    combinedNote: 'Cần xem lại quy tắc tìm thành phần chưa biết khi có ngoặc lồng nhau ở câu 2b. Chú ý cách giải phương trình dạng lũy thừa ở câu 2c: đưa về cùng cơ số chứ không lấy lũy thừa chia cho cơ số. Khi làm bài toán thực tế cần nêu rõ điều kiện hưởng ưu đãi.'
  },
  history: [
    { timestamp: '2026-09-28 09:40', action: 'Tải bài làm & Nhận dạng chữ viết', newScore: 8.1 },
    { timestamp: '2026-09-28 09:42', action: 'AI phân tích đề xuất điểm', newScore: 8.1 },
    { timestamp: '2026-09-28 10:15', action: 'Giáo viên duyệt và chốt điểm', previousScore: 8.1, newScore: 8.1 }
  ],
  ocrData: [
    {
      questionId: 'tl-1a',
      questionNumber: 'Câu 1a',
      pageIndex: 0,
      rawRecognizedText: '= 65 + 18 : 2 - 16\n= 65 + 9 - 16\n= 74 - 16\n= 58',
      detectedZone: { x: 5, y: 55, width: 42, height: 16 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-1b',
      questionNumber: 'Câu 1b',
      pageIndex: 0,
      rawRecognizedText: '= 54 . (38 + 62) - 400\n= 54 . 100 - 400\n= 5400 - 400\n= 5000',
      detectedZone: { x: 51, y: 55, width: 44, height: 16 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-1c',
      questionNumber: 'Câu 1c',
      pageIndex: 0,
      rawRecognizedText: '= 160 : [58 - (42 - 8 . 2)]\n= 160 : [58 - (42 - 16)]\n= 160 : [58 - 26]\n= 160 : 32\n= 5',
      detectedZone: { x: 5, y: 74, width: 42, height: 18 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-1d',
      questionNumber: 'Câu 1d',
      pageIndex: 0,
      rawRecognizedText: '= 320 : {180 - [75 + 5^2]}\n= 320 : {180 - [75 + 25]}\n= 320 : {180 - 100}\n= 320 : 80\n= 4',
      detectedZone: { x: 51, y: 74, width: 44, height: 18 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-2a',
      questionNumber: 'Câu 2a',
      pageIndex: 1,
      rawRecognizedText: '3(x - 4) = 66 - 45\n3(x - 4) = 21\n(x - 4) = 21 : 3\n(x - 4) = 7\nx = 7 + 4\nx = 11',
      detectedZone: { x: 5, y: 11, width: 42, height: 20 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-2b',
      questionNumber: 'Câu 2b',
      pageIndex: 1,
      rawRecognizedText: '150 - (x - 6) = 110\n(x - 6) = 150 - 110\n(x - 6) = 20\nx = 20 + 6\nx = 26',
      detectedZone: { x: 51, y: 11, width: 44, height: 20 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-2c',
      questionNumber: 'Câu 2c',
      pageIndex: 1,
      rawRecognizedText: '4 . 3^x = 101 + 7\n4 . 3^x = 108\n3^x = 27\nx = 27 : 3\nx = 9',
      detectedZone: { x: 5, y: 33, width: 42, height: 18 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-2d',
      questionNumber: 'Câu 2d',
      pageIndex: 1,
      rawRecognizedText: '5(x + 4) = 38 + 32\n5(x + 4) = 70\n(x + 4) = 70 : 5\n(x + 4) = 14\nx = 14 - 4\nx = 10',
      detectedZone: { x: 51, y: 33, width: 44, height: 18 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-3a',
      questionNumber: 'Câu 3a',
      pageIndex: 1,
      rawRecognizedText: 'a. Biểu thức: 10000 . 6 + 4 . 5000 + 25000 - 15000',
      detectedZone: { x: 5, y: 57, width: 88, height: 8 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    },
    {
      questionId: 'tl-3b',
      questionNumber: 'Câu 3b',
      pageIndex: 1,
      rawRecognizedText: 'b. Cúc phải trả số tiền cho nhà sách là:\n10000 . 6 + 4 . 5000 + 25000 - 15000 = 90000 (đồng)',
      detectedZone: { x: 5, y: 65, width: 88, height: 14 },
      hasAmbiguity: false,
      ambiguities: [],
      isTeacherVerified: true
    }
  ],
  questionGrades: [
    // Trắc nghiệm
    {
      questionId: 'tn-1',
      questionNumber: 'Câu 1 (TN)',
      maxScore: 0.5,
      scoreAwarded: 0.5,
      status: 'correct',
      studentTranscription: 'Chọn D',
      mathReasoning: 'Học sinh chọn D là đúng theo thứ tự thực hiện phép tính không có ngoặc: Lũy thừa -> Nhân, chia -> Cộng, trừ.',
      criteriaAssessments: [
        { criterionId: 'tn1-c1', code: 'TN.1', description: 'Chọn đáp án D', achieved: true, pointsAwarded: 0.5, maxPoints: 0.5, rationale: 'Chính xác' }
      ],
      annotations: [
        { id: 'ann-tn-1', type: 'score_badge', text: '(Đ)', pageIndex: 0, box: { x: 26, y: 22, width: 3, height: 3 }, severity: 'success' }
      ]
    },
    {
      questionId: 'tn-2',
      questionNumber: 'Câu 2 (TN)',
      maxScore: 0.5,
      scoreAwarded: 0.0,
      status: 'wrong',
      studentTranscription: 'Chọn B',
      firstFlawedStep: 'Chọn B (ngoặc tròn)',
      mathReasoning: 'Học sinh chọn B () là sai. Trong biểu thức có nhiều loại ngoặc, thứ tự thực hiện là () -> [] -> {}, do đó ngoặc nhọn {} phải thực hiện cuối cùng.',
      criteriaAssessments: [
        { criterionId: 'tn2-c1', code: 'TN.2', description: 'Chọn đáp án A', achieved: false, pointsAwarded: 0.0, maxPoints: 0.5, rationale: 'Sai đáp án (chọn B)' }
      ],
      annotations: [
        { id: 'ann-tn-2', type: 'error_callout', text: '(S)', pageIndex: 0, box: { x: 41, y: 22, width: 3, height: 3 }, severity: 'danger' }
      ]
    },
    {
      questionId: 'tn-3',
      questionNumber: 'Câu 3 (TN)',
      maxScore: 0.5,
      scoreAwarded: 0.5,
      status: 'correct',
      studentTranscription: 'Chọn B',
      mathReasoning: '40 - 24 + 5 = 21. Đáp án B đúng.',
      criteriaAssessments: [
        { criterionId: 'tn3-c1', code: 'TN.3', description: 'Chọn đáp án B', achieved: true, pointsAwarded: 0.5, maxPoints: 0.5, rationale: 'Chính xác' }
      ],
      annotations: [
        { id: 'ann-tn-3', type: 'score_badge', text: '(Đ)', pageIndex: 0, box: { x: 57, y: 22, width: 3, height: 3 }, severity: 'success' }
      ]
    },
    {
      questionId: 'tn-4',
      questionNumber: 'Câu 4 (TN)',
      maxScore: 0.5,
      scoreAwarded: 0.5,
      status: 'correct',
      studentTranscription: 'Chọn C',
      mathReasoning: '6*8 - 27:9 = 48 - 3 = 45. Đáp án C đúng.',
      criteriaAssessments: [
        { criterionId: 'tn4-c1', code: 'TN.4', description: 'Chọn đáp án C', achieved: true, pointsAwarded: 0.5, maxPoints: 0.5, rationale: 'Chính xác' }
      ],
      annotations: [
        { id: 'ann-tn-4', type: 'score_badge', text: '(Đ)', pageIndex: 0, box: { x: 73, y: 22, width: 3, height: 3 }, severity: 'success' }
      ]
    },
    {
      questionId: 'tn-5',
      questionNumber: 'Câu 5 (TN)',
      maxScore: 0.5,
      scoreAwarded: 0.5,
      status: 'correct',
      studentTranscription: 'Chọn D',
      mathReasoning: '150 : [25 + 5] = 150 : 30 = 5. Đáp án D đúng.',
      criteriaAssessments: [
        { criterionId: 'tn5-c1', code: 'TN.5', description: 'Chọn đáp án D', achieved: true, pointsAwarded: 0.5, maxPoints: 0.5, rationale: 'Chính xác' }
      ],
      annotations: [
        { id: 'ann-tn-5', type: 'score_badge', text: '(Đ)', pageIndex: 0, box: { x: 88, y: 22, width: 3, height: 3 }, severity: 'success' }
      ]
    },

    // Tự luận - Câu 1
    {
      questionId: 'tl-1a',
      questionNumber: 'Câu 1a',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '= 65 + 18 : 2 - 16\n= 65 + 9 - 16\n= 74 - 16\n= 58',
      mathReasoning: 'Các bước biến đổi hoàn toàn chính xác theo thứ tự thực hiện phép tính.',
      criteriaAssessments: [
        { criterionId: '1a-1', code: '1a.1', description: 'Tính lũy thừa 2^4=16 và chia 18:2=9', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Đúng các bước tính' },
        { criterionId: '1a-2', code: '1a.2', description: 'Cộng trừ đúng thứ tự, ra 58', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: 'Đáp số chính xác' }
      ],
      annotations: [
        { id: 'ann-1a', type: 'score_badge', text: '+0.625đ', pageIndex: 0, box: { x: 42, y: 62, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },
    {
      questionId: 'tl-1b',
      questionNumber: 'Câu 1b',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '= 54 . (38 + 62) - 400\n= 54 . 100 - 400\n= 5400 - 400\n= 5000',
      mathReasoning: 'Học sinh áp dụng tính chất phân phối một cách hợp lý và tính nhẩm chính xác.',
      criteriaAssessments: [
        { criterionId: '1b-1', code: '1b.1', description: 'Đặt thừa số chung 54 * (38 + 62)', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Phát hiện tính hợp lý' },
        { criterionId: '1b-2', code: '1b.2', description: 'Tính ra 5000', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: 'Tính toán chuẩn' }
      ],
      annotations: [
        { id: 'ann-1b', type: 'score_badge', text: '+0.625đ', pageIndex: 0, box: { x: 88, y: 64, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },
    {
      questionId: 'tl-1c',
      questionNumber: 'Câu 1c',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '= 160 : [58 - (42 - 8 . 2)]\n= 160 : [58 - (42 - 16)]\n= 160 : [58 - 26]\n= 160 : 32\n= 5',
      mathReasoning: 'Thực hiện đúng thứ tự ngoặc tròn trước, ngoặc vuông sau.',
      criteriaAssessments: [
        { criterionId: '1c-1', code: '1c.1', description: 'Tính trong ngoặc tròn', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Đúng 42 - 16 = 26' },
        { criterionId: '1c-2', code: '1c.2', description: 'Tính trong ngoặc vuông và chia', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: '160 : 32 = 5 đúng' }
      ],
      annotations: [
        { id: 'ann-1c', type: 'score_badge', text: '+0.625đ', pageIndex: 0, box: { x: 42, y: 84, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },
    {
      questionId: 'tl-1d',
      questionNumber: 'Câu 1d',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '= 320 : {180 - [75 + 5^2]}\n= 320 : {180 - [75 + 25]}\n= 320 : {180 - 100}\n= 320 : 80\n= 4',
      mathReasoning: 'Làm đúng lần lượt theo thứ tự () -> [] -> {}.',
      criteriaAssessments: [
        { criterionId: '1d-1', code: '1d.1', description: 'Ngoặc tròn và ngoặc vuông', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Tính 75 + 25 = 100 đúng' },
        { criterionId: '1d-2', code: '1d.2', description: 'Ngoặc nhọn và phép chia cuối', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: '320 : 80 = 4 đúng' }
      ],
      annotations: [
        { id: 'ann-1d', type: 'score_badge', text: '+0.625đ', pageIndex: 0, box: { x: 88, y: 84, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },

    // Tự luận - Câu 2
    {
      questionId: 'tl-2a',
      questionNumber: 'Câu 2a',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '3(x - 4) = 66 - 45\n3(x - 4) = 21\n(x - 4) = 21 : 3\n(x - 4) = 7\nx = 7 + 4\nx = 11',
      mathReasoning: 'Tìm thừa số và số bị trừ chuẩn xác.',
      criteriaAssessments: [
        { criterionId: '2a-1', code: '2a.1', description: 'Chuyển vế tìm 3(x - 4) = 21', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: 'Chính xác' },
        { criterionId: '2a-2', code: '2a.2', description: 'Tìm x = 11', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Chính xác' }
      ],
      annotations: [
        { id: 'ann-2a', type: 'score_badge', text: '+0.625đ', pageIndex: 1, box: { x: 42, y: 19, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },
    {
      questionId: 'tl-2b',
      questionNumber: 'Câu 2b',
      maxScore: 0.625,
      scoreAwarded: 0.0,
      status: 'wrong',
      studentTranscription: '150 - (x - 6) = 110\n(x - 6) = 150 - 110\n(x - 6) = 20\nx = 20 + 6\nx = 26',
      firstFlawedStep: 'Dòng 1: Học sinh tự ý bỏ cụm [60 - ...] thành 150 - (x - 6) = 110',
      mathReasoning: 'Học sinh sai ngay từ dòng 1 do bỏ ngoặc sai hoàn toàn quy tắc tìm số trừ (coi toàn bộ ngoặc là x - 6 thay vì 60 - (x - 6)). Dù đáp số vô tình trùng 26 nhưng toàn bộ lập luận biến đổi sai, không được công nhận điểm.',
      criteriaAssessments: [
        { criterionId: '2b-1', code: '2b.1', description: 'Tìm 60 - (x - 6) = 40', achieved: false, pointsAwarded: 0.0, maxPoints: 0.325, rationale: 'Sai quy tắc tìm số trừ ngay từ bước đầu' },
        { criterionId: '2b-2', code: '2b.2', description: 'Tìm tiếp x = 26', achieved: false, pointsAwarded: 0.0, maxPoints: 0.3, rationale: 'Bước trước sai hoàn toàn nên không tính điểm dây chuyền' }
      ],
      annotations: [
        {
          id: 'ann-2b-err',
          type: 'error_callout',
          text: 'Sai dòng 1: Chuyển vế\nbỏ ngoặc sai hoàn toàn\nquy tắc tìm số trừ (0đ)',
          pageIndex: 1,
          box: { x: 78, y: 14, width: 18, height: 5 },
          severity: 'danger'
        }
      ]
    },
    {
      questionId: 'tl-2c',
      questionNumber: 'Câu 2c',
      maxScore: 0.625,
      scoreAwarded: 0.3,
      status: 'partial',
      studentTranscription: '4 . 3^x = 101 + 7\n4 . 3^x = 108\n3^x = 27\nx = 27 : 3\nx = 9',
      firstFlawedStep: 'Dòng 4: x = 27 : 3 = 9',
      mathReasoning: 'Học sinh làm đúng 3 dòng đầu: chuyển vế tìm 4*3^x = 108 và 3^x = 27. Tuy nhiên ở dòng 4, học sinh lấy 27:3 = 9 là sai bản chất của số mũ. Cần viết 27 = 3^3 suy ra x = 3; không lấy lũy thừa chia cho cơ số.',
      criteriaAssessments: [
        { criterionId: '2c-1', code: '2c.1', description: 'Chuyển vế tính 4 * 3^x = 108', achieved: true, pointsAwarded: 0.15, maxPoints: 0.15, rationale: 'Đúng phép tính chuyển vế' },
        { criterionId: '2c-2', code: '2c.2', description: 'Tìm 3^x = 27', achieved: true, pointsAwarded: 0.15, maxPoints: 0.15, rationale: 'Đúng 108 : 4 = 27' },
        { criterionId: '2c-3', code: '2c.3', description: 'Đưa về cùng cơ số 3^x = 3^3 suy ra x = 3', achieved: false, pointsAwarded: 0.0, maxPoints: 0.325, rationale: 'Sai: lấy 27 : 3 = 9' }
      ],
      annotations: [
        {
          id: 'ann-2c-err',
          type: 'error_callout',
          text: 'Sai dòng 4: 3^x =\n27 thì x = 3, không\nphải x = 27:3 (+0.3đ)',
          pageIndex: 1,
          box: { x: 35, y: 34, width: 15, height: 5 },
          severity: 'danger'
        }
      ]
    },
    {
      questionId: 'tl-2d',
      questionNumber: 'Câu 2d',
      maxScore: 0.625,
      scoreAwarded: 0.625,
      status: 'correct',
      studentTranscription: '5(x + 4) = 38 + 32\n5(x + 4) = 70\n(x + 4) = 70 : 5\n(x + 4) = 14\nx = 14 - 4\nx = 10',
      mathReasoning: 'Các bước biến đổi tìm x logic và chính xác.',
      criteriaAssessments: [
        { criterionId: '2d-1', code: '2d.1', description: 'Tính vế phải và tìm 5(x+4)', achieved: true, pointsAwarded: 0.3, maxPoints: 0.3, rationale: 'Đúng' },
        { criterionId: '2d-2', code: '2d.2', description: 'Tìm x = 10', achieved: true, pointsAwarded: 0.325, maxPoints: 0.325, rationale: 'Đúng' }
      ],
      annotations: [
        { id: 'ann-2d', type: 'score_badge', text: '+0.625đ', pageIndex: 1, box: { x: 88, y: 37, width: 7, height: 3 }, points: 0.625, severity: 'success' }
      ]
    },

    // Tự luận - Câu 3
    {
      questionId: 'tl-3a',
      questionNumber: 'Câu 3a',
      maxScore: 1.25,
      scoreAwarded: 1.25,
      status: 'correct',
      studentTranscription: 'a. Biểu thức: 10000 . 6 + 4 . 5000 + 25000 - 15000',
      mathReasoning: 'Viết biểu thức hoàn toàn chính xác theo yêu cầu đề bài.',
      criteriaAssessments: [
        { criterionId: '3a-1', code: '3a.1', description: 'Biểu thức tiền mua hàng trước giảm', achieved: true, pointsAwarded: 0.75, maxPoints: 0.75, rationale: 'Đúng 10000*6 + 4*5000 + 25000' },
        { criterionId: '3a-2', code: '3a.2', description: 'Trừ đi khoản giảm giá 15000', achieved: true, pointsAwarded: 0.5, maxPoints: 0.5, rationale: 'Đúng' }
      ],
      annotations: [
        { id: 'ann-3a', type: 'score_badge', text: '+1.25đ', pageIndex: 1, box: { x: 89, y: 60, width: 6, height: 3 }, points: 1.25, severity: 'success' }
      ]
    },
    {
      questionId: 'tl-3b',
      questionNumber: 'Câu 3b',
      maxScore: 1.25,
      scoreAwarded: 1.0,
      status: 'partial',
      studentTranscription: 'b. Cúc phải trả số tiền cho nhà sách là:\n10000 . 6 + 4 . 5000 + 25000 - 15000 = 90000 (đồng)',
      firstFlawedStep: 'Thiếu câu lập luận so sánh 105 000đ >= 100 000đ để được hưởng giảm giá',
      mathReasoning: 'Học sinh tính đúng số tiền 90.000 đồng và có đơn vị, nhưng theo barem chấm quy định, học sinh thiếu bước lập luận điều kiện tổng tiền mua (105.000đ >= 100.000đ) để được giảm giá. Trừ 0.25đ theo tiêu chí 3b.1.',
      criteriaAssessments: [
        { criterionId: '3b-1', code: '3b.1', description: 'Lập luận điều kiện tổng tiền >= 100000đ', achieved: false, pointsAwarded: 0.0, maxPoints: 0.25, rationale: 'Thiếu lập luận điều kiện hưởng ưu đãi' },
        { criterionId: '3b-2', code: '3b.2', description: 'Tính đúng 90.000 đồng', achieved: true, pointsAwarded: 1.0, maxPoints: 1.0, rationale: 'Tính ra 90000 (đồng) chuẩn xác' }
      ],
      annotations: [
        {
          id: 'ann-3b-err',
          type: 'error_callout',
          text: 'Thiếu lập luận điều kiện tổng\ntiền >= 100000đ để được giảm\ngiá (+1.0đ)',
          pageIndex: 1,
          box: { x: 74, y: 67, width: 22, height: 5 },
          severity: 'danger'
        }
      ]
    }
  ]
};

// Dữ liệu danh sách lớp để chấm hàng loạt & kiểm tra các tình huống bắt buộc
export const CLASS_SUBMISSIONS_DEMO: StudentSubmission[] = [
  SAMPLE_CAO_TAI_SUBMISSION,
  {
    id: 'sub-tran-bao-103',
    studentName: 'Trần Quốc Bảo',
    studentCode: 'HS-6A1-02',
    examCode: '103',
    gradeLevel: '6',
    className: '6A1',
    pages: [{ pageNumber: 1, imageUrl: '', rotation: 0, isConfirmed: true }],
    pageConfirmedByTeacher: true,
    status: 'needs_review', // Tình huống D: Chữ viết không rõ
    rawTotalScore: 7.25,
    roundedTotalScore: 7.3,
    reviewFlags: ['Câu 1a: Không phân biệt được học sinh viết 2² hay 2³ ở dòng 1', 'Cần giáo viên xác nhận trước khi chốt điểm'],
    approvedByTeacher: false,
    generalFeedback: {
      strengths: 'Trình bày sạch sẽ, biết làm hầu hết các câu.',
      weaknesses: 'Nét chữ mũ số ở câu 1a chưa rõ nét giữa mũ 2 và mũ 3.',
      recommendations: 'Rèn luyện viết số mũ rõ ràng, tránh mất điểm đáng tiếc.',
      combinedNote: 'Bài làm tốt nhưng cần viết số mũ rõ ràng hơn.'
    },
    history: [{ timestamp: '2026-09-28 09:45', action: 'Phát hiện ký hiệu không rõ ràng, chuyển trạng thái Cần kiểm tra' }],
    ocrData: [
      {
        questionId: 'tl-1a',
        questionNumber: 'Câu 1a',
        pageIndex: 0,
        rawRecognizedText: '= 65 + 18 : 2 - 2[?]\n= 65 + 9 - 8\n= 66',
        detectedZone: { x: 5, y: 55, width: 42, height: 16 },
        hasAmbiguity: true,
        ambiguities: [
          {
            id: 'amb-1',
            questionId: 'tl-1a',
            locationText: 'Dòng 1: Số mũ của 2^?',
            possibleMeanings: ['2³ (đúng theo đề là 2⁴)', '2²'],
            confidence: 0.45,
            resolved: false,
            box: { x: 30, y: 56, width: 6, height: 3 },
            pageIndex: 0
          }
        ],
        isTeacherVerified: false
      }
    ],
    questionGrades: []
  },
  {
    id: 'sub-nguyen-mai-103',
    studentName: 'Nguyễn Thị Phương Mai',
    studentCode: 'HS-6A1-14',
    examCode: '103',
    gradeLevel: '6',
    className: '6A1',
    pages: [{ pageNumber: 1, imageUrl: '', rotation: 0, isConfirmed: true }],
    pageConfirmedByTeacher: true,
    status: 'pending_approval', // Tình huống E: Cách giải khác hợp lệ
    rawTotalScore: 9.5,
    roundedTotalScore: 9.5,
    reviewFlags: [],
    approvedByTeacher: false,
    generalFeedback: {
      strengths: 'Tư duy toán học rất tốt, biết vận dụng phương pháp giải khác linh hoạt ở Câu 1b.',
      weaknesses: 'Không có lỗi sai cơ bản.',
      recommendations: 'Tiếp tục phát huy năng lực tư duy sáng tạo.',
      combinedNote: 'Bài làm xuất sắc! Em có cách nhóm thông minh và giải quyết bài toán nhanh chóng.'
    },
    history: [{ timestamp: '2026-09-28 09:50', action: 'AI nhận diện cách giải khác hợp lệ, chờ giáo viên duyệt' }],
    ocrData: [],
    questionGrades: []
  },
  {
    id: 'sub-vu-trang-103',
    studentName: 'Vũ Thu Trang',
    studentCode: 'HS-6A1-25',
    examCode: '103',
    gradeLevel: '6',
    className: '6A1',
    pages: [{ pageNumber: 1, imageUrl: '', rotation: 0, isConfirmed: true }],
    pageConfirmedByTeacher: true,
    status: 'not_graded',
    rawTotalScore: 0,
    roundedTotalScore: 0,
    reviewFlags: [],
    approvedByTeacher: false,
    generalFeedback: { strengths: '', weaknesses: '', recommendations: '', combinedNote: '' },
    history: [],
    ocrData: [],
    questionGrades: []
  },
  {
    id: 'sub-hoang-khoi-103',
    studentName: 'Hoàng Minh Khôi',
    studentCode: 'HS-6A1-11',
    examCode: '103',
    gradeLevel: '6',
    className: '6A1',
    pages: [{ pageNumber: 1, imageUrl: '', rotation: 0, isConfirmed: true }],
    pageConfirmedByTeacher: true,
    status: 'not_graded',
    rawTotalScore: 0,
    roundedTotalScore: 0,
    reviewFlags: [],
    approvedByTeacher: false,
    generalFeedback: { strengths: '', weaknesses: '', recommendations: '', combinedNote: '' },
    history: [],
    ocrData: [],
    questionGrades: []
  }
];
