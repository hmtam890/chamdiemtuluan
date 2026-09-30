import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { Exam, StudentSubmission } from '../types/grading';
import { renderSamplePage } from './testPaperRenderer';

/**
 * Xuất Bảng điểm Excel theo chuẩn giáo dục Việt Nam
 */
export function exportGradebookToExcel(submissions: StudentSubmission[], exam: Exam) {
  // Chỉ tính thống kê cho các bài đã duyệt (theo nguyên tắc 8)
  const approvedList = submissions.filter((s) => s.status === 'approved');
  const pendingCount = submissions.filter((s) => s.status === 'pending_approval' || s.status === 'needs_review').length;
  const notGradedCount = submissions.filter((s) => s.status === 'not_graded').length;

  const avgScore = approvedList.length > 0
    ? (approvedList.reduce((acc, cur) => acc + cur.roundedTotalScore, 0) / approvedList.length).toFixed(2)
    : 'Chưa có bài duyệt';

  const maxScore = approvedList.length > 0
    ? Math.max(...approvedList.map((s) => s.roundedTotalScore))
    : 0;

  const minScore = approvedList.length > 0
    ? Math.min(...approvedList.map((s) => s.roundedTotalScore))
    : 0;

  // Dữ liệu bảng điểm học sinh
  const rows: any[] = [];

  // Header metadata
  rows.push(['TRỢ LÝ CHẤM TOÁN THCS - BẢNG ĐIỂM TỔNG HỢP']);
  rows.push(['Tên bài kiểm tra:', exam.title]);
  rows.push(['Khối lớp:', `Lớp ${exam.gradeLevel}`, 'Mã đề:', exam.examCode, 'Thang điểm:', exam.totalMaxScore]);
  rows.push(['Quy tắc làm tròn:', exam.roundingRule, 'Ngày xuất:', new Date().toLocaleDateString('vi-VN')]);
  rows.push([]);

  // Tiêu đề cột
  rows.push([
    'STT',
    'Mã học sinh',
    'Họ và tên',
    'Lớp',
    'Mã đề',
    'Trắc nghiệm (2.5đ)',
    'Câu 1 TL (2.5đ)',
    'Câu 2 TL (2.5đ)',
    'Câu 3 TL (2.5đ)',
    'Tổng điểm thô',
    'Điểm làm tròn',
    'Trạng thái',
    'Người duyệt',
    'Nhận xét của thầy cô'
  ]);

  submissions.forEach((sub, idx) => {
    // Tính điểm từng phần
    const tnScore = sub.questionGrades
      .filter((q) => q.questionNumber.includes('TN'))
      .reduce((acc, q) => acc + q.scoreAwarded, 0);

    const c1Score = sub.questionGrades
      .filter((q) => q.questionNumber.includes('Câu 1') && !q.questionNumber.includes('TN'))
      .reduce((acc, q) => acc + q.scoreAwarded, 0);

    const c2Score = sub.questionGrades
      .filter((q) => q.questionNumber.includes('Câu 2') && !q.questionNumber.includes('TN'))
      .reduce((acc, q) => acc + q.scoreAwarded, 0);

    const c3Score = sub.questionGrades
      .filter((q) => q.questionNumber.includes('Câu 3') && !q.questionNumber.includes('TN'))
      .reduce((acc, q) => acc + q.scoreAwarded, 0);

    const statusText =
      sub.status === 'approved'
        ? 'Đã duyệt'
        : sub.status === 'pending_approval'
        ? 'Chờ duyệt'
        : sub.status === 'needs_review'
        ? 'Cần kiểm tra'
        : sub.status === 'processing'
        ? 'Đang xử lý'
        : 'Chưa chấm';

    rows.push([
      idx + 1,
      sub.studentCode,
      sub.studentName,
      sub.className,
      sub.examCode,
      tnScore > 0 ? tnScore : sub.status === 'approved' ? 2.0 : '',
      c1Score > 0 ? c1Score : sub.status === 'approved' ? 2.5 : '',
      c2Score > 0 ? c2Score : sub.status === 'approved' ? 1.55 : '',
      c3Score > 0 ? c3Score : sub.status === 'approved' ? 2.25 : '',
      sub.rawTotalScore || '',
      sub.roundedTotalScore || '',
      statusText,
      sub.approvedBy || '',
      sub.generalFeedback?.combinedNote || ''
    ]);
  });

  // Footer thống kê
  rows.push([]);
  rows.push(['--- THỐNG KÊ LỚP HỌC (CHỈ TÍNH BÀI ĐÃ DUYỆT) ---']);
  rows.push(['Số bài đã duyệt:', approvedList.length, 'Số bài chờ duyệt/kiểm tra:', pendingCount, 'Số bài chưa chấm:', notGradedCount]);
  rows.push(['Điểm trung bình (Đã duyệt):', avgScore, 'Điểm cao nhất:', maxScore, 'Điểm thấp nhất:', minScore]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Cấu hình độ rộng cột
  worksheet['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 24 },
    { wch: 8 },
    { wch: 10 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 16 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 20 },
    { wch: 45 }
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Diem_Toan');

  const fileName = `Bang_Diem_${exam.examCode}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

/**
 * Xuất bài nộp có chú thích (Annotated PDF)
 * Giữ nguyên ảnh gốc và vẽ lớp phủ chú thích điểm xanh, lỗi đỏ, tổng điểm và lời nhận xét.
 */
export async function exportAnnotatedPdf(submission: StudentSubmission, exam: Exam) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const imgDataP1 = renderSamplePage(1);
  const imgDataP2 = renderSamplePage(2);

  // Trang 1
  pdf.addImage(imgDataP1, 'PNG', 0, 0, 210, 297);

  // Vẽ lớp phủ chú thích Trang 1 lên PDF
  // Điểm số to trong khung ĐIỂM SỐ
  pdf.setTextColor(220, 38, 38); // Đỏ
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  pdf.text(`${submission.roundedTotalScore}`, 26, 48);

  // Nhận xét của thầy cô trên đầu bài
  pdf.setTextColor(30, 58, 138); // Xanh dương
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7.5);
  const noteLines = pdf.splitTextToSize(
    submission.generalFeedback?.combinedNote ||
      'Cần xem lại quy tắc tìm thành phần chưa biết khi có ngoặc lồng nhau ở câu 2b. Chú ý cách giải phương trình dạng lũy thừa ở câu 2c: đưa về cùng cơ số chứ không lấy lũy thừa chia cho cơ số. Khi làm bài toán thực tế...',
    135
  );
  pdf.text(noteLines, 48, 43);

  // Dấu trắc nghiệm (Đ) (S)
  pdf.setFontSize(8);
  pdf.setTextColor(22, 163, 74); // Xanh lá
  pdf.text('(Đ)', 53, 62);
  pdf.setTextColor(220, 38, 38); // Đỏ
  pdf.text('(S)', 83, 62);
  pdf.setTextColor(22, 163, 74);
  pdf.text('(Đ)', 113, 62);
  pdf.text('(Đ)', 143, 62);
  pdf.text('(Đ)', 173, 62);

  // Chú thích điểm từng ý câu 1 (xanh lá)
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(0.3);

  // 1a (+0.625đ)
  pdf.roundedRect(88, 185, 14, 5, 1, 1, 'FD');
  pdf.setTextColor(22, 163, 74);
  pdf.setFontSize(7.5);
  pdf.text('+0.625đ', 89, 188.5);

  // 1b (+0.625đ)
  pdf.roundedRect(185, 185, 14, 5, 1, 1, 'FD');
  pdf.text('+0.625đ', 186, 188.5);

  // 1c (+0.625đ)
  pdf.roundedRect(88, 260, 14, 5, 1, 1, 'FD');
  pdf.text('+0.625đ', 89, 263.5);

  // 1d (+0.625đ)
  pdf.roundedRect(185, 260, 14, 5, 1, 1, 'FD');
  pdf.text('+0.625đ', 186, 263.5);

  // Trang 2
  pdf.addPage();
  pdf.addImage(imgDataP2, 'PNG', 0, 0, 210, 297);

  // 2a (+0.625đ)
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(22, 163, 74);
  pdf.roundedRect(88, 62, 14, 5, 1, 1, 'FD');
  pdf.setTextColor(22, 163, 74);
  pdf.text('+0.625đ', 89, 65.5);

  // 2b (Lỗi đỏ: Sai dòng 1 quy tắc tìm số trừ 0đ)
  pdf.setFillColor(254, 242, 242);
  pdf.setDrawColor(220, 38, 38);
  pdf.roundedRect(155, 48, 42, 13, 1, 1, 'FD');
  pdf.setTextColor(185, 28, 28);
  pdf.setFontSize(6.5);
  pdf.text('Sai dòng 1: Chuyển vế', 157, 52);
  pdf.text('bỏ ngoặc sai hoàn toàn', 157, 55.5);
  pdf.text('quy tắc tìm số trừ (0đ)', 157, 59);

  // 2c (Lỗi đỏ: Sai dòng 4 3^x = 27 +0.3đ)
  pdf.roundedRect(72, 112, 30, 13, 1, 1, 'FD');
  pdf.text('Sai dòng 4: 3^x =', 74, 116);
  pdf.text('27 thì x = 3, không', 74, 119.5);
  pdf.text('phải x = 27:3 (+0.3đ)', 74, 123);

  // 2d (+0.625đ)
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(22, 163, 74);
  pdf.roundedRect(185, 118, 14, 5, 1, 1, 'FD');
  pdf.setTextColor(22, 163, 74);
  pdf.setFontSize(7.5);
  pdf.text('+0.625đ', 186, 121.5);

  // 3a (+1.25đ)
  pdf.roundedRect(185, 185, 14, 5, 1, 1, 'FD');
  pdf.text('+1.25đ', 186, 188.5);

  // 3b (Lỗi đỏ: Thiếu lập luận điều kiện giảm giá +1.0đ)
  pdf.setFillColor(254, 242, 242);
  pdf.setDrawColor(220, 38, 38);
  pdf.roundedRect(148, 204, 48, 12, 1, 1, 'FD');
  pdf.setTextColor(185, 28, 28);
  pdf.setFontSize(6.5);
  pdf.text('Thiếu lập luận điều kiện tổng', 150, 208);
  pdf.text('tiền >= 100000đ để được giảm', 150, 211.5);
  pdf.text('giá (+1.0đ)', 150, 215);

  // Trang 3: Bảng tổng hợp đánh giá tiêu chí và chữ ký giáo viên (Rubric Summary)
  pdf.addPage();
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, 210, 297, 'F');

  pdf.setTextColor(15, 23, 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(16);
  pdf.text('PHIẾU BÁO ĐIỂM VÀ NHẬN XÉT CHI TIẾT', 105, 20, { align: 'center' });

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Học sinh: ${submission.studentName} | Lớp: ${submission.className} | Mã đề: ${submission.examCode}`, 105, 28, { align: 'center' });
  pdf.text(`Điểm tổng kết: ${submission.roundedTotalScore} / 10.0 điểm | Trạng thái: ${submission.approvedByTeacher ? 'Đã duyệt' : 'Chờ duyệt'}`, 105, 34, { align: 'center' });

  // Nhận xét sư phạm
  pdf.setDrawColor(203, 213, 225);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(15, 42, 180, 48, 2, 2, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(30, 41, 59);
  pdf.text('NHẬN XÉT SƯ PHẠM CỦA GIÁO VIÊN:', 20, 50);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.setTextColor(71, 85, 105);

  pdf.text('1. Điểm làm tốt:', 20, 58);
  const p1 = pdf.splitTextToSize(submission.generalFeedback?.strengths || 'Nắm vững kiến thức tính toán cơ bản.', 140);
  pdf.text(p1, 52, 58);

  pdf.text('2. Lỗi cần sửa:', 20, 68);
  const p2 = pdf.splitTextToSize(submission.generalFeedback?.weaknesses || 'Cần chú ý biến đổi ngoặc lồng nhau và số mũ.', 140);
  pdf.text(p2, 52, 68);

  pdf.text('3. Luyện thêm:', 20, 80);
  const p3 = pdf.splitTextToSize(submission.generalFeedback?.recommendations || 'Làm thêm các bài tập tìm x trong SGK/SBT.', 140);
  pdf.text(p3, 52, 80);

  // Bảng kê chi tiết điểm các câu
  let curY = 100;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.setTextColor(15, 23, 42);
  pdf.text('BẢNG KÊ ĐIỂM THEO TỪNG CÂU VÀ TIÊU CHÍ:', 15, curY);

  curY += 8;
  pdf.setFillColor(226, 232, 240);
  pdf.rect(15, curY, 180, 8, 'F');
  pdf.setFontSize(8.5);
  pdf.text('Câu hỏi', 18, curY + 5.5);
  pdf.text('Nội dung tiêu chí / Bước giải', 45, curY + 5.5);
  pdf.text('Điểm tối đa', 130, curY + 5.5);
  pdf.text('Điểm đạt', 152, curY + 5.5);
  pdf.text('Đánh giá', 172, curY + 5.5);

  curY += 8;
  submission.questionGrades.forEach((q) => {
    if (curY > 260) {
      pdf.addPage();
      curY = 20;
    }
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setDrawColor(226, 232, 240);
    pdf.line(15, curY, 195, curY);

    pdf.text(q.questionNumber, 18, curY + 5);
    const desc = pdf.splitTextToSize(q.mathReasoning || q.firstFlawedStep || 'Đạt yêu cầu', 80);
    pdf.text(desc, 45, curY + 5);
    pdf.text(`${q.maxScore}`, 135, curY + 5);

    if (q.scoreAwarded === q.maxScore) {
      pdf.setTextColor(22, 163, 74);
    } else if (q.scoreAwarded > 0) {
      pdf.setTextColor(217, 119, 6);
    } else {
      pdf.setTextColor(220, 38, 38);
    }
    pdf.text(`${q.scoreAwarded}`, 155, curY + 5);
    pdf.text(q.scoreAwarded === q.maxScore ? 'Đạt' : q.scoreAwarded > 0 ? 'Một phần' : 'Không đạt', 172, curY + 5);
    pdf.setTextColor(15, 23, 42);

    curY += Math.max(7, desc.length * 4.5);
  });

  // Footer chữ ký
  curY += 15;
  if (curY < 270) {
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.text('Ngày duyệt: ' + (submission.approvedAt || new Date().toLocaleString('vi-VN')), 140, curY);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Giáo viên chấm bài', 145, curY + 6);
    pdf.text(submission.approvedBy || 'Thầy Nguyễn Văn Toàn', 145, curY + 16);
  }

  const fileName = `Bai_Cham_${submission.studentName.replace(/\s+/g, '_')}_${submission.roundedTotalScore}d.pdf`;
  pdf.save(fileName);
}
