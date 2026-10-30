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
    id: 'kerala-kasavu-set-saree',
    num: '01',
    title: 'Imperial Kasavu Set Saree',
    subtitle: 'HERITAGE GOLDEN LOOMS & ARTISANAL WEAVE',
    desc: 'Handwoven off-white cotton drapes kissed with shimmering pure golden zari borders. Handcrafted by master weavers for timeless bridal and festive poise.',
    fabric: '100% Handloom Fine Combed Cotton & Pure Metallic Zari',
    craft: 'Traditional Temple Zari Borders & Artisanal Motifs',
    occasion: 'Weddings, Onam, Vishu & Grand Celebrations',
    image: '/images/collection_set_saree.jpg',
    tag: 'Heritage Masterpiece',
    link: '/shop/set-saree',
  },
  {
    id: 'royal-double-mundu',
    num: '02',
    title: 'Royal Heritage Double Mundu',
    subtitle: 'AUTHENTIC MEN’S CEREMONIAL COUTURE',
    desc: 'Pristine cream double mundu woven from superior combed cotton, crowned with luminous golden zari borders. Paired with coordinating angavastram for noble ceremonial distinction.',
    fabric: 'Fine Count Handloom Cotton & Shimmering Gold Kasavu',
    craft: 'Authentic Hand-woven Temple & Striped Zari Borders',
    occasion: 'Weddings, Temple Ceremonies & Cultural Festivities',
    image: '/images/collection_double_mundu.jpg',
    tag: 'Regal Menswear',
    link: '/shop/cream-double-mund',
  },
  {
    id: 'classic-set-mundu',
    num: '03',
    title: 'Classic Kerala Set Mundu',
    subtitle: 'GRACEFUL TWO-PIECE MUNDUM NERUATHUM',
    desc: 'The quintessential Kerala two-piece ensemble celebrating feminine dignity. Light, breathable, and woven with refined golden threadwork for ceremonial grace.',
    fabric: 'Pure Unbleached Cotton & Traditional Zari',
    craft: 'Authentic Loom Weave with Hand-finished Pallu',
    occasion: 'Onam, Temple Visits, Pujas & Festive Mornings',
    image: '/images/cat_set_mundu.jpg',
    tag: 'Timeless Tradition',
    link: '/shop/set-mund',
  },
  {
    id: 'royal-colour-saree',
    num: '04',
    title: 'Celebratory Royal Colour Sarees',
    subtitle: 'RICH JEWEL TONES & EMBELLISHED SILKS',
    desc: 'Vibrant festive palettes infused with luminous zari borders, delicate buttas, and lavish embroidery that bring regal splendor to every wedding evening.',
    fabric: 'Pure Silk Blend & Ethereal Tissue Organza',
    craft: 'Intricate Resham Threadwork & Zari Borders',
    occasion: 'Receptions, Sangeets & Evening Soirees',
    image: '/images/cat_saree_hd.jpg',
    tag: 'Evening Glamour',
    link: '/shop/colour-saree',
  },
  {
    id: 'festive-churidar-set',
    num: '05',
    title: 'Artisanal Festive Churidar Sets',
    subtitle: 'TAILORED SILHOUETTES & HAND-EMBROIDERED DUPATTAS',
    desc: 'Contemporary tailoring meets traditional Indian motifs. Fluid anarkali and straight-cut suits paired with opulent woven dupattas for effortless celebratory comfort.',
    fabric: 'Chanderi Silk, Pure Cotton & Organza Dupattas',
    craft: 'Fine Gota Patti, Floral Embroidery & Zari Accents',
    occasion: 'Family Celebrations, Haldi, Mehendi & Festivities',
    image: '/images/cat_churidar.jpg',
    tag: 'Artisanal Couture',
    link: '/shop/churidar-set',
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
