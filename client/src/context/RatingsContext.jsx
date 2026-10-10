import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getRatingSummary } from '../api/api';

// Holds the SITE-WIDE rating summary (not per-product) so the homepage badge,
// the footer and the ratings page all show the same, always-fresh numbers.
const RatingsContext = createContext({
  siteSummary: { average: 0, count: 0 },
  refreshSiteSummary: () => {},
});

export const useRatings = () => useContext(RatingsContext);

export const RatingsProvider = ({ children }) => {
  const [siteSummary, setSiteSummary] = useState({ average: 0, count: 0 });

  const refreshSiteSummary = useCallback(async () => {
    try {
      const { data } = await getRatingSummary();
      if (data) setSiteSummary(data);
    } catch {
      // The badge simply stays hidden if the request fails.
    }
  }, []);

  useEffect(() => {
    refreshSiteSummary();
  }, [refreshSiteSummary]);

  const value = useMemo(() => ({ siteSummary, refreshSiteSummary }), [siteSummary, refreshSiteSummary]);

  return <RatingsContext.Provider value={value}>{children}</RatingsContext.Provider>;
};
