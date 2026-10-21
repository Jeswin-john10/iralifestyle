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
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center p-2 p-sm-3 p-md-4"
      style={{ 
        backgroundColor: 'rgba(28, 25, 23, 0.78)', 
        backdropFilter: 'blur(8px)', 
        zIndex: 2000,
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3 shadow-2xl p-3 p-sm-4"
        style={{ 
          maxWidth: '600px', 
          width: '100%', 
          marginTop: '24px', 
          border: '1px solid #E8E2D7',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="d-flex align-items-center justify-content-between pb-2.5 pb-sm-3 border-bottom gap-2">
          <div className="d-flex align-items-center gap-2 gap-sm-2.5 flex-grow-1" style={{ minWidth: 0 }}>
            <Search size={19} color="var(--gold-primary)" className="flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search Set Saree, Mundu, Churidar..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-0 w-100"
              style={{ 
                outline: 'none', 
                minWidth: 0, 
                fontSize: 'clamp(0.92rem, 3.8vw, 1.15rem)',
                backgroundColor: 'transparent',
                color: '#1A1816'
              }}
              autoFocus
            />
          </div>
          <button 
            type="button"
            className="btn btn-link text-dark p-0 d-flex align-items-center justify-content-center flex-shrink-0 rounded-circle" 
            onClick={onClose} 
            aria-label="Close search"
            style={{ width: '32px', height: '32px', border: '1px solid #ECE4D6' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestions / Trending Searches */}
        {!query && (
          <div className="pt-2.5 pt-sm-3">
            <p className="text-muted text-uppercase mb-2" style={{ fontSize: '0.68rem', letterSpacing: '0.12em', fontWeight: 600 }}>
              Trending Category Searches
            </p>
            <div className="d-flex flex-wrap gap-1.5">
              {[
                'Set Saree',
                'Set Mund',
                'Cream Double Mund',
                'White Double Mund',
                'Churidar Set',
                'Colour Saree',
                'Davani Set',
                'Frock',
                'Bedsheets',
                'Blouse Materials'
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="btn btn-sm btn-light border py-1 px-2.5"
                  style={{ 
                    fontSize: 'clamp(0.72rem, 2.5vw, 0.78rem)', 
                    borderRadius: '20px',
                    borderColor: '#E8E2D7',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {loading && <div className="py-4 text-center text-muted small">Searching royal catalogue...</div>}

        {!loading && results.length > 0 && (
          <div className="pt-2.5 pt-sm-3 d-flex flex-column gap-2" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug || product.id}`}
                onClick={onClose}
                className="d-flex align-items-center gap-2.5 gap-sm-3 p-2 rounded text-decoration-none text-dark hover-bg-sand transition"
                style={{ border: '1px solid #F3EFE8' }}
              >
                <div style={{ position: 'relative', width: '44px', height: '54px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px' }}>
                  <Image src={product.image} alt={product.title} fill sizes="44px" style={{ objectFit: 'cover' }} />
                </div>
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <h6 className="mb-0 fw-semibold text-truncate" style={{ fontSize: '0.88rem' }}>{product.title}</h6>
                  <span className="text-muted" style={{ fontSize: '0.72rem' }}>{product.categoryLabel}</span>
                </div>
                <div className="text-end flex-shrink-0 ms-2">
                  <span className="fw-bold small" style={{ color: 'var(--gold-primary)' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <ArrowRight size={13} className="ms-1.5 text-muted d-none d-sm-inline" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && query && results.length === 0 && (
          <div className="py-4 text-center text-muted small">
            No luxurious items found for &ldquo;{query}&rdquo;.
          </div>
        )}
      </div>
    </div>
  );
}
