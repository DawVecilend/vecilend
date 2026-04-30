import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Component invisible que escolta canvis de pathname i fa scroll a (0, 0).
 * NO actua davant canvis de search params (filtres a /objects no haurien
 * de fer scroll up cada cop que canvia un chip).
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
