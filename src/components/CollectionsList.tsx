'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Gem, Layers } from 'lucide-react';

interface CollectionItem {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  fabric: string;
  craft: string;
  occasion: string;
  image: string;
  tag: string;
  link: string;
}

const COLLECTIONS_DATA: CollectionItem[] = [
  {
    id: 'festive-royale',
    num: '01',
    title: 'Festive Royale 2026',
    subtitle: 'THE BRIDAL & CELEBRATION CAPSULE',
    desc: 'Lavish lehengas, gold-dusted anarkalis, and pure zardozi craftsmanship designed for wedding grandeur and royal celebrations.',
    fabric: 'Pure Mulberry Silk & Heavy Georgette',
    craft: 'Hand-set Zardozi & Antique Marodi Zari',
    occasion: 'Weddings & Royal Receptions',
    image: '/images/hero_model.jpg',
    tag: 'Haute Couture',
    link: '/shop/dresses',
  },
  {
    id: 'sheer-grace',
    num: '02',
    title: 'Sheer Grace Chiffons',
    subtitle: 'ETHEREAL EVENING SAREES',
    desc: 'Fluid drapery meeting intricate metallic borders and featherlight drapes for modern cocktail soirees and sangeet affairs.',
    fabric: 'Pure Silk Chiffon & Gossamer Tissue',
    craft: 'Scalloped Resham & Cut-Dana Borders',
    occasion: 'Cocktails, Sangeets & Galas',
    image: '/images/cat_saree_hd.jpg',
    tag: 'Signature Saree Edit',
    link: '/shop/sarees',
  },
  {
    id: 'everyday-elegance',
    num: '03',
    title: 'Everyday Poise Kurtis',
    subtitle: 'BREATHABLE CHANDERI & ORGANZA',
    desc: 'Subtle pastel tones, handcrafted threadwork, and fluid ease designed for effortless poise from morning meetings to intimate evenings.',
    fabric: 'Pure Chanderi Silk-Cotton & Organza',
    craft: 'Delicate Gota Patti & Shadow Threadwork',
    occasion: 'Festive Pret & Fine Everyday Wear',
    image: '/images/cat_kurti.jpg',
    tag: 'Pret Collection',
    link: '/shop/kurtis',
  },
  {
    id: 'modern-heritage',
    num: '04',
    title: 'Contemporary Co-ords',
    subtitle: 'FUSION PEPLUM & TAILORED SUITS',
    desc: 'Structured power meets romantic Indian embroidery. Reimagining traditional cuts into versatile all-day luxury statement coordinates.',
    fabric: 'Handwoven Raw Silk & Micro-Velvet',
    craft: 'Architectural Pleating & Antique Zari',
    occasion: 'Destination Affairs & Power Festivities',
    image: '/images/cat_coord_hd.jpg',
    tag: 'Modern Indian',
    link: '/shop/co-ord-sets',
  },
  {
    id: 'imperial-velvet',
    num: '05',
    title: 'Imperial Velvet Ensembles',
    subtitle: 'WINTER FESTIVE COUTURE',
    desc: 'Deep jewel-toned micro-velvets adorned with Kashmiri tilla needlework, capturing the eternal splendour of royal Indian courts.',
    fabric: 'Silk Micro-Velvet & Brocade Lining',
    craft: 'Authentic Kashmiri Tilla & Dabka Work',
    occasion: 'Winter Weddings & Palace Soirees',
    image: '/images/prod_velvet.jpg',
    tag: 'Limited Atelier Edit',
    link: '/shop/new-arrivals',
  }
];

export default function CollectionsList() {
  const [visibleItems, setVisibleItems] = useState<{ [key: number]: boolean }>({});
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    itemRefs.current.forEach((el, index) => {
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleItems((prev) => ({ ...prev, [index]: true }));
            observer.disconnect(); // Stay revealed once entered
          }
        },
        { 
          threshold: 0.15,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="d-flex flex-column gap-5">
      {COLLECTIONS_DATA.map((col, idx) => {
        const isRevealed = !!visibleItems[idx];
        const isEven = idx % 2 === 0;

        return (
          <div 
            key={col.id} 
            ref={(el) => { itemRefs.current[idx] = el; }}
            className={`collection-row-item row align-items-center gy-4 ${!isEven ? 'flex-md-row-reverse' : ''}`}
          >
            {/* Image Column */}
            <div className="col-12 col-md-6 col-lg-5">
              <div 
                className={`collection-image-wrapper ${
                  isEven ? 'collection-anim-left' : 'collection-anim-right'
                } ${isRevealed ? 'is-revealed' : ''}`}
              >
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  style={{ 
                    objectFit: 'cover', 
                    objectPosition: 'center 12%' // Keeps model face and full attire perfectly framed
                  }}
                  priority={idx === 0}
                />
                
                {/* Top Badge */}
                <span 
                  className="position-absolute top-0 start-0 m-3 badge rounded-pill"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(8px)',
                    color: 'var(--text-dark)', 
                    border: '1px solid rgba(212, 185, 142, 0.5)',
                    fontSize: '0.68rem', 
                    letterSpacing: '0.12em', 
                    padding: '6px 14px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  {col.tag}
                </span>

                {/* Subtle Bottom Vignette */}
                <div 
                  className="position-absolute bottom-0 start-0 w-100 p-3"
                  style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(17, 15, 13, 0.65) 100%)' }}
                >
                  <span className="text-white small fw-light" style={{ letterSpacing: '0.1em', fontSize: '0.72rem' }}>
                    CAPSULE {col.num} &bull; IRA ATELIER
                  </span>
                </div>
              </div>
            </div>

            {/* Text / Editorial Narrative Column */}
            <div className="col-12 col-md-6 col-lg-7 px-lg-5">
              <div 
                className={`${
                  isEven ? 'collection-anim-right' : 'collection-anim-left'
                } ${isRevealed ? 'is-revealed' : ''}`}
              >
                {/* Number Watermark & Subtitle */}
                <div className="collection-num-watermark" aria-hidden="true">
                  {col.num}
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', color: 'var(--gold-primary)' }}>
                    {col.subtitle}
                  </span>
                </div>

                <h2 className="font-serif fs-1 fw-normal text-dark mt-1 mb-3" style={{ letterSpacing: '0.02em' }}>
                  {col.title}
                </h2>

                <p className="text-muted mb-4" style={{ lineHeight: '1.8', fontSize: '0.92rem' }}>
                  {col.desc}
                </p>

                {/* Editorial Spec Pills */}
                <div className="d-flex flex-column gap-2 mb-4 pb-2">
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <Gem size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                    <span><strong>Fabric:</strong> {col.fabric}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <Sparkles size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                    <span><strong>Craft:</strong> {col.craft}</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
                    <Layers size={14} style={{ color: 'var(--gold-primary)', flexShrink: 0 }} />
                    <span><strong>Ideal For:</strong> {col.occasion}</span>
                  </div>
                </div>

                <Link href={col.link} className="btn-ira-gold">
                  EXPLORE CAPSULE <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
