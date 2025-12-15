import Link from 'next/link';

const quickLinks = [
  { href: '/about', label: 'Tentang Kami' },
  { href: '/programs', label: 'Program' },
  { href: '/laporan', label: 'Laporan Keuangan' },
  { href: '/news', label: 'Berita' },
  { href: '/terms', label: 'Syarat & Ketentuan' },
];

const socialLinks = [
  { href: '#', icon: '📘', label: 'Facebook' },
  { href: '#', icon: '📸', label: 'Instagram' },
  { href: '#', icon: '🐦', label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🕌</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Masjid Syamsul 'Ulum</h3>
                <p className="text-sm text-gray-400">Telkom University</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Lembaga pengelolaan masjid yang transparan dan akuntabel dalam mengelola dana untuk kemaslahatan umat dan kemajuan masjid.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  className="w-10 h-10 bg-gray-700 hover:bg-green-600 rounded-lg flex items-center justify-center transition"
                  aria-label={social.label}
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Learn More</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Kontak</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">📍</span>
                <span className="text-sm">
                  Komplek Masjid Telkom University<br />
                  Bandung, Jawa Barat 40257
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">📞</span>
                <span className="text-sm">+62 811 2222 3333</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✉️</span>
                <span className="text-sm">info@masjidsyamsululum.ac.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Masjid Syamsul 'Ulum Telkom University · All Rights Reserved
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Dikembangkan oleh Tim PTI - Dashboard Keuangan Masjid
          </p>
        </div>
      </div>
    </footer>
  );
}
