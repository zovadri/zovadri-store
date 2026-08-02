export const JWT_SECRET = process.env.JWT_SECRET || "zovadri_prod_secret_change_me_2026";
export const UPLOADS_DIR = "uploads";

export const EXPORTS_GOVERNORATES: Record<string, number> = {
  "القاهرة": 30, "الجيزة": 30, "الأسكندرية": 45, "القليوبية": 35,
  "الشرقية": 45, "الدقهلية": 45, "الغربية": 40, "المنوفية": 40,
  "كفر الشيخ": 45, "البحر الأحمر": 60, "بورسعيد": 55, "الإسماعيلية": 50,
  "السويس": 50, "دمياط": 50, "المطرية": 50, "الفيوم": 45, "بني سويف": 45,
  "المنيا": 50, "أسيوط": 55, "سوهاج": 55, "قنا": 60, "الأقصر": 65,
  "أسوان": 70, "البحيرة": 45, "شمال سيناء": 65, "جنوب سيناء": 70, "الوادي الجديد": 60,
};

export const FREE_SHIPPING_THRESHOLD = 1500;
export const COD_FEE = 20;
export const DEFAULT_COMMISSION_RATE = 0.1;

export const maxUploadBytes = 10 * 1024 * 1024;
export const minUploadBytes = 10;