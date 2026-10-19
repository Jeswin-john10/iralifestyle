'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, Order, Review } from '@/types';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Plus, 
  Trash2, 
  LogOut, 
  ExternalLink, 
  Sparkles, 
  Check,
  Star,
  LayoutDashboard,
  Mail,
  Users,
  BarChart3,
  BarChart2,
  TrendingUp,
  PieChart as PieChartIcon,
  Calendar,
  ArrowUpRight,
  Settings,
  Menu,
  X,
  Edit,
  MessageCircle,
  Copy,
  Clock,
  Send,
  Phone,
  RefreshCw,
  Search,
  CheckCircle2,
  CheckSquare,
  FileSpreadsheet,
  RotateCcw,
  Truck,
  Download,
  Filter
} from 'lucide-react';

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
}

interface SubscriberItem {
  _id?: string;
  email: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'orders' | 'reviews' | 'inquiries' | 'subscribers' | 'reports' | 'options'
  >('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>([]);

  // Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [reviewProductFilter, setReviewProductFilter] = useState<string>('all');
  const [reviewSearch, setReviewSearch] = useState('');
  const [inquirySearch, setInquirySearch] = useState('');
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Charts & Reports state
  const [salesChartPeriod, setSalesChartPeriod] = useState<'monthly' | 'daily'>('monthly');
  const [hoveredSalesPoint, setHoveredSalesPoint] = useState<number | null>(null);
  const [hoveredCategorySlice, setHoveredCategorySlice] = useState<string | null>(null);
  const [reportView, setReportView] = useState<'daily' | 'monthly' | 'yearly' | 'custom'>('monthly');
  const [reportCustomFrom, setReportCustomFrom] = useState('');
  const [reportCustomTo, setReportCustomTo] = useState('');
  const [copiedReport, setCopiedReport] = useState(false);

  // Delivered Orders Audit Modal state
  const [showDeliveredModal, setShowDeliveredModal] = useState(false);
  const [deliveredDateFrom, setDeliveredDateFrom] = useState('');
  const [deliveredDateTo, setDeliveredDateTo] = useState('');
  const [deliveredSearchQuery, setDeliveredSearchQuery] = useState('');
  const [headerTime, setHeaderTime] = useState('');

  // Add Product Form Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    category: 'dresses',
    price: '',
    originalPrice: '',
    description: '',
    fabric: 'Pure Georgette with Silk Lining',
    image: '/images/cat_dress.jpg',
    isFeatured: true,
  });

  // Edit Product Form Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Image Upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  const showNotification = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, ordRes, inqRes, subRes, revRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/orders'),
        fetch('/api/inquiries'),
        fetch('/api/newsletter'),
        fetch('/api/reviews'),
      ]);

      const [prodData, ordData, inqData, subData, revData] = await Promise.all([
        prodRes.json(),
        ordRes.json(),
        inqRes.json(),
        subRes.json(),
        revRes.json(),
      ]);

      if (prodData.products) setProducts(prodData.products);
      if (ordData.orders) setOrders(ordData.orders);
      if (inqData.inquiries) setInquiries(inqData.inquiries);
      if (subData.subscribers) setSubscribers(subData.subscribers);
      if (revData.reviews) setReviews(revData.reviews);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const updateTime = () => {
      setHeaderTime(
        new Date().toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' });
    router.push('/admin/ira/login');
  };

  // Cloudflare R2 Upload
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadSuccessMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        if (isEdit && editingProduct) {
          setEditingProduct({ ...editingProduct, image: data.url });
        } else {
          setNewProd((prev) => ({ ...prev, image: data.url }));
        }
        setUploadSuccessMsg(
          `Uploaded to ${data.provider === 'cloudflare' ? 'Cloud Storage' : 'Local Storage'}`
        );
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Product Add
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.title || !newProd.price) return;

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProd,
          price: Number(newProd.price),
          originalPrice: newProd.originalPrice ? Number(newProd.originalPrice) : undefined,
          categoryLabel: newProd.category.toUpperCase(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewProd({
          title: '',
          category: 'dresses',
          price: '',
          originalPrice: '',
          description: '',
          fabric: 'Pure Georgette with Silk Lining',
          image: '/images/cat_dress.jpg',
          isFeatured: true,
        });
        showNotification('New garment successfully added to boutique catalog!');
        loadData();
      }
    } catch (err) {
      console.error('Failed to create product', err);
    }
  };

  // Product Edit
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct),
      });

      const data = await res.json();
      if (data.success) {
        setEditingProduct(null);
        showNotification('Product details updated successfully!');
        loadData();
      }
    } catch (err) {
      console.error('Failed to update product', err);
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you wish to permanently delete this luxury piece?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showNotification('Product removed from catalog.');
    } catch (err) {
      console.error('Delete product error', err);
    }
  };

  // Order Status Change
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, orderStatus: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus as any } : o))
        );
        showNotification(`Order #${orderId} status changed to ${newStatus}`);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  // Order Delete
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Delete order #${orderId}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/orders?orderId=${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
        showNotification(`Order #${orderId} deleted.`);
      }
    } catch (err) {
      console.error('Failed to delete order', err);
    }
  };

  // Contact Inquiries Delete
  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Delete this customer inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setInquiries((prev) => prev.filter((inq) => inq._id !== id));
        showNotification('Inquiry deleted.');
      }
    } catch (err) {
      console.error('Failed to delete inquiry', err);
    }
  };

  // Newsletter Subscriber Delete
  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm(`Remove subscriber ${email}?`)) return;
    try {
      const res = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSubscribers((prev) => prev.filter((s) => s.email !== email));
        showNotification(`Subscriber ${email} removed.`);
      }
    } catch (err) {
      console.error('Failed to delete subscriber', err);
    }
  };

  // Review Actions
  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you wish to delete this customer review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        showNotification('Review removed successfully.');
      }
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const handleToggleReviewStatus = async (id: string, currentStatus?: string) => {
    const nextStatus = currentStatus === 'approved' ? 'pending' : 'approved';
    try {
      const res = await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: nextStatus as any } : r))
        );
        showNotification(`Review status changed to ${nextStatus}.`);
      }
    } catch (err) {
      console.error('Failed to update review status', err);
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesProduct = reviewProductFilter === 'all' || r.productId === reviewProductFilter;
      const matchesSearch =
        !reviewSearch ||
        r.customerName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.productTitle.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        r.comment.toLowerCase().includes(reviewSearch.toLowerCase());
      return matchesProduct && matchesSearch;
    });
  }, [reviews, reviewProductFilter, reviewSearch]);

  // Copy all subscriber emails
  const handleCopySubscribers = () => {
    const emailList = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    showNotification(`Copied ${subscribers.length} subscriber email(s) to clipboard!`);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  // Metrics
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (o.total || 0), 0),
    [orders]
  );

  const pendingOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === 'Pending').length,
    [orders]
  );

  const deliveredOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === 'Delivered').length,
    [orders]
  );

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = orderFilterStatus === 'all' || o.orderStatus === orderFilterStatus;
      if (!matchesStatus) return false;

      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim().replace(/^#/, '');
        const idMatch = (o.orderId || o._id || '').toLowerCase().includes(q);
        const nameMatch = (o.customer?.fullName || '').toLowerCase().includes(q);
        const phoneMatch = (o.customer?.phone || '').toLowerCase().includes(q);
        const emailMatch = (o.customer?.email || '').toLowerCase().includes(q);
        const itemMatch = (o.items || []).some((it) => (it.title || '').toLowerCase().includes(q));
        if (!idMatch && !nameMatch && !phoneMatch && !emailMatch && !itemMatch) return false;
      }

      return true;
    });
  }, [orders, orderFilterStatus, orderSearch]);

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      if (!inquirySearch.trim()) return true;
      const q = inquirySearch.toLowerCase().trim().replace(/^#/, '');
      const nameMatch = (inq.name || '').toLowerCase().includes(q);
      const emailMatch = (inq.email || '').toLowerCase().includes(q);
      const phoneMatch = inq.phone ? inq.phone.toLowerCase().includes(q) : false;
      const subjectMatch = inq.subject ? inq.subject.toLowerCase().includes(q) : false;
      const messageMatch = (inq.message || '').toLowerCase().includes(q);
      return nameMatch || emailMatch || phoneMatch || subjectMatch || messageMatch;
    });
  }, [inquiries, inquirySearch]);

  // Product Counts by Category (for SVG Donut / Pie Diagram)
  const categoryStats = useMemo(() => {
    const total = products.length;
    const catCounts: Record<string, number> = {};

    // Premium Bespoke Palette: Black, Bronze/Brown, Champagne/White-Gold, Espresso, Slate Grey & Ash Grey
    const LUXURY_PALETTE = [
      '#1A1816', // Deep Onyx Black
      '#8C6538', // Rich Bronze / Warm Brown
      '#C5A880', // Champagne Gold / Warm Light Bronze
      '#4A3E36', // Deep Espresso Brown
      '#6B645C', // Slate Charcoal Grey
      '#9E978E', // Refined Ash Grey
      '#2E2A27', // Midnight Charcoal
      '#B39B7D', // Soft Muted Khaki Bronze
    ];

    const catLabels: Record<string, { label: string; color: string }> = {
      dresses: { label: 'Dresses', color: '#1A1816' }, // Deep Onyx Black
      kurtis: { label: 'Kurtis', color: '#8C6538' }, // Rich Bronze Brown
      kurtas: { label: 'Kurtas & Tunics', color: '#8C6538' },
      sarees: { label: 'Designer Sarees', color: '#C5A880' }, // Champagne Gold
      'co-ord-sets': { label: 'Co-ord Sets', color: '#4A3E36' }, // Deep Espresso Brown
      'co-ords': { label: 'Co-ord Sets', color: '#4A3E36' },
      'new-arrivals': { label: 'New Arrivals', color: '#6B645C' }, // Slate Charcoal Grey
      'new arrivals': { label: 'New Arrivals', color: '#6B645C' },
      lehengas: { label: 'Bridal Lehengas', color: '#2E2A27' }, // Midnight Charcoal
      tops: { label: 'Luxury Tops', color: '#9E978E' }, // Refined Ash Grey
      festive: { label: 'Festive Wear', color: '#A67C43' }, // Warm Antique Gold
    };

    products.forEach((p) => {
      const catKey = (p.category || 'dresses').toLowerCase().trim();
      catCounts[catKey] = (catCounts[catKey] || 0) + 1;
    });

    const entries = Object.entries(catCounts);
    const slices = entries.map(([catKey, count], idx) => {
      const meta = catLabels[catKey];
      const fallbackColor = LUXURY_PALETTE[idx % LUXURY_PALETTE.length];
      const formattedLabel = meta?.label || catKey
        .split(/[-_]/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        category: catKey,
        label: formattedLabel,
        count,
        percent,
        color: meta?.color || fallbackColor,
      };
    }).sort((a, b) => b.count - a.count);

    if (slices.length === 0) {
      return {
        total: 0,
        slices: [
          { category: 'dresses', label: 'Dresses', count: 0, percent: 0, color: '#1A1816' },
        ],
      };
    }

    return { total, slices };
  }, [products]);

  // Animated Selling Report Data (Monthly / Daily toggle)
  const salesTrendData = useMemo(() => {
    if (salesChartPeriod === 'monthly') {
      const months: { key: string; label: string; revenue: number; orders: number }[] = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const label = d.toLocaleDateString('en-US', { month: 'short' });
        months.push({ key, label, revenue: 0, orders: 0 });
      }

      orders.forEach((o) => {
        const orderDate = new Date(o.createdAt || Date.now());
        const key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        const match = months.find((m) => m.key === key);
        if (match) {
          match.revenue += Number(o.total || 0);
          match.orders += 1;
        }
      });

      const totalPeriodRevenue = months.reduce((sum, m) => sum + m.revenue, 0);
      const maxRevenue = Math.max(...months.map((m) => m.revenue), 5000);

      return { list: months, totalPeriodRevenue, maxRevenue };
    } else {
      const days: { key: string; label: string; revenue: number; orders: number }[] = [];
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        const label = d.toLocaleDateString('en-US', { weekday: 'short' });
        days.push({ key, label, revenue: 0, orders: 0 });
      }

      orders.forEach((o) => {
        const orderDate = new Date(o.createdAt || Date.now());
        const key = orderDate.toISOString().slice(0, 10);
        const match = days.find((d) => d.key === key);
        if (match) {
          match.revenue += Number(o.total || 0);
          match.orders += 1;
        }
      });

      const totalPeriodRevenue = days.reduce((sum, d) => sum + d.revenue, 0);
      const maxRevenue = Math.max(...days.map((d) => d.revenue), 2000);

      return { list: days, totalPeriodRevenue, maxRevenue };
    }
  }, [orders, salesChartPeriod]);

  // Periodic Reporting (Date-wise, Month-wise, Year-wise, Custom Range)
  const reportBreakdown = useMemo(() => {
    let totalRevenue = 0;
    let totalUnits = 0;

    const rowMap: Record<
      string,
      {
        periodKey: string;
        label: string;
        timestamp: number;
        ordersCount: number;
        unitsSold: number;
        deliveredCount: number;
        revenue: number;
      }
    > = {};

    const filteredOrders = orders.filter((o) => {
      if (reportView !== 'custom') return true;
      if (!reportCustomFrom && !reportCustomTo) return true;
      const orderDate = new Date(o.createdAt || Date.now());
      if (reportCustomFrom) {
        const from = new Date(reportCustomFrom);
        from.setHours(0, 0, 0, 0);
        if (orderDate < from) return false;
      }
      if (reportCustomTo) {
        const to = new Date(reportCustomTo);
        to.setHours(23, 59, 59, 999);
        if (orderDate > to) return false;
      }
      return true;
    });

    filteredOrders.forEach((o) => {
      const orderDate = new Date(o.createdAt || Date.now());
      const unitsInOrder = o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1;
      totalUnits += unitsInOrder;
      totalRevenue += Number(o.total || 0);

      let key = '';
      let label = '';
      let timestamp = orderDate.getTime();

      if (reportView === 'daily' || reportView === 'custom') {
        key = orderDate.toISOString().slice(0, 10);
        label = orderDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      } else if (reportView === 'monthly') {
        key = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        label = orderDate.toLocaleDateString('en-IN', {
          month: 'long',
          year: 'numeric',
        });
        timestamp = new Date(orderDate.getFullYear(), orderDate.getMonth(), 1).getTime();
      } else {
        key = `${orderDate.getFullYear()}`;
        label = `Year ${orderDate.getFullYear()}`;
        timestamp = new Date(orderDate.getFullYear(), 0, 1).getTime();
      }

      if (!rowMap[key]) {
        rowMap[key] = {
          periodKey: key,
          label,
          timestamp,
          ordersCount: 0,
          unitsSold: 0,
          deliveredCount: 0,
          revenue: 0,
        };
      }

      rowMap[key].ordersCount += 1;
      rowMap[key].unitsSold += unitsInOrder;
      if (o.orderStatus === 'Delivered') {
        rowMap[key].deliveredCount += 1;
      }
      rowMap[key].revenue += Number(o.total || 0);
    });

    const rows = Object.values(rowMap).sort((a, b) => b.timestamp - a.timestamp);
    const maxRevenue = rows.length > 0 ? Math.max(...rows.map((r) => r.revenue), 1) : 1;

    return {
      rows,
      totalRevenue,
      totalOrders: filteredOrders.length,
      totalUnits,
      maxRevenue,
    };
  }, [orders, reportView, reportCustomFrom, reportCustomTo]);

  // Delivered Orders calculation for Custom Date Audit Modal
  const deliveredOrdersData = useMemo(() => {
    const delivered = orders.filter((o) => o.orderStatus === 'Delivered');

    const filtered = delivered.filter((o) => {
      const orderDate = new Date(o.createdAt || Date.now());

      if (deliveredDateFrom) {
        const from = new Date(deliveredDateFrom);
        from.setHours(0, 0, 0, 0);
        if (orderDate < from) return false;
      }

      if (deliveredDateTo) {
        const to = new Date(deliveredDateTo);
        to.setHours(23, 59, 59, 999);
        if (orderDate > to) return false;
      }

      if (deliveredSearchQuery.trim()) {
        const q = deliveredSearchQuery.toLowerCase();
        const idMatch = (o.orderId || o._id || '').toLowerCase().includes(q);
        const nameMatch = (o.customer?.fullName || '').toLowerCase().includes(q);
        const emailMatch = (o.customer?.email || '').toLowerCase().includes(q);
        const phoneMatch = (o.customer?.phone || '').toLowerCase().includes(q);
        const itemMatch = (o.items || []).some((it) => (it.title || '').toLowerCase().includes(q));
        if (!idMatch && !nameMatch && !emailMatch && !phoneMatch && !itemMatch) return false;
      }

      return true;
    });

    filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const totalRevenue = filtered.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const totalUnits = filtered.reduce(
      (sum, o) => sum + (o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1),
      0
    );
    const aov = filtered.length ? Math.round(totalRevenue / filtered.length) : 0;

    return {
      orders: filtered,
      totalOrders: filtered.length,
      totalRevenue,
      totalUnits,
      aov,
      allDeliveredCount: delivered.length,
    };
  }, [orders, deliveredDateFrom, deliveredDateTo, deliveredSearchQuery]);

  // Export Delivered Orders Excel with Rich Colors & Styling
  const exportDeliveredExcel = () => {
    if (deliveredOrdersData.orders.length === 0) {
      showNotification('No delivered orders found in this date range to export.');
      return;
    }

    const dateRangeLabel = deliveredDateFrom && deliveredDateTo
      ? `${deliveredDateFrom}_to_${deliveredDateTo}`
      : deliveredDateFrom
      ? `from_${deliveredDateFrom}`
      : deliveredDateTo
      ? `until_${deliveredDateTo}`
      : 'All_Dates';

    const filename = `IRA_Delivered_Orders_${dateRangeLabel}.xls`;

    const rowsHtml = deliveredOrdersData.orders
      .map((o, idx) => {
        const orderDate = new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
        const orderTime = new Date(o.createdAt || Date.now()).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const itemsText = (o.items || [])
          .map((it) => `${it.title} (Qty: ${it.quantity || 1}, Size: ${it.size || 'Standard'})`)
          .join('; ');
        const units = o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1;
        const bg = idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7';
        const displayCity = o.shippingAddress?.city || '';
        const displayState = o.shippingAddress?.state || '';
        const destination = displayCity && displayState ? `${displayCity}, ${displayState}` : displayCity || displayState || 'India';

        return `
          <tr style="background-color: ${bg};">
            <td style="border: 1px solid #E5DFD5; padding: 10px; font-weight: bold; color: #181513;">#${(o.orderId || o._id || '').slice(-8).toUpperCase()}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #181513; font-weight: 600;">${o.customer?.fullName || 'Patron'}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #4A4540;">${o.customer?.email || 'N/A'}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #4A4540;">${o.customer?.phone || 'N/A'}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #4A4540;">${destination}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #181513;">${orderDate} ${orderTime}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; color: #333333; font-size: 11px;">${itemsText || 'Garment Item'}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: center; color: #181513;">${units}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: center; background-color: #E8F5E9; color: #1B5E20; font-weight: bold;">Delivered</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: right; font-weight: bold; color: #8E6B38; font-size: 13px;">₹${Number(o.total || 0).toLocaleString('en-IN')}</td>
          </tr>
        `;
      })
      .join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Delivered Orders</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
        </style>
      </head>
      <body>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr>
            <td colspan="10" style="background-color: #181513; color: #FAF7F2; padding: 16px; font-size: 18px; font-weight: bold; border: 1px solid #C5A880; letter-spacing: 2px;">
              IRA LIFESTYLE — DELIVERED ORDERS AUDIT REPORT
            </td>
          </tr>
          <tr>
            <td colspan="10" style="background-color: #C5A880; color: #181513; padding: 8px 16px; font-size: 12px; font-weight: bold;">
              Guruvayoor & Thrissur Atelier • Generated on: ${new Date().toLocaleString('en-IN')} • Filter: ${deliveredDateFrom ? `From ${deliveredDateFrom}` : 'Beginning'} to ${deliveredDateTo ? `Until ${deliveredDateTo}` : 'Current Date'}
            </td>
          </tr>
          <tr style="background-color: #F4EFE6;">
            <td colspan="2" style="padding: 10px; border: 1px solid #E5DFD5; font-weight: bold; color: #181513;">Delivered Orders: ${deliveredOrdersData.totalOrders}</td>
            <td colspan="3" style="padding: 10px; border: 1px solid #E5DFD5; font-weight: bold; color: #181513;">Total Garments: ${deliveredOrdersData.totalUnits} pieces</td>
            <td colspan="2" style="padding: 10px; border: 1px solid #E5DFD5; font-weight: bold; color: #181513;">Average Order Value: ₹${deliveredOrdersData.aov.toLocaleString('en-IN')}</td>
            <td colspan="3" style="padding: 10px; border: 1px solid #E5DFD5; font-weight: bold; color: #8E6B38; font-size: 14px; text-align: right;">Total Delivered Revenue: ₹${deliveredOrdersData.totalRevenue.toLocaleString('en-IN')}</td>
          </tr>
          <tr><td colspan="10" style="height: 12px;"></td></tr>
          <tr style="background-color: #181513; color: #FAF7F2; font-weight: bold; text-transform: uppercase; font-size: 11px;">
            <th style="border: 1px solid #C5A880; padding: 12px; color: #C5A880;">Order ID</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Patron Name</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Email Address</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Phone Line</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Destination</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Order Date</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2;">Garments & Specs</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: center;">Units</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: center;">Fulfillment Status</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #C5A880; text-align: right;">Gross Sales (INR)</th>
          </tr>
          ${rowsHtml}
          <tr style="background-color: #181513; color: #FAF7F2; font-weight: bold;">
            <td colspan="7" style="border: 1px solid #C5A880; padding: 12px; text-align: right; color: #C5A880; font-size: 13px;">GRAND TOTAL DELIVERED:</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: center; color: #FAF7F2; font-size: 13px;">${deliveredOrdersData.totalUnits}</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: center; background-color: #2E7D32; color: #FFFFFF;">100% DELIVERED</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: right; color: #C5A880; font-size: 15px;">₹${deliveredOrdersData.totalRevenue.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Excel report successfully exported: ${filename}`);
  };

  // Export Sales & Revenue Breakdown Excel with Rich Colors & Styling
  const exportBreakdownExcel = () => {
    if (reportBreakdown.rows.length === 0) {
      showNotification('No report data to export.');
      return;
    }

    const filename = `IRA_Sales_Revenue_${reportView.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.xls`;

    const rowsHtml = reportBreakdown.rows
      .map((r, idx) => {
        const aov = Math.round(r.revenue / (r.ordersCount || 1));
        const delPct = Math.round((r.deliveredCount / (r.ordersCount || 1)) * 100);
        const bg = idx % 2 === 0 ? '#FFFFFF' : '#FDFBF7';
        return `
          <tr style="background-color: ${bg};">
            <td style="border: 1px solid #E5DFD5; padding: 10px; font-weight: bold; color: #181513;">${r.label}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: center; color: #181513;">${r.ordersCount}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: center; color: #181513;">${r.unitsSold}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: center; font-weight: bold; color: ${delPct === 100 ? '#2E7D32' : '#B45309'};">${delPct}%</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: right; font-weight: bold; color: #8E6B38; font-size: 13px;">₹${r.revenue.toLocaleString('en-IN')}</td>
            <td style="border: 1px solid #E5DFD5; padding: 10px; text-align: right; color: #181513;">₹${aov.toLocaleString('en-IN')}</td>
          </tr>
        `;
      })
      .join('');

    const excelTemplate = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>${reportView.toUpperCase()} Report</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td colspan="6" style="background-color: #181513; color: #FAF7F2; padding: 16px; font-size: 18px; font-weight: bold; border: 1px solid #C5A880; letter-spacing: 2px;">
              IRA LIFESTYLE — ${reportView.toUpperCase()} SALES & REVENUE REPORT
            </td>
          </tr>
          <tr>
            <td colspan="6" style="background-color: #C5A880; color: #181513; padding: 8px 16px; font-size: 12px; font-weight: bold;">
              Generated on: ${new Date().toLocaleString('en-IN')} • Total Revenue: ₹${reportBreakdown.totalRevenue.toLocaleString('en-IN')} • Total Orders: ${reportBreakdown.totalOrders} • Total Units: ${reportBreakdown.totalUnits}
            </td>
          </tr>
          <tr style="background-color: #181513; color: #FAF7F2; font-weight: bold;">
            <th style="border: 1px solid #C5A880; padding: 12px; color: #C5A880;">Period</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: center;">Orders</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: center;">Units Sold</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: center;">Delivered %</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #C5A880; text-align: right;">Gross Revenue (INR)</th>
            <th style="border: 1px solid #C5A880; padding: 12px; color: #FAF7F2; text-align: right;">Average Order Value (AOV)</th>
          </tr>
          ${rowsHtml}
          <tr style="background-color: #181513; color: #FAF7F2; font-weight: bold;">
            <td style="border: 1px solid #C5A880; padding: 12px; color: #C5A880;">TOTAL:</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: center; color: #FAF7F2;">${reportBreakdown.totalOrders}</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: center; color: #FAF7F2;">${reportBreakdown.totalUnits}</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: center; color: #FAF7F2;">-</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: right; color: #C5A880; font-size: 15px;">₹${reportBreakdown.totalRevenue.toLocaleString('en-IN')}</td>
            <td style="border: 1px solid #C5A880; padding: 12px; text-align: right; color: #FAF7F2;">₹${reportBreakdown.totalOrders ? Math.round(reportBreakdown.totalRevenue / reportBreakdown.totalOrders).toLocaleString('en-IN') : 0}</td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification(`Excel report successfully exported: ${filename}`);
  };

  // Export / Copy Report Summary
  const handleCopyReport = () => {
    if (reportBreakdown.rows.length === 0) {
      showNotification('No report rows to copy.');
      return;
    }

    const title = `IRA LIFESTYLE - ${reportView.toUpperCase()} SALES & REVENUE REPORT`;
    const header = `Period | Orders | Units | Delivered % | Revenue (INR) | AOV (INR)`;
    const lines = reportBreakdown.rows.map((r) => {
      const aov = Math.round(r.revenue / (r.ordersCount || 1));
      const delPct = Math.round((r.deliveredCount / (r.ordersCount || 1)) * 100);
      return `${r.label} | ${r.ordersCount} | ${r.unitsSold} | ${delPct}% | ₹${r.revenue.toLocaleString('en-IN')} | ₹${aov.toLocaleString('en-IN')}`;
    });

    const summary = [
      title,
      `Generated on: ${new Date().toLocaleString('en-IN')}`,
      `Total Revenue: ₹${reportBreakdown.totalRevenue.toLocaleString('en-IN')} | Total Orders: ${reportBreakdown.totalOrders} | Units Sold: ${reportBreakdown.totalUnits}`,
      '--------------------------------------------------------------------------------',
      header,
      '--------------------------------------------------------------------------------',
      ...lines,
    ].join('\n');

    navigator.clipboard.writeText(summary);
    setCopiedReport(true);
    showNotification(`Copied ${reportView} report with ${reportBreakdown.rows.length} record(s) to clipboard!`);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div style={{ backgroundColor: '#F8F6F0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {actionNotice && (
        <div 
          className="position-fixed top-0 start-50 translate-middle-x mt-3 px-4 py-2 rounded-pill shadow-lg text-white d-flex align-items-center gap-2"
          style={{ backgroundColor: '#1A1816', zIndex: 9999, border: '1px solid #C5A880', fontSize: '0.85rem' }}
        >
          <CheckCircle2 size={16} color="#C5A880" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* ================= ADMIN HEADER ================= */}
      <header
        className="sticky-top w-100 px-2.5 px-sm-3 px-md-4 py-2 d-flex align-items-center justify-content-between"
        style={{
          background: 'linear-gradient(180deg, #1C1917 0%, #12100E 100%)',
          borderBottom: '1px solid rgba(197, 168, 128, 0.28)',
          boxShadow: '0 1px 0 rgba(197, 168, 128, 0.35) inset, 0 6px 24px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(12px)',
          zIndex: 1050,
          color: '#FAF7F2',
          minHeight: '60px',
        }}
      >
        {/* Left: Hamburger + Logo + Brand Monogram */}
        <div className="d-flex align-items-center gap-2 gap-sm-3">
          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="btn d-lg-none d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
            style={{ 
              width: '38px', 
              height: '38px', 
              border: '1px solid rgba(197, 168, 128, 0.4)', 
              backgroundColor: 'rgba(255, 255, 255, 0.06)', 
              color: '#C5A880',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            aria-label="Toggle Navigation"
          >
            {mobileSidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>

          {/* Logo & Brand Title */}
          <Link href="/admin/dashboard" className="d-flex align-items-center gap-2 gap-sm-2.5 text-decoration-none text-white">
            <div 
              className="d-flex align-items-center justify-content-center rounded-2 p-1"
              style={{ 
                position: 'relative', 
                width: '36px', 
                height: '42px', 
                flexShrink: 0,
                border: '1px solid rgba(197, 168, 128, 0.25)',
                backgroundColor: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <Image src="/images/logo.png" alt="IRA" fill sizes="36px" style={{ objectFit: 'contain' }} />
            </div>
            <div>
              <div className="d-flex align-items-center gap-1.5">
                <span 
                  className="font-serif fw-bold text-white d-block" 
                  style={{ 
                    letterSpacing: '0.18em', 
                    fontSize: '1.05rem',
                    lineHeight: '1.2' 
                  }}
                >
                  IRA LIFESTYLE
                </span>
                <span 
                  className="badge rounded-pill d-none d-xl-inline-flex align-items-center gap-1"
                  style={{ 
                    backgroundColor: 'rgba(16, 185, 129, 0.12)', 
                    color: '#34D399', 
                    border: '1px solid rgba(16, 185, 129, 0.3)', 
                    fontSize: '0.62rem',
                    padding: '2px 8px'
                  }}
                >
                  <span className="rounded-circle" style={{ width: '5px', height: '5px', backgroundColor: '#34D399' }} /> Live
                </span>
              </div>
              <small 
                className="d-none d-sm-flex align-items-center gap-1" 
                style={{ fontSize: '0.7rem', color: '#C5A880', letterSpacing: '0.04em' }}
              >
                <span>Guruvayoor & Thrissur Atelier</span>
                <span style={{ opacity: 0.5 }}>•</span>
                <span style={{ color: 'rgba(250, 247, 242, 0.75)' }}>Studio Portal</span>
              </small>
            </div>
          </Link>
        </div>

        {/* Center: Interactive Quick Links (Tablet & Desktop) */}
        <div className="d-none d-md-flex align-items-center gap-2">
          {/* Visit Live Store Link */}
          <Link
            href="/"
            target="_blank"
            className="btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5 text-decoration-none"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FAF7F2',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease',
            }}
            title="Preview customer storefront in a new tab"
          >
            <ExternalLink size={12} color="#C5A880" />
            <span>Storefront</span>
          </Link>

          {/* Sync / Refresh Data Button */}
          <button
            onClick={loadData}
            className="btn btn-sm rounded-pill d-flex align-items-center gap-1.5 px-3 py-1.5"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FAF7F2',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              fontSize: '0.75rem',
              transition: 'all 0.2s ease',
            }}
            title="Reload latest orders, inquiries, and reviews"
          >
            <RefreshCw 
              size={12} 
              color="#C5A880" 
              style={{
                animation: loading ? 'iraSpin 1s linear infinite' : 'none',
                transition: 'transform 0.3s ease'
              }} 
            />
            <span>{loading ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          {/* Live Studio IST Clock */}
          {headerTime && (
            <div 
              className="d-none d-lg-flex align-items-center gap-1.5 px-2.5 py-1.5 rounded-pill"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(197, 168, 128, 0.2)',
                fontSize: '0.72rem',
                color: '#D4C3A3',
              }}
              title="Atelier Local Time (IST)"
            >
              <Clock size={12} color="#C5A880" />
              <span>{headerTime} IST</span>
            </div>
          )}
        </div>

        {/* Right: Quick Add + Notification Shortcuts + Admin Profile + Logout */}
        <div className="d-flex align-items-center gap-1.5 gap-sm-2 gap-md-2.5">
          {/* Quick Action: New Garment */}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-sm rounded-pill fw-semibold d-flex align-items-center gap-1 px-2.5 px-sm-3 py-1.5 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #C5A880 0%, #B8966C 100%)',
              color: '#151311',
              border: '1px solid rgba(197, 168, 128, 0.6)',
              fontSize: '0.76rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
            }}
            title="Create and publish new luxury garment"
          >
            <Plus size={14} />
            <span className="d-none d-sm-inline">New Garment</span>
          </button>

          {/* Quick Inquiries Bell / Mail */}
          <button
            onClick={() => setActiveTab('inquiries')}
            className="btn btn-sm d-flex align-items-center justify-content-center position-relative rounded-circle"
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              color: '#C5A880',
              padding: 0,
              transition: 'all 0.2s ease',
            }}
            title="Client Inquiries & Direct Messages"
          >
            <Mail size={15} />
            {inquiries.length > 0 && (
              <span 
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-dark"
                style={{ fontSize: '0.58rem', padding: '2px 5px' }}
              >
                {inquiries.length}
              </span>
            )}
          </button>

          {/* Admin Profile Chip (Desktop) */}
          <div 
            className="d-none d-xl-flex align-items-center gap-2 px-2.5 py-1 rounded-pill"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(197, 168, 128, 0.25)',
            }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#C5A880',
                color: '#151311',
                fontSize: '0.68rem',
              }}
            >
              IRA
            </div>
            <span className="text-white small fw-medium" style={{ fontSize: '0.74rem' }}>
              Nikhil & Anju
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="btn btn-sm d-flex align-items-center gap-1.5 px-2.5 px-sm-3 py-1.5 rounded-pill"
            style={{
              backgroundColor: 'rgba(220, 38, 38, 0.12)',
              color: '#F87171',
              border: '1px solid rgba(220, 38, 38, 0.35)',
              fontSize: '0.75rem',
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease',
            }}
            title="Log Out of Administration"
          >
            <LogOut size={13} />
            <span className="d-none d-sm-inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTAINER WITH SIDEBAR & CONTENT ================= */}
      <div className="d-flex flex-grow-1 position-relative">
        {/* Mobile backdrop */}
        {mobileSidebarOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
            style={{ backgroundColor: 'rgba(0,0,0,0.65)', zIndex: 1040 }}
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ================= ADMIN SIDEBAR ================= */}
        <aside
          className={`d-flex flex-column flex-shrink-0 transition-all ${
            mobileSidebarOpen ? 'd-flex position-fixed start-0 top-0 bottom-0' : 'd-none d-lg-flex'
          }`}
          style={{
            width: '260px',
            backgroundColor: '#191715',
            borderRight: '1px solid rgba(197, 168, 128, 0.2)',
            zIndex: 1045,
            minHeight: 'calc(100vh - 56px)',
            padding: '1.25rem 0.85rem',
          }}
        >
          {/* Mobile Sidebar Close Header */}
          <div className="d-lg-none d-flex justify-content-between align-items-center mb-3 px-2 pb-2 border-bottom border-secondary">
            <span className="text-white fw-bold small">NAVIGATION</span>
            <button onClick={() => setMobileSidebarOpen(false)} className="btn btn-sm btn-link text-white p-0">
              <X size={20} />
            </button>
          </div>

          {/* Admin Profile Chip */}
          <div
            className="p-3 rounded mb-3 d-flex align-items-center gap-2"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(197, 168, 128, 0.15)' }}
          >
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
              style={{ width: '36px', height: '36px', backgroundColor: '#C5A880', color: '#151311', fontSize: '0.85rem' }}
            >
              IRA
            </div>
            <div className="overflow-hidden">
              <div className="text-white fw-semibold small text-truncate">Nikhil & Anju</div>
              <div style={{ color: '#C5A880', fontSize: '0.68rem', letterSpacing: '0.05em' }}>CO-FOUNDERS / ADMIN</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="nav nav-pills flex-column gap-1 flex-grow-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'dashboard' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'dashboard' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'dashboard' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <LayoutDashboard size={17} />
                <span>Dashboard Overview</span>
              </div>
            </button>

            {/* 2. Products */}
            <button
              onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'products' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'products' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'products' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Package size={17} />
                <span>Products & Stock</span>
              </div>
              <span className="badge rounded-pill bg-dark text-white border border-secondary" style={{ fontSize: '0.68rem' }}>
                {products.length}
              </span>
            </button>

            {/* 3. Orders */}
            <button
              onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'orders' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'orders' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'orders' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <ShoppingBag size={17} />
                <span>Orders & WhatsApp</span>
              </div>
              {pendingOrdersCount > 0 ? (
                <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                  {pendingOrdersCount} new
                </span>
              ) : (
                <span className="badge rounded-pill bg-dark text-white border border-secondary" style={{ fontSize: '0.68rem' }}>
                  {orders.length}
                </span>
              )}
            </button>

            {/* Client Reviews */}
            <button
              onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'reviews' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'reviews' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'reviews' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Star size={17} />
                <span>Client Reviews</span>
              </div>
              <span className="badge rounded-pill bg-dark text-white border border-secondary" style={{ fontSize: '0.68rem' }}>
                {reviews.length}
              </span>
            </button>

            {/* 4. Inquiries */}
            <button
              onClick={() => { setActiveTab('inquiries'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'inquiries' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'inquiries' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'inquiries' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Mail size={17} />
                <span>Contact Inquiries</span>
              </div>
              <span className="badge rounded-pill bg-dark text-white border border-secondary" style={{ fontSize: '0.68rem' }}>
                {inquiries.length}
              </span>
            </button>

            {/* 5. Subscribers */}
            <button
              onClick={() => { setActiveTab('subscribers'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'subscribers' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'subscribers' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'subscribers' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Users size={17} />
                <span>Subscriber List</span>
              </div>
              <span className="badge rounded-pill bg-dark text-white border border-secondary" style={{ fontSize: '0.68rem' }}>
                {subscribers.length}
              </span>
            </button>

            {/* 6. Reports */}
            <button
              onClick={() => { setActiveTab('reports'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'reports' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'reports' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'reports' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <BarChart3 size={17} />
                <span>Reports & Analytics</span>
              </div>
            </button>

            {/* 7. Options / Settings */}
            <button
              onClick={() => { setActiveTab('options'); setMobileSidebarOpen(false); }}
              className={`nav-link text-start d-flex align-items-center justify-content-between py-2 px-3 rounded ${
                activeTab === 'options' ? 'active text-dark' : 'text-light'
              }`}
              style={{
                backgroundColor: activeTab === 'options' ? '#C5A880' : 'transparent',
                fontWeight: activeTab === 'options' ? 600 : 400,
                fontSize: '0.86rem',
              }}
            >
              <div className="d-flex align-items-center gap-2">
                <Settings size={17} />
                <span>Store Settings</span>
              </div>
            </button>
          </nav>

          {/* View Online Store Button in Sidebar */}
          <div className="pt-3 pb-2 border-top border-secondary">
            <Link
              href="/"
              target="_blank"
              className="btn w-100 d-flex align-items-center justify-content-center gap-2 text-decoration-none py-2 px-3 rounded"
              style={{
                border: '1px solid rgba(197, 168, 128, 0.4)',
                color: '#C5A880',
                backgroundColor: 'rgba(197, 168, 128, 0.08)',
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                fontWeight: 500,
                transition: 'all 0.2s ease',
              }}
            >
              <ExternalLink size={14} />
              <span>View Online Store</span>
            </Link>
          </div>

          {/* Sidebar Footer info */}
          <div className="pt-2 text-muted" style={{ fontSize: '0.72rem' }}>
            <div>WhatsApp: +91 99954 66002</div>
            <div>Thrissur & Guruvayoor, Kerala</div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-grow-1 p-3 p-md-4 p-xl-5 overflow-auto" style={{ maxWidth: '100%' }}>
          {/* Header Title with quick refresh */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
            <div>
              <h2 className="font-serif fw-bold text-dark mb-1" style={{ fontSize: '1.65rem' }}>
                {activeTab === 'dashboard' && 'Executive Dashboard'}
                {activeTab === 'products' && 'Luxury Garment Catalog'}
                {activeTab === 'orders' && 'Customer Orders & Shipments'}
                {activeTab === 'reviews' && 'Client Reviews & Product Sentiments'}
                {activeTab === 'inquiries' && 'Customer Inquiries & Messages'}
                {activeTab === 'subscribers' && 'VIP Newsletter Subscribers'}
                {activeTab === 'reports' && 'Store Financial & Sales Reports'}
                {activeTab === 'options' && 'Store Settings & Brand Information'}
              </h2>
              <p className="text-muted small mb-0">
                Official Admin Portal for IRA Lifestyle Studio • Guruvayoor & Thrissur
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={loadData}
                disabled={loading}
                className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 bg-white"
                title="Refresh Store Data"
              >
                <RefreshCw size={13} className={loading ? 'fa-spin' : ''} />
                <span className="small">Refresh</span>
              </button>

              {activeTab === 'products' && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-sm text-dark fw-bold d-flex align-items-center gap-1 shadow-sm px-3"
                  style={{ backgroundColor: '#C5A880', border: '1px solid #B3956B' }}
                >
                  <Plus size={15} /> Add New Garment
                </button>
              )}

              {activeTab === 'subscribers' && subscribers.length > 0 && (
                <button
                  onClick={handleCopySubscribers}
                  className="btn btn-sm btn-dark d-flex align-items-center gap-1 shadow-sm px-3"
                >
                  <Copy size={14} /> {copiedEmails ? 'Copied All!' : 'Copy All Emails'}
                </button>
              )}
            </div>
          </div>

          {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
          {activeTab === 'dashboard' && (
            <div>
              {/* KPI Cards Row */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-3 border shadow-sm h-100">
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>Total Sales (INR)</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)' }}>
                        <DollarSign size={20} color="#9E7D47" />
                      </div>
                    </div>
                    <h3 className="fw-bold mb-1" style={{ color: '#9E7D47' }}>
                      ₹{totalRevenue.toLocaleString('en-IN')}
                    </h3>
                    <small className="text-muted">Direct boutique revenue</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-3 border shadow-sm h-100">
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>Total Orders</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)' }}>
                        <ShoppingBag size={20} color="#2563EB" />
                      </div>
                    </div>
                    <div className="d-flex align-items-baseline gap-2 mb-1">
                      <h3 className="fw-bold text-dark mb-0">{orders.length}</h3>
                      {pendingOrdersCount > 0 && (
                        <span className="badge bg-warning text-dark small">{pendingOrdersCount} Pending</span>
                      )}
                    </div>
                    <small className="text-muted">{deliveredOrdersCount} delivered successfully</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-3 border shadow-sm h-100">
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>Active Products</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <Package size={20} color="#10B981" />
                      </div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1">{products.length}</h3>
                    <small className="text-muted">{products.filter((p) => p.isFeatured).length} featured on frontpage</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-3 border shadow-sm h-100">
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem' }}>VIP Subscribers</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                        <Users size={20} color="#D97706" />
                      </div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1">{subscribers.length}</h3>
                    <small className="text-muted">{inquiries.length} contact inquiries received</small>
                  </div>
                </div>
              </div>

              {/* ================= CHARTS ROW: SALES TREND & CATEGORY PIE (WHITE, BLACK, BROWN & GREY PALETTE) ================= */}
              <div className="row g-4 mb-4">
                {/* 1. Animated Selling Report / Sales Revenue Chart */}
                <div className="col-12 col-xl-7">
                  <div className="bg-white rounded-3 border shadow-sm p-4 h-100 d-flex flex-column" style={{ borderColor: '#EAE4DC' }}>
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-1.5 rounded" style={{ backgroundColor: 'rgba(140, 101, 56, 0.12)', color: '#8C6538' }}>
                            <TrendingUp size={18} />
                          </div>
                          <h5 className="fw-bold text-dark mb-0 font-serif">Selling Performance Report</h5>
                        </div>
                        <small className="text-muted">
                          {salesChartPeriod === 'monthly' ? 'Monthly sales volume & revenue progression' : 'Last 7 days daily order checkout trends'}
                        </small>
                      </div>

                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          onClick={() => setSalesChartPeriod('monthly')}
                          className={`btn ${salesChartPeriod === 'monthly' ? 'btn-dark' : 'btn-outline-secondary'}`}
                          style={{
                            fontSize: '0.74rem',
                            backgroundColor: salesChartPeriod === 'monthly' ? '#1A1816' : 'transparent',
                            borderColor: '#D8D1C7',
                          }}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          onClick={() => setSalesChartPeriod('daily')}
                          className={`btn ${salesChartPeriod === 'daily' ? 'btn-dark' : 'btn-outline-secondary'}`}
                          style={{
                            fontSize: '0.74rem',
                            backgroundColor: salesChartPeriod === 'daily' ? '#1A1816' : 'transparent',
                            borderColor: '#D8D1C7',
                          }}
                        >
                          Daily
                        </button>
                      </div>
                    </div>

                    {/* Chart Header Metrics Card */}
                    <div className="d-flex align-items-baseline gap-3 mb-3 p-2.5 rounded border" style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D8' }}>
                      <div>
                        <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                          Period Sales
                        </small>
                        <span className="fw-bold fs-5" style={{ color: '#8C6538' }}>
                          ₹{salesTrendData.totalPeriodRevenue.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="vr" style={{ borderColor: '#DFD8CC' }} />
                      <div>
                        <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>
                          Avg Per {salesChartPeriod === 'monthly' ? 'Month' : 'Day'}
                        </small>
                        <span className="fw-bold fs-6 text-dark">
                          ₹{Math.round(salesTrendData.totalPeriodRevenue / (salesTrendData.list.length || 1)).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="ms-auto d-none d-sm-block">
                        <span className="badge px-2.5 py-1" style={{ backgroundColor: '#1A1816', color: '#C5A880', fontSize: '0.7rem', border: '1px solid rgba(197, 168, 128, 0.4)' }}>
                          ✓ Live WhatsApp Orders
                        </span>
                      </div>
                    </div>

                    {/* Animated SVG Bar Chart with Onyx Black & Bronze Gradient */}
                    <div className="position-relative flex-grow-1 d-flex flex-column justify-content-end" style={{ minHeight: '210px' }}>
                      <svg width="100%" height="190" viewBox="0 0 600 190" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                        <defs>
                          {/* Default bar: Bronze to Dark Onyx Black */}
                          <linearGradient id="luxuryBarGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8C6538" stopOpacity="1" />
                            <stop offset="100%" stopColor="#1A1816" stopOpacity="0.95" />
                          </linearGradient>
                          {/* Hover bar: Champagne Gold to Rich Bronze */}
                          <linearGradient id="luxuryBarHover" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#C5A880" stopOpacity="1" />
                            <stop offset="100%" stopColor="#8C6538" stopOpacity="1" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal reference grid lines */}
                        <line x1="0" y1="20" x2="600" y2="20" stroke="#F0EBE1" strokeDasharray="4 4" strokeWidth="1" />
                        <line x1="0" y1="80" x2="600" y2="80" stroke="#F0EBE1" strokeDasharray="4 4" strokeWidth="1" />
                        <line x1="0" y1="140" x2="600" y2="140" stroke="#DFD7CC" strokeWidth="1" />

                        {/* Bars */}
                        {salesTrendData.list.map((item, idx) => {
                          const totalBars = salesTrendData.list.length;
                          const barWidth = Math.min(50, (500 / totalBars) * 0.65);
                          const gap = 600 / totalBars;
                          const x = idx * gap + (gap - barWidth) / 2;
                          const hasSales = item.revenue > 0;
                          const barHeight = hasSales 
                            ? Math.max(16, (item.revenue / salesTrendData.maxRevenue) * 120) 
                            : 4; // Refined clean baseline for zero-sales periods
                          const y = 140 - barHeight;
                          const isHovered = hoveredSalesPoint === idx;

                          return (
                            <g 
                              key={item.key} 
                              onMouseEnter={() => setHoveredSalesPoint(idx)} 
                              onMouseLeave={() => setHoveredSalesPoint(null)}
                              style={{ cursor: 'pointer' }}
                            >
                              {/* Background hover highlight pillar */}
                              {isHovered && (
                                <rect
                                  x={idx * gap + 4}
                                  y={10}
                                  width={gap - 8}
                                  height={132}
                                  rx={6}
                                  fill="rgba(140, 101, 56, 0.08)"
                                />
                              )}

                              {/* Value label tooltip on hover */}
                              {isHovered && (
                                <g>
                                  <rect
                                    x={x + barWidth / 2 - 46}
                                    y={Math.max(2, y - 30)}
                                    width={92}
                                    height={24}
                                    rx={4}
                                    fill="#181513"
                                    stroke="#8C6538"
                                    strokeWidth="1"
                                    filter="drop-shadow(0 3px 6px rgba(0,0,0,0.3))"
                                  />
                                  <text
                                    x={x + barWidth / 2}
                                    y={Math.max(2, y - 30) + 16}
                                    textAnchor="middle"
                                    fill="#C5A880"
                                    fontSize="11"
                                    fontWeight="bold"
                                  >
                                    ₹{item.revenue.toLocaleString('en-IN')}
                                  </text>
                                </g>
                              )}

                              {/* Animated Main Bar */}
                              <rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx={hasSales ? 6 : 2}
                                fill={
                                  !hasSales 
                                    ? "#E6E0D5" 
                                    : isHovered 
                                      ? "url(#luxuryBarHover)" 
                                      : "url(#luxuryBarGrad)"
                                }
                                stroke={isHovered ? "#C5A880" : hasSales ? "rgba(140, 101, 56, 0.5)" : "none"}
                                strokeWidth={isHovered ? "1.5" : "1"}
                                style={{
                                  transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                  filter: isHovered 
                                    ? 'drop-shadow(0 6px 14px rgba(140, 101, 56, 0.45))' 
                                    : hasSales 
                                      ? 'drop-shadow(0 3px 8px rgba(24, 21, 19, 0.25))' 
                                      : 'none'
                                }}
                              />

                              {/* X-axis Label */}
                              <text
                                x={x + barWidth / 2}
                                y={160}
                                textAnchor="middle"
                                fill={isHovered ? "#181513" : "#685F56"}
                                fontSize="11"
                                fontWeight={isHovered || hasSales ? "700" : "500"}
                              >
                                {item.label}
                              </text>

                              {/* Order count pill below */}
                              <text
                                x={x + barWidth / 2}
                                y={175}
                                textAnchor="middle"
                                fill={hasSales ? "#8C6538" : "#A8A29E"}
                                fontSize="9"
                                fontWeight={hasSales ? "600" : "400"}
                              >
                                {item.orders} ord
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 2. Product Count by Category Donut / Pie Diagram (White, Black, Brown & Grey) */}
                <div className="col-12 col-xl-5">
                  <div className="bg-white rounded-3 border shadow-sm p-4 h-100 d-flex flex-column" style={{ borderColor: '#EAE4DC' }}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2">
                          <div className="p-1.5 rounded" style={{ backgroundColor: 'rgba(26, 24, 22, 0.08)', color: '#1A1816' }}>
                            <PieChartIcon size={18} />
                          </div>
                          <h5 className="fw-bold text-dark mb-0 font-serif">Catalog by Category</h5>
                        </div>
                        <small className="text-muted">Live distribution of curated garments</small>
                      </div>
                      <span className="badge rounded-pill bg-dark text-white px-2.5 py-1" style={{ fontSize: '0.72rem', backgroundColor: '#1A1816' }}>
                        {products.length} Total
                      </span>
                    </div>

                    <div className="row align-items-center g-3 my-auto">
                      {/* SVG Segmented Donut / Pie Diagram */}
                      <div className="col-12 col-sm-6 d-flex justify-content-center">
                        <div className="position-relative" style={{ width: '185px', height: '185px' }}>
                          <svg width="185" height="185" viewBox="0 0 200 200">
                            {/* Background track circle */}
                            <circle
                              cx="100"
                              cy="100"
                              r="65"
                              fill="none"
                              stroke="#F4EFE6"
                              strokeWidth="21"
                            />

                            {/* Donut Slices with Clean Separation Gaps */}
                            {(() => {
                              const C = 2 * Math.PI * 65; // ~408.4
                              let offset = 0;
                              const hasMultiple = categoryStats.slices.length > 1;
                              const gap = hasMultiple ? 4 : 0;

                              return categoryStats.slices.map((slice) => {
                                const strokeLength = (slice.count / (categoryStats.total || 1)) * C;
                                const strokeOffset = (offset / (categoryStats.total || 1)) * C;
                                offset += slice.count;
                                const isHovered = hoveredCategorySlice === slice.category;
                                const dashLength = Math.max(1, strokeLength - gap);

                                return (
                                  <circle
                                    key={slice.category}
                                    cx="100"
                                    cy="100"
                                    r="65"
                                    fill="none"
                                    stroke={slice.color}
                                    strokeWidth={isHovered ? "25" : "20"}
                                    strokeDasharray={`${dashLength} ${C - dashLength}`}
                                    strokeDashoffset={-strokeOffset - gap / 2}
                                    transform="rotate(-90 100 100)"
                                    style={{
                                      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                                      cursor: 'pointer',
                                      opacity: hoveredCategorySlice && !isHovered ? 0.35 : 1,
                                      filter: isHovered 
                                        ? 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' 
                                        : 'none',
                                    }}
                                    onMouseEnter={() => setHoveredCategorySlice(slice.category)}
                                    onMouseLeave={() => setHoveredCategorySlice(null)}
                                  />
                                );
                              });
                            })()}

                            {/* Inner Crisp White Center Disk */}
                            <circle
                              cx="100"
                              cy="100"
                              r="53"
                              fill="#FFFFFF"
                              stroke="#EAE4DC"
                              strokeWidth="1.2"
                              style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.06))' }}
                            />

                            {/* Center Garment Count */}
                            <text
                              x="100"
                              y="96"
                              textAnchor="middle"
                              className="fw-bold font-serif"
                              fill="#181513"
                              fontSize="26"
                            >
                              {hoveredCategorySlice 
                                ? (categoryStats.slices.find(s => s.category === hoveredCategorySlice)?.count || categoryStats.total) 
                                : categoryStats.total}
                            </text>
                            <text
                              x="100"
                              y="114"
                              textAnchor="middle"
                              fill="#8C6538"
                              fontSize="9.5"
                              letterSpacing="0.12em"
                              fontWeight="700"
                            >
                              {hoveredCategorySlice 
                                ? (categoryStats.slices.find(s => s.category === hoveredCategorySlice)?.label.toUpperCase().slice(0, 11)) 
                                : 'GARMENTS'}
                            </text>
                          </svg>
                        </div>
                      </div>

                      {/* Interactive Legend List (White, Black, Brown, Grey) */}
                      <div className="col-12 col-sm-6">
                        <div className="d-flex flex-column gap-1.5">
                          {categoryStats.slices.map((slice) => {
                            const isHovered = hoveredCategorySlice === slice.category;
                            return (
                              <div
                                key={slice.category}
                                onMouseEnter={() => setHoveredCategorySlice(slice.category)}
                                onMouseLeave={() => setHoveredCategorySlice(null)}
                                className="p-2 rounded d-flex align-items-center justify-content-between transition"
                                style={{
                                  backgroundColor: isHovered ? 'rgba(140, 101, 56, 0.08)' : 'rgba(0,0,0,0.02)',
                                  border: isHovered ? '1px solid #8C6538' : '1px solid transparent',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <div className="d-flex align-items-center gap-2 overflow-hidden">
                                  <span
                                    className="rounded-circle flex-shrink-0"
                                    style={{
                                      width: '11px',
                                      height: '11px',
                                      backgroundColor: slice.color,
                                      border: '1px solid rgba(0,0,0,0.18)',
                                    }}
                                  />
                                  <span
                                    className="small text-truncate"
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: isHovered ? 700 : 500,
                                      color: isHovered ? '#181513' : '#3C3630',
                                    }}
                                  >
                                    {slice.label}
                                  </span>
                                </div>
                                <span
                                  className="badge rounded-pill border small ms-1"
                                  style={{
                                    fontSize: '0.68rem',
                                    backgroundColor: '#FAF8F4',
                                    borderColor: '#DFD8CC',
                                    color: '#1A1816',
                                    fontWeight: 600,
                                  }}
                                >
                                  {slice.count} ({slice.percent}%)
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="row g-4">
                {/* Recent Orders List Preview */}
                <div className="col-12 col-lg-8">
                  <div className="bg-white rounded-3 border shadow-sm p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold text-dark mb-0 font-serif">Recent Customer Orders</h5>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="btn btn-sm btn-link text-decoration-none p-0"
                        style={{ color: '#9E7D47', fontWeight: 600 }}
                      >
                        View All Orders →
                      </button>
                    </div>

                    {orders.length === 0 ? (
                      <div className="text-center py-4 text-muted">No orders placed yet.</div>
                    ) : (
                      <>
                        {/* Desktop Table View */}
                        <div className="table-responsive d-none d-md-block">
                          <table className="table table-hover align-middle mb-0" style={{ fontSize: '0.84rem' }}>
                            <thead className="table-light">
                              <tr>
                                <th className="text-nowrap">Order ID</th>
                                <th className="text-nowrap">Customer</th>
                                <th className="text-nowrap">Total</th>
                                <th className="text-nowrap">Status</th>
                                <th className="text-nowrap">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {orders.slice(0, 5).map((ord) => (
                                <tr key={ord.orderId}>
                                  <td className="fw-semibold text-dark text-nowrap">{ord.orderId}</td>
                                  <td>
                                    <div className="text-nowrap">{ord.customer.fullName}</div>
                                    <small className="text-muted text-nowrap d-block">{ord.customer.phone || ord.customer.email}</small>
                                  </td>
                                  <td className="fw-bold text-nowrap" style={{ color: '#9E7D47' }}>
                                    ₹{ord.total.toLocaleString('en-IN')}
                                  </td>
                                  <td className="text-nowrap">
                                    <span
                                      className={`badge rounded-pill text-nowrap ${
                                        ord.orderStatus === 'Pending'
                                          ? 'bg-warning text-dark'
                                          : ord.orderStatus === 'Delivered'
                                          ? 'bg-success text-white'
                                          : ord.orderStatus === 'Cancelled'
                                          ? 'bg-danger text-white'
                                          : 'bg-primary text-white'
                                      }`}
                                    >
                                      {ord.orderStatus}
                                    </span>
                                  </td>
                                  <td className="text-nowrap">
                                    {ord.customer.phone && (
                                      <a
                                        href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                          `Hello ${ord.customer.fullName}, this is IRA Lifestyle regarding your order #${ord.orderId}.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 py-1 px-2"
                                        style={{ fontSize: '0.75rem' }}
                                      >
                                        <MessageCircle size={13} /> WhatsApp
                                      </a>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="d-md-none d-flex flex-column gap-2.5">
                          {orders.slice(0, 5).map((ord) => (
                            <div key={ord.orderId} className="bg-light p-3 rounded-3 border">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <span className="fw-bold font-serif text-dark d-block">#{ord.orderId}</span>
                                  <div className="fw-semibold text-dark small">{ord.customer.fullName}</div>
                                  <small className="text-muted d-block">{ord.customer.phone || ord.customer.email}</small>
                                </div>
                                <span
                                  className={`badge rounded-pill ${
                                    ord.orderStatus === 'Pending'
                                      ? 'bg-warning text-dark'
                                      : ord.orderStatus === 'Delivered'
                                      ? 'bg-success text-white'
                                      : ord.orderStatus === 'Cancelled'
                                      ? 'bg-danger text-white'
                                      : 'bg-primary text-white'
                                  }`}
                                >
                                  {ord.orderStatus}
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                                <span className="fw-bold" style={{ color: '#9E7D47' }}>
                                  ₹{ord.total.toLocaleString('en-IN')}
                                </span>
                                {ord.customer.phone && (
                                  <a
                                    href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                      `Hello ${ord.customer.fullName}, this is IRA Lifestyle regarding your order #${ord.orderId}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm btn-outline-success d-inline-flex align-items-center gap-1 py-1 px-2.5"
                                    style={{ fontSize: '0.74rem' }}
                                  >
                                    <MessageCircle size={13} /> WhatsApp
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Recent Inquiries Preview */}
                <div className="col-12 col-lg-4">
                  <div className="bg-white rounded-3 border shadow-sm p-4 h-100 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="fw-bold text-dark mb-0 font-serif">Customer Inquiries</h5>
                      <button
                        onClick={() => setActiveTab('inquiries')}
                        className="btn btn-sm btn-link text-decoration-none p-0"
                        style={{ color: '#9E7D47', fontWeight: 600 }}
                      >
                        View All ({inquiries.length})
                      </button>
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="text-center py-4 text-muted flex-grow-1 d-flex align-items-center justify-content-center">
                        No inquiries received yet.
                      </div>
                    ) : (
                      <div className="d-flex flex-column gap-3 flex-grow-1">
                        {inquiries.slice(0, 3).map((inq) => (
                          <div key={inq._id} className="p-3 rounded border bg-light">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <span className="fw-semibold text-dark small">{inq.name}</span>
                              <small className="text-muted" style={{ fontSize: '0.68rem' }}>
                                {new Date(inq.createdAt).toLocaleDateString()}
                              </small>
                            </div>
                            <p className="text-muted mb-2 small text-truncate" style={{ maxHeight: '40px' }}>
                              {inq.message}
                            </p>
                            <div className="d-flex gap-2">
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                  `Re: IRA Lifestyle Inquiry - ${inq.subject || 'Support'}`
                                )}`}
                                className="btn btn-xs btn-outline-dark d-flex align-items-center gap-1 py-0 px-2"
                                style={{ fontSize: '0.72rem' }}
                              >
                                <Mail size={12} /> Email
                              </a>
                              {inq.phone && (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${inq.name}, thank you for reaching out to IRA Lifestyle!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-xs btn-outline-success d-flex align-items-center gap-1 py-0 px-2"
                                  style={{ fontSize: '0.72rem' }}
                                >
                                  <MessageCircle size={12} /> WhatsApp
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PRODUCTS ================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3 border shadow-sm p-4">
              {/* Search & Actions Bar */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
                  <Search
                    size={16}
                    className="position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: '12px' }}
                  />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title or category..."
                    className="form-control form-control-sm ps-5"
                  />
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Showing {filteredProducts.length} garments</span>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-sm text-dark fw-bold d-flex align-items-center gap-1 px-3"
                    style={{ backgroundColor: '#C5A880' }}
                  >
                    <Plus size={16} /> Add Garment
                  </button>
                </div>
              </div>

              {/* Products Table (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    <tr>
                      <th className="ps-3 text-nowrap">Garment</th>
                      <th className="text-nowrap">Category</th>
                      <th className="text-nowrap">Price</th>
                      <th className="text-nowrap">Rating</th>
                      <th className="text-nowrap">Showcase</th>
                      <th className="text-end pe-3 text-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.86rem' }}>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id}>
                        <td className="ps-3">
                          <div className="d-flex align-items-center gap-3">
                            <div style={{ position: 'relative', width: '45px', height: '58px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E0D8' }}>
                              <Image src={prod.image} alt={prod.title} fill sizes="45px" style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                              <span className="fw-semibold text-dark d-block">{prod.title}</span>
                              <small className="text-muted">SKU: {prod.id} • {prod.fabric || 'Pure Silk'}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-nowrap">
                          <span className="badge bg-light text-dark border text-uppercase" style={{ fontSize: '0.7rem' }}>
                            {prod.category}
                          </span>
                        </td>
                        <td className="text-nowrap">
                          <div className="fw-bold" style={{ color: '#9E7D47' }}>
                            ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                          {prod.originalPrice && (
                            <small className="text-muted text-decoration-line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </small>
                          )}
                        </td>
                        <td className="text-nowrap">
                          <div className="d-flex align-items-center gap-1 text-warning">
                            <Star size={13} fill="currentColor" />
                            <span className="text-dark fw-semibold small">{prod.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="text-nowrap">
                          {prod.isFeatured ? (
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              Featured
                            </span>
                          ) : (
                            <span className="badge bg-light text-muted border">Standard</span>
                          )}
                        </td>
                        <td className="text-end pe-3 text-nowrap">
                          <div className="d-flex justify-content-end gap-1">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="btn btn-sm btn-outline-dark p-1"
                              title="Edit Garment"
                            >
                              <Edit size={14} />
                            </button>
                            <Link
                              href={`/product/${prod.slug || prod.id}`}
                              target="_blank"
                              className="btn btn-sm btn-outline-secondary p-1"
                              title="View on Store"
                            >
                              <ExternalLink size={14} />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Delete Garment"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Products Mobile Card View */}
              <div className="d-md-none d-flex flex-column gap-3">
                {filteredProducts.map((prod) => (
                  <div key={prod.id} className="bg-light p-3 rounded-3 border">
                    <div className="d-flex gap-3 align-items-start mb-2">
                      <div style={{ position: 'relative', width: '55px', height: '72px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E0D8' }}>
                        <Image src={prod.image} alt={prod.title} fill sizes="55px" style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start gap-1">
                          <span className="fw-semibold text-dark d-block font-serif" style={{ fontSize: '0.92rem' }}>{prod.title}</span>
                          {prod.isFeatured && (
                            <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.62rem' }}>
                              Featured
                            </span>
                          )}
                        </div>
                        <small className="text-muted d-block mb-1">SKU: {prod.id} • {prod.fabric || 'Pure Silk'}</small>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-white text-dark border text-uppercase" style={{ fontSize: '0.65rem' }}>
                            {prod.category}
                          </span>
                          <div className="d-flex align-items-center gap-1 text-warning" style={{ fontSize: '0.75rem' }}>
                            <Star size={12} fill="currentColor" />
                            <span className="text-dark fw-semibold">{prod.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                      <div>
                        <span className="fw-bold" style={{ color: '#9E7D47', fontSize: '1rem' }}>
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        {prod.originalPrice && (
                          <small className="text-muted text-decoration-line-through ms-2">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </small>
                        )}
                      </div>
                      <div className="d-flex gap-1.5">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="btn btn-sm btn-outline-dark px-2 py-1"
                          title="Edit Garment"
                        >
                          <Edit size={13} /> <span className="small">Edit</span>
                        </button>
                        <Link
                          href={`/product/${prod.slug || prod.id}`}
                          target="_blank"
                          className="btn btn-sm btn-outline-secondary px-2 py-1"
                          title="View on Store"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="btn btn-sm btn-outline-danger px-2 py-1"
                          title="Delete Garment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: ORDERS ================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3 border shadow-sm p-4">
              {/* Filter Tabs */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="d-flex gap-2 flex-wrap">
                  {['all', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilterStatus(status)}
                      className={`btn btn-sm ${
                        orderFilterStatus === status ? 'btn-dark' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}
                    >
                      {status === 'all' ? `All Orders (${orders.length})` : status}
                    </button>
                  ))}
                </div>

                <div className="text-muted small">
                  Showing {filteredOrders.length} order(s)
                </div>
              </div>

              {/* Orders Table (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    <tr>
                      <th className="ps-3 text-nowrap">Order ID & Date</th>
                      <th className="text-nowrap">Customer Details</th>
                      <th className="text-nowrap">Garments</th>
                      <th className="text-nowrap">Amount</th>
                      <th className="text-nowrap">Change Status</th>
                      <th className="text-end pe-3 text-nowrap">Direct Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.85rem' }}>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No orders matching this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.orderId}>
                          <td className="ps-3 text-nowrap">
                            <span className="fw-bold text-dark d-block">#{ord.orderId}</span>
                            <small className="text-muted">{new Date(ord.createdAt).toLocaleString()}</small>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark text-nowrap">{ord.customer.fullName}</div>
                            <div className="text-muted small text-nowrap">{ord.customer.phone || 'No phone'}</div>
                            <div className="text-muted small text-nowrap">{ord.customer.email}</div>
                            <div className="text-muted small text-truncate" style={{ maxWidth: '220px' }}>
                              {ord.shippingAddress?.address}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              {ord.items.map((item, idx) => (
                                <div key={idx} className="small text-truncate" style={{ maxWidth: '200px' }}>
                                  • {item.title} <span className="text-muted">(Qty: {item.quantity}, Size: {item.size})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <div className="fw-bold" style={{ color: '#9E7D47' }}>
                              ₹{ord.total.toLocaleString('en-IN')}
                            </div>
                            <span className="badge bg-light text-dark border" style={{ fontSize: '0.68rem' }}>
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="text-nowrap">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleOrderStatusChange(ord.orderId, e.target.value)}
                              className="form-select form-select-sm"
                              style={{
                                width: '135px',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                borderColor:
                                  ord.orderStatus === 'Pending'
                                    ? '#F59E0B'
                                    : ord.orderStatus === 'Delivered'
                                    ? '#10B981'
                                    : '#C5A880',
                              }}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="text-end pe-3 text-nowrap">
                            <div className="d-flex justify-content-end gap-1">
                              {ord.customer.phone && (
                                <a
                                  href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${ord.customer.fullName}, IRA Lifestyle update: Your order #${ord.orderId} status is now ${ord.orderStatus}. Thank you for choosing IRA Lifestyle!`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-success p-1 px-2 d-flex align-items-center gap-1"
                                  title="Chat on WhatsApp"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <MessageCircle size={14} /> WhatsApp
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteOrder(ord.orderId)}
                                className="btn btn-sm btn-outline-danger p-1"
                                title="Delete Order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Orders Mobile Card View */}
              <div className="d-md-none d-flex flex-column gap-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-4 text-muted">No orders matching this filter.</div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div key={ord.orderId} className="bg-light p-3 rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-bold font-serif text-dark d-block" style={{ fontSize: '0.95rem' }}>#{ord.orderId}</span>
                          <small className="text-muted">{new Date(ord.createdAt).toLocaleString()}</small>
                        </div>
                        <span className="badge bg-white text-dark border" style={{ fontSize: '0.68rem' }}>
                          {ord.paymentMethod}
                        </span>
                      </div>

                      <div className="mb-2 p-2 bg-white rounded border">
                        <div className="fw-semibold text-dark small">{ord.customer.fullName}</div>
                        <div className="text-muted small">{ord.customer.phone || 'No phone'} • {ord.customer.email}</div>
                        <div className="text-muted small text-truncate mt-1">
                          {ord.shippingAddress?.address}, {ord.shippingAddress?.city} - {ord.shippingAddress?.pincode}
                        </div>
                      </div>

                      <div className="mb-2.5">
                        <small className="text-muted fw-semibold text-uppercase d-block mb-1" style={{ fontSize: '0.68rem' }}>Garments</small>
                        <div className="d-flex flex-column gap-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="small text-dark">
                              • {item.title} <span className="text-muted">(Qty: {item.quantity}, Size: {item.size})</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="row g-2 align-items-center pt-2 border-top border-secondary-subtle mb-2.5">
                        <div className="col-5">
                          <small className="text-muted d-block" style={{ fontSize: '0.68rem' }}>Total Amount</small>
                          <span className="fw-bold" style={{ color: '#9E7D47', fontSize: '1rem' }}>
                            ₹{ord.total.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="col-7">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleOrderStatusChange(ord.orderId, e.target.value)}
                            className="form-select form-select-sm"
                            style={{
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              borderColor:
                                ord.orderStatus === 'Pending'
                                  ? '#F59E0B'
                                  : ord.orderStatus === 'Delivered'
                                  ? '#10B981'
                                  : '#C5A880',
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        {ord.customer.phone && (
                          <a
                            href={`https://wa.me/${ord.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${ord.customer.fullName}, IRA Lifestyle update: Your order #${ord.orderId} status is now ${ord.orderStatus}. Thank you for choosing IRA Lifestyle!`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success d-flex align-items-center gap-1.5 flex-grow-1 justify-content-center py-1.5"
                            style={{ fontSize: '0.76rem' }}
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteOrder(ord.orderId)}
                          className="btn btn-sm btn-outline-danger px-3 py-1.5"
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3b: CLIENT REVIEWS (PRODUCT-WISE VIEW) ================= */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-3 border shadow-sm p-4">
              {/* Product Selector Filter & Actions */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="d-flex flex-wrap align-items-center gap-3 flex-grow-1">
                  {/* Product-wise filter dropdown */}
                  <div style={{ minWidth: '260px' }}>
                    <label className="form-label small text-muted mb-1 fw-semibold">
                      Filter by Product / Garment
                    </label>
                    <select
                      value={reviewProductFilter}
                      onChange={(e) => setReviewProductFilter(e.target.value)}
                      className="form-select form-select-sm"
                      style={{ fontSize: '0.84rem' }}
                    >
                      <option value="all">All Garments ({reviews.length} Total Reviews)</option>
                      {products.map((p) => {
                        const pRevCount = reviews.filter((r) => r.productId === p.id).length;
                        return (
                          <option key={p.id} value={p.id}>
                            {p.title} ({pRevCount} review{pRevCount !== 1 ? 's' : ''})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Search query input */}
                  <div className="position-relative flex-grow-1" style={{ maxWidth: '300px' }}>
                    <label className="form-label small text-muted mb-1 fw-semibold">Search Content</label>
                    <div className="position-relative">
                      <Search
                        size={15}
                        className="position-absolute top-50 translate-middle-y text-muted"
                        style={{ left: '10px' }}
                      />
                      <input
                        type="text"
                        placeholder="Search reviewer or comment..."
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        className="form-control form-control-sm ps-4"
                        style={{ fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-muted small">
                  Showing {filteredReviews.length} client review(s)
                </div>
              </div>

              {/* Reviews Summary Stats Banner */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-2 border bg-light text-center">
                    <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>Total Reviews</small>
                    <span className="fs-4 fw-bold text-dark">{filteredReviews.length}</span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-2 border bg-light text-center">
                    <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>Avg Rating</small>
                    <div className="d-flex align-items-center justify-content-center gap-1 text-warning">
                      <Star size={18} fill="currentColor" />
                      <span className="fs-4 fw-bold text-dark">
                        {filteredReviews.length > 0 
                          ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
                          : '5.0'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-2 border bg-light text-center">
                    <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>5-Star Reviews</small>
                    <span className="fs-4 fw-bold text-success">
                      {filteredReviews.filter((r) => r.rating === 5).length}
                    </span>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="p-3 rounded-2 border bg-light text-center">
                    <small className="text-muted text-uppercase d-block" style={{ fontSize: '0.7rem' }}>Approval Rate</small>
                    <span className="fs-4 fw-bold text-dark">
                      {filteredReviews.length > 0
                        ? `${Math.round((filteredReviews.filter(r => (r.status || 'approved') === 'approved').length / filteredReviews.length) * 100)}%`
                        : '100%'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Table (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    <tr>
                      <th className="ps-3 text-nowrap">Garment / Piece</th>
                      <th className="text-nowrap">Client Reviewer</th>
                      <th className="text-nowrap">Rating</th>
                      <th style={{ minWidth: '220px' }}>Review Sentiment</th>
                      <th className="text-nowrap" style={{ minWidth: '120px' }}>Status</th>
                      <th className="text-nowrap">Date</th>
                      <th className="text-end pe-3 text-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.85rem' }}>
                    {filteredReviews.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4 text-muted">
                          No reviews found matching this product filter.
                        </td>
                      </tr>
                    ) : (
                      filteredReviews.map((rev) => (
                        <tr key={rev._id || rev.id}>
                          <td className="ps-3">
                            <div className="d-flex align-items-center gap-2">
                              {rev.productImage && (
                                <div style={{ position: 'relative', width: '38px', height: '48px', borderRadius: '3px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E0D8' }}>
                                  <Image src={rev.productImage} alt={rev.productTitle} fill sizes="38px" style={{ objectFit: 'cover' }} />
                                </div>
                              )}
                              <div>
                                <span className="fw-semibold text-dark d-block text-truncate" style={{ maxWidth: '170px' }}>
                                  {rev.productTitle}
                                </span>
                                <Link 
                                  href={`/product/${rev.productId}`}
                                  target="_blank"
                                  className="text-muted small text-decoration-none d-flex align-items-center gap-1"
                                  style={{ fontSize: '0.7rem' }}
                                >
                                  <span>View Piece</span>
                                  <ExternalLink size={10} />
                                </Link>
                              </div>
                            </div>
                          </td>

                          <td className="text-nowrap">
                            <div className="fw-semibold text-dark">{rev.customerName}</div>
                            <small className="text-muted d-block">{rev.customerEmail || 'Authenticated Patron'}</small>
                            <div>
                              <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.62rem' }}>
                                ✓ Verified Purchase
                              </span>
                            </div>
                          </td>

                          <td className="text-nowrap">
                            <div className="d-flex align-items-center gap-1 text-warning">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  fill={i < rev.rating ? '#F59E0B' : 'none'}
                                  color="#F59E0B"
                                />
                              ))}
                              <span className="text-dark fw-bold small ms-1">{rev.rating}.0</span>
                            </div>
                          </td>

                          <td>
                            <p className="mb-0 text-dark small" style={{ lineHeight: '1.5' }}>
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          </td>

                          <td className="text-nowrap" style={{ minWidth: '120px' }}>
                            <button
                              onClick={() => handleToggleReviewStatus(rev._id || rev.id || '', rev.status)}
                              className={`btn btn-sm py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-1.5 shadow-none ${
                                (rev.status || 'approved') === 'approved' 
                                  ? 'btn-outline-success' 
                                  : 'btn-outline-warning'
                              }`}
                              style={{ 
                                fontSize: '0.74rem', 
                                whiteSpace: 'nowrap',
                                fontWeight: 600,
                                lineHeight: '1.2'
                              }}
                              title="Click to toggle status"
                            >
                              {(rev.status || 'approved') === 'approved' ? (
                                <>
                                  <Check size={12} strokeWidth={2.5} />
                                  <span>Approved</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={12} strokeWidth={2.5} />
                                  <span>Pending</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="text-muted small text-nowrap">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </td>

                          <td className="text-end pe-3 text-nowrap">
                            <div className="d-flex justify-content-end gap-1">
                              {rev.customerEmail && (
                                <a
                                  href={`mailto:${rev.customerEmail}?subject=${encodeURIComponent(
                                    `Thank you for your review of ${rev.productTitle} - IRA Lifestyle`
                                  )}&body=${encodeURIComponent(
                                    `Dear ${rev.customerName},\n\nThank you for reviewing our ${rev.productTitle}. We are delighted to hear your feedback!\n\nWarm regards,\nNikhil & Anju\nIRA Lifestyle Studio`
                                  )}`}
                                  className="btn btn-sm btn-outline-dark p-1"
                                  title="Thank customer via Email"
                                >
                                  <Mail size={13} />
                                </a>
                              )}
                              <button
                                onClick={() => handleDeleteReview(rev._id || rev.id || '')}
                                className="btn btn-sm btn-outline-danger p-1"
                                title="Delete Review"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Reviews Mobile Card View */}
              <div className="d-md-none d-flex flex-column gap-3">
                {filteredReviews.length === 0 ? (
                  <div className="text-center py-4 text-muted">No reviews found matching this product filter.</div>
                ) : (
                  filteredReviews.map((rev) => (
                    <div key={rev._id || rev.id} className="bg-light p-3 rounded-3 border">
                      <div className="d-flex gap-2.5 align-items-start mb-2">
                        {rev.productImage && (
                          <div style={{ position: 'relative', width: '42px', height: '54px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0, border: '1px solid #E5E0D8' }}>
                            <Image src={rev.productImage} alt={rev.productTitle} fill sizes="42px" style={{ objectFit: 'cover' }} />
                          </div>
                        )}
                        <div className="flex-grow-1">
                          <span className="fw-semibold text-dark d-block font-serif text-truncate" style={{ maxWidth: '220px', fontSize: '0.9rem' }}>
                            {rev.productTitle}
                          </span>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <div className="d-flex align-items-center gap-0.5 text-warning">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  fill={i < rev.rating ? '#F59E0B' : 'none'}
                                  color="#F59E0B"
                                />
                              ))}
                              <span className="text-dark fw-bold small ms-1">{rev.rating}.0</span>
                            </div>
                            <Link 
                              href={`/product/${rev.productId}`}
                              target="_blank"
                              className="text-muted small text-decoration-none d-flex align-items-center gap-0.5"
                              style={{ fontSize: '0.7rem' }}
                            >
                              <span>View</span>
                              <ExternalLink size={9} />
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white rounded border mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold text-dark small">{rev.customerName}</span>
                          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.62rem' }}>
                            ✓ Verified
                          </span>
                        </div>
                        <p className="mb-0 text-dark small" style={{ lineHeight: '1.45', fontStyle: 'italic' }}>
                          &ldquo;{rev.comment}&rdquo;
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                        <button
                          onClick={() => handleToggleReviewStatus(rev._id || rev.id || '', rev.status)}
                          className={`btn btn-sm py-1 px-2.5 rounded-pill d-inline-flex align-items-center gap-1.5 ${
                            (rev.status || 'approved') === 'approved' 
                              ? 'btn-outline-success' 
                              : 'btn-outline-warning'
                          }`}
                          style={{ 
                            fontSize: '0.74rem', 
                            fontWeight: 600,
                            lineHeight: '1.2'
                          }}
                        >
                          {(rev.status || 'approved') === 'approved' ? (
                            <>
                              <Check size={12} strokeWidth={2.5} />
                              <span>Approved</span>
                            </>
                          ) : (
                            <>
                              <Clock size={12} strokeWidth={2.5} />
                              <span>Pending</span>
                            </>
                          )}
                        </button>

                        <div className="d-flex align-items-center gap-1.5">
                          <span className="text-muted small me-1" style={{ fontSize: '0.72rem' }}>
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                          {rev.customerEmail && (
                            <a
                              href={`mailto:${rev.customerEmail}?subject=${encodeURIComponent(
                                `Thank you for your review of ${rev.productTitle} - IRA Lifestyle`
                              )}&body=${encodeURIComponent(
                                `Dear ${rev.customerName},\n\nThank you for reviewing our ${rev.productTitle}. We are delighted to hear your feedback!\n\nWarm regards,\nNikhil & Anju\nIRA Lifestyle Studio`
                              )}`}
                              className="btn btn-sm btn-outline-dark p-1 px-2"
                              title="Email Patron"
                            >
                              <Mail size={13} />
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev._id || rev.id || '')}
                            className="btn btn-sm btn-outline-danger p-1 px-2"
                            title="Delete Review"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: INQUIRIES ================= */}
          {activeTab === 'inquiries' && (
            <div className="bg-white rounded-3 border shadow-sm p-4">
              {/* Search Bar */}
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div className="position-relative" style={{ maxWidth: '320px', width: '100%' }}>
                  <Search
                    size={16}
                    className="position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: '12px' }}
                  />
                  <input
                    type="text"
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                    placeholder="Search by name, email or message..."
                    className="form-control form-control-sm ps-5"
                  />
                </div>

                <div className="text-muted small">
                  Total {inquiries.length} customer messages received
                </div>
              </div>

              {/* Inquiries Table (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    <tr>
                      <th className="ps-3 text-nowrap">Customer</th>
                      <th className="text-nowrap">Contact Info</th>
                      <th className="text-nowrap">Subject / Purpose</th>
                      <th style={{ minWidth: '220px' }}>Message</th>
                      <th className="text-nowrap">Date</th>
                      <th className="text-end pe-3 text-nowrap">Direct Reply & Delete</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.85rem' }}>
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-4 text-muted">
                          No inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((inq) => (
                        <tr key={inq._id}>
                          <td className="ps-3 fw-semibold text-dark text-nowrap">{inq.name}</td>
                          <td className="text-nowrap">
                            <div>{inq.email}</div>
                            {inq.phone && <small className="text-muted d-block">{inq.phone}</small>}
                          </td>
                          <td className="text-nowrap">
                            <span className="badge bg-light text-dark border">
                              {inq.subject || 'General Inquiry'}
                            </span>
                          </td>
                          <td>
                            <p className="mb-0 text-dark small" style={{ whiteSpace: 'pre-wrap' }}>
                              {inq.message}
                            </p>
                          </td>
                          <td className="text-muted small text-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-end pe-3 text-nowrap">
                            <div className="d-flex justify-content-end gap-1">
                              {/* Direct Gmail/Email Reply */}
                              <a
                                href={`mailto:${inq.email}?subject=${encodeURIComponent(
                                    `Re: IRA Lifestyle Inquiry - ${inq.subject || 'Custom Styling'}`
                                )}&body=${encodeURIComponent(
                                    `Dear ${inq.name},\n\nThank you for reaching out to IRA Lifestyle Studio (Guruvayoor & Thrissur).\n\nIn response to your query:\n\nKind regards,\nNikhil & Anju\nIRA Lifestyle Studio\nWhatsApp: +91 99954 66002`
                                )}`}
                                className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1 p-1 px-2"
                                title="Reply via Email / Gmail"
                                style={{ fontSize: '0.75rem' }}
                              >
                                <Mail size={13} /> Email
                              </a>

                              {/* Direct WhatsApp Reply */}
                              {inq.phone ? (
                                <a
                                  href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                    `Hello ${inq.name}, thank you for contacting IRA Lifestyle Studio regarding "${inq.subject || 'your inquiry'}". How may we assist you today?`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 p-1 px-2"
                                  title="Reply via WhatsApp"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  <MessageCircle size={13} /> WhatsApp
                                </a>
                              ) : null}

                              {/* Delete Inquiry */}
                              <button
                                onClick={() => handleDeleteInquiry(inq._id)}
                                className="btn btn-sm btn-outline-danger p-1"
                                title="Delete Inquiry"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Inquiries Mobile Card View */}
              <div className="d-md-none d-flex flex-column gap-3">
                {filteredInquiries.length === 0 ? (
                  <div className="text-center py-4 text-muted">No inquiries found.</div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div key={inq._id} className="bg-light p-3 rounded-3 border">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-semibold text-dark font-serif d-block" style={{ fontSize: '0.95rem' }}>{inq.name}</span>
                          <small className="text-muted d-block">{inq.email}</small>
                          {inq.phone && <small className="text-muted d-block">{inq.phone}</small>}
                        </div>
                        <span className="badge bg-white text-dark border" style={{ fontSize: '0.68rem' }}>
                          {inq.subject || 'General'}
                        </span>
                      </div>

                      <div className="p-2.5 bg-white rounded border mb-2.5">
                        <p className="mb-0 text-dark small" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.45' }}>
                          {inq.message}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </small>
                        <div className="d-flex gap-1.5">
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(
                              `Re: IRA Lifestyle Inquiry - ${inq.subject || 'Custom Styling'}`
                            )}&body=${encodeURIComponent(
                              `Dear ${inq.name},\n\nThank you for reaching out to IRA Lifestyle Studio (Guruvayoor & Thrissur).\n\nIn response to your query:\n\nKind regards,\nNikhil & Anju\nIRA Lifestyle Studio\nWhatsApp: +91 99954 66002`
                            )}`}
                            className="btn btn-sm btn-outline-dark d-flex align-items-center gap-1 py-1 px-2.5"
                            style={{ fontSize: '0.74rem' }}
                          >
                            <Mail size={13} /> Email
                          </a>
                          {inq.phone && (
                            <a
                              href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                `Hello ${inq.name}, thank you for contacting IRA Lifestyle Studio regarding "${inq.subject || 'your inquiry'}". How may we assist you today?`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-success d-flex align-items-center gap-1 py-1 px-2.5"
                              style={{ fontSize: '0.74rem' }}
                            >
                              <MessageCircle size={13} /> WhatsApp
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteInquiry(inq._id)}
                            className="btn btn-sm btn-outline-danger p-1 px-2"
                            title="Delete Inquiry"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 5: SUBSCRIBERS ================= */}
          {activeTab === 'subscribers' && (
            <div className="bg-white rounded-3 border shadow-sm p-4">
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <h5 className="font-serif fw-bold text-dark mb-1">VIP Newsletter Subscriptions</h5>
                  <p className="text-muted small mb-0">
                    Customers who opted-in for private collection drops & festive styling alerts.
                  </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge px-3 py-2" style={{ backgroundColor: '#C5A880', color: '#151311', fontSize: '0.8rem' }}>
                    {subscribers.length} Subscribers
                  </span>
                  <button
                    onClick={handleCopySubscribers}
                    className="btn btn-sm btn-dark d-flex align-items-center gap-1"
                  >
                    <Copy size={13} /> {copiedEmails ? 'Copied!' : 'Copy All Emails'}
                  </button>
                </div>
              </div>

              {/* Subscribers Table (Desktop) */}
              <div className="table-responsive d-none d-md-block">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                    <tr>
                      <th className="ps-3 text-nowrap">Subscriber Email</th>
                      <th className="text-nowrap">Status</th>
                      <th className="text-nowrap">Joined Date</th>
                      <th className="text-end pe-3 text-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: '0.86rem' }}>
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          No newsletter subscribers yet.
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub, idx) => (
                        <tr key={idx}>
                          <td className="ps-3 fw-semibold text-dark text-nowrap">
                            <div className="d-flex align-items-center gap-2">
                              <Mail size={15} color="#9E7D47" />
                              <span>{sub.email}</span>
                            </div>
                          </td>
                          <td className="text-nowrap">
                            <span className="badge bg-success-subtle text-success border border-success-subtle">
                              Subscribed
                            </span>
                          </td>
                          <td className="text-muted small text-nowrap">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="text-end pe-3 text-nowrap">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.email)}
                              className="btn btn-sm btn-outline-danger p-1"
                              title="Remove Subscriber"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Subscribers Mobile Card View */}
              <div className="d-md-none d-flex flex-column gap-2.5">
                {subscribers.length === 0 ? (
                  <div className="text-center py-4 text-muted">No newsletter subscribers yet.</div>
                ) : (
                  subscribers.map((sub, idx) => (
                    <div key={idx} className="bg-light p-3 rounded-3 border d-flex justify-content-between align-items-center">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <Mail size={14} color="#9E7D47" />
                          <span className="fw-semibold text-dark small">{sub.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.62rem' }}>
                            Subscribed
                          </span>
                          <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteSubscriber(sub.email)}
                        className="btn btn-sm btn-outline-danger p-1 px-2"
                        title="Remove Subscriber"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 6: COMPREHENSIVE REPORTS & ANALYTICS ================= */}
          {activeTab === 'reports' && (
            <div className="d-flex flex-column gap-4">
              {/* Executive KPI Summary Row */}
              <div className="row g-3">
                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm h-100" style={{ borderColor: 'rgba(197, 168, 128, 0.22)' }}>
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>Total Sales (INR)</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)' }}>
                        <DollarSign size={18} color="#9E7D47" />
                      </div>
                    </div>
                    <h3 className="fw-bold mb-1 font-serif" style={{ color: '#9E7D47' }}>
                      ₹{reportBreakdown.totalRevenue.toLocaleString('en-IN')}
                    </h3>
                    <small className="text-muted">Direct boutique earnings</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm h-100" style={{ borderColor: 'rgba(197, 168, 128, 0.22)' }}>
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>Total Orders</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(37, 99, 235, 0.08)' }}>
                        <ShoppingBag size={18} color="#2563EB" />
                      </div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1 font-serif">{reportBreakdown.totalOrders}</h3>
                    <small className="text-muted">{deliveredOrdersCount} delivered successfully</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm h-100" style={{ borderColor: 'rgba(197, 168, 128, 0.22)' }}>
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>Garments Sold</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
                        <Package size={18} color="#10B981" />
                      </div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1 font-serif">{reportBreakdown.totalUnits}</h3>
                    <small className="text-muted">Individual pieces ordered</small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="bg-white p-3 p-md-4 rounded-4 border shadow-sm h-100" style={{ borderColor: 'rgba(197, 168, 128, 0.22)' }}>
                    <div className="d-flex justify-content-between align-items-center text-muted mb-2">
                      <span className="small text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.06em' }}>Average Order Value</span>
                      <div className="p-2 rounded-circle" style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)' }}>
                        <BarChart2 size={18} color="#D97706" />
                      </div>
                    </div>
                    <h3 className="fw-bold text-dark mb-1 font-serif">
                      ₹{reportBreakdown.totalOrders ? Math.round(reportBreakdown.totalRevenue / reportBreakdown.totalOrders).toLocaleString('en-IN') : 0}
                    </h3>
                    <small className="text-muted">Average spend per patron</small>
                  </div>
                </div>
              </div>

              {/* Main Report Section with Period Tabs (Date-wise, Month-wise, Year-wise) */}
              <div className="bg-white rounded-4 border shadow-sm p-3 p-md-4" style={{ borderColor: 'rgba(197, 168, 128, 0.22)' }}>
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 mb-4">
                  <div>
                    <h5 className="font-serif fw-bold text-dark mb-1" style={{ letterSpacing: '0.01em' }}>
                      Sales & Revenue Breakdown Reports
                    </h5>
                    <p className="text-muted small mb-0">
                      Granular periodic performance analysis for IRA Lifestyle Studio.
                    </p>
                  </div>

                  {/* Actions & Filters wrapper: full width on mobile, auto on desktop */}
                  <div className="d-flex flex-wrap align-items-center gap-2 w-100 w-lg-auto justify-content-start justify-content-lg-end">
                    {/* Period Tabs: Segmented luxury pill bar */}
                    <div 
                      className="d-flex align-items-center p-1 rounded-pill w-100 w-sm-auto justify-content-between"
                      style={{ 
                        backgroundColor: '#F4EFE6', 
                        border: '1px solid rgba(197, 168, 128, 0.35)',
                        gap: '4px'
                      }}
                      role="tablist"
                    >
                      <button
                        type="button"
                        onClick={() => setReportView('daily')}
                        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                        style={{
                          backgroundColor: reportView === 'daily' ? '#181513' : 'transparent',
                          color: reportView === 'daily' ? '#FAF7F2' : '#5A524C',
                          fontWeight: reportView === 'daily' ? 600 : 500,
                          fontSize: '0.78rem',
                          padding: '6px 12px',
                          border: 'none',
                          whiteSpace: 'nowrap',
                          boxShadow: reportView === 'daily' ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Calendar size={13} color={reportView === 'daily' ? '#C5A880' : 'currentColor'} /> 
                        <span>Date-wise</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportView('monthly')}
                        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                        style={{
                          backgroundColor: reportView === 'monthly' ? '#181513' : 'transparent',
                          color: reportView === 'monthly' ? '#FAF7F2' : '#5A524C',
                          fontWeight: reportView === 'monthly' ? 600 : 500,
                          fontSize: '0.78rem',
                          padding: '6px 12px',
                          border: 'none',
                          whiteSpace: 'nowrap',
                          boxShadow: reportView === 'monthly' ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <BarChart3 size={13} color={reportView === 'monthly' ? '#C5A880' : 'currentColor'} /> 
                        <span>Month-wise</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportView('yearly')}
                        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                        style={{
                          backgroundColor: reportView === 'yearly' ? '#181513' : 'transparent',
                          color: reportView === 'yearly' ? '#FAF7F2' : '#5A524C',
                          fontWeight: reportView === 'yearly' ? 600 : 500,
                          fontSize: '0.78rem',
                          padding: '6px 12px',
                          border: 'none',
                          whiteSpace: 'nowrap',
                          boxShadow: reportView === 'yearly' ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <TrendingUp size={13} color={reportView === 'yearly' ? '#C5A880' : 'currentColor'} /> 
                        <span>Year-wise</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setReportView('custom')}
                        className="btn btn-sm rounded-pill d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                        style={{
                          backgroundColor: reportView === 'custom' ? '#181513' : 'transparent',
                          color: reportView === 'custom' ? '#FAF7F2' : '#5A524C',
                          fontWeight: reportView === 'custom' ? 600 : 500,
                          fontSize: '0.78rem',
                          padding: '6px 12px',
                          border: 'none',
                          whiteSpace: 'nowrap',
                          boxShadow: reportView === 'custom' ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <Filter size={13} color={reportView === 'custom' ? '#C5A880' : 'currentColor'} /> 
                        <span>Custom Date</span>
                      </button>
                    </div>

                    {/* Custom Button: Delivered Orders Audit Modal Trigger */}
                    <button
                      onClick={() => setShowDeliveredModal(true)}
                      className="btn btn-sm rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-1.5 px-3 py-2"
                      style={{
                        backgroundColor: '#181513',
                        color: '#C5A880',
                        border: '1px solid rgba(197, 168, 128, 0.45)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                      }}
                      title="Open Delivered Orders Audit & Custom Date Modal"
                    >
                      <Truck size={14} color="#C5A880" />
                      <span>Delivered Orders</span>
                      <span
                        className="badge rounded-pill ms-1"
                        style={{ backgroundColor: 'rgba(197, 168, 128, 0.25)', color: '#FAF7F2', fontSize: '0.65rem' }}
                      >
                        {deliveredOrdersCount}
                      </span>
                    </button>

                    {/* Export Styled Excel Button */}
                    <button
                      onClick={exportBreakdownExcel}
                      className="btn btn-sm rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-1.5 px-3 py-2"
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#181513',
                        border: '1px solid rgba(197, 168, 128, 0.45)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                      }}
                      title="Download Colored Excel Spreadsheet (.xls)"
                    >
                      <FileSpreadsheet size={14} color="#15803D" />
                      <span>Export Excel</span>
                    </button>

                    {/* Copy/Export Summary Button */}
                    <button
                      onClick={handleCopyReport}
                      className="btn btn-sm rounded-pill fw-semibold d-flex align-items-center justify-content-center gap-1.5 px-3 py-2"
                      style={{ 
                        background: 'linear-gradient(135deg, #C5A880 0%, #B69466 100%)',
                        color: '#151311',
                        border: '1px solid rgba(197, 168, 128, 0.4)',
                        boxShadow: '0 2px 8px rgba(197, 168, 128, 0.25)',
                        fontSize: '0.78rem',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {copiedReport ? <Check size={14} /> : <Copy size={13} />}
                      <span>{copiedReport ? 'Copied!' : 'Copy Summary'}</span>
                    </button>
                  </div>
                </div>

                {/* Custom Date Range Inline Filter Bar (When Custom Date tab is active) */}
                {reportView === 'custom' && (
                  <div 
                    className="p-3 mb-4 rounded-3 d-flex flex-column flex-md-row align-items-stretch align-items-md-center justify-content-between gap-3"
                    style={{ backgroundColor: '#F8F6F0', border: '1px dashed #C5A880' }}
                  >
                    <div className="d-flex flex-wrap align-items-center gap-2.5">
                      <span className="small fw-bold text-dark d-flex align-items-center gap-1">
                        <Calendar size={14} color="#9E7D47" /> Custom Period:
                      </span>
                      <div className="d-flex align-items-center gap-1.5">
                        <small className="text-muted">From:</small>
                        <input
                          type="date"
                          value={reportCustomFrom}
                          onChange={(e) => setReportCustomFrom(e.target.value)}
                          className="form-control form-control-sm bg-white"
                          style={{ maxWidth: '145px', fontSize: '0.78rem' }}
                        />
                      </div>
                      <div className="d-flex align-items-center gap-1.5">
                        <small className="text-muted">To:</small>
                        <input
                          type="date"
                          value={reportCustomTo}
                          onChange={(e) => setReportCustomTo(e.target.value)}
                          className="form-control form-control-sm bg-white"
                          style={{ maxWidth: '145px', fontSize: '0.78rem' }}
                        />
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      {(reportCustomFrom || reportCustomTo) && (
                        <button
                          onClick={() => {
                            setReportCustomFrom('');
                            setReportCustomTo('');
                          }}
                          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 rounded-pill"
                          style={{ fontSize: '0.74rem' }}
                        >
                          <RotateCcw size={12} /> Clear Filter
                        </button>
                      )}
                      <small className="text-muted" style={{ fontSize: '0.74rem' }}>
                        Auto-filtering: <strong className="text-dark">{reportBreakdown.totalOrders} order(s)</strong> found
                      </small>
                    </div>
                  </div>
                )}

                {/* Period Breakdown Table (Desktop) */}
                <div className="table-responsive d-none d-md-block">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
                      <tr>
                        <th className="ps-3 text-nowrap">
                          {reportView === 'daily' && 'Date / Day'}
                          {reportView === 'monthly' && 'Calendar Month'}
                          {reportView === 'yearly' && 'Financial Year'}
                          {reportView === 'custom' && 'Custom Date Breakdown'}
                        </th>
                        <th className="text-nowrap">Orders</th>
                        <th className="text-nowrap">Garments Sold</th>
                        <th className="text-nowrap">Delivered Rate</th>
                        <th style={{ minWidth: '220px' }}>Revenue & Volume Share</th>
                        <th className="text-nowrap">Gross Sales</th>
                        <th className="text-end pe-3 text-nowrap">Average Order (AOV)</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: '0.86rem' }}>
                      {reportBreakdown.rows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            No order data recorded for this time range yet.
                          </td>
                        </tr>
                      ) : (
                        reportBreakdown.rows.map((row) => {
                          const percentOfMax = Math.round((row.revenue / reportBreakdown.maxRevenue) * 100);
                          const aov = Math.round(row.revenue / (row.ordersCount || 1));
                          const fulfillmentPct = Math.round((row.deliveredCount / (row.ordersCount || 1)) * 100);

                          return (
                            <tr key={row.periodKey}>
                              <td className="ps-3 fw-semibold text-dark text-nowrap">
                                <div className="d-flex align-items-center gap-2">
                                  <Calendar size={14} color="#9E7D47" />
                                  <span>{row.label}</span>
                                </div>
                              </td>

                              <td className="text-nowrap">
                                <span className="badge bg-light text-dark border">
                                  {row.ordersCount} order{row.ordersCount !== 1 ? 's' : ''}
                                </span>
                              </td>

                              <td className="text-nowrap">
                                <span className="text-dark fw-semibold">{row.unitsSold}</span>
                                <small className="text-muted ms-1">units</small>
                              </td>

                              <td className="text-nowrap">
                                <span
                                  className={`badge ${
                                    fulfillmentPct === 100
                                      ? 'bg-success-subtle text-success border border-success-subtle'
                                      : 'bg-warning-subtle text-dark border border-warning-subtle'
                                  }`}
                                  style={{ fontSize: '0.72rem' }}
                                >
                                  {fulfillmentPct}% delivered
                                </span>
                              </td>

                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="progress flex-grow-1" style={{ height: '7px', backgroundColor: '#EFEAE2' }}>
                                    <div
                                      className="progress-bar"
                                      role="progressbar"
                                      style={{
                                        width: `${percentOfMax}%`,
                                        backgroundColor: '#9E7D47',
                                        transition: 'width 0.6s ease'
                                      }}
                                    />
                                  </div>
                                  <small className="text-muted text-nowrap" style={{ fontSize: '0.72rem', minWidth: '38px' }}>
                                    {percentOfMax}%
                                  </small>
                                </div>
                              </td>

                              <td className="text-nowrap">
                                <span className="fw-bold" style={{ color: '#9E7D47' }}>
                                  ₹{row.revenue.toLocaleString('en-IN')}
                                </span>
                              </td>

                              <td className="text-end pe-3 text-nowrap">
                                <span className="fw-semibold text-dark">
                                  ₹{aov.toLocaleString('en-IN')}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Period Breakdown Mobile Cards */}
                <div className="d-md-none d-flex flex-column gap-3">
                  {reportBreakdown.rows.length === 0 ? (
                    <div className="text-center py-5 text-muted bg-light rounded-4 border">
                      <Calendar size={28} className="text-muted opacity-50 mb-2 d-block mx-auto" />
                      No order data recorded for this time range yet.
                    </div>
                  ) : (
                    reportBreakdown.rows.map((row) => {
                      const aov = Math.round(row.revenue / (row.ordersCount || 1));
                      const percentOfMax = Math.round((row.revenue / reportBreakdown.maxRevenue) * 100);
                      const fulfillmentPct = Math.round((row.deliveredCount / (row.ordersCount || 1)) * 100);

                      return (
                        <div 
                          key={row.periodKey} 
                          className="p-3.5 rounded-4 bg-white"
                          style={{
                            border: '1px solid rgba(197, 168, 128, 0.28)',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {/* Card Top: Label & Revenue */}
                          <div className="d-flex justify-content-between align-items-start mb-2.5">
                            <div>
                              <div className="d-flex align-items-center gap-1.5 mb-1">
                                <Calendar size={14} color="#9E7D47" />
                                <span className="fw-bold font-serif text-dark" style={{ fontSize: '1.02rem', letterSpacing: '0.01em' }}>
                                  {row.label}
                                </span>
                              </div>
                              <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                                {row.ordersCount} {row.ordersCount === 1 ? 'order' : 'orders'} • {row.unitsSold} {row.unitsSold === 1 ? 'unit' : 'units'}
                              </span>
                            </div>

                            <div className="text-end">
                              <span 
                                className="fw-bold d-block" 
                                style={{ 
                                  color: '#9E7D47', 
                                  fontSize: '1.15rem',
                                  letterSpacing: '-0.01em' 
                                }}
                              >
                                ₹{row.revenue.toLocaleString('en-IN')}
                              </span>
                              <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                {percentOfMax}% volume
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div 
                            className="w-100 mb-3 rounded-pill overflow-hidden" 
                            style={{ height: '5px', backgroundColor: '#F1EDE4' }}
                          >
                            <div
                              style={{ 
                                width: `${percentOfMax}%`, 
                                height: '100%',
                                background: 'linear-gradient(90deg, #C5A880 0%, #9E7D47 100%)',
                                borderRadius: '999px',
                                transition: 'width 0.6s ease'
                              }}
                            />
                          </div>

                          {/* Card Footer: Delivery Badge + AOV */}
                          <div className="d-flex justify-content-between align-items-center pt-2.5 border-top" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                            <span 
                              className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1"
                              style={{ 
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                backgroundColor: fulfillmentPct === 100 ? 'rgba(16, 185, 129, 0.1)' : fulfillmentPct > 0 ? 'rgba(217, 119, 6, 0.1)' : 'rgba(107, 114, 128, 0.08)',
                                color: fulfillmentPct === 100 ? '#059669' : fulfillmentPct > 0 ? '#B45309' : '#6B7280',
                                border: fulfillmentPct === 100 ? '1px solid rgba(16, 185, 129, 0.25)' : fulfillmentPct > 0 ? '1px solid rgba(217, 119, 6, 0.25)' : '1px solid rgba(107, 114, 128, 0.2)'
                              }}
                            >
                              <span className="rounded-circle" style={{ width: '5px', height: '5px', backgroundColor: 'currentColor' }} />
                              {fulfillmentPct}% Delivered
                            </span>

                            <div style={{ fontSize: '0.8rem', color: '#666' }}>
                              AOV: <strong className="text-dark" style={{ fontSize: '0.86rem' }}>₹{aov.toLocaleString('en-IN')}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Status & Catalog Distribution Cards */}
              <div className="row g-4">
                {/* Order Status Distribution */}
                <div className="col-12 col-lg-6">
                  <div className="bg-white p-4 rounded-3 border shadow-sm h-100">
                    <h5 className="font-serif fw-bold text-dark mb-3">Order Status Distribution</h5>
                    <div className="row g-2">
                      {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
                        const count = orders.filter((o) => o.orderStatus === st).length;
                        const percent = orders.length ? Math.round((count / orders.length) * 100) : 0;
                        return (
                          <div key={st} className="col-6 col-sm-4">
                            <div className="p-3 rounded border text-center bg-light">
                              <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>{st}</small>
                              <span className="fs-5 fw-bold text-dark">{count}</span>
                              <div className="text-muted" style={{ fontSize: '0.68rem' }}>{percent}%</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Garment Catalog Breakdown */}
                <div className="col-12 col-lg-6">
                  <div className="bg-white p-4 rounded-3 border shadow-sm h-100">
                    <h5 className="font-serif fw-bold text-dark mb-3">Garment Catalog Breakdown</h5>
                    <div className="row g-2">
                      {categoryStats.slices.map((slice) => (
                        <div key={slice.category} className="col-6 col-sm-4">
                          <div className="p-3 rounded border text-center bg-light">
                            <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                              <span className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: slice.color }} />
                              <small className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
                                {slice.label}
                              </small>
                            </div>
                            <span className="fs-5 fw-bold text-dark">{slice.count}</span>
                            <div className="text-muted" style={{ fontSize: '0.68rem' }}>{slice.percent}% share</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 7: STORE OPTIONS & SETTINGS ================= */}
          {activeTab === 'options' && (
            <div className="bg-white rounded-3 border shadow-sm p-4" style={{ maxWidth: '800px' }}>
              <h5 className="font-serif fw-bold text-dark mb-3">IRA Lifestyle Boutique Configuration</h5>
              <p className="text-muted small mb-4">
                Master store metadata, direct WhatsApp line, and flagship studio locations.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Brand / Boutique Name</label>
                    <input type="text" readOnly value="IRA Lifestyle" className="form-control form-control-sm bg-light" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Founders / Visionaries</label>
                    <input type="text" readOnly value="Nikhil & Anju" className="form-control form-control-sm bg-light" />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Official WhatsApp Line</label>
                    <input type="text" readOnly value="+91 99954 66002" className="form-control form-control-sm bg-light" />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-semibold">Store Currency</label>
                    <input type="text" readOnly value="INR (₹)" className="form-control form-control-sm bg-light" />
                  </div>
                </div>

                <div>
                  <label className="form-label small fw-semibold">Studio Locations</label>
                  <input
                    type="text"
                    readOnly
                    value="Guruvayoor & Thrissur, Kerala, India"
                    className="form-control form-control-sm bg-light"
                  />
                  <small className="text-muted">Direct dispatch to patrons nationwide.</small>
                </div>


              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODAL: DELIVERED ORDERS AUDIT & CUSTOM DATE RANGE ================= */}
      {showDeliveredModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-2 p-md-3"
          style={{ backgroundColor: 'rgba(21, 19, 17, 0.8)', backdropFilter: 'blur(6px)', zIndex: 3200 }}
          onClick={() => setShowDeliveredModal(false)}
        >
          <div
            className="bg-white rounded-4 shadow-2xl p-3 p-md-4 w-100 overflow-auto"
            style={{ maxWidth: '1060px', maxHeight: '92vh', border: '1px solid #C5A880' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="d-flex justify-content-between align-items-start pb-3 border-bottom mb-3">
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '42px', height: '42px', backgroundColor: 'rgba(197, 168, 128, 0.15)', border: '1px solid rgba(197, 168, 128, 0.35)' }}
                >
                  <Truck size={22} color="#9E7D47" />
                </div>
                <div>
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="font-serif mb-0 text-dark fw-bold" style={{ letterSpacing: '0.01em' }}>
                      Delivered Orders Audit
                    </h4>
                    <span className="badge rounded-pill bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.72rem' }}>
                      100% Delivered
                    </span>
                  </div>
                  <small className="text-muted">
                    Filter completed deliveries by custom date range, search patrons, and export color-styled Excel spreadsheets.
                  </small>
                </div>
              </div>

              <button
                onClick={() => setShowDeliveredModal(false)}
                className="btn btn-sm btn-link text-muted p-1 rounded-circle"
                aria-label="Close Modal"
              >
                <X size={22} />
              </button>
            </div>

            {/* Date Filters & Auto-Search Controls Bar */}
            <div 
              className="p-3 mb-3.5 rounded-3" 
              style={{ backgroundColor: '#F9F7F2', border: '1px solid rgba(197, 168, 128, 0.3)' }}
            >
              <div className="row g-2.5 align-items-end">
                {/* From Date */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label small fw-semibold text-dark mb-1 d-flex align-items-center gap-1">
                    <Calendar size={13} color="#9E7D47" /> From Date:
                  </label>
                  <input
                    type="date"
                    value={deliveredDateFrom}
                    onChange={(e) => setDeliveredDateFrom(e.target.value)}
                    className="form-control form-control-sm bg-white"
                  />
                </div>

                {/* To Date */}
                <div className="col-12 col-sm-6 col-md-3">
                  <label className="form-label small fw-semibold text-dark mb-1 d-flex align-items-center gap-1">
                    <Calendar size={13} color="#9E7D47" /> To Date:
                  </label>
                  <input
                    type="date"
                    value={deliveredDateTo}
                    onChange={(e) => setDeliveredDateTo(e.target.value)}
                    className="form-control form-control-sm bg-white"
                  />
                </div>

                {/* Auto Search */}
                <div className="col-12 col-sm-8 col-md-4">
                  <label className="form-label small fw-semibold text-dark mb-1 d-flex align-items-center gap-1">
                    <Search size={13} color="#9E7D47" /> Auto-Search Filter:
                  </label>
                  <input
                    type="text"
                    placeholder="Search patron, phone, garment, order ID..."
                    value={deliveredSearchQuery}
                    onChange={(e) => setDeliveredSearchQuery(e.target.value)}
                    className="form-control form-control-sm bg-white"
                  />
                </div>

                {/* Clear Button */}
                <div className="col-12 col-sm-4 col-md-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeliveredDateFrom('');
                      setDeliveredDateTo('');
                      setDeliveredSearchQuery('');
                    }}
                    disabled={!deliveredDateFrom && !deliveredDateTo && !deliveredSearchQuery}
                    className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1 rounded"
                    style={{ height: '31px', fontSize: '0.78rem' }}
                  >
                    <RotateCcw size={12} /> Clear Filter
                  </button>
                </div>
              </div>

              {/* Quick Date Presets */}
              <div className="d-flex flex-wrap align-items-center gap-1.5 mt-2.5 pt-2 border-top border-secondary-subtle">
                <small className="text-muted fw-semibold me-1" style={{ fontSize: '0.72rem' }}>Quick Presets:</small>
                <button
                  type="button"
                  onClick={() => {
                    const todayStr = new Date().toISOString().slice(0, 10);
                    setDeliveredDateFrom(todayStr);
                    setDeliveredDateTo(todayStr);
                  }}
                  className="btn btn-xs btn-outline-dark rounded-pill px-2.5 py-0.5"
                  style={{ fontSize: '0.7rem' }}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
                    const todayStr = now.toISOString().slice(0, 10);
                    setDeliveredDateFrom(firstDay);
                    setDeliveredDateTo(todayStr);
                  }}
                  className="btn btn-xs btn-outline-dark rounded-pill px-2.5 py-0.5"
                  style={{ fontSize: '0.7rem' }}
                >
                  This Month
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const d = new Date();
                    d.setDate(d.getDate() - 30);
                    setDeliveredDateFrom(d.toISOString().slice(0, 10));
                    setDeliveredDateTo(now.toISOString().slice(0, 10));
                  }}
                  className="btn btn-xs btn-outline-dark rounded-pill px-2.5 py-0.5"
                  style={{ fontSize: '0.7rem' }}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const firstDayYear = new Date(now.getFullYear(), 0, 1).toISOString().slice(0, 10);
                    const todayStr = now.toISOString().slice(0, 10);
                    setDeliveredDateFrom(firstDayYear);
                    setDeliveredDateTo(todayStr);
                  }}
                  className="btn btn-xs btn-outline-dark rounded-pill px-2.5 py-0.5"
                  style={{ fontSize: '0.7rem' }}
                >
                  This Year
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveredDateFrom('');
                    setDeliveredDateTo('');
                    setDeliveredSearchQuery('');
                  }}
                  className="btn btn-xs btn-outline-dark rounded-pill px-2.5 py-0.5"
                  style={{ fontSize: '0.7rem' }}
                >
                  All Delivered ({deliveredOrdersData.allDeliveredCount})
                </button>
              </div>
            </div>

            {/* Summary KPI row inside modal */}
            <div className="row g-2.5 mb-3.5">
              <div className="col-6 col-md-3">
                <div className="p-2.5 rounded-3 border bg-white text-center shadow-xs">
                  <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Delivered Orders</small>
                  <span className="fs-5 fw-bold text-dark">{deliveredOrdersData.totalOrders}</span>
                  <div className="text-muted" style={{ fontSize: '0.68rem' }}>of {deliveredOrdersData.allDeliveredCount} total</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-2.5 rounded-3 border bg-white text-center shadow-xs">
                  <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Delivered Sales</small>
                  <span className="fs-5 fw-bold" style={{ color: '#9E7D47' }}>
                    ₹{deliveredOrdersData.totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <div className="text-muted" style={{ fontSize: '0.68rem' }}>Direct earnings</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-2.5 rounded-3 border bg-white text-center shadow-xs">
                  <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Garments Delivered</small>
                  <span className="fs-5 fw-bold text-dark">{deliveredOrdersData.totalUnits}</span>
                  <div className="text-muted" style={{ fontSize: '0.68rem' }}>pieces dispatched</div>
                </div>
              </div>

              <div className="col-6 col-md-3">
                <div className="p-2.5 rounded-3 border bg-white text-center shadow-xs">
                  <small className="text-muted d-block text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>Delivered AOV</small>
                  <span className="fs-5 fw-bold text-dark">
                    ₹{deliveredOrdersData.aov.toLocaleString('en-IN')}
                  </span>
                  <div className="text-muted" style={{ fontSize: '0.68rem' }}>Avg spend / order</div>
                </div>
              </div>
            </div>

            {/* Modal Table Action Bar */}
            <div className="d-flex justify-content-between align-items-center mb-2.5">
              <span className="small text-muted">
                Showing <strong className="text-dark">{deliveredOrdersData.totalOrders}</strong> delivered record(s)
              </span>

              {/* Export Excel with Colors Button */}
              <button
                onClick={exportDeliveredExcel}
                disabled={deliveredOrdersData.totalOrders === 0}
                className="btn btn-sm rounded-pill fw-bold text-dark d-flex align-items-center gap-1.5 px-3 py-1.5 shadow-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #C5A880 0%, #B69466 100%)',
                  border: '1px solid rgba(197, 168, 128, 0.6)',
                  fontSize: '0.78rem'
                }}
                title="Download Excel spreadsheet with custom colors and formatting"
              >
                <FileSpreadsheet size={15} />
                <span>Export Excel (Styled with Colors)</span>
              </button>
            </div>

            {/* Delivered Orders List (Desktop Table) */}
            <div className="table-responsive d-none d-md-block border rounded-3 overflow-hidden mb-3">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small text-uppercase" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                  <tr>
                    <th className="ps-3">Order ID</th>
                    <th>Patron & Contact</th>
                    <th>Date & Time</th>
                    <th>Garments & Specs</th>
                    <th className="text-center">Units</th>
                    <th className="text-center">Fulfillment</th>
                    <th className="text-end pe-3">Gross Total</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.84rem' }}>
                  {deliveredOrdersData.orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 text-muted">
                        <Truck size={32} className="opacity-30 mb-2 d-block mx-auto text-muted" />
                        No delivered orders match the selected date range or search query.
                      </td>
                    </tr>
                  ) : (
                    deliveredOrdersData.orders.map((o) => {
                      const orderDate = new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });
                      const orderTime = new Date(o.createdAt || Date.now()).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const units = o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1;

                      return (
                        <tr key={o.orderId || o._id || Math.random()}>
                          <td className="ps-3 fw-bold font-monospace small text-dark">
                            #{(o.orderId || o._id || '').slice(-8).toUpperCase()}
                          </td>

                          <td>
                            <div className="fw-semibold text-dark">{o.customer?.fullName || 'Patron'}</div>
                            <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.72rem' }}>
                              {o.customer?.phone && (
                                <span className="d-flex align-items-center gap-1">
                                  <Phone size={10} /> {o.customer.phone}
                                </span>
                              )}
                              {o.shippingAddress?.city && <span>• {o.shippingAddress.city}</span>}
                            </div>
                          </td>

                          <td className="text-nowrap">
                            <div>{orderDate}</div>
                            <small className="text-muted" style={{ fontSize: '0.72rem' }}>{orderTime}</small>
                          </td>

                          <td style={{ maxWidth: '280px' }}>
                            <div className="text-truncate">
                              {(o.items || []).map((it, i) => (
                                <span key={i} className="d-block text-truncate" style={{ fontSize: '0.78rem' }}>
                                  {it.title} <span className="text-muted">({it.size || 'Standard'} × {it.quantity || 1})</span>
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="text-center text-nowrap fw-semibold">
                            {units}
                          </td>

                          <td className="text-center text-nowrap">
                            <span 
                              className="badge rounded-pill d-inline-flex align-items-center gap-1 px-2.5 py-1"
                              style={{ 
                                backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                                color: '#059669', 
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                fontSize: '0.7rem'
                              }}
                            >
                              <CheckCircle2 size={11} /> Delivered
                            </span>
                          </td>

                          <td className="text-end pe-3 fw-bold font-serif" style={{ color: '#9E7D47', fontSize: '0.94rem' }}>
                            ₹{Number(o.total || 0).toLocaleString('en-IN')}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Delivered Orders List (Mobile Cards) */}
            <div className="d-md-none d-flex flex-column gap-2.5 mb-3">
              {deliveredOrdersData.orders.length === 0 ? (
                <div className="text-center py-4 text-muted bg-light rounded-3 border">
                  No delivered orders found in this date range.
                </div>
              ) : (
                deliveredOrdersData.orders.map((o) => {
                  const orderDate = new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });
                  const units = o.items ? o.items.reduce((s, it) => s + (it.quantity || 1), 0) : 1;

                  return (
                    <div key={o.orderId || o._id || Math.random()} className="p-3 rounded-3 bg-light border">
                      <div className="d-flex justify-content-between align-items-start mb-1.5">
                        <div>
                          <span className="fw-bold font-monospace small text-dark d-block">
                            #{(o.orderId || o._id || '').slice(-8).toUpperCase()}
                          </span>
                          <span className="fw-semibold text-dark">{o.customer?.fullName || 'Patron'}</span>
                        </div>
                        <span className="fw-bold font-serif" style={{ color: '#9E7D47', fontSize: '1rem' }}>
                          ₹{Number(o.total || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                        {orderDate} • {units} piece{units !== 1 ? 's' : ''} • {o.customer?.phone || 'No phone'}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary-subtle">
                        <span 
                          className="badge rounded-pill d-inline-flex align-items-center gap-1"
                          style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontSize: '0.68rem' }}
                        >
                          <CheckCircle2 size={10} /> Delivered
                        </span>
                        <small className="text-muted text-truncate" style={{ maxWidth: '180px', fontSize: '0.72rem' }}>
                          {(o.items || []).map((it) => it.title).join(', ')}
                        </small>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="d-flex justify-content-end gap-2 pt-2 border-top">
              <button
                type="button"
                onClick={() => setShowDeliveredModal(false)}
                className="btn btn-sm btn-outline-secondary px-3"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD PRODUCT ================= */}
      {showAddModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(21, 19, 17, 0.75)', backdropFilter: 'blur(5px)', zIndex: 3000 }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-3 shadow-2xl p-4 p-md-5 w-100 overflow-auto"
            style={{ maxWidth: '640px', maxHeight: '90vh', border: '1px solid #C5A880' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
              <h4 className="font-serif mb-0 text-dark fw-bold">Add Luxury Garment</h4>
              <button onClick={() => setShowAddModal(false)} className="btn btn-link text-dark p-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-semibold">Garment Title *</label>
                <input
                  type="text"
                  required
                  value={newProd.title}
                  onChange={(e) => setNewProd({ ...newProd, title: e.target.value })}
                  placeholder="e.g. Royal Maroon Silk Anarkali"
                  className="form-control"
                />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="dresses">Dresses & Gowns</option>
                    <option value="kurtis">Kurtis</option>
                    <option value="sarees">Sarees</option>
                    <option value="co-ord-sets">Co-ord Sets</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="2999"
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Original Price (₹) (Optional)</label>
                  <input
                    type="number"
                    value={newProd.originalPrice}
                    onChange={(e) => setNewProd({ ...newProd, originalPrice: e.target.value })}
                    placeholder="4999"
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Fabric Specification</label>
                  <input
                    type="text"
                    value={newProd.fabric}
                    onChange={(e) => setNewProd({ ...newProd, fabric: e.target.value })}
                    placeholder="Pure Georgette with Silk Lining"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="form-label small fw-semibold">Garment Image & Cloudflare Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="form-control mb-2"
                />
                {uploadingImage && <small className="text-muted">Uploading image...</small>}
                {uploadSuccessMsg && <small className="text-success d-block">{uploadSuccessMsg}</small>}

                <div className="mt-2">
                  <label className="form-label small text-muted">Or Direct Image URL</label>
                  <input
                    type="text"
                    value={newProd.image}
                    onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                    className="form-control form-control-sm"
                  />
                </div>
              </div>

              <div>
                <label className="form-label small fw-semibold">Garment Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Handcrafted pure zari embroidery..."
                  className="form-control"
                />
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={newProd.isFeatured}
                  onChange={(e) => setNewProd({ ...newProd, isFeatured: e.target.checked })}
                  className="form-check-input"
                />
                <label htmlFor="featuredCheck" className="form-check-label small fw-semibold">
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-dark fw-bold px-4"
                  style={{ backgroundColor: '#C5A880' }}
                >
                  Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PRODUCT ================= */}
      {editingProduct && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{ backgroundColor: 'rgba(21, 19, 17, 0.75)', backdropFilter: 'blur(5px)', zIndex: 3000 }}
          onClick={() => setEditingProduct(null)}
        >
          <div
            className="bg-white rounded-3 shadow-2xl p-4 p-md-5 w-100 overflow-auto"
            style={{ maxWidth: '640px', maxHeight: '90vh', border: '1px solid #C5A880' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
              <h4 className="font-serif mb-0 text-dark fw-bold">Edit Luxury Garment</h4>
              <button onClick={() => setEditingProduct(null)} className="btn btn-link text-dark p-0">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="d-flex flex-column gap-3">
              <div>
                <label className="form-label small fw-semibold">Garment Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Category *</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="form-select"
                  >
                    <option value="dresses">Dresses & Gowns</option>
                    <option value="kurtis">Kurtis</option>
                    <option value="sarees">Sarees</option>
                    <option value="co-ord-sets">Co-ord Sets</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div className="col-6">
                  <label className="form-label small fw-semibold">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="form-control"
                  />
                </div>
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label small fw-semibold">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="form-control"
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-semibold">Fabric Specification</label>
                  <input
                    type="text"
                    value={editingProduct.fabric || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, fabric: e.target.value })}
                    className="form-control"
                  />
                </div>
              </div>

              {/* Upload image */}
              <div>
                <label className="form-label small fw-semibold">Garment Image & Upload</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="form-control form-control-sm"
                  placeholder="Image URL"
                />
              </div>

              <div>
                <label className="form-label small fw-semibold">Garment Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="form-control"
                />
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  id="editFeaturedCheck"
                  checked={editingProduct.isFeatured || false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                  className="form-check-input"
                />
                <label htmlFor="editFeaturedCheck" className="form-check-label small fw-semibold">
                  Feature on Homepage Showcase
                </label>
              </div>

              <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-2">
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn text-dark fw-bold px-4"
                  style={{ backgroundColor: '#C5A880' }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
