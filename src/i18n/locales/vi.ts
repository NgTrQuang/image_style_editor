import type { TranslationKeys } from './en'

const vi: Record<TranslationKeys, string> = {
  // Header
  appName: 'Trình Chỉnh Sửa Ảnh',
  uploadImage: 'Tải Ảnh Lên',
  changeImage: 'Đổi Ảnh',
  fileHint: 'JPG, PNG, WebP · tối đa 10MB',
  tagline: 'Không phá hủy gốc · Chạy trên trình duyệt',
  errorInvalidType: 'Định dạng không hợp lệ. Vui lòng tải lên JPG, PNG hoặc WebP.',
  errorTooLarge: 'Tệp quá lớn. Kích thước tối đa là 10MB.',
  errorLoadFailed: 'Không thể tải ảnh. Tệp có thể bị hỏng.',

  // LeftPanel
  stylePresets: 'Bộ Lọc Phong Cách',
  styles: 'bộ lọc',
  activeIntensity: 'Cường Độ Hiện Tại',
  intensityHint: 'Kéo thanh trượt trên thẻ bộ lọc đang chọn',

  // Category names
  catCinematic: 'Điện Ảnh',
  catVintage: 'Cổ Điển',
  catPortrait: 'Chân Dung',
  catLandscape: 'Phong Cảnh',
  catDarkMood: 'Tối Tăm',
  catUrban: 'Đô Thị',
  catDreamy: 'Mơ Mộng',

  // RightPanel sections
  histogram: 'Biểu Đồ Tông Màu',
  transform: 'Biến Đổi',
  highlightsShadows: 'Sáng & Tối',
  vibrance: 'Độ Rực Rỡ',
  color: 'Màu Sắc',
  curves: 'Đường Cong',
  claritySharpness: 'Độ Nét & Sắc',
  splitToning: 'Tô Màu Tách Biệt',
  grainVignette: 'Hạt Phim & Viền Tối',
  masks: 'Mặt Nạ',
  history: 'Lịch Sử',
  compare: 'So Sánh',
  zoom: 'Thu Phóng',
  session: 'Phiên Làm Việc',
  exportImage: 'Xuất Ảnh',

  // Transform
  cwRotate: 'Xoay 90° ▶',
  ccwRotate: 'Xoay 90° ◀',
  flipH: 'Lật Ngang',
  flipV: 'Lật Dọc',
  crop: 'Cắt Xén',
  cropping: 'Đang cắt…',

  // History
  undo: 'Hoàn Tác',
  redo: 'Làm Lại',
  undoHint: 'Ctrl+Z / Ctrl+Shift+Z',
  operations: 'Thao Tác',
  resetAll: 'Đặt Lại Tất Cả',
  applyFlatten: 'Áp Dụng & Gộp',
  flattening: 'Đang gộp…',
  flattenHint: 'Gộp chỉnh sửa vào ảnh gốc. Xóa lịch sử.',

  // Compare
  hideCompare: 'Ẩn So Sánh',
  compareBtn: 'So Sánh',
  holdPreview: 'Giữ Để Xem Gốc',

  // Zoom
  resetZoom: 'Về 100%',

  // Session
  exportSession: 'Xuất Phiên Làm Việc',
  importSession: 'Nhập Phiên Làm Việc',
  sessionHint: 'Lưu / khôi phục quy trình chỉnh sửa dưới dạng JSON.',
  sessionImportError: 'Vui lòng tải ảnh trước khi nhập phiên làm việc.',

  // Export
  quality: 'Chất Lượng',
  download: 'Tải Xuống',

  // Color Controls
  whiteBalance: 'Cân Bằng Trắng',
  temperature: '🌡 Nhiệt Độ',
  tint: '🎨 Sắc Tông',
  hsl: 'HSL',
  selectChannel: 'Chọn một kênh màu ở trên',
  hue: 'Màu Sắc (Hue)',
  saturation: 'Độ Bão Hòa',
  lightness: 'Độ Sáng',

  // Highlights & Shadows
  highlights: 'Vùng Sáng',
  shadows: 'Vùng Tối',
  reset: 'Đặt Lại',

  // Vibrance
  vibranceLabel: 'Độ Rực Rỡ',
  vibranceHint: 'Tăng cường vùng màu nhạt trước. Bảo vệ tông da.',

  // Clarity & Sharpness
  clarity: 'Độ Tương Phản Trung Gian',
  sharpen: 'Làm Sắc Nét',
  sharpenRadius: 'Bán Kính Làm Nét',

  // Split Toning
  stHighlights: 'Vùng Sáng',
  stShadows: 'Vùng Tối',
  balance: 'Cân Bằng',

  // Grain & Vignette
  grain: 'Hạt Phim',
  vignetteAmount: 'Viền Tối',
  vignetteFeather: 'Độ Mờ Viền',

  // Mask Tool
  radialMask: 'Mặt Nạ Tròn',
  gradientMask: 'Mặt Nạ Gradient',
  centerX: 'Tâm X',
  centerY: 'Tâm Y',
  radiusX: 'Bán Kính X',
  radiusY: 'Bán Kính Y',
  feather: 'Độ Mờ',
  exposure: 'Phơi Sáng',
  startX: 'Điểm Đầu X',
  startY: 'Điểm Đầu Y',
  endX: 'Điểm Cuối X',
  endY: 'Điểm Cuối Y',
  addMask: 'Thêm Mặt Nạ',

  // Curves
  master: 'Tổng',
  curveHint: 'Click để thêm điểm · Kéo ra ngoài để xóa',

  // Language toggle
  language: 'Ngôn Ngữ',
}

export default vi
