import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getSEOData } from '../utils/seoController';

/**
 * Hook to update SEO meta tags based on current route
 */
export const useSEO = () => {
    const location = useLocation();

    useEffect(() => {
        const seoData = getSEOData(location.pathname);

        // Update document title
        document.title = seoData.title;

        // Update or create meta tags
        updateMetaTag('description', seoData.description);
        updateMetaTag('keywords', seoData.keywords);

        // Open Graph tags
        updateMetaTag('og:title', seoData.ogTitle || seoData.title, 'property');
        updateMetaTag(
            'og:description',
            seoData.ogDescription || seoData.description,
            'property'
        );
        updateMetaTag('og:type', seoData.ogType || 'website', 'property');
        if (seoData.ogImage) {
            updateMetaTag('og:image', seoData.ogImage, 'property');
        }

        // Twitter Card tags
        updateMetaTag(
            'twitter:card',
            seoData.twitterCard || 'summary_large_image'
        );
        updateMetaTag('twitter:title', seoData.twitterTitle || seoData.title);
        updateMetaTag(
            'twitter:description',
            seoData.twitterDescription || seoData.description
        );

        // Canonical URL
        if (seoData.canonical) {
            updateCanonical(seoData.canonical);
        } else {
            updateCanonical(window.location.href.split('?')[0]);
        }
    }, [location.pathname]);
};

/**
 * Update or create a meta tag
 */
const updateMetaTag = (
    name: string,
    content: string | undefined,
    attribute: 'name' | 'property' = 'name'
) => {
    if (!content) return;

    let element = document.querySelector(
        `meta[${attribute}="${name}"]`
    ) as HTMLMetaElement;

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
};

/**
 * Update canonical link
 */
const updateCanonical = (url: string) => {
    let element = document.querySelector(
        'link[rel="canonical"]'
    ) as HTMLLinkElement;

    if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', 'canonical');
        document.head.appendChild(element);
    }

    element.setAttribute('href', url);
};
