import { FaGithub, FaLink, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function Footer() {
  return (
    <footer className="border-t border-soft-black-lighter px-6 py-4 mt-8">
      <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
        <div className="mt-1 flex items-center justify-center gap-3">
          <span>
            Developed by{' '}
            <a
              href="https://x.com/@lejdipr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              @lejdipr
            </a>
          </span>
          <a
            href="https://lejdiprifti.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 transition-colors"
            aria-label="Personal Website"
          >
            <FaLink className="w-5 h-5" />
          </a>
          <a
            href="https://x.com/@lejdipr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 transition-colors"
            aria-label="X Profile"
          >
            <FaXTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/lejdi-prifti"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/lejdiprifti/claudetrace"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-brand-400 transition-colors"
            aria-label="GitHub Repository"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
