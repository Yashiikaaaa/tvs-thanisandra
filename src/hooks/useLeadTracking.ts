import { useCallback } from "react";
import ReactGA from "react-ga4";

// UTM Params type
type UTMParams = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_keyword: string | null;
  utm_term: string | null;
  utm_content: string | null;
};

// Utility: Get UTM params from current URL
const getUTMParams = (): UTMParams => {
  if (typeof window === "undefined") return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_keyword: null,
    utm_term: null,
    utm_content: null,
  };
  const urlParams = new URLSearchParams(window.location.search);

  const getParam = (keys: string[]): string | null => {
    for (const key of keys) {
      const val = urlParams.get(key);
      if (val) return val;
    }
    return null;
  };

  return {
    utm_source: getParam(["utm_source", "utmSource"]),
    utm_medium: getParam(["utm_medium", "utmMedium"]),
    utm_campaign: getParam(["utm_campaign", "utmCampaign"]),
    utm_keyword: getParam(["utm_keyword", "utmKeyword"]),
    utm_term: getParam(["utm_term", "utmTerm"]),
    utm_content: getParam(["utm_content", "utmContent"]),
  };
};

// Lead source constants
export const LEAD_SOURCES = {
  HERO: "hero_banner",
  OVERVIEW: "overview_section",
  PRICING_2BHK: "pricing_2BHK",
  PRICING_3BHK: "pricing_3BHK",
  PRICING_4BHK: "pricing_4BHK",
  MASTER_PLAN: "master_plan_section",
  FOOTER: "footer_section",
  CONTACT_FORM_LINK: "contact_form_internal_link",
  UNKNOWN: "unknown_source",
} as const;

export type LeadSource = typeof LEAD_SOURCES[keyof typeof LEAD_SOURCES];

// Property types
export const PROPERTY_TYPES = {
  BHK2: "2BHK",
  BHK3: "3BHK",
  BHK4: "4BHK",
  all: "All",
} as const;

export type PropertyType = typeof PROPERTY_TYPES[keyof typeof PROPERTY_TYPES];

type TrackButtonClick = (
  source: LeadSource,
  action: string,
  label: string,
  propertyType?: PropertyType | null
) => void;

type TrackFormSubmission = (
  source: LeadSource,
  formType: string,
  propertyType?: PropertyType | null
) => void;

type TrackFormOpen = (
  source: LeadSource,
  formType: string,
  propertyType?: PropertyType | null
) => void;

export const useLeadTracking = () => {
  const utmParams = getUTMParams();

  const trackButtonClick: TrackButtonClick = useCallback(
    (source, action, label, propertyType = null) => {
      ReactGA.gtag("event", action, {
        event_category: "Button Click",
        event_label: `${source}${propertyType ? ` - ${propertyType}` : ""}`,
        lead_source: source,
        property_type: propertyType,
        funnel_stage: "interest",
        ...utmParams,
      });
    },
    [utmParams]
  );

  const trackFormSubmission: TrackFormSubmission = useCallback(
    (source, formType, propertyType = null) => {
      ReactGA.gtag("event", `${formType}_submit`, {
        event_category: "Form Submission",
        event_label: `${source}${propertyType ? ` - ${propertyType}` : ""}`,
        lead_source: source,
        property_type: propertyType,
        funnel_stage:
          formType === "contact_form" ? "lead" : "site_visit_request",
        ...utmParams,
      });
    },
    [utmParams]
  );

  const trackFormOpen: TrackFormOpen = useCallback(
    (source, formType, propertyType = null) => {
      const normalize = (str: string) =>
        (str || "")
          .toLowerCase()
          .replace(/[_\s]+/g, "")
          .trim();

      ReactGA.gtag("event", `${formType}_opened`, {
        event_category: "Form Interaction",
        event_label:
          propertyType && !normalize(source).includes(normalize(propertyType))
            ? `${source} - ${propertyType}`
            : source,
        lead_source: source,
        property_type: propertyType,
        funnel_stage: "consideration",
        ...utmParams,
      });
    },
    [utmParams]
  );

  return {
    trackButtonClick,
    trackFormSubmission,
    trackFormOpen,
  };
};