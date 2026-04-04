import { useState } from 'react';
import { Link, Check } from 'lucide-react';
import { COPY_FEEDBACK_MS } from '@/lib/config';

interface Props {
  url: string;
  label?: string;
}

export default function CopyShareButton({ url, label = 'Copy share link' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
  };

  return (
    <button
      onClick={handleCopy}
      className="btn btn-ghost"
      style={{ fontFamily: 'inherit' }}
      title={url}
    >
      {copied ? (
        <>
          <Check size={14} aria-hidden="true" />
          Copied!
        </>
      ) : (
        <>
          <Link size={14} aria-hidden="true" />
          {label}
        </>
      )}
    </button>
  );
}
