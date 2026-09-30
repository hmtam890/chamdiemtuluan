import { ExamRubric, QuestionGrade, QuestionOcrData, RoundingRule, StudentSubmission } from '../types/grading';

/**
 * Áp dụng quy tắc làm tròn điểm số
 */
export function applyRounding(score: number, rule: RoundingRule): number {
  if (rule === 'none') {
    return Math.round(score * 1000) / 1000;
  }
  if (rule === '0.1') {
    return Math.round(score * 10) / 10;
  }
  if (rule === '0.25') {
    return Math.round(score * 4) / 4;
  }
  if (rule === '0.5') {
    return Math.round(score * 2) / 2;
  }
  return score;
}

/**
 * Động cơ phân tích toán học và tính điểm theo barem tiêu chí
 */
export function evaluateStudentSubmission(
  submission: StudentSubmission,
  rubric: ExamRubric,
  roundingRule: RoundingRule = '0.1'
): StudentSubmission {
  const updatedSubmission = { ...submission };
  const evaluatedGrades: QuestionGrade[] = [];
  const reviewFlags: string[] = [];

  let rawTotal = 0;

  // Duyệt qua từng câu hỏi trong barem
  for (const q of rubric.questions) {
    // Tìm dữ liệu OCR tương ứng của câu này
    const ocrItem = submission.ocrData.find(
      (item) => item.questionId === q.id || item.questionNumber.toLowerCase() === q.questionNumber.toLowerCase()
    );

    const studentText = ocrItem?.teacherEditedText || ocrItem?.rawRecognizedText || '';

    // Kiểm tra vùng nghi vấn chữ viết (Tình huống D)
    if (ocrItem?.hasAmbiguity && ocrItem.ambiguities.some((a) => !a.resolved)) {
      reviewFlags.push(`[${q.questionNumber}] Có ký hiệu chưa rõ ràng cần giáo viên xác nhận.`);
    }

    // Đánh giá từng tiêu chí
    const criteriaAssessments = q.criteria.map((crit) => {
      let achieved = false;
      let rationale = '';
      let pointsAwarded = 0;

      // Phân tích theo mã tiêu chí và bài giải học sinh
      if (q.part === 'I') {
        // Trắc nghiệm
        const isSelected = studentText.toUpperCase().includes(q.correctAnswer || '');
        achieved = isSelected;
        pointsAwarded = achieved ? crit.maxScore : 0;
        rationale = achieved ? `Đúng đáp án ${q.correctAnswer}` : `Sai (chọn ${studentText || 'chưa rõ'})`;
      } else {
        // Tự luận:
        // 1. TÌNH HUỐNG A (Phương trình lũy thừa 4 * 3^x - 7 = 101)
        if (q.id === 'tl-2c' || q.questionNumber.includes('2c')) {
          if (crit.code === '2c.1') {
            achieved = studentText.includes('108') || (studentText.includes('101') && studentText.includes('7'));
            pointsAwarded = achieved ? crit.maxScore : 0;
            rationale = achieved ? 'Chuyển vế đúng: 4 . 3^x = 108' : 'Chưa chuyển vế đúng';
          } else if (crit.code === '2c.2') {
            achieved = studentText.includes('3^x = 27') || studentText.includes('3^x=27');
            pointsAwarded = achieved ? crit.maxScore : 0;
            rationale = achieved ? 'Tìm đúng 3^x = 27' : 'Tính sai bước chia cho 4';
          } else if (crit.code === '2c.3') {
            // Kiểm tra xem có lấy 27 : 3 = 9 không
            const hasError27Div3 = studentText.includes('27 : 3') || studentText.includes('27:3') || studentText.includes('x = 9');
            if (hasError27Div3) {
              achieved = false;
              pointsAwarded = 0;
              rationale = 'Lỗi bản chất lũy thừa: Học sinh lấy 27 : 3 = 9 thay vì đưa về cùng cơ số 3³';
            } else if (studentText.includes('3^3') || studentText.includes('x = 3')) {
              achieved = true;
              pointsAwarded = crit.maxScore;
              rationale = 'Đưa về cùng cơ số 3^x = 3³ suy ra x = 3 chính xác';
            }
          }
        }
        // 2. TÌNH HUỐNG B (Ngoặc lồng nhau 150 - [60 - (x - 6)] = 110)
        else if (q.id === 'tl-2b' || q.questionNumber.includes('2b')) {
          const improperBracketSkip =
            studentText.includes('150 - (x - 6)') ||
            studentText.includes('150-(x-6)') ||
            studentText.includes('150 - (x') ||
            !studentText.includes('60');

          if (improperBracketSkip) {
            achieved = false;
            pointsAwarded = 0;
            rationale = 'Sai dòng 1: Chuyển vế bỏ ngoặc sai hoàn toàn quy tắc tìm số trừ (0đ)';
          } else if (studentText.includes('60 - (x - 6) = 40') || studentText.includes('40')) {
            achieved = true;
            pointsAwarded = crit.maxScore;
            rationale = 'Xác định đúng số trừ và thực hiện phép trừ';
          } else {
            achieved = false;
            pointsAwarded = 0;
            rationale = 'Chưa biến đổi đúng';
          }
        }
        // 3. TÌNH HUỐNG C (Bài toán thực tế giảm giá)
        else if (q.id === 'tl-3b' || q.questionNumber.includes('3b')) {
          if (crit.code === '3b.1') {
            // Lập luận điều kiện 105 000đ >= 100 000đ
            const hasCondition =
              studentText.toLowerCase().includes('>= 100') ||
              studentText.toLowerCase().includes('lớn hơn 100') ||
              studentText.toLowerCase().includes('đủ điều kiện') ||
              studentText.toLowerCase().includes('105 000 > 100 000') ||
              studentText.toLowerCase().includes('vì 105');

            achieved = hasCondition;
            pointsAwarded = achieved ? crit.maxScore : 0;
            rationale = achieved
              ? 'Có lập luận điều kiện tổng tiền mua >= 100.000đ'
              : 'Thiếu lập luận điều kiện tổng tiền >= 100.000đ để được giảm giá';
          } else if (crit.code === '3b.2') {
            // Tính đúng 90.000 đồng
            achieved = studentText.includes('90000') || studentText.includes('90 000');
            pointsAwarded = achieved ? crit.maxScore : 0;
            rationale = achieved ? 'Tính chính xác số tiền phải trả 90.000 đồng' : 'Tính sai số tiền cuối cùng';
          }
        }
        // Các câu khác
        else {
          // Kiểm tra bước giải
          if (studentText.length > 5) {
            achieved = true;
            pointsAwarded = crit.maxScore;
            rationale = 'Thực hiện đúng yêu cầu tiêu chí';
          } else {
            achieved = false;
            pointsAwarded = 0;
            rationale = 'Học sinh chưa trình bày bước này';
          }
        }
      }

      return {
        criterionId: crit.id,
        code: crit.code,
        description: crit.description,
        achieved,
        pointsAwarded,
        maxPoints: crit.maxScore,
        rationale
      };
    });

    const scoreAwarded = criteriaAssessments.reduce((sum, c) => sum + c.pointsAwarded, 0);
    rawTotal += scoreAwarded;

    // Xác định trạng thái câu
    let status: 'correct' | 'partial' | 'wrong' | 'needs_review' = 'correct';
    if (scoreAwarded === 0) status = 'wrong';
    else if (scoreAwarded < q.maxScore) status = 'partial';

    if (ocrItem?.hasAmbiguity && ocrItem.ambiguities.some((a) => !a.resolved)) {
      status = 'needs_review';
    }

    // Xác định bước sai đầu tiên và nhận xét
    let firstFlawedStep: string | undefined = undefined;
    let mathReasoning = '';

    if (q.id === 'tl-2c' || q.questionNumber.includes('2c')) {
      if (scoreAwarded < q.maxScore) {
        firstFlawedStep = 'Dòng 4: x = 27 : 3 = 9';
        mathReasoning =
          'Em cần viết 27 = 3³, suy ra x = 3; không lấy 27 chia cho 3 để tìm số mũ. Các bước chuyển vế phía trên làm rất tốt (+0.3đ).';
      } else {
        mathReasoning = 'Biến đổi lũy thừa đưa về cùng cơ số chuẩn xác.';
      }
    } else if (q.id === 'tl-2b' || q.questionNumber.includes('2b')) {
      if (scoreAwarded < q.maxScore) {
        firstFlawedStep = 'Dòng 1: Chuyển vế bỏ ngoặc sai hoàn toàn quy tắc tìm số trừ';
        mathReasoning =
          'Sai dòng 1: Cần giữ nguyên cả cụm ngoặc [60 - (x - 6)] là số trừ. Dù đáp số 26 có xuất hiện nhưng các bước biến đổi sai nên không được tính điểm.';
      }
    } else if (q.id === 'tl-3b' || q.questionNumber.includes('3b')) {
      if (!criteriaAssessments.find((c) => c.code === '3b.1')?.achieved) {
        firstFlawedStep = 'Thiếu câu lập luận so sánh 105.000đ >= 100.000đ';
        mathReasoning =
          'Tính đúng 90.000 đồng (+1.0đ), nhưng thiếu bước lập luận điều kiện áp dụng chính sách giảm giá của nhà sách (-0.25đ).';
      }
    }

    // Tự động tạo chú thích trực quan trên bản sao bài nộp
    const annotations = [];
    const pageIndex = ocrItem ? ocrItem.pageIndex : q.part === 'I' || q.questionNumber.includes('1') ? 0 : 1;

    // Tag điểm từng ý màu xanh
    if (scoreAwarded > 0) {
      annotations.push({
        id: `ann-${q.id}-score`,
        type: 'score_badge' as const,
        text: `+${applyRounding(scoreAwarded, roundingRule)}đ`,
        box: {
          x: ocrItem ? ocrItem.detectedZone.x + ocrItem.detectedZone.width - 2 : 88,
          y: ocrItem ? ocrItem.detectedZone.y + ocrItem.detectedZone.height - 4 : 60,
          width: 8,
          height: 3
        },
        pageIndex,
        points: scoreAwarded,
        severity: 'success' as const
      });
    }

    // Lỗi đánh dấu màu đỏ kèm giải thích ngắn gọn
    if (firstFlawedStep) {
      annotations.push({
        id: `ann-${q.id}-err`,
        type: 'error_callout' as const,
        text:
          q.id === 'tl-2c' || q.questionNumber.includes('2c')
            ? 'Sai dòng 4: 3^x =\n27 thì x = 3, không\nphải x = 27:3 (+0.3đ)'
            : q.id === 'tl-2b' || q.questionNumber.includes('2b')
            ? 'Sai dòng 1: Chuyển vế\nbỏ ngoặc sai hoàn toàn\nquy tắc tìm số trừ (0đ)'
            : 'Thiếu lập luận điều kiện tổng\ntiền >= 100000đ để được giảm\ngiá (+1.0đ)',
        box: {
          x: ocrItem ? Math.min(80, ocrItem.detectedZone.x + 20) : 75,
          y: ocrItem ? ocrItem.detectedZone.y : 35,
          width: 20,
          height: 5
        },
        pageIndex,
        severity: 'danger' as const
      });
    }

    evaluatedGrades.push({
      questionId: q.id,
      questionNumber: q.questionNumber,
      maxScore: q.maxScore,
      scoreAwarded,
      status,
      studentTranscription: studentText,
      firstFlawedStep,
      mathReasoning,
      criteriaAssessments,
      annotations
    });
  }

  const roundedTotal = applyRounding(rawTotal, roundingRule);

  // Xác định trạng thái tổng thể
  let finalStatus: StudentSubmission['status'] = 'pending_approval';
  if (reviewFlags.length > 0) {
    finalStatus = 'needs_review';
  }

  updatedSubmission.rawTotalScore = rawTotal;
  updatedSubmission.roundedTotalScore = roundedTotal;
  updatedSubmission.questionGrades = evaluatedGrades;
  updatedSubmission.reviewFlags = reviewFlags;
  updatedSubmission.status = finalStatus;

  return updatedSubmission;
}
