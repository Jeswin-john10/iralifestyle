import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getCustomerWishlist, toggleCustomerWishlist, syncCustomerWishlist } from '@/lib/dbStore';
import { CustomerUser } from '@/types';

async function getSessionUser(): Promise<CustomerUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ira_customer_session');
    if (!sessionCookie?.value) return null;
    return JSON.parse(sessionCookie.value) as CustomerUser;
  } catch {
    return null;
  }
}

// GET: Retrieve customer's saved wishlist from MongoDB
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryEmail = searchParams.get('email');
    const queryUserId = searchParams.get('userId');

    const sessionUser = await getSessionUser();
    const userIdentifier = sessionUser?.id || sessionUser?.email || queryUserId || queryEmail;

    if (!userIdentifier) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        count: 0,
        wishlist: [],
      });
    }

    const wishlist = await getCustomerWishlist(userIdentifier);

    return NextResponse.json({
      success: true,
      authenticated: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error('Error fetching customer wishlist:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST: Toggle an item (add/remove) in user's MongoDB wishlist
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, email, userId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();
    const userIdentifier = sessionUser?.id || sessionUser?.email || userId || email;

    if (!userIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login to save to wishlist database.' },
        { status: 401 }
      );
    }

    const result = await toggleCustomerWishlist(userIdentifier, productId);

    return NextResponse.json({
      success: true,
      inWishlist: result.inWishlist,
      wishlistIds: result.wishlistIds,
      count: result.wishlist.length,
      wishlist: result.wishlist,
    });
  } catch (error) {
    console.error('Error toggling customer wishlist:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT: Synchronize guest/local items into user's DB wishlist upon login
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { productIds, email, userId } = body;

    const sessionUser = await getSessionUser();
    const userIdentifier = sessionUser?.id || sessionUser?.email || userId || email;

    if (!userIdentifier) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login to sync wishlist.' },
        { status: 401 }
      );
    }

    const ids = Array.isArray(productIds) ? productIds : [];
    const wishlist = await syncCustomerWishlist(userIdentifier, ids);

    return NextResponse.json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error('Error synchronizing customer wishlist:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
