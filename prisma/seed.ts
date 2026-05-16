import { Role, VideoStatus, StatusMedical, OrderStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

import { prisma } from "@/lib/prisma";

async function main() {
  // Buat administrator
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'administrator@mydoc.com',
      password: await bcrypt.hash('administrator123', 12),
      role: Role.ADMINISTRATOR
    }
  })

  // Buat 2 admin
  await prisma.user.createMany({
    data: [
      {
        name: 'Admin Satu',
        email: 'admin1@mydoc.com', 
        password: await bcrypt.hash('admin123', 12),
        role: Role.ADMIN
      },
      {
        name: 'Admin Dua',
        email: 'admin2@mydoc.com',
        password: await bcrypt.hash('admin123', 12),
        role: Role.ADMIN
      }
    ]
  })

  // Buat 3 staf medis
  const medicalStaff = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Dr. John Doe',
        email: 'john.doe@mydoc.com',
        password: await bcrypt.hash('medical123', 12),
        role: Role.MEDICAL_STAFF,
        medicalStaffInfo: {
          create: {
            username: 'dr.johndoe',
            phone: '+6281234567890',
            address: 'Jl. Medis No. 1',
            specialization: 'Dokter Umum',
            credentials: 'MD, PhD',
            experience: '10 tahun',
            institutionName: 'RS Umum',
            status: StatusMedical.ACTIVE
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Jane Smith',
        email: 'jane.smith@mydoc.com',
        password: await bcrypt.hash('medical123', 12),
        role: Role.MEDICAL_STAFF,
        medicalStaffInfo: {
          create: {
            username: 'dr.janesmith',
            phone: '+6281234567891',
            address: 'Jl. Medis No. 2',
            specialization: 'Dokter Gigi',
            credentials: 'DDS, MS',
            experience: '8 tahun',
            institutionName: 'RS Gigi',
            status: StatusMedical.ACTIVE
          }
        }
      }
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Robert Wilson',
        email: 'robert.wilson@mydoc.com',
        password: await bcrypt.hash('medical123', 12),
        role: Role.MEDICAL_STAFF,
        medicalStaffInfo: {
          create: {
            username: 'dr.robertwilson',
            phone: '+6281234567892',
            address: 'Jl. Medis No. 3',
            specialization: 'Dokter Bedah',
            credentials: 'MD, FACS',
            experience: '12 tahun',
            institutionName: 'RS Bedah',
            status: StatusMedical.ACTIVE
          }
        }
      }
    })
  ])

  // Buat 10 pelanggan
  await prisma.user.createMany({
    data: Array.from({ length: 10 }, (_, i) => ({
      name: `Pelanggan ${i + 1}`,
      email: `customer${i + 1}@example.com`,
      password: bcrypt.hashSync('customer123', 12),
      role: Role.CUSTOMER
    }))
  })

  // Buat kategori
  await prisma.category.createMany({
    data: [
      { name: 'Dokter Umum', slug: 'dokter-umum' },
      { name: 'Dokter Gigi', slug: 'dokter-gigi' },
      { name: 'Dokter Bedah', slug: 'dokter-bedah' },
    ]
  })

  // Dapatkan kategori untuk referensi
  const categories = await prisma.category.findMany();

  // Buat subkategori
  await prisma.subCategory.createMany({
    data: [
      { name: 'Penyakit Dalam', categoryId: categories[0].id, slug: 'penyakit-dalam' },
      { name: 'Kesehatan Gigi', categoryId: categories[1].id, slug: 'kesehatan-gigi' },
      { name: 'Bedah Umum', categoryId: categories[2].id, slug: 'bedah-umum' }
    ]
  })

  const subCategories = await prisma.subCategory.findMany();

  // Buat video
  const videoData = [
    {
      title: 'Pengantar Nutrisi',
      description: 'Pelajari dasar-dasar nutrisi dan pentingnya dalam kesehatan.',
      message: 'Video pembelajaran nutrisi dasar',
      price: 250000,
      discount: 0.1,
      status: VideoStatus.APPROVED,
      videoUrl: 'video1.mp4',
      videoPreviewUrl: 'preview1.mp4',
      thumbnailUrl: 'thumbnail.jpg',
      uploadedById: medicalStaff[0].id,
      approvedById: medicalStaff[0].id,
      categoryId: categories[0].id,
      subCategorieIds: [subCategories[0].id],
      subCategoryId: subCategories[0].id
    },
    {
      title: 'Perawatan Gigi Dasar',
      description: 'Panduan lengkap perawatan gigi sehari-hari.',
      message: 'Video pembelajaran perawatan gigi',
      price: 200000,
      discount: 0.15,
      status: VideoStatus.APPROVED,
      videoUrl: 'video1.mp4',
      videoPreviewUrl: 'preview1.mp4',
      thumbnailUrl: 'thumbnail.jpg',
      uploadedById: medicalStaff[1].id,
      approvedById: medicalStaff[1].id,
      categoryId: categories[1].id,
      subCategorieIds: [subCategories[1].id],
      subCategoryId: subCategories[1].id
    }
  ];

  for (const video of videoData) {
    await prisma.video.create({
      data: video
    });
  }

  // Buat review untuk video
  const videos = await prisma.video.findMany();
  const customers = await prisma.user.findMany({
    where: { role: Role.CUSTOMER }
  });

  for (const video of videos) {
    for (const customer of customers.slice(0, 3)) { // 3 review per video
      await prisma.review.create({
        data: {
          rating: Math.floor(Math.random() * 5) + 1,
          comment: `Review untuk video ${video.title} oleh ${customer.name}`,
          userId: customer.id,
          videoId: video.id
        }
      });
    }
  }

  // Buat order
  for (const video of videos) {
    for (const customer of customers.slice(0, 2)) { // 2 order per video
      await prisma.order.create({
        data: {
          userId: customer.id,
          videoId: video.id,
          amount: video.price || 0,
          status: OrderStatus.COMPLETED
        }
      });
    }
  }

  // Buat general settings
  await prisma.generalSetting.create({
    data: {
      companyName: 'MyDoc Healthcare',
      address: 'Jl. Kesehatan No. 123',
      phone: '+62812345678',
      email: 'contact@mydoc.com',
      logoUrl: '/logo.png'
    }
  });

  // Buat social media
  await prisma.socialMedia.createMany({
    data: [
      { name: 'Facebook', url: 'https://facebook.com/mydoc' },
      { name: 'Instagram', url: 'https://instagram.com/mydoc' },
      { name: 'Twitter', url: 'https://twitter.com/mydoc' }
    ]
  });

  // buat banner seed
  await prisma.banner.createMany({
    data: [
      { title: 'Banner 1', description: 'Banner 1', imageUrl: '/banner1.jpg' },
      { title: 'Banner 2', description: 'Banner 2', imageUrl: '/banner2.jpg' },
      { title: 'Banner 3', description: 'Banner 3', imageUrl: '/banner3.jpg' }
    ]
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
