'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Product, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Check, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Ruler, 
  Sparkles,
  ChevronRight,
  Share2,
  MessageSquare,
  UserCheck,
  User as UserIcon,
  Mail,
  PenLine,
  ThumbsUp,
  ArrowRight
} from 'lucide-react';

import { Suspense } from 'react';
import { INITIAL_PRODUCTS } from '@/data/initialData';
import ProductCard from '@/components/ProductCard';
import { useAuth } from '@/context/AuthContext';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const id = (params.id as string) || '';
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const { user } = useAuth();

  const initialProd = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
  const [product, setProduct] = useState<Product | null>(initialProd);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(() =>
    initialProd ? INITIAL_PRODUCTS.filter((p) => p.id !== initialProd.id).slice(0, 4) : []
  );
  const [selectedImage, setSelectedImage] = useState<string>(initialProd?.image || '');
  const [selectedSize, setSelectedSize] = useState<string>(initialProd?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(!initialProd);
  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'reviews'>('details');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Auto-fill logged-in client details
  useEffect(() => {
    if (user && !reviewName) {
      setReviewName(user.name || '');
      setReviewEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedImage(data.product.image);
          setSelectedSize(data.product.sizes?.[0] || 'M');

          // Load related
          const allRes = await fetch(`/api/products?category=${data.product.category}`);
          const allData = await allRes.json();
          if (allData.products) {
            setRelatedProducts(allData.products.filter((p: Product) => p.id !== data.product.id).slice(0, 4));
          }
        }

        // Fetch client reviews for this piece
        const revRes = await fetch(`/api/reviews?productId=${id}`);
        const revData = await revRes.json();
        if (revData.reviews) {
          setReviews(revData.reviews);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="py-5 text-center text-muted min-vh-50 d-flex align-items-center justify-content-center">
        <p>Loading royal garment details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h3 className="font-serif">Garment Not Found</h3>
        <p className="text-muted mb-4">The exclusive piece you are searching for might have found a new home.</p>
        <Link href="/shop" className="btn-ira-gold">EXPLORE WARDROBE</Link>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id || id,
          productTitle: product.title,
          productImage: product.image,
          customerName: reviewName,
          customerEmail: reviewEmail,
          rating: reviewRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setReviews((prev) => [data.review, ...prev]);
        setReviewSubmitted(true);
        setReviewComment('');
        setReviewName('');
        setReviewEmail('');
        setTimeout(() => {
          setReviewSubmitted(false);
          setShowReviewForm(false);
        }, 2500);
      }
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: '#FAF7F2' }}>
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-4 text-muted" style={{ fontSize: '0.76rem', letterSpacing: '0.1em' }}>
          <Link href="/" className="text-muted text-decoration-none hover-gold">HOME</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/shop" className="text-muted text-decoration-none hover-gold">SHOP</Link>
          <span className="mx-2">&gt;</span>
          <Link href={`/shop/${product.category}`} className="text-muted text-decoration-none hover-gold text-uppercase">
            {product.categoryLabel}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-dark fw-semibold">{product.title}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="row gy-4 mb-5">
          {/* Left Column: Image Gallery */}
          <div className="col-12 col-lg-7">
            <div className="d-flex flex-column-reverse flex-md-row gap-3">
              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="d-flex flex-md-column gap-2 overflow-auto" style={{ maxHeight: '580px' }}>
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`btn p-0 rounded overflow-hidden position-relative border ${
                        selectedImage === img ? 'border-2 border-dark' : 'border-light'
                      }`}
                      style={{ width: '70px', height: '90px', flexShrink: 0 }}
                    >
                      <Image src={img} alt="thumb" fill sizes="70px" style={{ objectFit: 'cover', objectPosition: 'center 10%' }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Frame */}
              <div 
                className="flex-grow-1 position-relative rounded shadow-sm overflow-hidden bg-white"
                style={{ 
                  aspectRatio: '3 / 4', 
                  maxHeight: '620px', 
                  border: '1px solid #E8E2D7' 
                }}
              >
                <Image
                  src={selectedImage || product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 992px) 100vw, 50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 10%' }}
                />

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`wishlist-btn ${inWish ? 'active' : ''}`}
                  style={{ width: '38px', height: '38px', top: '16px', right: '16px' }}
                  title="Add to Wishlist"
                  aria-label="Wishlist toggle"
                >
                  <Heart size={18} fill={inWish ? '#D32F2F' : 'none'} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Buy Box */}
          <div className="col-12 col-lg-5 ps-lg-4">
            <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.18em', color: 'var(--gold-primary)' }}>
              IRA LIFESTYLE &bull; {product.categoryLabel}
            </span>
            <h1 className="font-serif display-6 fw-normal text-dark mt-1 mb-2">
              {product.title}
            </h1>

            {/* Rating Stars & Reviews */}
            <div 
              className="d-flex align-items-center gap-2 mb-3 cursor-pointer"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setActiveTab('reviews');
                document.getElementById('product-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              title="Click to view client reviews"
            >
              <div className="d-flex text-warning">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-warning' : 'text-muted'}
                  />
                ))}
              </div>
              <span className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>
                {reviews.length > 0 
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : product.rating.toFixed(1)}
              </span>
              <span className="text-muted small text-decoration-underline">
                ({reviews.length || product.reviewsCount} verified reviews)
              </span>
            </div>

            {/* Price Row */}
            <div className="d-flex align-items-baseline gap-3 pb-3 border-bottom mb-3">
              <span className="display-6 fw-bold" style={{ color: 'var(--gold-primary)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-muted fs-5 text-decoration-line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.originalPrice && (
                <span className="badge bg-success small">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <p className="text-muted mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.7' }}>
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold text-dark" style={{ fontSize: '0.82rem' }}>
                  SELECT SIZE
                </span>
                <span className="text-muted d-flex align-items-center gap-1" style={{ fontSize: '0.76rem', cursor: 'pointer' }}>
                  <Ruler size={13} /> Size Guide
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`btn ${
                      selectedSize === s 
                        ? 'btn-dark text-white' 
                        : 'btn-outline-secondary'
                    }`}
                    style={{ minWidth: '48px', fontSize: '0.82rem', borderRadius: '3px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="d-flex flex-column gap-3 mb-4">
              <div className="d-flex gap-3">
                <div 
                  className="d-flex align-items-center border rounded bg-white px-2"
                  style={{ height: '44px' }}
                >
                  <button 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="btn btn-link p-1 text-dark"
                  >
                    -
                  </button>
                  <span className="px-3 fw-semibold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity((q) => q + 1)}
                    className="btn btn-link p-1 text-dark"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="btn-ira-gold flex-grow-1 justify-content-center text-center"
                  style={{ height: '44px' }}
                >
                  {added ? (
                    <>
                      <Check size={18} /> ADDED TO BAG
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> ADD TO BAG
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                className="btn btn-dark w-100 py-2 text-uppercase fw-semibold"
                style={{ letterSpacing: '0.12em', fontSize: '0.82rem', height: '44px' }}
              >
                BUY IT NOW
              </button>
            </div>

            {/* Value Highlights */}
            <div className="d-flex flex-column gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={15} color="var(--gold-primary)" />
                <span>100% Handcrafted Artisanal Embroidered Masterpiece</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <RotateCcw size={15} color="var(--gold-primary)" />
                <span>Hassle-Free 7 Days Exchange & Return Guarantee</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={15} color="var(--gold-primary)" />
                <span>Certified Pure Quality Tested Fabric</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Luxury Tabs Navigation */}
        <div id="product-tabs-section" className="bg-white p-3 p-sm-4 p-md-5 rounded-4 border shadow-sm mb-5">
          {/* Mobile-optimized Smooth Scrolling Tab Navigation */}
          <div 
            className="d-flex align-items-center gap-1.5 gap-sm-2 pb-3 mb-4 border-bottom overflow-x-auto"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className="btn btn-sm text-nowrap transition d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-pill"
              style={{
                backgroundColor: activeTab === 'details' ? '#1C1917' : 'transparent',
                color: activeTab === 'details' ? '#FAF7F0' : '#685F56',
                border: activeTab === 'details' ? '1px solid #1C1917' : '1px solid rgba(0,0,0,0.06)',
                fontWeight: activeTab === 'details' ? 600 : 500,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                boxShadow: activeTab === 'details' ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                outline: 'none',
              }}
            >
              <span>GARMENT DETAILS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('fabric')}
              className="btn btn-sm text-nowrap transition d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-pill"
              style={{
                backgroundColor: activeTab === 'fabric' ? '#1C1917' : 'transparent',
                color: activeTab === 'fabric' ? '#FAF7F0' : '#685F56',
                border: activeTab === 'fabric' ? '1px solid #1C1917' : '1px solid rgba(0,0,0,0.06)',
                fontWeight: activeTab === 'fabric' ? 600 : 500,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                boxShadow: activeTab === 'fabric' ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                outline: 'none',
              }}
            >
              <span>FABRIC &amp; CARE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className="btn btn-sm text-nowrap transition d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-pill"
              style={{
                backgroundColor: activeTab === 'shipping' ? '#1C1917' : 'transparent',
                color: activeTab === 'shipping' ? '#FAF7F0' : '#685F56',
                border: activeTab === 'shipping' ? '1px solid #1C1917' : '1px solid rgba(0,0,0,0.06)',
                fontWeight: activeTab === 'shipping' ? 600 : 500,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                boxShadow: activeTab === 'shipping' ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                outline: 'none',
              }}
            >
              <span>SHIPPING &amp; RETURNS</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className="btn btn-sm text-nowrap transition d-inline-flex align-items-center gap-1.5 px-3 py-2 rounded-pill"
              style={{
                backgroundColor: activeTab === 'reviews' ? '#1C1917' : 'transparent',
                color: activeTab === 'reviews' ? '#FAF7F0' : '#685F56',
                border: activeTab === 'reviews' ? '1px solid #1C1917' : '1px solid rgba(0,0,0,0.06)',
                fontWeight: activeTab === 'reviews' ? 600 : 500,
                fontSize: '0.78rem',
                letterSpacing: '0.08em',
                boxShadow: activeTab === 'reviews' ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
                outline: 'none',
              }}
            >
              <Star size={13} color="#F59E0B" fill="#F59E0B" />
              <span>CLIENT REVIEWS ({reviews.length})</span>
            </button>
          </div>

          <div>
            {activeTab === 'details' && (
              <div>
                <h5 className="font-serif fw-bold text-dark mb-3">Highlights &amp; Silhouette</h5>
                <ul className="text-muted small d-flex flex-column gap-2 ps-3 mb-0" style={{ lineHeight: '1.7' }}>
                  {product.features?.map((f, i) => (
                    <li key={i}>{f}</li>
                  )) || (
                    <>
                      <li>Pure Georgette with micro-cotton lining</li>
                      <li>Hand-finished gold zari and sequin embroidery</li>
                      <li>Flared 4.5-meter umbrella ghera for graceful movement</li>
                      <li>Includes coordinated embroidered dupatta</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {activeTab === 'fabric' && (
              <div>
                <h5 className="font-serif fw-bold text-dark mb-3">Fabric Composition &amp; Longevity</h5>
                <p className="text-muted small mb-2">
                  <strong className="text-dark">Fabric:</strong> {product.fabric || 'Pure Georgette & Silk Blend'}
                </p>
                <p className="text-muted small mb-2">
                  <strong className="text-dark">Care:</strong> {product.care || 'Dry clean only to maintain embroidery shine and fabric integrity.'}
                </p>
                <p className="text-muted small mb-0">
                  Store wrapped in breathable muslin cloth away from direct sunlight for lasting luster.
                </p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h5 className="font-serif fw-bold text-dark mb-3">Shipping &amp; Exchange Policy</h5>
                <p className="text-muted small mb-2">
                  We offer complimentary insured express shipping across India on all atelier orders.
                </p>
                <p className="text-muted small mb-2">
                  Orders are dispatched within 24-48 business hours with live WhatsApp &amp; SMS tracking updates.
                </p>
                <p className="text-muted small mb-0">
                  If the size or drape is not ideal, you can initiate a seamless exchange within 7 days of delivery.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {/* Reviews Summary Header Card */}
                <div 
                  className="p-3 p-sm-4 rounded-3 mb-4 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
                  style={{ backgroundColor: '#FAF8F4', borderColor: '#E8E2D8' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-center px-3 py-2 rounded-2 bg-white border" style={{ minWidth: '85px' }}>
                      <span className="display-6 fw-bold text-dark font-serif d-block" style={{ lineHeight: 1.1 }}>
                        {reviews.length > 0 
                          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                          : product.rating.toFixed(1)}
                      </span>
                      <small className="text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.04em' }}>OUT OF 5</small>
                    </div>

                    <div>
                      <div className="d-flex text-warning mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={17} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                      <span className="fw-semibold text-dark small d-block">
                        {reviews.length > 0 ? `${reviews.length} Verified Patron Review${reviews.length > 1 ? 's' : ''}` : 'No Patron Reviews Yet'}
                      </span>
                      <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                        100% verified atelier purchases from IRA Lifestyle patrons.
                      </small>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="btn w-100 w-md-auto d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2.5 rounded-3 text-white fw-bold shadow-sm transition"
                      style={{
                        background: showReviewForm 
                          ? '#4A423B' 
                          : 'linear-gradient(180deg, #9E7440 0%, #835E30 100%)',
                        border: '1px solid #755227',
                        fontSize: '0.82rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      <PenLine size={15} />
                      <span>{showReviewForm ? 'CLOSE REVIEW FORM' : 'WRITE A REVIEW'}</span>
                    </button>
                  </div>
                </div>

                {/* Modern Responsive Review Submission Form */}
                {showReviewForm && (
                  <form 
                    onSubmit={handleReviewSubmit} 
                    className="p-3 p-sm-4 p-md-5 rounded-4 border mb-4 shadow-sm position-relative overflow-hidden"
                    style={{
                      backgroundColor: '#FAF8F3',
                      borderColor: '#D6BC92',
                    }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <Sparkles size={16} color="#9E7440" />
                      <span className="text-uppercase fw-bold" style={{ fontSize: '0.72rem', letterSpacing: '0.18em', color: '#8C6839' }}>
                        ATELIER TESTIMONIAL
                      </span>
                    </div>

                    <h4 className="font-serif fw-bold text-dark mb-1" style={{ fontSize: '1.45rem' }}>
                      Share Your Drape &amp; Fit Experience
                    </h4>
                    <p className="text-muted small mb-4">
                      Your candid feedback assists fellow connoisseurs in choosing their ideal size, fabric, and silhouette.
                    </p>

                    {/* Star Rating Interactive Picker */}
                    <div className="p-3 rounded-3 bg-white border mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1.5 d-block">
                        Your Royal Rating *
                      </label>
                      <div className="d-flex flex-wrap align-items-center gap-2">
                        <div className="d-flex align-items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="btn btn-link p-1 text-warning"
                              style={{ border: 'none', outline: 'none' }}
                              aria-label={`Rate ${star} stars`}
                            >
                              <Star
                                size={28}
                                fill={(hoverRating || reviewRating) >= star ? '#F59E0B' : 'none'}
                                color="#F59E0B"
                                strokeWidth={1.5}
                              />
                            </button>
                          ))}
                        </div>
                        <span 
                          className="badge rounded-pill px-2.5 py-1.5 ms-sm-2" 
                          style={{ 
                            backgroundColor: 'rgba(197, 168, 128, 0.18)', 
                            color: '#8C6533', 
                            fontSize: '0.74rem',
                            fontWeight: 600,
                          }}
                        >
                          {reviewRating === 5 && '★★★★★ Outstanding Fit & Regal Drape'}
                          {reviewRating === 4 && '★★★★ Very Elegant & Premium'}
                          {reviewRating === 3 && '★★★ Satisfactory Fit'}
                          {reviewRating === 2 && '★★ Needs Refinement'}
                          {reviewRating === 1 && '★ Below Expectations'}
                        </span>
                      </div>
                    </div>

                    {/* Name & Email Fields */}
                    <div className="row g-3 mb-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-dark mb-1">
                          Your Full Name *
                        </label>
                        <div className="d-flex align-items-center rounded-2 px-3 bg-white border" style={{ height: '44px', borderColor: '#DFD5C5' }}>
                          <UserIcon size={16} className="text-muted me-2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ananya Sharma"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            className="w-100 bg-transparent border-0 text-dark outline-none p-0"
                            style={{ fontSize: '0.86rem', outline: 'none', boxShadow: 'none' }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6">
                        <label className="form-label small fw-semibold text-dark mb-1">
                          Your Email (Private &bull; Never Shared)
                        </label>
                        <div className="d-flex align-items-center rounded-2 px-3 bg-white border" style={{ height: '44px', borderColor: '#DFD5C5' }}>
                          <Mail size={16} className="text-muted me-2" />
                          <input
                            type="email"
                            placeholder="patron@example.com"
                            value={reviewEmail}
                            onChange={(e) => setReviewEmail(e.target.value)}
                            className="w-100 bg-transparent border-0 text-dark outline-none p-0"
                            style={{ fontSize: '0.86rem', outline: 'none', boxShadow: 'none' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Feedback Comment */}
                    <div className="mb-3">
                      <label className="form-label small fw-semibold text-dark mb-1">
                        Review Details &amp; Drape Observations *
                      </label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell fellow patrons about the fabric feel, embroidery sparkle, lining comfort, and whether the sizing ran true to your measurements..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        className="form-control p-3 bg-white"
                        style={{ fontSize: '0.86rem', borderColor: '#DFD5C5', borderRadius: '8px' }}
                      />
                    </div>

                    {/* Feedback Success Notice */}
                    {reviewSubmitted && (
                      <div 
                        className="alert alert-success py-2.5 px-3 small mb-3 d-flex align-items-center gap-2 rounded-3 border-success-subtle"
                        style={{ fontSize: '0.82rem' }}
                      >
                        <Check size={16} className="text-success" />
                        <span>Thank you! Your verified review has been submitted to the IRA Lifestyle showcase.</span>
                      </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="d-flex flex-column-reverse flex-sm-row justify-content-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="btn btn-sm btn-outline-secondary px-3 py-2"
                        style={{ fontSize: '0.82rem' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="btn btn-sm text-white fw-bold px-4 py-2.5 shadow-sm d-flex align-items-center justify-content-center gap-1.5"
                        style={{
                          background: 'linear-gradient(180deg, #9E7440 0%, #835E30 100%)',
                          border: '1px solid #755227',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {submittingReview ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1" />
                            SUBMITTING...
                          </>
                        ) : (
                          <>
                            <span>SUBMIT ROYAL REVIEW</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Reviews List */}
                <div className="d-flex flex-column gap-3">
                  {reviews.length === 0 ? (
                    <div className="text-center py-5 px-3 rounded-3 border bg-light">
                      <div 
                        className="p-3 rounded-circle d-inline-flex mb-3"
                        style={{ backgroundColor: 'rgba(197, 168, 128, 0.15)', color: '#9E7440' }}
                      >
                        <Sparkles size={24} />
                      </div>
                      <h5 className="font-serif fw-bold text-dark mb-1">Be the First Patron to Review</h5>
                      <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '360px' }}>
                        Share your thoughts on the craftsmanship, fabric quality, and fit of this exclusive luxury piece.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(true)}
                        className="btn btn-sm px-4 py-2 text-white fw-semibold"
                        style={{ backgroundColor: '#1C1917' }}
                      >
                        ★ Write First Review
                      </button>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div 
                        key={rev._id || rev.id}
                        className="p-3 p-sm-4 rounded-3 border transition"
                        style={{ backgroundColor: '#FFFFFF', borderColor: '#EDE8E0' }}
                      >
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div className="d-flex align-items-center gap-2.5">
                            <div 
                              className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold small flex-shrink-0"
                              style={{ width: '38px', height: '38px', backgroundColor: '#9E7D47', fontSize: '0.85rem' }}
                            >
                              {rev.customerName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="fw-semibold text-dark small d-flex align-items-center gap-2">
                                <span>{rev.customerName}</span>
                                {rev.verifiedPurchase && (
                                  <span 
                                    className="badge d-inline-flex align-items-center gap-1"
                                    style={{
                                      backgroundColor: 'rgba(16, 185, 129, 0.12)',
                                      color: '#059669',
                                      fontSize: '0.66rem',
                                      border: '1px solid rgba(16, 185, 129, 0.25)',
                                    }}
                                  >
                                    ✓ Verified Patron
                                  </span>
                                )}
                              </div>
                              <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </small>
                            </div>
                          </div>

                          {/* Star Rating */}
                          <div className="d-flex text-warning">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < rev.rating ? '#F59E0B' : 'none'}
                                color="#F59E0B"
                              />
                            ))}
                          </div>
                        </div>

                        <p className="mb-0 text-dark small mt-2" style={{ lineHeight: '1.65', color: '#2B2622' }}>
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-4">
              <span className="text-uppercase fw-semibold" style={{ fontSize: '0.74rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                COMPLETE THE LOOK
              </span>
              <h3 className="font-serif fs-2 fw-normal text-dark">
                You May Also Adore
              </h3>
            </div>

            <div className="row row-cols-2 row-cols-md-4 g-3">
              {relatedProducts.map((rel, idx) => (
                <div key={rel.id} className="col">
                  <ProductCard product={rel} index={idx} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="py-5 text-center text-muted">Loading royal garment...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
