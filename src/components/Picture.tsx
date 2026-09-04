import { media, type MediaName } from '../data/media.generated';

interface PictureProps {
  name: MediaName;
  /** Atributo `sizes` — quanto do viewport a foto ocupa em cada largura. */
  sizes: string;
  /** Só a foto do LCP deve receber `priority`. */
  priority?: boolean;
  className?: string;
  /** Texto alternativo específico para o contexto (o padrão vem do catálogo). */
  alt?: string;
  objectPosition?: string;
}

/**
 * Foto responsiva com AVIF + fallback JPEG, dimensões explícitas (sem layout
 * shift) e um LQIP embutido como fundo enquanto o arquivo final carrega.
 */
export function Picture({ name, sizes, priority = false, className, alt, objectPosition }: PictureProps) {
  const asset = media[name];
  const srcSet = (extension: 'avif' | 'jpg') =>
    asset.widths.map((width) => `/media/images/${asset.slug}-${width}.${extension} ${width}w`).join(', ');
  const fallbackWidth = asset.widths[asset.widths.length - 1];

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src={`/media/images/${asset.slug}-${fallbackWidth}.jpg`}
        srcSet={srcSet('jpg')}
        sizes={sizes}
        width={asset.width}
        height={asset.height}
        alt={alt ?? asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{
          backgroundImage: `url(${asset.lqip})`,
          backgroundSize: 'cover',
          backgroundPosition: objectPosition ?? asset.position ?? '50% 50%',
          objectPosition: objectPosition ?? asset.position ?? '50% 50%',
        }}
      />
    </picture>
  );
}
