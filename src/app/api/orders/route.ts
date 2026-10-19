import { NextResponse } from 'next/server';
import { getOrders, createOrder, updateOrderStatus, deleteOrder } from '@/lib/dbStore';

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items || !body.items.length) {
      return NextResponse.json({ success: false, message: 'Cart items are required' }, { status: 400 });
    }
    const order = await createOrder(body);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { orderId, orderStatus, paymentStatus } = await request.json();
    if (!orderId || !orderStatus) {
      return NextResponse.json({ success: false, message: 'orderId and orderStatus are required' }, { status: 400 });
    }
    const updated = await updateOrderStatus(orderId, orderStatus, paymentStatus);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    if (!orderId) {
      return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400 });
    }
    const success = await deleteOrder(orderId);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
