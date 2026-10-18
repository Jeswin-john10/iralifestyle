import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Curated Collections | IRA LIFESTYLE',
  description: 'Explore the royal ethnic edits, pastel daywear and regal evening ensembles of IRA Lifestyle.',
};

export default function CollectionsPage() {
  const collections = [
    {
      title: 'Royal Festivities',
      subtitle: 'Festive & Bridal Edition',
      description: 'Opulent ivory and antique gold lehengas, pure silk anarkalis, and statement pieces engineered for matrimonial splendor.',
      image: '/images/hero-model.jpg',
      category: 'Dresses',
      piecesCount: '18 Signature Silhouettes',
    },
    {
      title: 'Ethereal Pastels',
      subtitle: 'Summer & Daywear Edit',
      description: 'Powder blush pinks, pistachio mints, and gentle morning hues adorned with delicate pearl drop work and breathable georgettes.',
      image: '/images/cat-kurtis.jpg',
      category: 'Kurtis',
      piecesCount: '24 Curated Sets',
    },
    {
      title: 'Heritage Drapes',
      subtitle: 'Classic Sarees',
      description: 'Handcrafted wine purples, emeralds, and sheer organzas framed by timeless zardozi borders that transcend seasons.',
      image: '/images/cat-sarees.jpg',
      category: 'Sarees',
      piecesCount: '15 Draped Heirlooms',
    },
    {
      title: 'Modern Sovereign',
      subtitle: 'Luxury Co-ords & Jackets',
      description: 'Contemporary power silhouettes tailored in bespoke Belgian linens and silk cord embroidery for the visionary woman.',
      image: '/images/cat-coord.jpg',
      category: 'Co-ord Sets',
      piecesCount: '12 Tailored Sets',
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] tracking-[0.25em] text-[#8F867C] uppercase font-semibold block mb-2">
            EDITORIAL EDITIONS
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-4xl md:text-5xl font-normal text-[#231F1C] tracking-tight mb-4"
          >
            The IRA Collections
          </h1>
          <p className="text-sm text-[#6F665C] font-light">
            Every collection tells a chapter of Indian artisan craftsmanship married with effortless contemporary lines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {collections.map((col, idx) => (
            <div
              key={col.title}
              className="group bg-[#F4EFE6] rounded-xs border border-[#EDE5D8] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-500"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#EDE5D8]">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#E6C789] block">
                    {col.subtitle}
                  </span>
                  <span className="text-xs text-white/80 font-mono">{col.piecesCount}</span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3
                    style={{ fontFamily: 'var(--font-serif)' }}
                    className="text-2xl sm:text-3xl text-[#231F1C] font-normal mb-2"
                  >
                    {col.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6F665C] leading-relaxed font-light mb-6">
                    {col.description}
                  </p>
                </div>

                <div>
                  <Link
                    href={`/shop?category=${encodeURIComponent(col.category)}`}
                    className="gold-btn px-6 py-3 text-xs tracking-widest rounded-xs uppercase inline-flex items-center space-x-2"
                  >
                    <span>EXPLORE {col.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
