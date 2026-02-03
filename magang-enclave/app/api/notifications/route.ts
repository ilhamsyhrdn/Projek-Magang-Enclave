import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

// Sample notifications data (in production, this would be from database)
const sampleNotifications = [
  // Notifications for Ilham (Approver - userId: 2001)
  {
    id: 1,
    userId: 2001,
    title: 'Surat Keluar Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP menunggu persetujuan Anda',
    type: 'surat-keluar',
    documentId: 1,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T08:30:00').toISOString(),
  },
  {
    id: 2,
    userId: 2001,
    title: 'Memo Pengajuan Dana',
    message: 'Risalah Internal iFest - Memo pengajuan dana perlu ditinjau',
    type: 'memo',
    documentId: 1,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T13:00:00').toISOString(),
  },
  {
    id: 3,
    userId: 2001,
    title: 'Surat Masuk Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP telah diterima',
    type: 'surat-masuk',
    documentId: 1,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T10:00:00').toISOString(),
  },
  {
    id: 4,
    userId: 2001,
    title: 'Notulensi Rapat',
    message: 'Notulensi rapat evaluasi proyek telah diupload',
    type: 'notulensi',
    documentId: 1,
    status: 'Selesai',
    isRead: true,
    createdAt: new Date('2026-01-26T14:30:00').toISOString(),
  },
  {
    id: 5,
    userId: 2001,
    title: 'Memo Permohonan Izin',
    message: 'Risalah Internal iFest - Memo permohonan izin menunggu persetujuan',
    type: 'memo',
    documentId: 2,
    status: 'Ditolak',
    isRead: false,
    createdAt: new Date('2026-01-27T14:00:00').toISOString(),
  },
  
  // Notifications for Rayhan (Approver - userId: 2002)
  {
    id: 11,
    userId: 2002,
    title: 'Memo Koordinasi',
    message: 'Risalah Internal iFest - Memo koordinasi perlu ditinjau',
    type: 'memo',
    documentId: 4,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T09:00:00').toISOString(),
  },
  {
    id: 12,
    userId: 2002,
    title: 'Surat Masuk Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP telah diterima',
    type: 'surat-masuk',
    documentId: 2,
    status: 'Selesai',
    isRead: false,
    createdAt: new Date('2026-01-27T11:00:00').toISOString(),
  },
  {
    id: 13,
    userId: 2002,
    title: 'Notulensi Rapat',
    message: 'Notulensi rapat koordinasi tim telah diupload',
    type: 'notulensi',
    documentId: 2,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T14:00:00').toISOString(),
  },
  {
    id: 14,
    userId: 2002,
    title: 'Memo Persetujuan',
    message: 'Risalah Internal iFest - Memo persetujuan menunggu persetujuan',
    type: 'memo',
    documentId: 5,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T15:30:00').toISOString(),
  },
  
  // Notifications for Candra (Approver - userId: 2003)
  {
    id: 15,
    userId: 2003,
    title: 'Surat Keluar Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP menunggu persetujuan Anda',
    type: 'surat-keluar',
    documentId: 3,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T08:00:00').toISOString(),
  },
  {
    id: 16,
    userId: 2003,
    title: 'Memo Laporan Kegiatan',
    message: 'Risalah Internal iFest - Memo laporan kegiatan perlu ditinjau',
    type: 'memo',
    documentId: 3,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T10:30:00').toISOString(),
  },
  {
    id: 17,
    userId: 2003,
    title: 'Surat Masuk Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP telah diterima',
    type: 'surat-masuk',
    documentId: 3,
    status: 'Selesai',
    isRead: false,
    createdAt: new Date('2026-01-27T12:00:00').toISOString(),
  },
  {
    id: 18,
    userId: 2003,
    title: 'Memo Pengajuan Dana',
    message: 'Risalah Internal iFest - Memo pengajuan dana perlu ditinjau',
    type: 'memo',
    documentId: 1,
    status: 'Selesai',
    isRead: true,
    createdAt: new Date('2026-01-26T16:00:00').toISOString(),
  },
  
  // Notifications for Pegawai (User - userId: 3001)
  {
    id: 6,
    userId: 3001,
    title: 'Surat Keluar Disetujui',
    message: 'Surat permohonan cuti Anda telah disetujui',
    type: 'surat-keluar',
    documentId: 1,
    status: 'Selesai',
    isRead: false,
    createdAt: new Date('2026-01-27T11:00:00').toISOString(),
  },
  {
    id: 7,
    userId: 3001,
    title: 'Memo Laporan Kegiatan',
    message: 'Risalah Internal iFest - Memo laporan kegiatan perlu dilengkapi',
    type: 'memo',
    documentId: 3,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T15:00:00').toISOString(),
  },
  
  // Notifications for Admin (userId: 1001)
  {
    id: 8,
    userId: 1001,
    title: 'Surat Masuk Baru',
    message: 'Pt Lorem Ipsum - Surat Keluar POP perlu diproses',
    type: 'surat-masuk',
    documentId: 1,
    status: 'Dalam Proses',
    isRead: false,
    createdAt: new Date('2026-01-27T09:00:00').toISOString(),
  },
  {
    id: 9,
    userId: 1001,
    title: 'Memo Koordinasi',
    message: 'Risalah Internal iFest - Memo koordinasi telah diterima',
    type: 'memo',
    documentId: 4,
    status: 'Selesai',
    isRead: false,
    createdAt: new Date('2026-01-27T16:00:00').toISOString(),
  },
  {
    id: 10,
    userId: 1001,
    title: 'Pegawai Baru Terdaftar',
    message: 'Pegawai baru Ahmad Fauzi telah terdaftar di sistem',
    type: 'system',
    documentId: null,
    status: null,
    isRead: false,
    createdAt: new Date('2026-01-27T07:00:00').toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    
    // Filter notifications by userId
    const userNotifications = sampleNotifications.filter(
      notif => notif.userId === payload.userId
    );

    return NextResponse.json({
      success: true,
      notifications: userNotifications,
      unreadCount: userNotifications.filter(n => !n.isRead).length,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { notificationIds, deleteAll } = await request.json();

    if (deleteAll) {
      // Delete all user notifications
      const indices = sampleNotifications
        .map((n, i) => (n.userId === payload.userId ? i : -1))
        .filter(i => i !== -1)
        .reverse();
      
      indices.forEach(i => sampleNotifications.splice(i, 1));
    } else if (notificationIds && Array.isArray(notificationIds)) {
      // Delete specific notifications
      const indices = sampleNotifications
        .map((n, i) => (notificationIds.includes(n.id) && n.userId === payload.userId ? i : -1))
        .filter(i => i !== -1)
        .reverse();
      
      indices.forEach(i => sampleNotifications.splice(i, 1));
    }

    return NextResponse.json({
      success: true,
      message: 'Notifikasi berhasil dihapus',
    });
  } catch (error) {
    console.error('Delete notifications error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    const { notificationId } = await request.json();

    const notification = sampleNotifications.find(
      n => n.id === notificationId && n.userId === payload.userId
    );

    if (notification) {
      notification.isRead = true;
    }

    return NextResponse.json({
      success: true,
      message: 'Notifikasi ditandai sebagai dibaca',
    });
  } catch (error) {
    console.error('Update notification error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan' },
      { status: 500 }
    );
  }
}
