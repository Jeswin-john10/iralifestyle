'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Upload,
  Plus,
  Trash2,
  Package,
  ShoppingBag,
  Database,
  Cloud,
  Check,
  AlertCircle,
  Eye,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { initialProducts } from '@/lib/data';
import { Product } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'products' | 'add' | 'orders'>('products');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [dbSource, setDbSource] = useState<'mongodb' | 'memory'>('memory');
  const [toast, setToast] = useState<string | null>(null);

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Dresses',
    description: '',
    fabric: 'Pure Silk',
    care: 'Dry clean only',
    sizes: 'S, M, L, XL',
    featured: false,
    isNewArrival: true,
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProvider, setUploadProvider] = useState<string | null>(null);

  // Check login
  useEffect(() => {
    const isLogged = localStorage.getItem('ira_admin_logged_in');
    if (!isLogged) {
      router.push('/admin/ira/login');
    }
  }, [router]);

  // Fetch products & orders
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
        setDbSource(data.source);
      }

      const ordRes = await fetch('/api/orders');
      const ordData = await ordRes.json();
      if (ordData.success && ordData.orders) {
        setOrders(ordData.orders);
      }
    } catch {
      // Keep initial
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ira_admin_logged_in');
    router.push('/admin/ira/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      setToast('Name and price are required');
      return;
    }

    setUploading(true);
    let finalImageUrl = previewUrl || '/images/cat-dresses.jpg';

    // Upload image to Cloudflare R2 / Local API
    if (uploadFile) {
      try {
        const formData = new FormData();
        formData.append('file', uploadFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (uploadData.success && uploadData.url) {
          finalImageUrl = uploadData.url;
          setUploadProvider(uploadData.provider);
        }
      } catch (err) {
        console.error('Image upload failed, using fallback', err);
      }
    }

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price),
          originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : undefined,
          image: finalImageUrl,
          sizes: newProduct.sizes.split(',').map((s) => s.trim()),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setToast(`Product "${newProduct.name}" created successfully!`);
        // Reset form
        setNewProduct({
          name: '',
          price: '',
          originalPrice: '',
          category: 'Dresses',
          description: '',
          fabric: 'Pure Silk',
          care: 'Dry clean only',
          sizes: 'S, M, L, XL',
          featured: false,
          isNewArrival: true,
        });
        setUploadFile(null);
        setPreviewUrl(null);
        setActiveTab('products');
        loadData();
      } else {
        setToast('Failed to save product');
      }
    } catch {
      setToast('Server error while saving product');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this piece from the catalogue?')) return;
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setToast('Product removed');
    } catch {
      setToast('Failed to delete product');
    }
  };

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-8 md:py-12">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#231F1C] text-white px-5 py-3 rounded-sm shadow-xl flex items-center space-x-2 text-xs tracking-wider animate-fadeIn">
          <Check className="w-4 h-4 text-[#B68D56]" />
          <span>{toast}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-[#8F867C] hover:text-white">
            &times;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-12">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-[#EDE5D8] gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative w-12 h-12">
              <Image
                src="/images/ira-logo.png"
                alt="IRA Lifestyle"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] font-semibold text-[#8F867C] uppercase block">
                ATELIER ADMIN CONSOLE
              </span>
              <h1
                style={{ fontFamily: 'var(--font-serif)' }}
                className="text-2xl sm:text-3xl text-[#231F1C] font-normal"
              >
                IRA Lifestyle Management
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 border border-[#EDE5D8] bg-white rounded-xs text-[#5A524A] hover:text-[#B68D56] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/"
              className="px-4 py-2 border border-[#EDE5D8] bg-white text-xs text-[#5A524A] hover:text-[#B68D56] rounded-xs transition-colors"
            >
              View Live Store &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-[#231F1C] text-white text-xs rounded-xs hover:bg-[#3D3731] flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xs border border-[#EDE5D8] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8F867C] font-medium uppercase tracking-wider">
                MongoDB Database
              </span>
              <Database className="w-4 h-4 text-[#B68D56]" />
            </div>
            <div className="text-sm font-semibold text-[#231F1C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{dbSource === 'mongodb' ? 'MongoDB Atlas Connected' : 'In-Memory Cache (Active)'}</span>
            </div>
            <p className="text-[11px] text-[#8F867C] mt-1">Configured via MONGODB_URI in .env</p>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#EDE5D8] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8F867C] font-medium uppercase tracking-wider">
                Storage &amp; CDN
              </span>
              <Cloud className="w-4 h-4 text-[#B68D56]" />
            </div>
            <div className="text-sm font-semibold text-[#231F1C] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{uploadProvider === 'cloudflare-r2' ? 'Cloudflare R2 Active' : 'Cloudflare R2 / Local Storage'}</span>
            </div>
            <p className="text-[11px] text-[#8F867C] mt-1">S3 API endpoint ready for R2 bucket</p>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#EDE5D8] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8F867C] font-medium uppercase tracking-wider">
                Total Products
              </span>
              <Package className="w-4 h-4 text-[#B68D56]" />
            </div>
            <div className="text-2xl font-bold text-[#231F1C]">{products.length}</div>
            <p className="text-[11px] text-[#8F867C] mt-1">Dresses, Kurtis, Sarees, Co-ords</p>
          </div>

          <div className="bg-white p-5 rounded-xs border border-[#EDE5D8] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#8F867C] font-medium uppercase tracking-wider">
                Orders Placed
              </span>
              <ShoppingBag className="w-4 h-4 text-[#B68D56]" />
            </div>
            <div className="text-2xl font-bold text-[#231F1C]">{orders.length}</div>
            <p className="text-[11px] text-[#8F867C] mt-1">Real-time checkout orders</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex space-x-3 mb-6 border-b border-[#EDE5D8]">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-2 text-xs uppercase tracking-wider font-semibold transition-colors relative ${
              activeTab === 'products' ? 'text-[#B68D56]' : 'text-[#8F867C] hover:text-[#231F1C]'
            }`}
          >
            All Products ({products.length})
            {activeTab === 'products' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B68D56]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-2 text-xs uppercase tracking-wider font-semibold transition-colors relative flex items-center space-x-1 ${
              activeTab === 'add' ? 'text-[#B68D56]' : 'text-[#8F867C] hover:text-[#231F1C]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Piece</span>
            {activeTab === 'add' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B68D56]" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-2 text-xs uppercase tracking-wider font-semibold transition-colors relative ${
              activeTab === 'orders' ? 'text-[#B68D56]' : 'text-[#8F867C] hover:text-[#231F1C]'
            }`}
          >
            Customer Orders ({orders.length})
            {activeTab === 'orders' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#B68D56]" />
            )}
          </button>
        </div>

        {/* TAB 1: PRODUCT LIST */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-xs border border-[#EDE5D8] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#4A423A]">
                <thead className="bg-[#FAF7F2] border-b border-[#EDE5D8] text-[11px] uppercase tracking-wider font-semibold text-[#8F867C]">
                  <tr>
                    <th className="py-3.5 px-4">Piece</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Sizes</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EDE5D8]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-16 bg-[#EDE5D8] rounded-xs overflow-hidden flex-shrink-0">
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-[#231F1C] block text-sm">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#8F867C] font-mono">ID: {p.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 bg-[#F2ECE0] rounded-xs text-[11px] font-medium text-[#4A423A]">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#231F1C]">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-[#6F665C]">
                        {p.sizes?.join(', ') || 'Standard'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          <span>In Stock</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 text-[#8F867C] hover:text-[#B68D56] rounded-xs hover:bg-[#F2ECE0] transition-colors"
                            title="View Product Page"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#9E948A] hover:text-red-600 rounded-xs hover:bg-red-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PRODUCT WITH CLOUDFLARE UPLOAD */}
        {activeTab === 'add' && (
          <div className="bg-white p-6 sm:p-10 rounded-xs border border-[#EDE5D8] shadow-xs max-w-3xl">
            <h2
              style={{ fontFamily: 'var(--font-serif)' }}
              className="text-2xl sm:text-3xl text-[#231F1C] font-normal mb-2"
            >
              Add New Luxury Creation
            </h2>
            <p className="text-xs text-[#8F867C] mb-6 font-light">
              Images will be uploaded to Cloudflare R2 object storage with fast global CDN delivery.
            </p>

            <form onSubmit={handleCreateProduct} className="space-y-5">
              {/* Image Upload Zone */}
              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-2">
                  Product Image (Cloudflare R2 Object Storage) *
                </label>
                <div className="border-2 border-dashed border-[#EDE5D8] hover:border-[#B68D56] rounded-xs p-6 text-center cursor-pointer bg-[#FAF7F2] transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {previewUrl ? (
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-44 rounded-xs overflow-hidden border border-[#EDE5D8] mb-2 shadow-xs">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      </div>
                      <span className="text-xs text-[#3F6A44] font-semibold">Image selected. Click to replace.</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-[#B68D56] mb-2 stroke-[1.5]" />
                      <span className="text-xs font-semibold text-[#231F1C] block">
                        Upload high-resolution photography
                      </span>
                      <span className="text-[11px] text-[#8F867C] mt-1">
                        PNG, JPG, WebP up to 10MB (Stores on Cloudflare R2 CDN)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Royal Maroon Silk Anarkali"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56] cursor-pointer"
                  >
                    <option value="Dresses">Dresses</option>
                    <option value="Kurtis">Kurtis</option>
                    <option value="Sarees">Sarees</option>
                    <option value="Co-ord Sets">Co-ord Sets</option>
                    <option value="New Arrivals">New Arrivals</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="2999"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    placeholder="4499"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Fabric &amp; Composition
                  </label>
                  <input
                    type="text"
                    value={newProduct.fabric}
                    onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                    placeholder="e.g. Pure Chanderi Silk"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                    Sizes Available (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="XS, S, M, L, XL"
                    className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Describe the silhouette, embroidery details, and occasion suitability..."
                  className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
                />
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-xs text-[#4A423A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="rounded-xs text-[#B68D56] focus:ring-[#B68D56]"
                  />
                  <span>Feature on Homepage &ldquo;Designer Ethnic Wear&rdquo;</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-[#4A423A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isNewArrival}
                    onChange={(e) => setNewProduct({ ...newProduct, isNewArrival: e.target.checked })}
                    className="rounded-xs text-[#B68D56] focus:ring-[#B68D56]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="gold-btn w-full py-4 text-xs tracking-[0.2em] uppercase rounded-xs font-semibold shadow-sm flex items-center justify-center space-x-2"
              >
                <Cloud className="w-4 h-4" />
                <span>{uploading ? 'UPLOADING TO CLOUDFLARE R2...' : 'SAVE & PUBLISH PRODUCT'}</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-xs border border-[#EDE5D8] overflow-hidden shadow-xs">
            {orders.length === 0 ? (
              <div className="py-16 text-center text-xs text-[#8F867C]">
                No customer orders received yet. New checkout orders will show up here automatically.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#4A423A]">
                  <thead className="bg-[#FAF7F2] border-b border-[#EDE5D8] text-[11px] uppercase tracking-wider font-semibold text-[#8F867C]">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Delivery Address</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EDE5D8]">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#231F1C]">
                          #{ord.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#231F1C] block">{ord.customerName}</span>
                          <span className="text-[10px] text-[#8F867C]">{ord.email} &bull; {ord.phone}</span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-[#6F665C]">
                          {ord.address}, {ord.city}, {ord.state} - {ord.pincode}
                        </td>
                        <td className="py-3.5 px-4 uppercase font-semibold text-[#B68D56]">
                          {ord.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-[#231F1C]">
                          ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-xs bg-[#EAF2EC] text-[#2F5A35] font-semibold text-[10px] uppercase">
                            {ord.status || 'Confirmed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
