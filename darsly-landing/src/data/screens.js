// Real app screens rendered from the Darsly design canvas (public/screens/*.webp, 600px wide).
export const screen = (code) => `${import.meta.env.BASE_URL}screens/${code}.webp`;
export const brand = (name) => `${import.meta.env.BASE_URL}brand/${name}.svg`;

export const GALLERY = {
  student: [
    ['ST1.4', 'الرئيسية · كل كورساتي'], ['ST4.1', 'صفحة الكورس'], ['ST6.1', 'المشغّل المحمي'], ['ST6.3', 'جودة الفيديو'],
    ['ST6.15', 'تحميل المحاضرة'], ['ST7.3', 'التنزيلات'], ['ST9.3', 'حل الامتحان'], ['ST9.6', 'النتيجة'],
    ['ST12.1', 'تقدّمي'], ['ST13.1', 'ساحة النقاش'], ['ST11.4', 'طلب الانضمام'], ['ST10.7', 'إشعاراتي']
  ],
  teacher: [
    ['L47.1', 'إضافة رابط فيديو'], ['L47.2', 'جاري المعالجة'], ['L47.4', 'اتنشرت + إشعار'], ['L47.7', 'إعدادات التحميل'],
    ['L45.1', 'الفواتير'], ['L45.3', 'طلاب الكورس في الفاتورة'], ['L45.5', 'دفع الفاتورة']
  ],
  admin: [['A2.1', 'لوحة الأدمن'], ['A2.2', 'إشعارات الأدمن']]
};
