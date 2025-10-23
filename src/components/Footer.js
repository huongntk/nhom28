export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto p-6 text-center">
        <p>📞 Hotline: 0909 999 999 | ✉️ support@threeH.vn</p>
        <p className="mt-2 text-sm text-gray-400">
          © {new Date().getFullYear()} ThreeH. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
