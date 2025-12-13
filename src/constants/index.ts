export const footerMenu = [
    { title: 'Home', url: '/' },
    { title: 'About', url: '/about' },
    { title: 'Terms & Conditions', url: '/terms-conditions' },
    { title: 'Shipping & Return Policy', url: '/shipping-return-policy' },
    { title: 'Privacy Policy', url: '/privacy-policy' },
    { title: 'FAQ', url: '/frequently-asked-questions' },
]

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';

export interface FooterMenuProps {
    url: string;
    title: string
}

export const DEFAULT_OPTION = 'Default Title';

export type SortFilterItem = {
    title: string;
    slug: string | null;
    sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
    reverse: boolean;
};

export const defaultSort: SortFilterItem = {
    title: 'Relevance',
    slug: null,
    sortKey: 'RELEVANCE',
    reverse: false
};

export const sorting: SortFilterItem[] = [
    defaultSort,
    { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
    { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
    { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
    { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
    collections: 'collections',
    categories: 'categoreis',
    subcategories: 'subcategories',
    products: 'products',
    cart: 'cart'
};

export const states = [
    "Andaman and Nicobar Islands",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chandigarh",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Ladakh",
    "Lakshadweep",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Puducherry",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
];


export const HUB_GRAPHQL_API_ENDPOINT = '/graphql';