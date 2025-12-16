import { PrismaClient, Role, TransactionType, NewsCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ==========================================
  // 1. Create Categories
  // ==========================================
  console.log('📁 Creating categories...');
  
  const categories = await Promise.all([
    // Income categories
    prisma.category.upsert({
      where: { name: 'Infak' },
      update: {},
      create: {
        name: 'Infak',
        type: TransactionType.INCOME,
        description: 'Infak umum jamaah',
        color: '#10B981',
        icon: 'heart',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Zakat' },
      update: {},
      create: {
        name: 'Zakat',
        type: TransactionType.INCOME,
        description: 'Zakat fitrah dan maal',
        color: '#059669',
        icon: 'wallet',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Wakaf' },
      update: {},
      create: {
        name: 'Wakaf',
        type: TransactionType.INCOME,
        description: 'Wakaf tanah, bangunan, dan uang',
        color: '#047857',
        icon: 'building',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Sedekah' },
      update: {},
      create: {
        name: 'Sedekah',
        type: TransactionType.INCOME,
        description: 'Sedekah umum',
        color: '#34D399',
        icon: 'gift',
      },
    }),
    // Expense categories
    prisma.category.upsert({
      where: { name: 'Operasional' },
      update: {},
      create: {
        name: 'Operasional',
        type: TransactionType.EXPENSE,
        description: 'Biaya operasional masjid (listrik, air, dll)',
        color: '#F59E0B',
        icon: 'settings',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Kebersihan' },
      update: {},
      create: {
        name: 'Kebersihan',
        type: TransactionType.EXPENSE,
        description: 'Biaya kebersihan dan peralatan',
        color: '#3B82F6',
        icon: 'sparkles',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Pembangunan' },
      update: {},
      create: {
        name: 'Pembangunan',
        type: TransactionType.EXPENSE,
        description: 'Biaya pembangunan dan renovasi',
        color: '#8B5CF6',
        icon: 'hammer',
      },
    }),
    prisma.category.upsert({
      where: { name: 'Kegiatan' },
      update: {},
      create: {
        name: 'Kegiatan',
        type: TransactionType.EXPENSE,
        description: 'Biaya kegiatan masjid',
        color: '#EC4899',
        icon: 'calendar',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // ==========================================
  // 2. Create Admin User
  // ==========================================
  console.log('👤 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@masjid-msu.id' },
    update: {},
    create: {
      email: 'admin@masjid-msu.id',
      password: hashedPassword,
      name: 'Administrator',
      role: Role.SUPER_ADMIN,
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);

  // ==========================================
  // 3. Create Sample Programs
  // ==========================================
  console.log('📋 Creating sample programs...');

  const programs = await Promise.all([
    prisma.program.upsert({
      where: { slug: 'renovasi-masjid' },
      update: {},
      create: {
        title: 'Renovasi Masjid',
        slug: 'renovasi-masjid',
        description: 'Program renovasi dan perluasan masjid untuk menampung lebih banyak jamaah.',
        target: 150000000,
        collected: 75000000,
        isActive: true,
        isFeatured: true,
        endDate: new Date('2026-03-31'),
      },
    }),
    prisma.program.upsert({
      where: { slug: 'santunan-anak-yatim' },
      update: {},
      create: {
        title: 'Santunan Anak Yatim',
        slug: 'santunan-anak-yatim',
        description: 'Program santunan rutin untuk anak-anak yatim di sekitar masjid.',
        target: 50000000,
        collected: 28000000,
        isActive: true,
        isFeatured: true,
        endDate: new Date('2026-01-15'),
      },
    }),
    prisma.program.upsert({
      where: { slug: 'operasional-bulanan' },
      update: {},
      create: {
        title: 'Operasional Masjid',
        slug: 'operasional-bulanan',
        description: 'Dana untuk operasional bulanan masjid termasuk listrik, air, dan kebersihan.',
        target: 25000000,
        collected: 15500000,
        isActive: true,
        isFeatured: true,
        endDate: new Date('2025-12-31'),
      },
    }),
  ]);

  console.log(`✅ Created ${programs.length} programs`);

  // ==========================================
  // 4. Create Sample Transactions
  // ==========================================
  console.log('💰 Creating sample transactions...');

  const infakCategory = categories.find(c => c.name === 'Infak');
  const operasionalCategory = categories.find(c => c.name === 'Operasional');

  if (infakCategory && operasionalCategory) {
    await Promise.all([
      prisma.transaction.create({
        data: {
          type: TransactionType.INCOME,
          amount: 1500000,
          description: 'Infak Jumat',
          donor: 'Bapak Ahmad Ridwan',
          date: new Date('2025-11-24'),
          categoryId: infakCategory.id,
          createdById: adminUser.id,
        },
      }),
      prisma.transaction.create({
        data: {
          type: TransactionType.EXPENSE,
          amount: 1200000,
          description: 'Pembayaran listrik bulan November',
          recipient: 'PLN',
          date: new Date('2025-11-23'),
          categoryId: operasionalCategory.id,
          createdById: adminUser.id,
        },
      }),
      prisma.transaction.create({
        data: {
          type: TransactionType.INCOME,
          amount: 500000,
          description: 'Infak anonim kotak amal',
          donor: 'Anonymous',
          date: new Date('2025-11-22'),
          categoryId: infakCategory.id,
          createdById: adminUser.id,
        },
      }),
    ]);
    
    console.log('✅ Created sample transactions');
  }

  // ==========================================
  // 5. Create Sample News
  // ==========================================
  console.log('📰 Creating sample news...');

  await prisma.news.upsert({
    where: { slug: 'laporan-keuangan-november-2025' },
    update: {},
    create: {
      title: 'Laporan Keuangan Bulan November 2025',
      slug: 'laporan-keuangan-november-2025',
      content: 'Alhamdulillah, berikut adalah laporan keuangan masjid untuk bulan November 2025. Total pemasukan bulan ini mencapai Rp 125.500.000 dengan pengeluaran sebesar Rp 87.300.000.',
      excerpt: 'Laporan keuangan bulanan Masjid Syamsul Ulum',
      category: NewsCategory.LAPORAN,
      isPublished: true,
      publishedAt: new Date('2025-11-24'),
      authorId: adminUser.id,
    },
  });

  console.log('✅ Created sample news');

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('=====================================');
  console.log('Admin Login:');
  console.log('  Email: admin@masjid-msu.id');
  console.log('  Password: admin123');
  console.log('=====================================');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
