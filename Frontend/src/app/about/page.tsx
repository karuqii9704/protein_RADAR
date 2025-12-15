import { 
  Building2, 
  Target, 
  Eye,
  Users,
  Award,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export default function AboutPage() {
  const teamMembers = [
    { name: 'Dr. H. Ahmad Fauzi, M.A.', role: 'Ketua DKM', image: null },
    { name: 'Ustadz Ridwan Kamil', role: 'Imam Besar', image: null },
    { name: 'Ir. Budi Santoso, M.T.', role: 'Bendahara', image: null },
    { name: 'Hj. Siti Fatimah, S.Pd.', role: 'Sekretaris', image: null },
  ];

  const stats = [
    { value: '15+', label: 'Tahun Berdiri', icon: Building2 },
    { value: '5000+', label: 'Jamaah Aktif', icon: Users },
    { value: '50+', label: 'Program Terlaksana', icon: Award },
    { value: '100%', label: 'Transparansi', icon: Target },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-green-50/30 to-white">
      {/* Page Header */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tentang Kami
          </h1>
          <p className="text-green-50 text-lg max-w-2xl mx-auto">
            Mengenal lebih dekat Masjid Syamsul 'Ulum Telkom University, 
            pusat ibadah dan kegiatan keislaman di lingkungan kampus.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Masjid Syamsul 'Ulum
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Masjid Syamsul 'Ulum adalah masjid utama di lingkungan Telkom University 
                yang berdiri sejak awal pendirian kampus. Masjid ini menjadi pusat kegiatan 
                ibadah dan dakwah bagi civitas akademika serta masyarakat sekitar.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Dengan kapasitas lebih dari 2000 jamaah, masjid ini melayani berbagai 
                kegiatan seperti sholat berjamaah lima waktu, sholat Jumat, kajian rutin, 
                dan berbagai program sosial keagamaan lainnya.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami berkomitmen untuk mengelola masjid secara transparan dan profesional, 
                sehingga setiap donasi yang diberikan jamaah dapat dipertanggungjawabkan 
                dengan baik melalui laporan keuangan yang terbuka.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl h-80 flex items-center justify-center">
              <span className="text-9xl">🕌</span>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-600 rounded-xl mb-6">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
              <p className="text-gray-600 leading-relaxed">
                Menjadi pusat kegiatan keislaman yang unggul, transparan, dan terpercaya 
                dalam memakmurkan masjid dan membina umat menuju masyarakat yang 
                beriman, berilmu, dan berakhlak mulia.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-6">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Menyelenggarakan ibadah dengan khusyuk dan berkualitas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Mengelola keuangan masjid secara transparan
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Menyelenggarakan program dakwah dan pendidikan Islam
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  Melaksanakan program sosial untuk kemaslahatan umat
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-green-700">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-green-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Pengurus DKM</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Tim pengurus yang berdedikasi untuk kemakmuran masjid dan pelayanan umat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-green-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">Hubungi Kami</h2>
                <p className="text-gray-300 mb-6">
                  Kami siap melayani pertanyaan dan masukan dari jamaah demi kemajuan masjid.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Alamat</p>
                      <p className="text-gray-400 text-sm">
                        Komplek Masjid Telkom University, Bandung, Jawa Barat 40257
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Telepon</p>
                      <p className="text-gray-400 text-sm">+62 811 2222 3333</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gray-400 text-sm">info@masjidsyamsululum.ac.id</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Kirim Pesan</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                  <textarea
                    placeholder="Pesan Anda"
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 resize-none"
                  ></textarea>
                  <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition">
                    Kirim Pesan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
