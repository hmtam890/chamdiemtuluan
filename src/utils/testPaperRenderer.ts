/**
 * Vẽ bài làm của học sinh (như mẫu CAO_TAI_8.1.pdf)
 * Hỗ trợ tạo ảnh mô phỏng có lưới ô li, đề in sẵn và chữ viết tay học sinh.
 */

export function renderSamplePage(pageNumber: 1 | 2): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1700;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background trắng giấy thi hơi ấm nhẹ tự nhiên
  ctx.fillStyle = '#faf8f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Helper vẽ lưới chấm ô li mờ ở vùng bài làm
  const drawDottedGrid = (x: number, y: number, w: number, h: number) => {
    ctx.save();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);
    for (let curY = y + 25; curY < y + h; curY += 25) {
      ctx.beginPath();
      ctx.moveTo(x + 10, curY);
      ctx.lineTo(x + w - 10, curY);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Header chung
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1.5;

  if (pageNumber === 1) {
    // Outer border header
    ctx.strokeRect(40, 40, 1120, 100);
    ctx.beginPath();
    ctx.moveTo(850, 40);
    ctx.lineTo(850, 140);
    ctx.stroke();

    ctx.font = 'bold 22px "Times New Roman", serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('PHIẾU KIỂM TRA ĐỊNH KỲ TOÁN 6 - TUẦN 04 - BUỔI 01', 60, 75);
    ctx.font = 'italic 18px "Times New Roman", serif';
    ctx.fillText('Chủ đề: Thứ tự thực hiện các phép tính', 60, 110);

    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillText('Mã đề: 103 - Trang 1/2', 870, 75);
    ctx.font = 'italic 17px "Times New Roman", serif';
    ctx.fillText('Thời gian: 45 phút', 870, 110);

    // Họ tên học sinh
    ctx.font = '19px "Times New Roman", serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('Họ và tên học sinh:', 50, 180);
    ctx.beginPath();
    ctx.moveTo(210, 185);
    ctx.lineTo(750, 185);
    ctx.stroke();

    // Chữ viết tay tên học sinh
    ctx.font = 'italic bold 28px "Caveat", "Brush Script MT", "Times New Roman", cursive';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('Lê Cao Tài', 260, 180);

    ctx.font = '19px "Times New Roman", serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('Mã HS:', 800, 180);
    ctx.beginPath();
    ctx.moveTo(870, 185);
    ctx.lineTo(1150, 185);
    ctx.stroke();

    // Khung Điểm số & Lời nhận xét của thầy cô
    ctx.strokeRect(50, 205, 1100, 105);
    ctx.beginPath();
    ctx.moveTo(250, 205);
    ctx.lineTo(250, 310);
    ctx.stroke();

    ctx.font = 'bold 17px "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.fillText('ĐIỂM SỐ', 150, 230);
    ctx.fillText('LỜI NHẬN XÉT CỦA THẦY CÔ', 675, 230);
    ctx.textAlign = 'left';

    // Bảng điền đáp án trắc nghiệm
    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillText('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM (Mỗi câu đúng 0,5 điểm):', 50, 345);

    // Table trắc nghiệm
    const tX = 50, tY = 360, tW = 1100, tH = 75;
    ctx.strokeRect(tX, tY, tW, tH);
    ctx.beginPath();
    ctx.moveTo(tX, tY + 38);
    ctx.lineTo(tX + tW, tY + 38);
    ctx.stroke();

    const colW = tW / 6;
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(tX + i * colW, tY);
      ctx.lineTo(tX + i * colW, tY + tH);
      ctx.stroke();
    }

    ctx.font = 'bold 17px "Times New Roman", serif';
    ctx.fillText('Câu', tX + 60, tY + 25);
    ctx.fillText('Đáp án', tX + 50, tY + 63);

    for (let i = 1; i <= 5; i++) {
      ctx.fillText(i.toString(), tX + i * colW + 80, tY + 25);
    }

    // Chữ điền trắc nghiệm của học sinh
    ctx.font = 'italic bold 28px "Times New Roman", cursive';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('D', tX + 1 * colW + 80, tY + 65);
    ctx.fillText('B', tX + 2 * colW + 80, tY + 65);
    ctx.fillText('B', tX + 3 * colW + 80, tY + 65);
    ctx.fillText('C', tX + 4 * colW + 80, tY + 65);
    ctx.fillText('D', tX + 5 * colW + 80, tY + 65);

    // Đề Phần I Trắc nghiệm
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillText('PHẦN I. TRẮC NGHIỆM KHÁCH QUAN (2,5 điểm)', 50, 470);

    ctx.font = '16px "Times New Roman", serif';
    ctx.fillText('Câu 1. Khi thực hiện phép tính trong biểu thức không có dấu ngoặc, thứ tự nào sau đây là đúng?', 50, 500);
    ctx.fillText('A. Nhân, chia -> Cộng, trừ -> Lũy thừa          B. Cộng, trừ -> Nhân, chia -> Lũy thừa', 70, 525);
    ctx.fillText('C. Lũy thừa -> Cộng, trừ -> Nhân, chia          D. Lũy thừa -> Nhân, chia -> Cộng, trừ', 70, 550);

    ctx.fillText('Câu 2. Dấu ngoặc nào được thực hiện cuối cùng trong biểu thức có nhiều loại ngoặc?', 50, 585);
    ctx.fillText('A. {}               B. ()               C. []               D. Tùy ý thứ tự', 70, 610);

    ctx.fillText('Câu 3. Kết quả của phép tính 40 - 4 . 6 + 5 là:', 50, 645);
    ctx.fillText('A. 221              B. 21               C. 15               D. 29', 70, 670);

    ctx.fillText('Câu 4. Giá trị của biểu thức 6 . 2³ - 27 : 3² là:', 50, 705);
    ctx.fillText('A. 42               B. 41               C. 45               D. 51', 70, 730);

    ctx.fillText('Câu 5. Giá trị của biểu thức 150 : [25 + (15 - 10)] là:', 50, 765);
    ctx.fillText('A. 10               B. 6                C. 3                D. 5', 70, 790);

    // Đề Phần II Tự luận
    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillText('PHẦN II. TỰ LUẬN (7,5 điểm)', 50, 835);
    ctx.font = 'bold 18px "Times New Roman", serif';
    ctx.fillText('Câu 1 (2,5 điểm). Thực hiện phép tính (hợp lý nếu có thể):', 50, 865);

    // Khung 4 câu tự luận 1a, 1b, 1c, 1d
    const boxW = 540, boxH = 340;
    // 1a
    ctx.strokeRect(50, 885, boxW, boxH);
    drawDottedGrid(50, 885, boxW, boxH);
    ctx.font = 'bold 17px "Times New Roman", serif';
    ctx.fillText('a) 65 + 18 : 2 - 2⁴', 65, 915);

    // 1b
    ctx.strokeRect(610, 885, boxW, boxH);
    drawDottedGrid(610, 885, boxW, boxH);
    ctx.fillText('b) 54 . 38 + 54 . 62 - 400', 625, 915);

    // 1c
    ctx.strokeRect(50, 1250, boxW, boxH);
    drawDottedGrid(50, 1250, boxW, boxH);
    ctx.fillText('c) 160 : [58 - (42 - 2³ . 2)]', 65, 1280);

    // 1d
    ctx.strokeRect(610, 1250, boxW, boxH);
    drawDottedGrid(610, 1250, boxW, boxH);
    ctx.fillText('d) 320 : {180 - [75 + (11 - 6)²]}', 625, 1280);

    // BÀI LÀM HỌC SINH (Viết tay bút xanh)
    ctx.font = 'italic 23px "Caveat", "Times New Roman", cursive';
    ctx.fillStyle = '#1e3a8a';

    // 1a giải
    ctx.fillText('= 65 + 18 : 2 - 16', 90, 960);
    ctx.fillText('= 65 + 9 - 16', 90, 1010);
    ctx.fillText('= 74 - 16', 90, 1060);
    ctx.fillText('= 58', 90, 1110);

    // 1b giải
    ctx.fillText('= 54 . (38 + 62) - 400', 650, 960);
    ctx.fillText('= 54 . 100 - 400', 650, 1010);
    ctx.fillText('= 5400 - 400', 650, 1060);
    ctx.fillText('= 5000', 650, 1110);

    // 1c giải
    ctx.fillText('= 160 : [58 - (42 - 8 . 2)]', 90, 1330);
    ctx.fillText('= 160 : [58 - (42 - 16)]', 90, 1380);
    ctx.fillText('= 160 : [58 - 26]', 90, 1430);
    ctx.fillText('= 160 : 32', 90, 1480);
    ctx.fillText('= 5', 90, 1530);

    // 1d giải
    ctx.fillText('= 320 : {180 - [75 + 5²]}', 650, 1330);
    ctx.fillText('= 320 : {180 - [75 + 25]}', 650, 1380);
    ctx.fillText('= 320 : {180 - 100}', 650, 1430);
    ctx.fillText('= 320 : 80', 650, 1480);
    ctx.fillText('= 4', 650, 1530);

  } else {
    // PAGE 2
    // Outer border header
    ctx.strokeRect(40, 40, 1120, 50);
    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillStyle = '#000000';
    ctx.fillText('PHẦN II. TỰ LUẬN (Tiếp theo) - TOÁN 6 TUẦN 04 BUỔI 01', 60, 72);
    ctx.fillText('Mã đề: 103 - Trang 2/2', 880, 72);

    // Câu 2
    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillText('Câu 2 (2,5 điểm). Tìm số tự nhiên x, biết:', 50, 125);

    const bW = 540, bH = 340;
    // 2a
    ctx.strokeRect(50, 140, bW, bH);
    drawDottedGrid(50, 140, bW, bH);
    ctx.font = 'bold 17px "Times New Roman", serif';
    ctx.fillText('a) 45 + 3(x - 4) = 66', 65, 170);

    // 2b
    ctx.strokeRect(610, 140, bW, bH);
    drawDottedGrid(610, 140, bW, bH);
    ctx.fillText('b) 150 - [60 - (x - 6)] = 110', 625, 170);

    // 2c
    ctx.strokeRect(50, 505, bW, bH);
    drawDottedGrid(50, 505, bW, bH);
    ctx.fillText('c) 4 . 3^x - 7 = 101', 65, 535);

    // 2d
    ctx.strokeRect(610, 505, bW, bH);
    drawDottedGrid(610, 505, bW, bH);
    ctx.fillText('d) 5(x + 4) - 25 = 38 + 32', 625, 535);

    // CHỮ VIẾT TAY HỌC SINH CÂU 2
    ctx.font = 'italic 23px "Caveat", "Times New Roman", cursive';
    ctx.fillStyle = '#1e3a8a';

    // 2a
    ctx.fillText('3(x - 4) = 66 - 45', 85, 215);
    ctx.fillText('3(x - 4) = 21', 85, 260);
    ctx.fillText('(x - 4) = 21 : 3', 85, 305);
    ctx.fillText('(x - 4) = 7', 85, 350);
    ctx.fillText('x = 7 + 4', 85, 395);
    ctx.fillText('x = 11', 85, 440);

    // 2b (Học sinh làm sai ngoặc lồng nhau)
    ctx.save();
    ctx.strokeStyle = '#64748b';
    ctx.fillText('150 - (x - 6) = 110', 645, 215);
    ctx.fillText('(x - 6) = 150 - 110', 645, 265);
    ctx.fillText('(x - 6) = 20', 645, 315);
    ctx.fillText('x = 20 + 6', 645, 365);
    ctx.fillText('x = 26', 850, 365);
    ctx.restore();

    // 2c (Học sinh làm đúng 3 dòng đầu, sai dòng lấy 27:3)
    ctx.fillText('4 . 3^x = 101 + 7', 85, 580);
    ctx.fillText('4 . 3^x = 108', 85, 625);
    ctx.fillText('3^x = 27', 85, 670);
    ctx.fillText('x = 27 : 3', 85, 715);
    ctx.fillText('x = 9', 85, 760);

    // 2d
    ctx.fillText('5(x + 4) = 38 + 32', 645, 580);
    ctx.fillText('5(x + 4) = 70', 645, 625);
    ctx.fillText('(x + 4) = 70 : 5', 645, 670);
    ctx.fillText('(x + 4) = 14', 645, 715);
    ctx.fillText('x = 14 - 4', 645, 760);
    ctx.fillText('x = 10', 645, 805);

    // Câu 3
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px "Times New Roman", serif';
    ctx.fillText('Câu 3 (2,5 điểm). Bài toán thực tế:', 50, 885);

    // Khung đề và bài giải câu 3
    const c3H = 740;
    ctx.strokeRect(50, 905, 1100, c3H);
    drawDottedGrid(50, 1070, 1100, c3H - 170);

    ctx.font = '16px "Times New Roman", serif';
    ctx.fillText('Bạn Cúc đi nhà sách mua: 6 quyển vở giá 10 000 đồng/quyển, 4 cây bút gel giá 5 000 đồng/cây và 1 bộ', 65, 935);
    ctx.fillText('compa - êke giá 25 000 đồng. Nhà sách có chính sách giảm giá 15 000 đồng cho hóa đơn mua hàng có tổng', 65, 960);
    ctx.fillText('giá trị từ 100 000 đồng trở lên.', 65, 985);
    ctx.fillText('a) (1,25 điểm) Hãy viết một biểu thức số thể hiện số tiền bạn Cúc phải trả.', 65, 1015);
    ctx.fillText('b) (1,25 điểm) Tính cụ thể số tiền bạn Cúc phải trả cho nhà sách sau khi được giảm giá.', 65, 1040);

    ctx.font = 'italic bold 17px "Times New Roman", serif';
    ctx.fillText('Bài giải:', 65, 1085);

    // Lời giải học sinh câu 3
    ctx.font = 'italic 23px "Caveat", "Times New Roman", cursive';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('a. Biểu thức: 10 000 . 6 + 4 . 5 000 + 25 000', 160, 1085);
    ctx.fillText('- 15 000', 110, 1135);

    ctx.fillText('b. Cúc phải trả số tiền cho nhà sách là:', 160, 1185);
    ctx.fillText('10 000 . 6 + 4 . 5 000 + 25 000 - 15 000 =', 110, 1235);
    ctx.fillText('90 000 (đồng)', 110, 1285);
  }

  return canvas.toDataURL('image/png');
}
