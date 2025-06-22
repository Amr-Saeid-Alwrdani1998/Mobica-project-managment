// models/Item.ts
import mongoose from "mongoose"

const ItemSchema = new mongoose.Schema({
  "اسم العـميل": String,
  "العـــــــــــــــنوان": String,
  "مجموعة التركيب": String,
  "رقـم العقـد": String,
  "موقف التركيب": String,
  "المــنتجـات": String,
  "تاريخ بدء التركيب": Date,
  "تاريخ انتهاء التركيب": Date,
  "اجمالي قيمة المنتجات": Number,
  // أضف أي أعمدة تانية عندك هنا
}, { timestamps: true })

export default mongoose.models.Item || mongoose.model("Item", ItemSchema)
