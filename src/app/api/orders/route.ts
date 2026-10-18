import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { OrderModel } from '@/models/Order';

// In-memory fallback orders
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const memoryOrders: any[] = [
  {
    id: 'ORD-7821',
    customerName: 'Ananya Sharma',
    email: 'ananya.s@example.com',
    phone: '+91 98765 43210',
    address: '42, Defence Colony',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110024',
    items: [
      {
        productId: 'ira-001',
        name: 'Floral Anarkali Dress',
        price: 2999,
        size: 'M',
        quantity: 1,
        image: '/images/prod-sage-anarkali.jpg',
      },
    ],
    totalAmount: 2999,
    paymentMethod: 'upi',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
      return NextResponse.json({
        success: true,
        source: 'mongodb',
        orders: orders.map((o) => ({ ...o, id: o._id?.toString() })),
      });
    }

    return NextResponse.json({
      success: true,
      source: 'memory',
      orders: memoryOrders,
    });
  } catch (error) {
    console.error('Orders GET Error:', error);
    return NextResponse.json({ success: false, orders: memoryOrders }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerName, email, phone, address, city, state, pincode, items, totalAmount, paymentMethod } = body;

    if (!customerName || !email || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing order details' }, { status: 400 });
    }

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod || 'cod',
      status: 'confirmed' as const,
      createdAt: new Date().toISOString(),
    };

    const db = await connectToDatabase();
    if (db) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const created: any = await OrderModel.create(newOrder);
      return NextResponse.json({
        success: true,
        order: { ...created.toObject(), id: created._id.toString() },
      });
    }

    memoryOrders.unshift(newOrder);
    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('Orders POST Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
