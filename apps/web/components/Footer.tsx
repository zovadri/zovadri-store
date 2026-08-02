import Link from "next/link";
import { asset } from "@/lib/ref";

export default function Footer() {
  return (
    <footer className="z-footer">
      <div className="z-footer-inner">
        <div>
          <div className="z-logo" style={{ marginBottom: 10 }}>
            <img src={asset("/logo.png")} alt="Zovadri" className="z-logo-img" />
            <span>زوفادري</span>
          </div>
          <p className="z-footer-desc">بنبني مشاريعك البرمجية من الفكرة للتسليم — مواقع، متاجر، تطبيقات، وبوتات.</p>
        </div>
        <div>
          <h4>روابط سريعة</h4>
          <Link href="#services">خدماتنا</Link>
          <Link href="#portfolio">أعمالنا</Link>
          <Link href="#order">اطلب مشروعك</Link>
        </div>
        <div>
          <h4>تواصل معنا</h4>
          <a href="https://wa.me/201039866876" target="_blank" rel="noopener noreferrer">واتساب: 01039866876</a>
          <a href="https://www.facebook.com/people/Zovadri/61591990170275/" target="_blank" rel="noopener noreferrer">فيسبوك: Zovadri</a>
        </div>
      </div>
      <div className="z-footer-bottom">© {new Date().getFullYear()} زوفادري — جميع الحقوق محفوظة</div>
    </footer>
  );
}
