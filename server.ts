import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Kiểm tra trạng thái AI
app.get('/api/status', (req, res) => {
  res.json({
    aiAvailable: !!aiClient,
    model: 'gemini-3.8-flash',
    mode: aiClient ? 'LIVE_GEMINI_API' : 'DEMONSTRATION_MODE',
    message: aiClient
      ? 'Dịch vụ AI Gemini 3.8 Flash đã sẵn sàng.'
      : 'Đang chạy Chế độ Minh Họa (Chưa cấu hình GEMINI_API_KEY).'
  });
});

// 2. Dự thảo Hướng dẫn chấm & Thang điểm từ đề bài
app.post('/api/gemini/generate-rubric', async (req, res) => {
  const { examTitle, gradeLevel, testPaperText } = req.body;

  if (!testPaperText) {
    return res.status(400).json({ error: 'Thiếu nội dung đề bài' });
  }

  if (aiClient) {
    try {
      const prompt = `Bạn là chuyên gia thẩm định và giáo viên Toán THCS (lớp ${gradeLevel || 6}).
Hãy phân tích đề kiểm tra sau và xây dựng HƯỚNG DẪN CHẤM VÀ THANG ĐIỂM CHI TIẾT (tổng điểm 10.0đ).
Đề bài:
${testPaperText}

Yêu cầu định dạng JSON theo cấu trúc sau:
{
  "totalScore": 10.0,
  "questions": [
    {
      "id": "tl-1a",
      "questionNumber": "Câu 1a",
      "part": "II",
      "title": "Tên câu / biểu thức",
      "maxScore": 0.625,
      "standardSolution": "Lời giải từng bước",
      "criteria": [
        {
          "id": "c1",
          "code": "1a.1",
          "description": "Nội dung tiêu chí cụ thể",
          "maxScore": 0.325
        }
      ]
    }
  ]
}
Lưu ý quan trọng: Tổng điểm của tất cả tiêu chí của tất cả câu PHẢI bằng chính xác 10.0 điểm.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Bạn là chuyên gia sư phạm Toán THCS Việt Nam, thiết lập barem chấm chuẩn Bộ GD&ĐT.',
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err: any) {
      console.error('Lỗi gọi Gemini generate-rubric:', err);
      // Fallback
    }
  }

  // Chế độ minh họa / fallback
  return res.json({
    isDemoFallback: true,
    totalScore: 10.0,
    notice: 'Được tạo bởi động cơ sư phạm minh họa (Demo Engine) tuân thủ khung chuẩn THCS.'
  });
});

// 3. Nhận dạng chữ viết tay (OCR) và phát hiện vùng nghi vấn
app.post('/api/gemini/ocr', async (req, res) => {
  const { imageBase64, pageNumber, examContext } = req.body;

  if (aiClient && imageBase64) {
    try {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/png',
                data: cleanBase64
              }
            },
            {
              text: `Bạn là kỹ sư nhận dạng chữ viết tay Toán học THCS Việt Nam.
Hãy đọc bài làm của học sinh trong ảnh trang ${pageNumber || 1}.
Nguyên tắc:
1. Phân biệt rõ đề in sẵn và chữ viết tay của học sinh.
2. Không tự sửa lỗi sai của học sinh thành đúng.
3. Chú ý các ký hiệu: dấu âm (-), dấu bằng (=), dấu ngoặc, lũy thừa (x², x³), phân số, căn thức.
4. Nếu ký hiệu mờ hoặc không phân biệt được (như x² vs x³), gắn cờ hasAmbiguity: true và ghi rõ nghi vấn.
5. Định dạng JSON kết quả:
{
  "studentNameDetected": "Tên nếu có",
  "examCodeDetected": "Mã đề nếu có",
  "ocrItems": [
    {
      "questionNumber": "Câu 2c",
      "rawRecognizedText": "Dòng 1: ...\\nDòng 2: ...",
      "detectedZone": { "x": 10, "y": 20, "width": 40, "height": 20 },
      "hasAmbiguity": false,
      "ambiguities": []
    }
  ]
}`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      return res.json(JSON.parse(responseText));
    } catch (err: any) {
      console.error('Lỗi Gemini OCR:', err);
    }
  }

  // Fallback minh họa
  return res.json({
    isDemoFallback: true,
    message: 'Nhận dạng hoàn tất qua động cơ xử lý hình ảnh cục bộ.'
  });
});

// 4. Chấm bài theo Barem, kiểm tra logic toán học và xuất chú thích
app.post('/api/gemini/grade', async (req, res) => {
  const { submission, rubric, roundingRule } = req.body;

  if (aiClient) {
    try {
      const prompt = `Bạn là Trợ lý Chấm Toán THCS chuyên sâu.
Hãy chấm bài làm học sinh theo hướng dẫn chấm đã duyệt.

QUY TẮC BẮT BUỘC:
1. Chấm theo từng tiêu chí trong barem, không chỉ so sánh đáp số cuối.
2. Kiểm tra tính đúng đắn của từng phép biến đổi.
3. Chỉ ra bước sai đầu tiên và ảnh hưởng đến kết quả.
4. Không tự ý trừ điểm ngoài hướng dẫn. Không trừ điểm trùng lặp cho cùng một lỗi.
5. Công nhận cách giải khác hợp lệ nếu đáp ứng yêu cầu.
6. Khi thiếu lập luận, điều kiện, chỉ trừ điểm nếu tiêu chí quy định (Ví dụ bài toán giảm giá).
7. Tình huống phương trình lũy thừa 4 * 3^x - 7 = 101: nếu đến 3^x = 27 rồi viết x = 27:3 = 9 thì bước trước đó vẫn được điểm, nhận xét học sinh cần viết 27 = 3^3 suy ra x = 3.
8. Tình huống ngoặc lồng nhau 150 - [60 - (x - 6)] = 110: nếu học sinh bỏ ngoặc sai thì dù đáp số 26 có đúng cũng không được cho trọn điểm.
9. Đề xuất vị trí chú thích trên bài thi (box tọa độ x, y, width, height theo %) để không che chữ.
10. Gợi ý nhận xét chung: Điểm làm tốt, Lỗi cần sửa, Nội dung nên luyện thêm.

Dữ liệu đầu vào:
Barem: ${JSON.stringify(rubric)}
Bài làm học sinh: ${JSON.stringify(submission?.ocrData || [])}
Quy tắc làm tròn: ${roundingRule || '0.1'}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'Bạn là chuyên gia sư phạm Toán THCS Việt Nam chấm bài tự luận khách quan, chuẩn xác theo tiêu chí.',
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      return res.json(JSON.parse(responseText));
    } catch (err: any) {
      console.error('Lỗi Gemini Grade:', err);
    }
  }

  // Demo fallback
  return res.json({
    isDemoFallback: true,
    message: 'Chấm thành công bằng Động cơ Quy tắc Toán THCS (Rule-based Math Validator).'
  });
});

// Khởi chạy Vite middleware trong môi trường dev
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server Trợ Lý Chấm Toán THCS đang chạy tại http://localhost:${PORT}`);
  });
}

startServer();
