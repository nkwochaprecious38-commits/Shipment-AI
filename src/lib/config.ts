// Prices were read from the supplied Selar checkout pages (USD, per month).
// The Selar pages do not publish plan benefits, so the lists below describe
// platform capabilities only and state no limits. Edit freely.
export const PLANS = [
  {
    name: 'Starter', price: '$47', period: 'per month', url: 'https://selar.com/47plan?currency=USD',
    blurb: 'For teams beginning to centralize shipment visibility.',
    features: ['Shipment tracking dashboard', 'Interactive shipment map', 'Manual and CSV shipment entry', 'Customer tracking links', 'Document records', 'Email and password accounts'],
    highlight: false,
  },
  {
    name: 'Professional', price: '$57', period: 'per month', url: 'https://selar.com/57plan?currency=USD',
    blurb: 'For operations teams coordinating carriers and exceptions.',
    features: ['Everything in Starter', 'Exception management workspace', 'Carrier performance analytics', 'Delivery appointment calendar', 'Ask Shipment AI assistant', 'Team members and roles'],
    highlight: true,
  },
  {
    name: 'Enterprise', price: '$97', period: 'per month', url: 'https://selar.com/97plan?currency=USD',
    blurb: 'For organizations connecting systems across the supply chain.',
    features: ['Everything in Professional', 'REST API and webhooks', 'Integration directory access', 'Audit logs', 'Organization level permissions', 'Priority onboarding'],
    highlight: false,
  },
]
