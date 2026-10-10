import { useCallback, useEffect, useState } from 'react';
import { getRatingSummary } from '../api/api';

// Rating summary ({ average, count }) for one product, with a manual refresh.
function useProductRatingSummary(productHandle) {
  const [summary, setSummary] = useState({ average: 0, count: 0 });

  const refresh = useCallback(async () => {
    if (!productHandle) return;
    try {
      const { data } = await getRatingSummary(productHandle);
      if (data) setSummary(data);
    } catch {
      // keep the previous value
    }
  }, [productHandle]);

  useEffect(() => {
    setSummary({ average: 0, count: 0 });
    refresh();
  }, [refresh]);

  return [summary, refresh];
}

export default useProductRatingSummary;
