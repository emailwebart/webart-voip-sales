import Link from 'next/link';
import Image from 'next/image';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  const logoImage = getPlaceholderImage('logo');

  return (
    <Link href="/admin" className={cn("flex items-center gap-2", className)}>
      {logoImage && (
        <Image
          src={logoImage.imageUrl}
          alt={logoImage.description}
          width={25}
          height={25}
          data-ai-hint={logoImage.imageHint}
          className="rounded-md"
        />
      )}
      <span className="font-headline text-lg font-semibold text-primary">
        VoIP Sales Insights
      </span>
    </Link>
  );
}
