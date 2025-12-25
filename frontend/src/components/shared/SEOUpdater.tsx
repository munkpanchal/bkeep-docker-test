import { useSEO } from '../../hooks/useSEO';

/**
 * Component that updates SEO meta tags based on current route
 * Should be placed in the root of the app
 */
const SEOUpdater = () => {
    useSEO();
    return null;
};

export default SEOUpdater;
