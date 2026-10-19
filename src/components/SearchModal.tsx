'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (data.products) {
          const q = query.toLowerCase();
          const filtered = data.products.filter(
            (p: Product) =>
              p.title.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q)
          );
          setResults(filtered.slice(0, 6));
        }
      } catch (err) {
        console.error('Search fetch failed', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center p-3 p-md-5"
      style={{ backgroundColor: 'rgba(28, 25, 23, 0.75)', backdropFilter: 'blur(8px)', zIndex: 2000 }}
      onClick={onClose}
    >
      <div 
        className="bg-white w-100 rounded shadow-2xl p-4"
        style={{ maxWidth: '640px', marginTop: '60px', border: '1px solid #E8E2D7' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="d-flex align-items-center justify-content-between pb-3 border-bottom">
          <div className="d-flex align-items-center gap-3 flex-grow-1">
            <Search size={22} color="var(--gold-primary)" />
            <input 
              type="text" 
              placeholder="Search Anarkali, Saree, Kurti, Co-ords..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 w-100 fs-5 outline-none"
              style={{ outline: 'none' }}
              autoFocus
            />
          </div>
          <button className="btn btn-link text-dark p-0" onClick={onClose} aria-label="Close search">
            <X size={22} />
          </button>
        </div>

        {/* Quick Suggestions */}
        {!query && (
          <div className="pt-3">
            <p className="text-muted text-uppercase mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.1em' }}>
              Trending Searches
            </p>
            <div className="d-flex flex-wrap gap-2">
              {['Floral Anarkali', 'Chiffon Saree', 'Linen Co-ord', 'Velvet Dress', 'Embroidered Kurti'].map((item) => (
                <button
                  key={item}
                  onClick={() => setQuery(item)}
                  className="btn btn-sm btn-light border"
                  style={{ fontSize: '0.78rem', borderRadius: '20px' }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {loading && <div className="py-4 text-center text-muted">Searching royal catalogue...</div>}

        {!loading && results.length > 0 && (
          <div className="pt-3 d-flex flex-column gap-2" style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                onClick={onClose}
                className="d-flex align-items-center gap-3 p-2 rounded text-decoration-none text-dark hover-bg-sand transition"
                style={{ border: '1px solid #F3EFE8' }}
              >
                <div style={{ position: 'relative', width: '48px', height: '60px', flexShrink: 0, overflow: 'hidden', borderRadius: '3px' }}>
                  <Image src={product.image} alt={product.title} fill sizes="48px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-semibold fs-6">{product.title}</h6>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>{product.categoryLabel}</span>
                </div>
                <div className="text-end">
                  <span className="fw-bold" style={{ color: 'var(--gold-primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <ArrowRight size={14} className="ms-2 text-muted" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="py-4 text-center text-muted">
            No luxurious items found for &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
