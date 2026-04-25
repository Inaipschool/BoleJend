import React, { useState, useEffect, useCallback, CSSProperties, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart, Users, Bell, Home, User, Plus,
  ChevronRight, Star, Clock, Share2, Heart, Truck, TrendingUp, TrendingDown,
  CheckCircle, Package, Search, X, ArrowLeft, MapPin, Award,
  Flame, BarChart2, Download, LogOut, Settings,
  RefreshCw, Zap, MessageCircle, FileText, Check, HelpCircle, AlertCircle,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const T = {
  bg:       "#07101C",
  surface:  "#0D1A2A",
  card:     "#112236",
  card2:    "#0F1E30",
  border:   "#1C3048",
  green:    "#12C25A",
  greenDk:  "#0A6B35",
  greenMd:  "#16A550",
  greenLt:  "#0D3320",
  gold:     "#F5C518",
  goldLt:   "#2A2010",
  orange:   "#FF6B35",
  orangeLt: "#2A1508",
  red:      "#EF4444",
  blue:     "#3B9EF5",
  text:     "#EFF6FF",
  muted:    "#7A9BBF",
  muted2:   "#3A5570",
};

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const DEALS = [
  {
    id: 1, nom: "Tomates fraîches Niayes", cat: "Légumes", emoji: "🍅",
    prixSolo: 1200, prixGroupe: 780, unite: "kg", minGroupe: 5,
    stock: 120, image: "tomato", couleur: "#E63946",
    desc: "Tomates bio directes des Niayes, récoltées ce matin. Qualité premium garantie.",
    producteur: "Coopérative Niayes Bio", note: 4.9, avis: 142,
    membres: [
      { initiale: "F", couleur: "#12C25A" }, { initiale: "M", couleur: "#3B9EF5" },
      { initiale: "A", couleur: "#F5C518" }, { initiale: "O", couleur: "#FF6B35" },
    ],
    groupeActuel: 4, featured: true, nouveau: false, chaud: true,
    expireIn: 14 * 3600 + 23 * 60 + 44,
    createdAt: "2026-05-18T10:00:00Z",
  },
  {
    id: 2, nom: "Riz local Sénégalais", cat: "Céréales", emoji: "🌾",
    prixSolo: 920, prixGroupe: 580, unite: "kg", minGroupe: 10,
    stock: 500, image: "rice", couleur: "#F5C518",
    desc: "Riz de la vallée du Fleuve Sénégal, cultivé sans pesticides. Goût authentique.",
    producteur: "Ferme Lamine Sow", note: 4.7, avis: 89,
    membres: [
      { initiale: "R", couleur: "#12C25A" }, { initiale: "I", couleur: "#E63946" },
      { initiale: "N", couleur: "#9B59B6" },
    ],
    groupeActuel: 3, featured: false, nouveau: true, chaud: false,
    expireIn: 8 * 3600 + 45 * 60 + 12,
    createdAt: "2026-05-20T14:30:00Z",
  },
  {
    id: 3, nom: "Oignons Violet Sénégal", cat: "Légumes", emoji: "🧅",
    prixSolo: 700, prixGroupe: 420, unite: "kg", minGroupe: 8,
    stock: 300, image: "onion", couleur: "#9B59B6",
    desc: "Oignons violets sénégalais, conserve long. Idéal pour les sauces et plats locaux.",
    producteur: "Groupement Femmes Pikine", note: 4.8, avis: 215,
    membres: [
      { initiale: "C", couleur: "#3B9EF5" }, { initiale: "S", couleur: "#12C25A" },
      { initiale: "D", couleur: "#F5C518" }, { initiale: "B", couleur: "#FF6B35" },
      { initiale: "K", couleur: "#E63946" }, { initiale: "L", couleur: "#9B59B6" },
    ],
    groupeActuel: 6, featured: false, nouveau: false, chaud: true,
    expireIn: 3 * 3600 + 12 * 60 + 8,
    createdAt: "2026-05-15T09:15:00Z",
  },
  {
    id: 4, nom: "Bissap séché premium", cat: "Boissons", emoji: "🌺",
    prixSolo: 2500, prixGroupe: 1600, unite: "kg", minGroupe: 6,
    stock: 80, image: "bissap", couleur: "#E63946",
    desc: "Fleurs de bissap séchées, sans additifs. Idéal pour jus et infusions.",
    producteur: "Ferme Kaolack", note: 4.6, avis: 67,
    membres: [
      { initiale: "Y", couleur: "#F5C518" }, { initiale: "P", couleur: "#12C25A" },
    ],
    groupeActuel: 2, featured: false, nouveau: true, chaud: false,
    expireIn: 22 * 3600,
    createdAt: "2026-05-22T11:00:00Z",
  },
  {
    id: 5, nom: "Légumes feuilles mix", cat: "Légumes", emoji: "🥬",
    prixSolo: 500, prixGroupe: 300, unite: "botte", minGroupe: 6,
    stock: 200, image: "greens", couleur: "#12C25A",
    desc: "Assortiment de légumes feuilles frais : épinards, morelle noire, amarante.",
    producteur: "Groupement Femmes Pikine", note: 4.9, avis: 178,
    membres: [
      { initiale: "A", couleur: "#E63946" }, { initiale: "M", couleur: "#3B9EF5" },
      { initiale: "S", couleur: "#F5C518" }, { initiale: "F", couleur: "#9B59B6" },
      { initiale: "N", couleur: "#FF6B35" },
    ],
    groupeActuel: 5, featured: true, nouveau: false, chaud: false,
    expireIn: 6 * 3600 + 30 * 60,
    createdAt: "2026-05-19T08:00:00Z",
  },
  {
    id: 6, nom: "Huile d'arachide locale", cat: "Huiles", emoji: "🫙",
    prixSolo: 3200, prixGroupe: 2100, unite: "litre", minGroupe: 5,
    stock: 150, image: "oil", couleur: "#F5C518",
    desc: "Huile d'arachide pressée à froid. Produit 100% sénégalais, sans additifs.",
    producteur: "Huilerie Sine Saloum", note: 4.8, avis: 134,
    membres: [
      { initiale: "O", couleur: "#12C25A" }, { initiale: "B", couleur: "#E63946" },
      { initiale: "C", couleur: "#3B9EF5" },
    ],
    groupeActuel: 3, featured: false, nouveau: false, chaud: true,
    expireIn: 18 * 3600 + 55 * 60,
    createdAt: "2026-05-17T16:45:00Z",
  },
  {
    id: 7, nom: "Huile de Palme Artisanale", cat: "Huiles", emoji: "🌴",
    prixSolo: 1800, prixGroupe: 1250, unite: "litre", minGroupe: 10,
    stock: 300, image: "palm_oil", couleur: "#D35400",
    desc: "Huile de palme rouge naturelle, riche en vitamines. Pressée traditionnellement en Casamance.",
    producteur: "GIE Casamance Vert", note: 4.7, avis: 54,
    membres: [
      { initiale: "K", couleur: "#D35400" }, { initiale: "L", couleur: "#12C25A" },
    ],
    groupeActuel: 2, featured: false, nouveau: true, chaud: false,
    expireIn: 36 * 3600,
    createdAt: "2026-05-21T12:00:00Z",
  },
  {
    id: 8, nom: "Mangues Kent Casamance", cat: "Fruits Locaux", emoji: "🥭",
    prixSolo: 1500, prixGroupe: 950, unite: "kg", minGroupe: 5,
    stock: 200, image: "mango", couleur: "#FFB000",
    desc: "Mangues Kent juteuses et sans fibres, direct de Ziguinchor. Goût sucré exceptionnel.",
    producteur: "Vergers de la Casamance", note: 4.9, avis: 88,
    membres: [
      { initiale: "M", couleur: "#FFB000" }, { initiale: "A", couleur: "#12C25A" },
      { initiale: "S", couleur: "#3B9EF5" },
    ],
    groupeActuel: 3, featured: false, nouveau: true, chaud: true,
    expireIn: 24 * 3600,
    createdAt: "2026-05-22T15:20:00Z",
  },
  {
    id: 9, nom: "Gombo Frais (Kandia)", cat: "Légumes", emoji: "🥒",
    prixSolo: 800, prixGroupe: 500, unite: "kg", minGroupe: 5,
    stock: 100, image: "okra", couleur: "#2ECC71",
    desc: "Gombo frais et tendre, idéal pour votre sauce kandia. Récolte locale.",
    producteur: "Maraîchers de Sangalkam", note: 4.7, avis: 45,
    membres: [
      { initiale: "K", couleur: "#2ECC71" }, { initiale: "G", couleur: "#E67E22" },
    ],
    groupeActuel: 2, featured: false, nouveau: true, chaud: false,
    expireIn: 12 * 3600,
    createdAt: "2026-05-23T09:00:00Z",
  },
  {
    id: 10, nom: "Salade Laitue Bio", cat: "Légumes", emoji: "🥬",
    prixSolo: 400, prixGroupe: 250, unite: "pied", minGroupe: 10,
    stock: 150, image: "lettuce", couleur: "#27AE60",
    desc: "Laitue croquante cultivée sans produits chimiques. Fraîcheur garantie.",
    producteur: "Jardins de Sebikotane", note: 4.8, avis: 62,
    membres: [
      { initiale: "S", couleur: "#27AE60" }, { initiale: "L", couleur: "#F1C40F" },
      { initiale: "M", couleur: "#E74C3C" },
    ],
    groupeActuel: 3, featured: false, nouveau: false, chaud: false,
    expireIn: 18 * 3600,
    createdAt: "2026-05-21T07:30:00Z",
  },
  {
    id: 11, nom: "Carottes des Niayes", cat: "Légumes", emoji: "🥕",
    prixSolo: 600, prixGroupe: 400, unite: "kg", minGroupe: 5,
    stock: 250, image: "carrot", couleur: "#E67E22",
    desc: "Carottes bien sucrées et croquantes, riches en bêta-carotène.",
    producteur: "Coopérative Niayes Bio", note: 4.9, avis: 112,
    membres: [
      { initiale: "C", couleur: "#E67E22" }, { initiale: "A", couleur: "#3498DB" },
      { initiale: "J", couleur: "#9B59B6" }, { initiale: "B", couleur: "#2ECC71" },
    ],
    groupeActuel: 4, featured: true, nouveau: false, chaud: true,
    expireIn: 48 * 3600,
    createdAt: "2026-05-19T14:00:00Z",
  },
  {
    id: 12, nom: "Pommes de Terre Locales", cat: "Légumes", emoji: "🥔",
    prixSolo: 550, prixGroupe: 380, unite: "kg", minGroupe: 15,
    stock: 1000, image: "potato", couleur: "#D35400",
    desc: "Pommes de terre de conservation, idéales pour frites et ragoûts.",
    producteur: "Grands Domaines du Sénégal", note: 4.7, avis: 156,
    membres: [
      { initiale: "P", couleur: "#D35400" }, { initiale: "D", couleur: "#7F8C8D" },
      { initiale: "T", couleur: "#16A085" },
    ],
    groupeActuel: 3, featured: false, nouveau: false, chaud: true,
    expireIn: 72 * 3600,
    createdAt: "2026-05-15T11:00:00Z",
  },
  {
    id: 13, nom: "Citrons Verts Juteux", cat: "Fruits Locaux", emoji: "🍋",
    prixSolo: 1000, prixGroupe: 700, unite: "kg", minGroupe: 5,
    stock: 80, image: "lemon", couleur: "#F1C40F",
    desc: "Citrons frais du jardin, très juteux et parfumés.",
    producteur: "Vergers de Pout", note: 4.6, avis: 38,
    membres: [
      { initiale: "C", couleur: "#F1C40F" },
    ],
    groupeActuel: 1, featured: false, nouveau: true, chaud: false,
    expireIn: 24 * 3600,
    createdAt: "2026-05-23T16:00:00Z",
  },
  {
    id: 14, nom: "Arachides Grillées", cat: "Snacks", emoji: "🥜",
    prixSolo: 1500, prixGroupe: 1100, unite: "pot", minGroupe: 10,
    stock: 50, image: "peanuts", couleur: "#A04000",
    desc: "Arachides locales grillées artisanalement au feu de bois. Très croquantes.",
    producteur: "GIE Femmes Rurales", note: 4.8, avis: 92,
    membres: [
      { initiale: "A", couleur: "#A04000" }, { initiale: "G", couleur: "#2980B9" },
    ],
    groupeActuel: 2, featured: false, nouveau: false, chaud: true,
    expireIn: 120 * 3600,
    createdAt: "2026-05-10T10:00:00Z",
  },
  {
    id: 15, nom: "Poissons Séchés (Guedj)", cat: "Produits Mer", emoji: "🐟",
    prixSolo: 3500, prixGroupe: 2800, unite: "kg", minGroupe: 5,
    stock: 40, image: "dried_fish", couleur: "#BDC3C7",
    desc: "Poissons séchés de qualité supérieure, sans sable. Parfait pour le Thieboudienne.",
    producteur: "Femmes Transformatrices de Joal", note: 4.9, avis: 45,
    membres: [
      { initiale: "G", couleur: "#BDC3C7" }, { initiale: "J", couleur: "#2C3E50" },
    ],
    groupeActuel: 2, featured: false, nouveau: true, chaud: false,
    expireIn: 96 * 3600,
    createdAt: "2026-05-22T08:00:00Z",
  },
  {
    id: 16, nom: "Bananes Poyo", cat: "Fruits Locaux", emoji: "🍌",
    prixSolo: 1000, prixGroupe: 650, unite: "kg", minGroupe: 5,
    stock: 120, image: "banana", couleur: "#F4D03F",
    desc: "Bananes mûres de Casamance, bien sucrées et énergétiques.",
    producteur: "Bananes de Sédhiou", note: 4.7, avis: 54,
    membres: [
      { initiale: "B", couleur: "#F4D03F" }, { initiale: "P", couleur: "#27AE60" },
    ],
    groupeActuel: 2, featured: true, nouveau: false, chaud: false,
    expireIn: 15 * 3600,
    createdAt: "2026-05-21T18:00:00Z",
  },
  {
    id: 17, nom: "Fraises des Niayes", cat: "Fruits Locaux", emoji: "🍓",
    prixSolo: 4500, prixGroupe: 3200, unite: "barquette", minGroupe: 5,
    stock: 30, image: "strawberry", couleur: "#E74C3C",
    desc: "Fraises fraîches cultivées localement dans les Niayes. Goût intense.",
    producteur: "Ferme Fraises Dakar", note: 4.9, avis: 28,
    membres: [
      { initiale: "F", couleur: "#E74C3C" },
    ],
    groupeActuel: 1, featured: true, nouveau: true, chaud: true,
    expireIn: 8 * 3600,
    createdAt: "2026-05-24T06:00:00Z",
  },
];

const PRODUCERS = [
  {
    id: "prod-1",
    nom: "Coopérative Niayes Bio",
    localisation: "Niayes, Sénégal",
    desc: "Spécialisée dans la production maraîchère biologique depuis 2012. Notre coopérative regroupe 50 producteurs locaux engagés pour une agriculture durable.",
    photo: "🚜",
    certifie: true,
    badges: ["Bio", "Circuit Court", "Eco-responsable"],
    note: 4.9,
    anniversaire: "Mars 2015",
    nbVentes: 1240
  },
  {
    id: "prod-2",
    nom: "Ferme Lamine Sow",
    localisation: "Vallée du Fleuve, Saint-Louis",
    desc: "Ancien ingénieur agronome, Lamine Sow est retourné à la terre pour produire le meilleur riz local du Sénégal avec des méthodes respectueuses de l'environnement.",
    photo: "🌾",
    certifie: true,
    badges: ["Artisanal", "Savoir-faire", "Local"],
    note: 4.8,
    anniversaire: "Juin 2018",
    nbVentes: 850
  },
  {
    id: "prod-3",
    nom: "Groupement Femmes Pikine",
    localisation: "Pikine, Dakar",
    desc: "Ce groupement d'intérêt économique regroupe 20 femmes transformatrices et productrices urbaines. Elles luttent contre la précarité via l'agriculture urbaine.",
    photo: "👩‍🌾",
    certifie: true,
    badges: ["Femmes", "Social", "Urbain"],
    note: 4.9,
    anniversaire: "Janvier 2020",
    nbVentes: 2100
  },
];

const CATS = ["Tous", "Légumes", "Céréales", "Fruits Locaux", "Boissons", "Huiles", "Épices", "Snacks", "Produits Mer"];

const SUB_CATS: Record<string, string[]> = {
  "Légumes": ["Tous", "Tubercules", "Feuilles", "Bulbes"],
  "Céréales": ["Tous", "Riz", "Mil", "Maïs"],
  "Fruits Locaux": ["Tous", "Saisonniers", "Exotiques"],
  "Boissons": ["Tous", "Jus", "Eaux"],
  "Huiles": ["Tous", "Végétale", "Palme"],
  "Épices": ["Tous", "Piments", "Aromates"],
};

const POPULAR_SEARCHES = ["Oignon", "Tomates", "Pomme de terre", "Gombo", "Carottes", "Bananes", "Fraises", "Poisson séché"];

const SAMPLE_PARTICIPANTS = [
  { initials: "AS", color: "#FF5733" },
  { initials: "MD", color: "#33FF57" },
  { initials: "BK", color: "#3357FF" },
];

const HUBS = [
  { id: "hub-1", nom: "Hub Yoff - Station Total", adresse: "Route de l'Aéroport, Dakar", horaire: "8h - 20h" },
  { id: "hub-2", nom: "Hub Pikine - Maison Communale", adresse: "Tally Boubess, Pikine", horaire: "9h - 18h" },
  { id: "hub-3", nom: "Hub Parcelles - Terminus P23", adresse: "Villa 422, Unité 14", horaire: "8h - 19h" },
];

const MES_GROUPES = [
  { id: 1, deal: DEALS[0], membres: 4, target: 5, expireIn: 14*3600+23*60+44, statut: "ouvert", montant: 780*3, role: "membre", hub: HUBS[0], paymentMethod: "wave" },
  { id: 2, deal: DEALS[2], membres: 8, target: 8, expireIn: 0, statut: "complet", montant: 420 * 10, role: "créateur", hub: HUBS[1], paymentMethod: "orange" },
  { id: 3, deal: DEALS[3], membres: 2, target: 6, expireIn: 22 * 3600, statut: "ouvert", montant: 1600 * 2, role: "membre", hub: HUBS[2], paymentMethod: "wave" },
];

const MES_COMMANDES = [
  { id: "BJ-001", deal: DEALS[0], qte: 5, montant: 3900,  statut: "livrée",     date: "10 Mai 2026", hub: "Hub Yoff Centre" },
  { id: "BJ-002", deal: DEALS[2], qte: 3, montant: 1260,  statut: "en transit", date: "15 Mai 2026", hub: "Hub Yoff Centre" },
];

const USER_SAVINGS_HISTORY = [
  { p: "Jan", eco: 2500 },
  { p: "Fév", eco: 5800 },
  { p: "Mar", eco: 9200 },
  { p: "Avr", eco: 12400 },
  { p: "Mai", eco: 15300 },
];

const USER_COMMUNITY_IMPACT = [
  { m: "Déc", eco: 1200 },
  { m: "Jan", eco: 1800 },
  { m: "Fév", eco: 2200 },
  { m: "Mar", eco: 2900 },
  { m: "Avr", eco: 3400 },
  { m: "Mai", eco: 3800 },
];

const KPI_DATA = [
  { m: "M1", gmv: 480,  men: 20, eco: 86  },
  { m: "M2", gmv: 840,  men: 35, eco: 151 },
  { m: "M3", gmv: 1440, men: 60, eco: 259 },
  { m: "M4", gmv: 1920, men: 80, eco: 346 },
  { m: "M5", gmv: 2400, men: 100,eco: 432 },
  { m: "M6", gmv: 2400, men: 100,eco: 432 },
];

const NOTIF_DATA = [
  { id: 1, type: "livraison", msg: "✅ Commande BJ-001 livrée au Hub Yoff Centre",              ts: "Il y a 2h",  lu: false, action: "Suivre le colis" },
  { id: 2, type: "groupe",    msg: "👥 Plus qu'1 membre pour compléter votre groupe Tomates!",  ts: "Il y a 4h",  lu: false, action: "Voir le groupe" },
  { id: 3, type: "deal",      msg: "🔥 Nouveau deal: Huile d'arachide -34% — expire dans 18h", ts: "Il y a 6h",  lu: true,  action: "Voir le deal" },
  { id: 4, type: "paiement",  msg: "💰 Paiement Wave confirmé: 3 900 FCFA pour BJ-001",        ts: "10 Mai",     lu: true,  action: "Reçu" },
];

const SAMPLE_REVIEWS = [
  { id: 1, user: "Moussa D.", rating: 5, comment: "Produits de très bonne qualité, livraison rapide au hub.", date: "Il y a 2 jours" },
  { id: 2, user: "Fatou S.", rating: 4, comment: "Très satisfaite des tomates, bien fraîches.", date: "Il y a 1 semaine" },
  { id: 3, user: "Abdou L.", rating: 5, comment: "Excellent service, j'économise beaucoup avec BOLÉ JËND.", date: "Il y a 3 jours" },
];

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const fmt   = (n: number) => new Intl.NumberFormat("fr-SN").format(n) + " F";
const pct   = (solo: number, grp: number) => Math.round((1 - grp / solo) * 100);
const fmtT  = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sc = s % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}`;
};

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useTimers(deals: any[]) {
  const [timers, setTimers] = useState(() =>
    Object.fromEntries(deals.map(d => [d.id, d.expireIn]))
  );
  useEffect(() => {
    const id = setInterval(() =>
      setTimers((p: any) => {
        const n = { ...p };
        Object.keys(n).forEach(k => { if (n[k] > 0) n[k]--; });
        return n;
      }), 1000);
    return () => clearInterval(id);
  }, []);
  return timers;
}

/* ═══════════════════════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════════════════════ */

/** Emoji art placeholder */
function ProductArt({ deal, size = 72 }: { deal: any, size?: number }) {
  const gradMap: Record<string, string[]> = {
    tomato: ["#7f1d1d","#991b1b"], rice:  ["#78350f","#92400e"],
    onion:  ["#4c1d95","#5b21b6"], bissap:["#831843","#9d174d"],
    greens: ["#14532d","#166534"], oil:   ["#78350f","#92400e"],
    palm_oil: ["#b91c1c","#9a3412"], mango: ["#f59e0b","#ea580c"],
  };
  const [c1, c2] = gradMap[deal.image] || ["#1C3048","#0F2030"];
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.25,
      background: `linear-gradient(135deg, ${c1}, ${c2})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.46, flexShrink: 0,
    }}>
      {deal.emoji}
    </div>
  );
}

/** Countdown inline */
function CountdownBadge({ seconds }: { seconds: number }) {
  const urgent = seconds < 3600;
  return (
    <span style={{
      fontFamily: "monospace", fontSize: 11, fontWeight: 700,
      color: urgent ? T.orange : T.gold,
    }}>⏱ {fmtT(seconds)}</span>
  );
}

/** Countdown blocks (big) */
function CountdownBlocks({ seconds }: { seconds: number }) {
  const urgent = seconds < 3600;
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60;
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {([["h", h], ["m", m], ["s", s]] as [string, number][]).map(([l, v]) => (
        <div key={l} style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontSize: 15, fontWeight: 900,
            background: urgent ? `${T.orange}22` : `${T.gold}18`,
            color: urgent ? T.orange : T.gold,
            border: `1px solid ${urgent ? T.orange : T.gold}40`,
          }}>{String(v).padStart(2,"0")}</div>
          <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

/** Horizontal group progress */
function GroupBar({ current, target, small }: { current: number, target: number, small?: boolean }) {
  const val = Math.min(100, Math.round((current / target) * 100));
  const rem = target - current;
  const color = val >= 80 ? T.green : T.blue;
  if (small) return (
    <div>
      <div style={{ height: 5, borderRadius: 99, background: T.border, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${val}%`, borderRadius: 99, background: `linear-gradient(90deg,${color},${T.green})`, transition:"width .4s" }} />
      </div>
      <div style={{ fontSize: 10, color: T.muted, marginTop: 3 }}>
        {rem > 0
          ? <span style={{ color: T.gold, fontWeight: 700 }}>+{rem} manquant{rem>1?"s":""}</span>
          : <span style={{ color: T.green, fontWeight: 700 }}>✓ Groupe complet!</span>}
        <span> ({current}/{target})</span>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:12, color:T.muted, fontWeight:600 }}>Progression groupe</span>
        <span style={{ fontSize:12, fontWeight:900, color: val>=100 ? T.green : T.gold }}>{val}%</span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: T.border, overflow:"hidden" }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${val}%` }}
          transition={{ type: "spring", stiffness: 45, damping: 20 }}
          style={{ 
            height:"100%", borderRadius:99,
            background: `linear-gradient(90deg,${color},${T.green})`,
            boxShadow: `0 0 12px ${color}50`
          }} 
        />
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, fontSize:11 }}>
        <span style={{ color:T.muted }}>{current} personnes</span>
        {rem>0
          ? <span style={{ color:T.gold, fontWeight:800, animation:"pulse 1.5s infinite" }}>⚡ Plus que {rem}!</span>
          : <span style={{ color:T.green, fontWeight:800 }}>✅ Complet!</span>}
        <span style={{ color:T.muted }}>Cible: {target}</span>
      </div>
    </div>
  );
}

/** Avatar stack */
function Avatars({ membres, size = 24 }: { membres: any[], size?: number }) {
  const shown = membres.slice(0, 4);
  const extra = membres.length - 4;
  return (
    <div style={{ display:"flex", alignItems:"center" }}>
      {shown.map((m, i) => (
        <div key={i} style={{
          width:size, height:size, borderRadius:"50%",
          background:`${m.couleur}30`, color:m.couleur,
          border:`2px solid ${T.card}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:size*0.38, fontWeight:900,
          marginLeft: i===0 ? 0 : -(size*0.35),
        }}>{m.initiale}</div>
      ))}
      {extra>0 && (
        <div style={{
          width:size, height:size, borderRadius:"50%",
          background:T.border, color:T.muted,
          border:`2px solid ${T.card}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:size*0.35, fontWeight:900,
          marginLeft:-(size*0.35),
        }}>+{extra}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FEATURED DEAL CARD  (Deals du jour — grande carte)
═══════════════════════════════════════════════════════════ */
function FeaturedCard({ deal, timer, onPress }: { deal: any, timer: number, onPress: (d: any) => void }) {
  const [liked, setLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const reduction = pct(deal.prixSolo, deal.prixGroupe);

  const handlePress = () => {
    onPress(deal);
    window.scrollTo(0, 0);
  };

  return (
    <motion.div
      onClick={handlePress}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        background:`linear-gradient(160deg,${T.card} 0%,#091825 100%)`,
        border:`1px solid ${T.border}`,
        borderRadius:24, overflow:"hidden", cursor:"pointer",
        marginBottom:16, position:"relative",
        transformOrigin: "center center",
      }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              bottom: 12,
              background: "rgba(7, 16, 28, 0.95)",
              backdropFilter: "blur(10px)",
              zIndex: 50,
              borderRadius: 20,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: `1px solid ${T.green}40`,
            }}
          >
            <div style={{ fontSize: 72, marginBottom: 16 }}>{deal.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: T.text, textAlign: "center", marginBottom: 8 }}>
              {deal.nom}
            </div>
            <div style={{ background: T.greenLt, color: T.green, padding: "8px 16px", borderRadius: 12, fontWeight: 900, fontSize: 20 }}>
              {fmt(deal.prixGroupe)}
            </div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 12, fontWeight: 600 }}>
              Cliquer pour voir les détails
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glow accent */}
      <div style={{
        position:"absolute", top:-40, right:-40, width:140, height:140,
        borderRadius:"50%", background:`${deal.couleur}10`, pointerEvents:"none",
      }}/>

      {/* Top row */}
      <div style={{ padding:"16px 16px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:6 }}>
          {deal.chaud && (
            <span style={{ background:`${T.orange}22`, color:T.orange, fontSize:10, fontWeight:800,
              padding:"3px 10px", borderRadius:99 }}>🔥 HOT DEAL</span>
          )}
          {deal.nouveau && (
            <span style={{ background:`${T.blue}22`, color:T.blue, fontSize:10, fontWeight:800,
              padding:"3px 10px", borderRadius:99 }}>✨ NOUVEAU</span>
          )}
          {!deal.chaud && !deal.nouveau && (
            <span style={{ background:`${T.green}18`, color:T.green, fontSize:10, fontWeight:700,
              padding:"3px 10px", borderRadius:99 }}>{deal.cat}</span>
          )}
        </div>
        <button
          onClick={e => { e.stopPropagation(); setLiked(l=>!l); }}
          style={{ background:liked?`${T.red}20`:T.border, border:"none", borderRadius:10,
            padding:7, cursor:"pointer", display:"flex" }}
        >
          <Heart size={14} fill={liked?"#E63946":"none"} color={liked?"#E63946":T.muted} />
        </button>
      </div>

      {/* Main body */}
      <div style={{ padding:"0 16px 14px", display:"flex", gap:14, alignItems:"center" }}>
        <ProductArt deal={deal} size={90} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:900, fontSize:16, color:T.text, lineHeight:1.2, marginBottom:3 }}>
            {deal.nom}
          </div>
          <div style={{ fontSize:11, color:T.muted, marginBottom:10 }}>
            📍 {deal.producteur}
          </div>

          {/* Prices */}
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, flexWrap:"wrap" }}>
            <div>
              <div style={{ fontSize:11, color:T.muted, textDecoration:"line-through" }}>
                {fmt(deal.prixSolo)}/{deal.unite}
              </div>
              <div style={{ fontSize:26, fontWeight:900, color:T.green, lineHeight:1 }}>
                {fmt(deal.prixGroupe)}
              </div>
              <div style={{ fontSize:10, color:T.muted }}>/{deal.unite}</div>
            </div>
            <div style={{
              background:`linear-gradient(135deg,${T.green},#06EFAA)`,
              color:"#fff", fontSize:13, fontWeight:900,
              padding:"4px 10px", borderRadius:10,
            }}>-{reduction}%</div>
          </div>

          {/* Star */}
          <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:8 }}>
            <Star size={11} fill={T.gold} color={T.gold}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.gold }}>{deal.note}</span>
            <span style={{ fontSize:11, color:T.muted }}>({deal.avis} avis)</span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding:"0 16px 10px" }}>
        <GroupBar current={deal.groupeActuel} target={deal.minGroupe} small />
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop:`1px solid ${T.border}`,
        padding:"12px 16px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <Avatars membres={deal.membres} size={26}/>
          <CountdownBadge seconds={timer}/>
        </div>
        <button
          onClick={e => { e.stopPropagation(); handlePress(); }}
          style={{
            background:`linear-gradient(135deg,${T.green},${T.greenMd})`,
            color:"#fff", border:"none", borderRadius:12,
            padding:"9px 18px", fontSize:12, fontWeight:800,
            cursor:"pointer", display:"flex", alignItems:"center", gap:6,
          }}
        >
          Rejoindre <ChevronRight size={13}/>
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   REGULAR DEAL CARD  (liste compacte)
═══════════════════════════════════════════════════════════ */
function DealCard({ deal, timer, onPress }: { deal: any, timer: number, onPress: (d: any) => void, key?: any }) {
  const [liked, setLiked] = useState(false);
  const reduction = pct(deal.prixSolo, deal.prixGroupe);

  const handlePress = () => {
    onPress(deal);
    window.scrollTo(0, 0);
  };

  return (
    <div
      onClick={handlePress}
      style={{
        background:T.card, border:`1px solid ${T.border}`,
        borderRadius:18, overflow:"hidden", cursor:"pointer",
        marginBottom:12,
      }}
    >
      <div style={{ padding:14 }}>
        <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
          <ProductArt deal={deal} size={62}/>
          <div style={{ flex:1, minWidth:0 }}>
            {/* Header row */}
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:4 }}>
              <div style={{ fontWeight:800, fontSize:13, color:T.text, lineHeight:1.3, flex:1 }}>
                {deal.nom}
              </div>
              <button
                onClick={e=>{ e.stopPropagation(); setLiked(l=>!l); }}
                style={{ background:"none", border:"none", cursor:"pointer", padding:2, flexShrink:0 }}
              >
                <Heart size={13} fill={liked?"#E63946":"none"} color={liked?"#E63946":T.muted2}/>
              </button>
            </div>

            {/* Badges row */}
            <div style={{ display:"flex", gap:5, marginTop:5, flexWrap:"wrap" }}>
              {deal.chaud && <span style={{ background:`${T.orange}20`,color:T.orange,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99 }}>🔥 HOT</span>}
              {deal.nouveau && <span style={{ background:`${T.blue}20`,color:T.blue,fontSize:9,fontWeight:800,padding:"2px 7px",borderRadius:99 }}>✨ NOUVEAU</span>}
              <span style={{ background:`${T.green}15`,color:T.green,fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:99 }}>{deal.cat}</span>
            </div>

            {/* Price row */}
            <div style={{ display:"flex", alignItems:"center", gap:7, marginTop:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:18, fontWeight:900, color:T.green }}>{fmt(deal.prixGroupe)}</span>
              <span style={{ fontSize:11, color:T.muted, textDecoration:"line-through" }}>{fmt(deal.prixSolo)}</span>
              <span style={{ background:T.greenLt, color:T.green, fontSize:10, fontWeight:900, padding:"2px 7px", borderRadius:8 }}>
                -{reduction}%
              </span>
            </div>

            {/* Progress */}
            <div style={{ marginTop:10 }}>
              <GroupBar current={deal.groupeActuel} target={deal.minGroupe} small/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          marginTop:10, paddingTop:10, borderTop:`1px solid ${T.border}`,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Avatars membres={deal.membres} size={20}/>
            <span style={{ fontSize:11, color:T.muted }}>
              <Star size={10} fill={T.gold} color={T.gold} style={{verticalAlign:"middle", marginRight:2}}/>{deal.note}
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <CountdownBadge seconds={timer}/>
            <button
              onClick={e=>{ e.stopPropagation(); handlePress(); }}
              style={{
                background:`linear-gradient(135deg,${T.green},${T.greenMd})`,
                color:"#fff", border:"none", borderRadius:9,
                padding:"7px 14px", fontSize:11, fontWeight:800, cursor:"pointer",
              }}
            >Rejoindre</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME SCREEN
═══════════════════════════════════════════════════════════ */
function HomeScreen({ timers, onDeal, onShowNotifs, cart, setPage, notifications, deals }: { timers: any, onDeal: (d: any) => void, onShowNotifs: () => void, cart: any[], setPage: (p: string) => void, notifications: any[], deals: any[] }) {
  const [cat, setCat]       = useState("Tous");
  const [subCat, setSubCat] = useState("Tous");
  const [search, setSearch] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState("pop"); // pop, price, expire, new
  const [showSort, setShowSort] = useState(false);

  const allDeals      = Array.isArray(deals) ? deals : [];
  
  const filteredAll = allDeals.filter(d => {
    const matchCat = cat === "Tous" || d.cat === cat;
    // Mock sub-category match for now as it's not in the data schema yet
    const matchSub = subCat === "Tous"; 
    const matchSearch = !search.trim() || 
        d.nom.toLowerCase().includes(search.toLowerCase()) ||
        d.producteur.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSub && matchSearch;
  });

  const sortedDeals = [...filteredAll].sort((a, b) => {
    if (sortBy === "price") return a.prixGroupe - b.prixGroupe;
    if (sortBy === "expire") return (timers[a.id] ?? a.expireIn) - (timers[b.id] ?? b.expireIn);
    if (sortBy === "new") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return b.avis - a.avis; // pop
  });

  const featuredDeals = sortedDeals.filter(d => d.featured);
  const regularDeals  = sortedDeals.filter(d => !d.featured);
  
  const unreadNotifs  = notifications.filter(n => !n.lu).length;

  const displayRegular = regularDeals.length > 0
    ? regularDeals
    : (cat === "Tous" && !search.trim() && !subCat ? allDeals.filter(d=>!d.featured) : []);

  const sortLabel = { pop: "Popularité", price: "Prix", expire: "Urgence", new: "Nouveauté" }[sortBy as "pop"|"price"|"expire"|"new"];

  return (
    <div style={{ paddingBottom:100 }}>
      {/* HEADER */}
      <div style={{
        position:"sticky", top:0, zIndex:30,
        background:T.bg, padding:"16px 16px 10px",
        borderBottom:`1px solid ${T.border}`,
      }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:T.green, letterSpacing:1, display:"flex", alignItems:"center", gap:4 }}>
              <MapPin size={10}/> Yoff, Dakar
            </div>
            <div style={{ fontSize:20, fontWeight:900, color:T.text, letterSpacing:0.5 }}>
              BOLÉ JËND
            </div>
            <div style={{ fontSize:10, color:T.muted }}>L'Union Fait Le Prix</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <button
              onClick={() => setPage("commandes")}
              style={{
                position:"relative", background:T.card, border:`1px solid ${T.border}`,
                borderRadius:12, padding:"8px 10px", cursor:"pointer", display:"flex",
              }}
            >
              <ShoppingCart size={18} color={cart.length > 0 ? T.green : T.muted}/>
              {cart.length > 0 && (
                <div style={{
                  position:"absolute", top:-4, right:-4, width:16, height:16,
                  borderRadius:"50%", background:T.red, color:"#fff",
                  fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center",
                }}>{cart.length}</div>
              )}
            </button>
            <button
              onClick={onShowNotifs}
              style={{
                position:"relative", background:T.card, border:`1px solid ${T.border}`,
                borderRadius:12, padding:"8px 10px", cursor:"pointer", display:"flex",
              }}
            >
              <Bell size={18} color={unreadNotifs > 0 ? T.gold : T.muted}/>
              {unreadNotifs > 0 && (
                <div style={{
                  position:"absolute", top:-4, right:-4, width:16, height:16,
                  borderRadius:"50%", background:T.red, color:"#fff",
                  fontSize:9, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center",
                }}>{unreadNotifs}</div>
              )}
            </button>
          </div>
        </div>

        <div style={{ position:"relative" }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:T.muted }}/>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Chercher un deal, un produit…"
            style={{
              width:"100%", boxSizing:"border-box",
              padding:"10px 36px 10px 34px", borderRadius:14,
              background:T.card, border:`1px solid ${T.border}`,
              color:T.text, fontSize:13, outline:"none",
              fontFamily:"inherit",
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)",
                background:"none", border:"none", cursor:"pointer" }}
            >
              <X size={14} color={T.muted}/>
            </button>
          )}

          {isSearchFocused && !search && (
            <div style={{ 
              position: "absolute", top: "100%", left: 0, right: 0, 
              background: T.card, border: `1px solid ${T.border}`, 
              borderRadius: 14, marginTop: 8, padding: 12, zIndex: 50,
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
            }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, marginBottom: 8, textTransform: "uppercase" }}>Recherches populaires</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {POPULAR_SEARCHES.map(s => (
                  <button 
                    key={s} 
                    onClick={() => { setSearch(s); setIsSearchFocused(false); }}
                    style={{ 
                      padding: "6px 12px", borderRadius: 8, background: T.surface, 
                      border: `1px solid ${T.border}`, color: T.text, fontSize: 11, 
                      fontWeight: 600, cursor: "pointer" 
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isSearchFocused && search && (
             <div style={{ 
               position: "absolute", top: "100%", left: 0, right: 0, 
               background: T.card, border: `1px solid ${T.border}`, 
               borderRadius: 14, marginTop: 8, padding: 12, zIndex: 50,
               boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
               maxHeight: 300, overflowY: "auto"
             }}>
               {(() => {
                 const dealMatches = allDeals.filter(d => d.nom.toLowerCase().includes(search.toLowerCase())).slice(0, 5);
                 const producerMatches = Array.from(new Set(allDeals.filter(d => d.producteur.toLowerCase().includes(search.toLowerCase())).map(d => d.producteur))).slice(0, 3);
                 
                 if (dealMatches.length === 0 && producerMatches.length === 0) {
                   return <div style={{ fontSize: 11, color: T.muted, textAlign: "center", padding: "10px 0" }}>Aucun résultat trouvé</div>;
                 }

                 return (
                   <>
                     {dealMatches.length > 0 && (
                       <div style={{ marginBottom: 12 }}>
                         <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, marginBottom: 8, textTransform: "uppercase" }}>Produits</div>
                         {dealMatches.map(d => (
                           <div 
                              key={d.id} 
                              onClick={() => { onDeal(d); setSearch(""); setIsSearchFocused(false); window.scrollTo(0, 0); }}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 8, cursor: "pointer" }}
                           >
                             <div style={{ width: 24, height: 24, borderRadius: 6, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>{d.emoji}</div>
                             <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{d.nom}</div>
                           </div>
                         ))}
                       </div>
                     )}
                     {producerMatches.length > 0 && (
                       <div>
                         <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, marginBottom: 8, textTransform: "uppercase" }}>Producteurs</div>
                         {producerMatches.map(p => (
                           <div 
                              key={p} 
                              onClick={() => { setSearch(p); setIsSearchFocused(false); }}
                              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px", borderRadius: 8, cursor: "pointer" }}
                           >
                             <Award size={14} color={T.gold} />
                             <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{p}</div>
                           </div>
                         ))}
                       </div>
                     )}
                   </>
                 );
               })()}
             </div>
          )}
        </div>
      </div>

      {/* SAVINGS BANNER */}
      <div style={{
        margin:"14px 16px", borderRadius:20,
        background:`linear-gradient(135deg,${T.greenLt},${T.goldLt})`,
        border:`1px solid ${T.green}30`, padding:"14px 16px",
        display:"flex", alignItems:"center", gap:12,
      }}>
        <div style={{ fontSize:28 }}>💰</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.green, textTransform:"uppercase", letterSpacing:0.8 }}>
            Économies communautaires — semaine
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:T.text, marginTop:2 }}>
            82 000 FCFA économisés
          </div>
          <div style={{ fontSize:10, color:T.muted, marginTop:1 }}>
            par les 35 ménages actifs à Yoff
          </div>
        </div>
        <Award size={30} color={T.gold}/>
      </div>

      {/* CATEGORIES */}
      <div style={{ padding: "0 16px" }}>
        <div style={{
          display:"flex", gap:8, padding:"0 0 8px",
          overflowX:"auto", WebkitOverflowScrolling:"touch",
          scrollbarWidth:"none",
        }}>
          {CATS.map(c => (
            <button
              key={c}
              onClick={() => { setCat(c); setSubCat("Tous"); }}
              style={{
                flexShrink:0, padding:"7px 16px", borderRadius:99,
                fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                transition:"all .2s",
                ...(cat === c
                  ? { background:`linear-gradient(135deg,${T.green},${T.greenMd})`, color:"#fff" }
                  : { background:T.card, color:T.muted, border:`1px solid ${T.border}` }),
              }}
            >{c}</button>
          ))}
        </div>

        {cat !== "Tous" && SUB_CATS[cat] && (
          <div style={{
            display:"flex", gap:6, padding:"4px 0 10px",
            overflowX:"auto", WebkitOverflowScrolling:"touch",
            scrollbarWidth:"none",
          }}>
            {SUB_CATS[cat].map(sc => (
              <button
                key={sc}
                onClick={() => setSubCat(sc)}
                style={{
                  flexShrink:0, padding:"4px 12px", borderRadius:8,
                  fontSize:10, fontWeight:600, cursor:"pointer", border:"none",
                  transition:"all .2s",
                  ...(subCat === sc
                    ? { background:`${T.green}20`, color:T.green, border:`1px solid ${T.green}40` }
                    : { background:"none", color:T.muted, border:`1px solid ${T.border}` }),
                }}
              >{sc}</button>
            ))}
          </div>
        )}
      </div>

      {/* SORTING BAR */}
      <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.muted }}>
          {sortedDeals.length} deals disponibles
        </div>
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setShowSort(!showSort)}
            style={{ 
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 8,
              padding: "4px 10px", fontSize: 11, fontWeight: 700, color: T.text,
              display: "flex", alignItems: "center", gap: 4, cursor: "pointer" 
            }}>
            <TrendingUp size={12} color={T.green} /> {sortLabel}
          </button>
          {showSort && (
            <div style={{ 
              position: "absolute", right: 0, top: 28, background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 12, boxShadow: "0 10px 20px rgba(0,0,0,0.3)", zIndex: 40, overflow: "hidden", minWidth: 140
            }}>
              {[
                { id: "pop", label: "Popularité" },
                { id: "price", label: "Prix croissant" },
                { id: "new", label: "Nouveauté" },
                { id: "expire", label: "Urgence" },
              ].map(s => (
                <div 
                  key={s.id} 
                  onClick={() => { setSortBy(s.id); setShowSort(false); }}
                  style={{ 
                    padding: "10px 16px", fontSize: 12, color: sortBy === s.id ? T.green : T.text, 
                    fontWeight: 600, cursor: "pointer", background: sortBy === s.id ? `${T.green}10` : "none" 
                  }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FEATURED */}
      {featuredDeals.length > 0 && (
        <div style={{ marginBottom:6 }}>
          <div style={{
            padding:"10px 16px 12px",
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <div style={{ fontSize:15, fontWeight:900, color:T.text }}>🔥 Deals du jour</div>
            <button
              onClick={() => setCat("Tous")}
              style={{ fontSize:11, fontWeight:700, color:T.green, background:"none", border:"none", cursor:"pointer" }}
            >Voir tout →</button>
          </div>
          <div style={{ 
            padding: "0 16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 16
          }}>
            {featuredDeals.map(d => (
              <FeaturedCard key={d.id} deal={d} timer={timers[d.id] ?? d.expireIn} onPress={onDeal}/>
            ))}
          </div>
        </div>
      )}

      {/* REGULAR LIST */}
      <div style={{ padding:"0 16px" }}>
        <div style={{
          display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12,
        }}>
          <div style={{ fontSize:15, fontWeight:900, color:T.text }}>
            {cat !== "Tous" ? `Deals — ${cat}` : "Tous les deals"}
          </div>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 12,
          paddingBottom: 20
        }}>
          {displayRegular.map(d => (
            <DealCard key={d.id} deal={d} timer={timers[d.id] ?? d.expireIn} onPress={onDeal}/>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN COMPONENT
═══════════════════════════════════════════════════════════ */
function Admin() {
  const [tab, setTab] = useState("kpis");
  return (
    <div style={{ paddingBottom:100, paddingTop:16 }}>
      <div style={{ padding:"0 16px 14px" }}>
        <div style={{ fontSize:10, fontWeight:700, color:T.green }}>Mode Administration</div>
        <div style={{ fontSize:20, fontWeight:900, color:T.text }}>Dashboard</div>
      </div>
      <div style={{ display:"flex", gap:8, padding:"0 16px", marginBottom:14 }}>
        {["kpis","rapports"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex:1, padding:"10px", borderRadius:12, fontSize:11, fontWeight:800, cursor:"pointer", border:"none", textTransform:"capitalize",
            ...(tab===t ? { background:`linear-gradient(135deg,${T.green},${T.greenMd})`, color:"#fff" } : { background:T.card, color:T.muted }),
          }}>{t}</button>
        ))}
      </div>

      {tab==="kpis" && (
        <div style={{ padding:"0 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
            {[
              { l:"Ménages actifs",v:"35",t:"+12%",c:T.green,e:"👥" },
              { l:"GMV Pilote",v:"840K FCFA",t:"+8%",c:T.blue,e:"💰" },
            ].map(k => (
              <div key={k.l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:14 }}>
                <div style={{ fontSize:22, marginBottom:5 }}>{k.e}</div>
                <div style={{ fontSize:20, fontWeight:900, color:k.c }}>{k.v}</div>
                <div style={{ fontSize:10, color:T.muted }}>{k.l}</div>
              </div>
            ))}
          </div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:16, marginBottom:14 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.text, marginBottom:12 }}>Impact des économies</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={KPI_DATA}>
                <defs>
                  <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.green} stopOpacity={0.3}/>
                    <stop offset="100%" stopColor={T.green} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:T.muted }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fontSize:9, fill:T.muted }} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, fontSize:11 }}/>
                <Area type="monotone" dataKey="eco" stroke={T.green} strokeWidth={2.5} fill="url(#ag)" dot={{ fill:T.green, r:3 }}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:16 }}>
            <div style={{ fontSize:12, fontWeight:800, color:T.text, marginBottom:12 }}>GMV vs Économies (FCFA)</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={KPI_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize:10, fill:T.muted }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:9, fill:T.muted }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: T.border, opacity: 0.4 }}
                  contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 11 }}
                />
                <Bar dataKey="gmv" fill={T.blue} radius={[4, 4, 0, 0]} name="GMV" />
                <Bar dataKey="eco" fill={T.green} radius={[4, 4, 0, 0]} name="Économies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DEAL DETAIL
═══════════════════════════════════════════════════════════ */
function DealDetail({ deal, timer, onBack, onJoin, isFavorite, onToggleFavorite, onDeal, onShowProducer, deals }: { deal: any, timer: number, onBack: () => void, onJoin: (d: any, q: number, h: any) => void, isFavorite: boolean, onToggleFavorite: (id: number) => void, onDeal: (d: any) => void, onShowProducer?: (pName: string) => void, deals: any[] }) {
  const [qte, setQte] = useState(1);
  const [selectedHub, setSelectedHub] = useState(HUBS[0]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const [isJoining, setIsJoining] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleReviewSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newReviewText.trim()) {
      setReviewSubmitted(true);
      setTimeout(() => {
        setReviewSubmitted(false);
        setNewReviewText("");
        setNewReviewRating(5);
      }, 3000);
    }
  };

  const handleJoinClick = () => {
    setIsJoining(true);
    setTimeout(() => {
      // Simulate API failure
      if (Math.random() > 0.1) {
        onJoin(deal, qte, selectedHub);
        setIsSuccess(true);
        setIsJoining(false);
        setTimeout(() => setIsSuccess(false), 3000);
      } else {
        setIsJoining(false);
        alert("Erreur: Impossible de rejoindre le groupe. Veuillez réessayer.");
      }
    }, 800);
  };

  const reduction = pct(deal.prixSolo, deal.prixGroupe);
  const rem = deal.minGroupe - deal.groupeActuel;

  return (
    <div style={{ paddingBottom:120 }}>
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ 
              position: "fixed", top: "40%", left: "50%", transform: "translateX(-50%)", zIndex: 100,
              background: T.green, color: "#fff", padding: "16px 30px", borderRadius: 24,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)", textAlign: "center", pointerEvents: "none"
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
            <div style={{ fontWeight: 900, fontSize: 16 }}>Inscription réussie !</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>Bienvenue dans le groupe</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div style={{ position:"sticky",top:0,zIndex:20,background:T.bg,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:`1px solid ${T.border}` }}>
        <button onClick={onBack} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:"8px 10px",cursor:"pointer",display:"flex" }}>
          <ArrowLeft size={18} color={T.text}/>
        </button>
        <span style={{ fontWeight:800,fontSize:15,color:T.text }}>Détail du deal</span>
        
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            onClick={() => onToggleFavorite(deal.id)}
            style={{ 
              background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, 
              padding: "8px 10px", cursor: "pointer", display: "flex", alignItems: "center" 
            }}
          >
            <Heart 
              size={18} 
              fill={isFavorite ? T.red : "none"} 
              color={isFavorite ? T.red : T.muted} 
            />
          </button>
          
          <button 
            onClick={async () => {
              const shareData = {
                title: `BOLÉ JËND - ${deal.nom}`,
                text: `Rejoignez mon groupe d'achat pour ${deal.nom} à ${fmt(deal.prixGroupe)}/${deal.unite} !`,
                url: window.location.href,
              };
              if (navigator.share) {
                try { await navigator.share(shareData); } catch (e) {}
              } else {
                try { await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`); } catch (e) {}
              }
            }}
            style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:"8px 10px", cursor:"pointer", display:"flex" }}
          >
            <Share2 size={16} color={T.green} />
          </button>
        </div>
      </div>

      <div style={{ margin:"14px 16px",borderRadius:22,padding:20,display:"flex",flexDirection:"column",alignItems:"center",background:`linear-gradient(135deg,${T.card},#0D1F35)`,border:`1px solid ${T.border}` }}>
        <div style={{ fontSize:52, marginBottom:10 }}>{deal.emoji}</div>
        <div style={{ fontSize:17,fontWeight:900,color:T.text,textAlign:"center" }}>{deal.nom}</div>
        <div style={{ fontSize:11,color:T.muted,marginTop:2 }}>{deal.producteur}</div>
      </div>

      <div style={{ margin: "0 16px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          {[
            { l: "Fraîcheur", i: <Clock size={12} />, c: T.green },
            { l: "Qualité", i: <Star size={12} />, c: T.gold },
            { l: "Disponibilité", i: <Package size={12} />, c: T.blue },
          ].map(a => (
            <div key={a.l} style={{ display: "flex", alignItems: "center", gap: 4, background: `${a.c}10`, color: a.c, padding: "4px 10px", borderRadius: 20, fontSize: 9, fontWeight: 800, border: `1px solid ${a.c}20` }}>
              {a.i} {a.l}
            </div>
          ))}
        </div>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "12px 16px", textAlign: "center" }}>
          <p style={{ fontSize: 12, color: T.muted, margin: 0, lineHeight: 1.5 }}>{deal.desc}</p>
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,margin:"0 16px 14px" }}>
        <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:16,textAlign:"center" }}>
          <div style={{ fontSize:11,color:T.muted }}>Prix solo</div>
          <div style={{ fontSize:18,fontWeight:900,color:T.muted,textDecoration:"line-through" }}>{fmt(deal.prixSolo)}</div>
        </div>
        <div style={{ borderRadius:18,padding:16,textAlign:"center",background:`linear-gradient(135deg,${T.greenLt},#0A2A18)`,border:`1px solid ${T.green}40`, position: "relative", overflow: "hidden" }}>
          <div style={{ fontSize:11,color:T.green,fontWeight:700 }}>Prix groupe</div>
          <div style={{ fontSize:28,fontWeight:950,color:T.green, letterSpacing: -0.5 }}>{fmt(deal.prixGroupe)}</div>
          <div style={{ 
            position:"absolute",top:8,right:8,background:T.green,color:"#fff",
            fontSize:10,fontWeight:900,padding:"4px 8px",borderRadius:8,
            display: "flex", alignItems: "center", gap: 4,
            boxShadow: `0 4px 10px ${T.green}40`
          }}>
            <TrendingDown size={12} strokeWidth={3} />
            -{reduction}%
          </div>
        </div>
      </div>

      <div style={{ margin:"0 16px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:16 }}>
        <CountdownBlocks seconds={timer}/>
      </div>

      <div style={{ margin:"0 16px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:16 }}>
        <GroupBar current={deal.groupeActuel} target={deal.minGroupe}/>
        {rem > 0 && (
          <div style={{ marginTop:12,padding:10,borderRadius:10,background:`${T.gold}12`,color:T.gold,fontSize:11,fontWeight:800,textAlign:"center" }}>
            ⚡ Plus que {rem} personnes !
          </div>
        )}
        
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, marginBottom: 12, textTransform: "uppercase" }}>Qui participe ?</div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", marginLeft: 4 }}>
              {SAMPLE_PARTICIPANTS.map((p, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    width: 32, height: 32, borderRadius: "50%", background: p.color, 
                    border: `2px solid ${T.card}`, marginLeft: idx === 0 ? 0 : -10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 900, color: "#fff",
                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                  }}
                >
                  {p.initials}
                </div>
              ))}
              <div style={{ 
                width: 32, height: 32, borderRadius: "50%", background: T.surface, 
                border: `2px solid ${T.card}`, marginLeft: -10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: T.muted
              }}>
                +{deal.groupeActuel > 3 ? deal.groupeActuel - 3 : 2}
              </div>
            </div>
            <div style={{ marginLeft: 12, fontSize: 12, color: T.text, fontWeight: 600 }}>
              {deal.groupeActuel} voisins ont déjà rejoint
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ margin:"0 16px 14px",background:T.card,border:`1px solid ${T.border}`,borderRadius:18,padding:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.text }}>Avis sur le producteur</div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <Star size={14} fill={T.gold} color={T.gold} />
            <span style={{ fontSize:14, fontWeight:900, color:T.gold }}>{deal.note}</span>
            <span style={{ fontSize:11, color:T.muted }}>({deal.avis})</span>
          </div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {SAMPLE_REVIEWS.map(rev => (
            <div key={rev.id} style={{ borderBottom:`1px solid ${T.border}`, paddingBottom:12 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                <span style={{ fontSize:12, fontWeight:800, color:T.text }}>{rev.user}</span>
                <span style={{ fontSize:10, color:T.muted }}>{rev.date}</span>
              </div>
              <div style={{ display:"flex", gap:2, marginBottom:6 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill={i < rev.rating ? T.gold : "none"} color={i < rev.rating ? T.gold : T.muted2} />
                ))}
              </div>
              <p style={{ fontSize:11, color:T.muted, margin:0, lineHeight:1.5 }}>{rev.comment}</p>
            </div>
          ))}
          <button style={{ 
            background:"none", border:"none", color:T.green, 
            fontSize:11, fontWeight:700, cursor:"pointer", textAlign:"center", marginTop:4 
          }}>
            Voir tous les avis ({deal.avis})
          </button>
        </div>

        <div style={{ marginTop: 24, padding: "16px 0 0", borderTop: `1px dashed ${T.border}` }}>
          <div style={{ fontSize: 13, fontWeight: 900, color: T.text, marginBottom: 12 }}>Laisser un avis</div>
          {reviewSubmitted ? (
            <div style={{ background: `${T.green}10`, padding: 12, borderRadius: 12, color: T.green, fontSize: 12, fontWeight: 700, textAlign: "center" }}>
              Merci ! Votre avis a été envoyé.
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit}>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setNewReviewRating(star)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    <Star 
                      size={20} 
                      fill={star <= newReviewRating ? T.gold : "none"} 
                      color={star <= newReviewRating ? T.gold : T.muted2} 
                    />
                  </button>
                ))}
              </div>
              <textarea 
                value={newReviewText}
                onChange={e => setNewReviewText(e.target.value)}
                placeholder="Partagez votre expérience avec ce producteur..."
                style={{ 
                  width: "100%", height: 80, padding: 12, borderRadius: 14, background: T.surface, 
                  border: `1px solid ${T.border}`, color: T.text, fontSize: 12, outline: "none",
                  resize: "none", marginBottom: 12
                }}
              />
              <button 
                type="submit"
                disabled={!newReviewText.trim()}
                style={{ 
                  width: "100%", padding: "12px", borderRadius: 12, background: newReviewText.trim() ? T.green : T.border,
                  color: "#fff", border: "none", fontSize: 12, fontWeight: 800, cursor: "pointer"
                }}
              >
                Publier l'avis
              </button>
            </form>
          )}
        </div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Producteur</div>
              <div 
                onClick={() => onShowProducer?.(deal.producteur)}
                style={{ fontSize: 16, fontWeight: 900, color: T.text, marginTop: 2, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                {deal.producteur} <ChevronRight size={14} color={T.green} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                <Star size={12} fill={T.gold} color={T.gold} />
                <span style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{deal.note}</span>
              </div>
              <div style={{ fontSize: 10, color: T.muted }}>Note certifiée</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: `${T.green}15`, color: T.green, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>Vérifié</span>
            <span style={{ background: `${T.blue}15`, color: T.blue, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>Local</span>
            <span style={{ background: `${T.gold}15`, color: T.gold, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 8 }}>Circuit Court</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 16 }}>Plus de {deal.producteur}</h4>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {deals.filter(d => d.producteur === deal.producteur && d.id !== deal.id).map(s => (
            <div 
              key={s.id} 
              onClick={() => { onDeal(s); window.scrollTo(0, 0); }}
              style={{ flexShrink: 0, width: 140, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 12, cursor: "pointer" }}
            >
              <div style={{ width: "100%", height: 80, borderRadius: 12, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 10 }}>
                {s.emoji}
              </div>
              <div style={{ fontSize: 12, fontWeight: 800, color: T.text, marginBottom: 4, height: 32, overflow: "hidden" }}>{s.nom}</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: T.green }}>{fmt(s.prixGroupe)}</div>
              <div style={{ fontSize: 9, color: T.muted }}>Prix groupé</div>
            </div>
          ))}
          {deals.filter(d => d.producteur === deal.producteur && d.id !== deal.id).length === 0 && (
            <div style={{ fontSize: 11, color: T.muted, fontStyle: "italic", padding: "10px 0" }}>Aucun autre produit disponible pour le moment</div>
          )}
        </div>
      </div>

      <div style={{ padding: "0 16px 32px" }}>
        <h4 style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 16 }}>Produits similaires</h4>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
          {DEALS.filter(d => d.cat === deal.cat && d.id !== deal.id)
            .sort((a, b) => Math.abs(a.prixGroupe - deal.prixGroupe) - Math.abs(b.prixGroupe - deal.prixGroupe))
            .slice(0, 3)
            .map(s => (
              <div 
                key={s.id} 
                onClick={() => { onDeal(s); window.scrollTo(0, 0); }}
                style={{ flexShrink: 0, width: 140, background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 12, cursor: "pointer" }}
              >
                <div style={{ width: "100%", height: 80, borderRadius: 12, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 10 }}>
                  {s.emoji}
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: T.text, marginBottom: 4, height: 32, overflow: "hidden" }}>{s.nom}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: T.green }}>{fmt(s.prixGroupe)}</div>
                <div style={{ fontSize: 9, color: T.muted }}>Prix groupé</div>
              </div>
            ))}
        </div>
      </div>

      {/* Community Section */}
      <div style={{ margin:"0 16px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: T.text, marginBottom: 8 }}>Besoin d'aide ?</div>
        <p style={{ fontSize: 11, color: T.muted, marginBottom: 12 }}>Un doute sur ce deal ? Échangez avec la communauté sur WhatsApp.</p>
        <a 
          href="https://chat.whatsapp.com/IPG03ZvPcmF4pTgt7FXLxd" 
          target="_blank" 
          rel="noreferrer"
          style={{ 
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            background: "#25D36620", color: "#25D366", padding: "12px", borderRadius: 12,
            textDecoration: "none", fontSize: 12, fontWeight: 800, border: "1px solid #25D36640"
          }}
        >
          <MessageCircle size={16} />
          Groupe d'entraide WhatsApp
        </a>
      </div>

      <div style={{ 
        position:"fixed",bottom:0,left:0,right:0,zIndex:30,background:T.bg,
        borderTop:`1px solid ${T.border}`,padding:"14px 16px",maxWidth:480,margin:"0 auto",
        boxShadow: "0 -10px 20px rgba(0,0,0,0.15)"
      }}>
        {!confirmOpen ? (
          <button 
            onClick={() => setConfirmOpen(true)} 
            style={{
              width:"100%",padding:"16px",borderRadius:16,fontSize:15,fontWeight:900,cursor:"pointer",border:"none",
              background:`linear-gradient(135deg,${T.green},#06EFAA)`,color:"#fff",
              boxShadow: `0 8px 16px ${T.green}30`
            }}
          >
            Rejoindre le groupe
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: T.text }}>Quantité :</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <button 
                  onClick={() => setQte(Math.max(1, qte - 1))} 
                  style={{ width: 34, height: 34, borderRadius: 10, background: T.card, border: `1px solid ${T.border}`, color: T.text, cursor: "pointer" }}
                >
                  −
                </button>
                <span style={{ fontSize: 18, fontWeight: 900, color: T.text }}>{qte}</span>
                <button 
                  onClick={() => setQte(qte + 1)} 
                  style={{ width: 34, height: 34, borderRadius: 10, background: T.green, border: "none", color: "#fff", cursor: "pointer" }}
                >
                  +
                </button>
              </div>
            </div>

            <div style={{ padding: "12px", background: T.surface, borderRadius: 14, border: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: T.muted, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={12} /> POINT DE RETRAIT (HUB)
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {HUBS.map(hub => (
                  <div 
                    key={hub.id}
                    onClick={() => setSelectedHub(hub)}
                    style={{ 
                      padding: "10px", borderRadius: 10, cursor: "pointer",
                      background: selectedHub.id === hub.id ? `${T.green}20` : T.card,
                      border: `1px solid ${selectedHub.id === hub.id ? T.green : T.border}`,
                      transition: "0.2s"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{hub.nom}</span>
                      {selectedHub.id === hub.id && <Check size={14} color={T.green} />}
                    </div>
                    <div style={{ fontSize: 9, color: T.muted }}>{hub.adresse} • {hub.horaire}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: "flex", gap: 10 }}>
              <button 
                onClick={() => setConfirmOpen(false)}
                style={{ 
                  padding: "14px 20px", borderRadius: 14, background: T.card, border: `1px solid ${T.border}`, 
                  color: T.muted, fontSize: 13, fontWeight: 800, cursor: "pointer" 
                }}
              >
                Annuler
              </button>
              <button 
                onClick={handleJoinClick}
                disabled={isJoining}
                style={{ 
                  flex: 1, padding: "14px", borderRadius: 14, background: isJoining ? T.muted : T.green, border: "none", 
                  color: "#fff", fontSize: 14, fontWeight: 900, cursor: isJoining ? "default" : "pointer",
                  display: "flex", justifyContent: "center", alignItems: "center", gap: 8
                }}
              >
                {isJoining ? "Vérification..." : `Confirmer · ${fmt(deal.prixGroupe * qte)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS PANEL
 ═══════════════════════════════════════════════════════════ */
function NotificationPanel({ onBack, notifications }: { onBack: () => void, notifications: any[] }) {
  return (
    <div style={{ padding: "16px 16px 120px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={onBack} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "8px 10px", cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={18} color={T.text} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text, margin: 0 }}>Notifications</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notifications.map(n => (
          <div key={n.id} style={{ 
            background: n.lu ? T.card : `${T.green}10`, 
            border: `1px solid ${n.lu ? T.border : T.green}`, 
            borderRadius: 20, padding: 16, position: "relative" 
          }}>
            {!n.lu && <div style={{ position: "absolute", top: 12, right: 12, width: 8, height: 8, borderRadius: "50%", background: T.green }}></div>}
            <div style={{ fontSize: 10, fontWeight: 800, color: T.muted, marginBottom: 8, textTransform: "uppercase" }}>{n.ts || n.time}</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: T.text, margin: "0 0 12px", lineHeight: 1.4 }}>{n.msg || n.content}</p>
            
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ 
                flex: 1, padding: "10px", borderRadius: 12, background: T.green, border: "none", 
                color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" 
              }}>
                {n.action}
              </button>
              <button style={{ 
                padding: "10px", borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, 
                color: T.muted, fontSize: 13, fontWeight: 600, cursor: "pointer" 
              }}>
                Effacer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAYMENT SCREEN
 ═══════════════════════════════════════════════════════════ */
function PaymentScreen({ amount, onConfirm, onCancel, dealName, hubNom }: { amount: number, onConfirm: (method: string) => void, onCancel: () => void, dealName: string, hubNom?: string }) {
  const [method, setMethod] = useState("wave");
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      if (Math.random() > 0.15) {
        setLoading(false);
        onConfirm(method);
      } else {
        setLoading(false);
        alert("Paiement échoué. Solide insuffisant ou erreur réseau.");
      }
    }, 2000);
  };

  return (
    <div style={{ padding: "16px", minHeight: "100vh" }}>
      <AnimatePresence>
        {showCancelConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 24, width: "100%", maxWidth: 340, textAlign: "center" }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: T.text, marginBottom: 8 }}>Annuler le paiement ?</div>
              <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>Vos économies sur {dealName} seront perdues si vous partez maintenant.</p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowCancelConfirm(false)} style={{ flex: 1, padding: "14px", borderRadius: 14, background: T.surface, border: `1px solid ${T.border}`, color: T.text, fontWeight: 700, cursor: "pointer" }}>Continuer</button>
                <button onClick={onCancel} style={{ flex: 1, padding: "14px", borderRadius: 14, background: T.red, border: "none", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Annuler</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShowCancelConfirm(true)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "8px 10px", cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={18} color={T.text} />
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text, margin: 0 }}>Finaliser l'achat</h2>
      </div>

      <div style={{ background: `${T.green}10`, border: `1px dashed ${T.green}40`, borderRadius: 24, padding: 24, textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: T.green, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>MONTANT TOTAL A RÉGLER</div>
        <div style={{ fontSize: 32, fontWeight: 900, color: T.green }}>{fmt(amount)}</div>
        <div style={{ fontSize: 13, color: T.text, marginTop: 12, fontWeight: 600 }}>{dealName}</div>
        {hubNom && (
          <div style={{ fontSize: 11, color: T.muted, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <MapPin size={12} /> Livraison à : <strong>{hubNom}</strong>
          </div>
        )}
        <p style={{ fontSize: 11, color: T.muted, marginTop: 10 }}>Le groupe est complet ! Votre paiement valide la commande groupée.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
        <div 
          onClick={() => setMethod("wave")}
          style={{ 
            padding: 16, borderRadius: 20, background: T.card, border: `2px solid ${method === 'wave' ? T.green : T.border}`,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .2s"
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#1BA2FF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
             <img src="https://static.wave.com/logo.png" style={{ width: "70%" }} alt="Wave" onError={(e) => { (e.target as any).src = "https://play-lh.googleusercontent.com/I-Y9S_E9k_939Xf-SfsatC8S__288jSnt6yM9VvC7s927H6mX_Yf88F-Lp7H1mX_30E"; }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Wave Sénégal</div>
            <div style={{ fontSize: 11, color: T.muted }}>0% de frais de transaction</div>
          </div>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${method === 'wave' ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {method === 'wave' && <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.green }}></div>}
          </div>
        </div>

        <div 
          onClick={() => setMethod("orange")}
          style={{ 
            padding: 16, borderRadius: 20, background: T.card, border: `2px solid ${method === 'orange' ? T.green : T.border}`,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 16, transition: "all .2s"
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Orange_logo.svg/1024px-Orange_logo.svg.png" style={{ width: "100%" }} alt="Orange" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Orange Money</div>
            <div style={{ fontSize: 11, color: T.muted }}>Validation par code secret (#144#)</div>
          </div>
          <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${method === 'orange' ? T.green : T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {method === 'orange' && <div style={{ width: 12, height: 12, borderRadius: "50%", background: T.green }}></div>}
          </div>
        </div>
      </div>

      <button 
        disabled={loading}
        onClick={handlePay}
        style={{ 
          width: "100%", padding: "18px", borderRadius: 18, background: T.green, border: "none", 
          color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: `0 8px 16px ${T.green}30`,
          display: "flex", justifyContent: "center", alignItems: "center", gap: 10
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 18, height: 18, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} />
            Traitement...
          </>
        ) : `Payer via ${method === 'wave' ? 'Wave' : 'Orange Money'}`}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCER DETAIL
 ═══════════════════════════════════════════════════════════ */
function ProducerDetail({ producer, onBack, onSocial }: { producer: any, onBack: () => void, onSocial: (net: string) => void }) {
  const producerDeals = DEALS.filter(d => d.producteur === producer.nom);

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header Image/Emoji Area */}
      <div style={{ height: 200, background: `linear-gradient(135deg, ${T.surface}, ${T.bg})`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 40, left: 0, right: 0, display: "flex", justifyContent: "center", fontSize: 100 }}>
          {producer.photo}
        </div>
        <button 
          onClick={onBack}
          style={{ position: "absolute", top: 16, left: 16, width: 40, height: 40, borderRadius: 12, background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Profile Card */}
      <div style={{ marginTop: -40, padding: "0 16px", position: "relative" }}>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 28, padding: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: T.text, margin: 0 }}>{producer.nom}</h2>
                {producer.certifie && (
                  <div style={{ display: "flex", alignItems: "center", gap: 4, background: `${T.green}20`, padding: "2px 8px", borderRadius: 99 }}>
                    <CheckCircle size={14} color={T.green} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: T.green }}>VÉRIFIÉ</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.muted, fontSize: 13, marginTop: 4 }}>
                <MapPin size={14} /> {producer.localisation}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: T.gold, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                <Star size={16} fill={T.gold} color={T.gold} /> {producer.note}
              </div>
              <div style={{ fontSize: 10, color: T.muted }}>Ventes: {producer.nbVentes}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {producer.badges.map((b: string) => (
              <span key={b} style={{ background: `${T.green}15`, color: T.green, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8 }}>{b}</span>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, margin: 0 }}>Suivre le producteur</h3>
              <div style={{ fontSize: 11, color: T.green, fontWeight: 900 }}>DÉCOUVRIR LEURS RÉSEAUX</div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { id: "tiktok", icon: "📱", color: "#000" },
                { id: "facebook", icon: <Share2 size={16} />, color: "#1877F2" },
                { id: "whatsapp", icon: <MessageCircle size={16} />, color: "#25D366" },
                { id: "instagram", icon: <Heart size={16} />, color: "#E4405F" },
              ].map(soc => (
                <motion.button
                  key={soc.id}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onSocial(soc.id)}
                  style={{ width: 40, height: 40, borderRadius: 12, border: `1px solid ${T.border}`, background: T.surface, color: soc.color, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  {soc.icon}
                </motion.button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 8 }}>À propos</h3>
            <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.6, margin: 0 }}>{producer.desc}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <div style={{ padding: 12, background: T.surface, borderRadius: 16 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Sur BOLÉ JËND depuis</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{producer.anniversaire}</div>
            </div>
            <div style={{ padding: 12, background: T.surface, borderRadius: 16 }}>
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Délai moyen récolte</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>24 - 48h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Deals */}
      <div style={{ padding: "32px 16px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Deals en cours ({producerDeals.length})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {producerDeals.map(d => (
            <div 
              key={d.id}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 12, display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {d.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{d.nom}</div>
                <div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>{fmt(d.prixGroupe)} <span style={{ color: T.muted, textDecoration: "line-through", fontSize: 10, fontWeight: 400 }}>{fmt(d.prixSolo)}</span></div>
              </div>
              <button 
                onClick={() => { onBack(); /* navigation is handled by parent state */ }}
                style={{ padding: "8px 12px", borderRadius: 10, background: T.surface, border: `1px solid ${T.border}`, color: T.text, fontSize: 10, fontWeight: 800 }}
              >
                Voir
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRODUCER ONBOARDING & DASHBOARD
 ═══════════════════════════════════════════════════════════ */

function ProducerOnboarding({ onComplete, onCancel }: { onComplete: (data: any) => void, onCancel: () => void }) {
  const [step, setStep] = useState(1); // 1: Info, 2: OTP
  const [formData, setFormData] = useState({ nom: "", prenom: "", contact: "", bio: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234") {
      setLoading(true);
      setTimeout(() => {
        onComplete(formData);
      }, 1500);
    } else {
      alert("Code incorrect. Utilisez 1234 pour ce prototype.");
    }
  };

  return (
    <div style={{ padding: "40px 20px", minHeight: "100vh", background: T.bg }}>
      <button onClick={onCancel} style={{ background: "none", border: "none", color: T.text, marginBottom: 24, display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
        <ArrowLeft size={20} /> Retour
      </button>

      {step === 1 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${T.green}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Users size={32} color={T.green} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 12 }}>Devenez un producteur certifié</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 32, lineHeight: 1.6 }}>
            Rejoignez BOLÉ JËND et vendez vos produits directement aux consommateurs. Inscription simple et rapide.
          </p>

          <form onSubmit={handleInfoSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input 
                required placeholder="Prénom" 
                value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})}
                style={{ background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, fontSize: 14, outline: "none" }} 
              />
              <input 
                required placeholder="Nom" 
                value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})}
                style={{ background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, fontSize: 14, outline: "none" }} 
              />
            </div>
            <input 
              required placeholder="Email ou N° de Téléphone" 
              value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}
              style={{ background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, fontSize: 14, outline: "none" }} 
            />
            <textarea 
              placeholder="Décrivez brièvement votre exploitation..." 
              value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})}
              style={{ background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, fontSize: 14, outline: "none", height: 100, resize: "none" }} 
            />
            <button 
              type="submit" disabled={loading}
              style={{ width: "100%", padding: 18, borderRadius: 18, background: T.green, color: "#fff", border: "none", fontSize: 15, fontWeight: 900, marginTop: 12, cursor: "pointer", display: "flex", justifyContent: "center" }}
            >
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 20, height: 20, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} /> : "Recevoir mon code de confirmation"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: `${T.blue}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <Award size={32} color={T.blue} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 12 }}>Vérification de sécurité</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 32, lineHeight: 1.6 }}>
            Un code de confirmation a été envoyé à <strong>{formData.contact}</strong>. Veuillez le saisir ci-dessous.
          </p>

          <form onSubmit={handleOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <input 
              required placeholder="Code à 4 chiffres" 
              maxLength={4} value={otp} onChange={e => setOtp(e.target.value)}
              style={{ background: T.card, border: `2px solid ${T.green}`, padding: 18, borderRadius: 18, color: T.text, fontSize: 24, fontWeight: 900, textAlign: "center", letterSpacing: 8, outline: "none" }} 
            />
            <p style={{ fontSize: 12, color: T.muted, textAlign: "center" }}>Vous n'avez pas reçu le code ? <span style={{ color: T.green, fontWeight: 700, cursor: "pointer" }}>Renvoyer</span></p>
            <button 
              type="submit" disabled={loading}
              style={{ width: "100%", padding: 18, borderRadius: 18, background: T.green, color: "#fff", border: "none", fontSize: 15, fontWeight: 900, marginTop: 12, cursor: "pointer", display: "flex", justifyContent: "center" }}
            >
              {loading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 20, height: 20, border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%" }} /> : "Confirmer mon identité"}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}

function AddProductForm({ onAdd, onCancel }: { onAdd: (deal: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    nom: "",
    prixSolo: "",
    prixGroupe: "",
    cat: CATS[1],
    emoji: "📦",
    stock: "100",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDeal = {
      id: Date.now(),
      nom: formData.nom,
      producteur: "Ma Ferme (Moi)",
      localite: "Local",
      emoji: formData.emoji,
      prixSolo: parseInt(formData.prixSolo),
      prixGroupe: parseInt(formData.prixGroupe),
      qteMin: 3,
      prog: 0,
      expireIn: 86400,
      note: 5.0,
      cat: formData.cat,
      stock: parseInt(formData.stock)
    };
    onAdd(newDeal);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 3000, overflowY: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text, margin: 0 }}>Nouveau Deal</h2>
        <button onClick={onCancel} style={{ background: T.surface, border: "none", color: T.text, width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><Plus size={20} style={{ rotate: "45deg" }}/></button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, display: "block" }}>Nom du produit / Deal</label>
          <input required value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, outline: "none" }} placeholder="ex: Panier de Fraises Bio" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, display: "block" }}>Prix Solo (FCFA)</label>
            <input required type="number" value={formData.prixSolo} onChange={e => setFormData({...formData, prixSolo: e.target.value})} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, outline: "none" }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, display: "block" }}>Prix Groupe (FCFA)</label>
            <input required type="number" value={formData.prixGroupe} onChange={e => setFormData({...formData, prixGroupe: e.target.value})} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, outline: "none" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, display: "block" }}>Catégorie</label>
            <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, outline: "none" }}>
              {CATS.filter(c => c !== "Tous").map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 800, color: T.muted, marginBottom: 8, display: "block" }}>Emoji / Icône</label>
            <input value={formData.emoji} onChange={e => setFormData({...formData, emoji: e.target.value})} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, padding: 14, borderRadius: 14, color: T.text, outline: "none" }} />
          </div>
        </div>

        <button type="submit" style={{ width: "100%", padding: 18, borderRadius: 18, background: T.green, color: "#fff", border: "none", fontSize: 15, fontWeight: 900, marginTop: 12, cursor: "pointer" }}>Publier mon deal</button>
      </form>
    </div>
  );
}

function ProducerDashboard({ producerData, deals, onAddProduct, onExit, onSocial }: { producerData: any, deals: any[], onAddProduct: () => void, onExit: () => void, onSocial: (net: string) => void }) {
  const myDeals = deals.filter(d => d.producteur === "Ma Ferme (Moi)");
  
  return (
    <div style={{ minHeight: "100vh", background: T.bg, paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ padding: "40px 20px 20px", background: `linear-gradient(135deg, ${T.card}, ${T.surface})`, borderBottom: `1px solid ${T.border}`, borderRadius: "0 0 32px 32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
           <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: T.green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>👨‍🌾</div>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: T.text, margin: 0 }}>Bonjour, {producerData.prenom}</h2>
                <div style={{ fontSize: 11, color: T.green, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={10} /> Producteur Certifié</div>
              </div>
           </div>
           <button onClick={onExit} style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.text, fontSize: 10, fontWeight: 800, padding: "8px 12px", borderRadius: 10 }}>Mode Acheteur</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 20 }}>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" }}>Ventes totales</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text, marginTop: 4 }}>45.000 F</div>
          </div>
          <div style={{ padding: 16, background: "rgba(255,255,255,0.03)", border: `1px solid ${T.border}`, borderRadius: 20 }}>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase" }}>Deals Actifs</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: T.text, marginTop: 4 }}>{myDeals.length}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, margin: 0 }}>Mes Produits</h3>
            <button onClick={onAddProduct} style={{ background: T.green, border: "none", color: "#fff", fontSize: 11, fontWeight: 800, padding: "8px 16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Plus size={14} /> Publier
            </button>
         </div>

         {myDeals.length === 0 ? (
           <div style={{ padding: "40px 20px", textAlign: "center", background: T.card, border: `1px dashed ${T.border}`, borderRadius: 24 }}>
              <Package size={48} color={T.muted} style={{ marginBottom: 16, opacity: 0.3 }} />
              <div style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 4 }}>Aucun produit en vente</div>
              <div style={{ fontSize: 11, color: T.muted }}>Commencez par publier votre premier deal !</div>
           </div>
         ) : (
           <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {myDeals.map(d => (
                <div key={d.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{d.emoji}</div>
                  <div style={{ flex: 1 }}>
                     <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{d.nom}</div>
                     <div style={{ fontSize: 11, color: T.green, fontWeight: 700 }}>{fmt(d.prixGroupe)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                     <div style={{ fontSize: 10, color: T.muted }}>Participants</div>
                     <div style={{ fontSize: 12, fontWeight: 900, color: T.text }}>{d.prog}%</div>
                  </div>
                </div>
              ))}
           </div>
         )}

         <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, marginBottom: 16 }}>Ma Présence Sociale</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
               {[
                 { id: "tiktok", icon: "📱", color: "#000", label: "TikTok" },
                 { id: "facebook", icon: <Share2 size={16} />, color: "#1877F2", label: "Facebook" },
                 { id: "whatsapp", icon: <MessageCircle size={16} />, color: "#25D366", label: "WhatsApp" },
                 { id: "instagram", icon: <Heart size={16} />, color: "#E4405F", label: "Instagram" },
               ].map(soc => (
                 <div key={soc.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }} onClick={() => onSocial(soc.id)}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, border: `1px solid ${T.border}`, background: T.card, color: soc.color, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                       {soc.icon}
                       <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%", background: T.green, border: `2px solid ${T.bg}`, display: "flex", alignItems: "center", justifyContent: "center" }}><CheckCircle size={8} color="#fff" /></div>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: T.muted }}>{soc.label}</span>
                 </div>
               ))}
            </div>
            <button style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 12, border: `1px dashed ${T.border}`, background: "none", color: T.muted, fontSize: 11, fontWeight: 700 }}>
              + Lier un nouveau compte
            </button>
         </div>

         <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, marginBottom: 16 }}>Commandes à préparer</h3>
            <div style={{ padding: "40px 20px", textAlign: "center", background: T.card, border: `1px solid ${T.border}`, borderRadius: 24 }}>
               <div style={{ fontSize: 11, color: T.muted }}>Les commandes apparaîtront ici quand un groupe sera complet.</div>
            </div>
         </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SOCIAL MEDIA PAGES (MOCKUPS)
 ═══════════════════════════════════════════════════════════ */
function SocialPage({ network, onBack }: { network: any, onBack: () => void }) {
  const networks: Record<string, any> = {
    tiktok: { name: "TikTok", color: "#000000", icon: "📱", handle: "@bole_jend", followers: "125K" },
    facebook: { name: "Facebook", color: "#1877F2", icon: <motion.div><Share2 size={24} /></motion.div>, handle: "Bole Jënd Sénégal", followers: "45K" },
    whatsapp: { name: "WhatsApp", color: "#25D366", icon: <MessageCircle size={24} />, handle: "Communauté BOLÉ JËND", followers: "12 Groupes" },
    twitter: { name: "X (Twitter)", color: "#000000", icon: "𝕏", handle: "@BoleJend", followers: "18K" },
    instagram: { name: "Instagram", color: "#E4405F", icon: <motion.div><Heart size={24} /></motion.div>, handle: "@bolejend_officiel", followers: "56K" },
    youtube: { name: "YouTube", color: "#FF0000", icon: "▶️", handle: "BOLÉ JËND TV", followers: "32K" },
    linkedin: { name: "LinkedIn", color: "#0A66C2", icon: "💼", handle: "BOLÉ JËND", followers: "10K" },
  };

  const net = networks[network] || networks.facebook;

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 4000, display: "flex", flexDirection: "column" }}
    >
      <div style={{ padding: "20px 16px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 16 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: T.text, cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ fontSize: 18, fontWeight: 900, color: T.text }}>BOLÉ JËND sur {net.name}</div>
      </div>

      <div style={{ flex: 1, padding: 20, textAlign: "center" }}>
        <div style={{ width: 120, height: 120, borderRadius: 32, background: net.color, margin: "40px auto 24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: "#fff", boxShadow: `0 20px 40px ${net.color}40` }}>
          {net.icon}
        </div>
        
        <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, margin: 0 }}>{net.handle}</h2>
        <div style={{ fontSize: 16, color: T.muted, marginTop: 8 }}>{net.followers} abonnés</div>

        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ height: 150, background: T.card, borderRadius: 24, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted2 }}>
            [ Mockup : Fil d'actualité {net.name} ]
          </div>
          <div style={{ height: 150, background: T.card, borderRadius: 24, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: T.muted2 }}>
            [ Dernières vidéos & promos ]
          </div>
        </div>

        <button 
          onClick={() => window.open("#", "_blank")}
          style={{ width: "100%", marginTop: 40, padding: 18, borderRadius: 18, background: net.color, color: "#fff", border: "none", fontSize: 16, fontWeight: 900, cursor: "pointer" }}
        >
          S'abonner sur {net.name}
        </button>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [page,         setPage]         = useState("home");
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [selectedProducer, setSelectedProducer] = useState<any>(null);
  const [selectedSocialPage, setSelectedSocialPage] = useState<string | null>(null);
  const [cart,         setCart]         = useState<any[]>([]);
  const [groups,       setGroups]       = useState<any[]>(MES_GROUPES);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [paymentInfo,  setPaymentInfo]  = useState<any>(null);
  const [favorites,    setFavorites]    = useState<number[]>([]);
  const [showWelcome,  setShowWelcome]  = useState(false);
  const [notifications, setNotifications] = useState(NOTIF_DATA);
  const [notifSettings, setNotifSettings] = useState({
    groupFilled: true,
    newDeals: true,
    newDealsCategories: ["Légumes", "Céréales", "Huiles", "Fruits Locaux", "Produits Mer", "Boissons", "Snacks"],
    reminders: true,
    soundEnabled: true
  });
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const [globalSuccessOverlay, setGlobalSuccessOverlay] = useState<React.ReactNode | null>(null);
  
  // Producer States
  const [isProducerMode, setIsProducerMode] = useState(false);
  const [isProducerVerified, setIsProducerVerified] = useState(false);
  const [producerData, setProducerData] = useState<any>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [producerOrders, setProducerOrders] = useState<any[]>([]);

  // Clear success overlay when page changes
  useEffect(() => {
    setGlobalSuccessOverlay(null);
  }, [page]);

  // Notification Service
  const playNotifSound = () => {
    if (!notifSettings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  const notify = (title: string, body: string, isError = false) => {
    playNotifSound();
    // 1. In-app notification
    const id = Date.now();
    setNotifications(prev => [{
      id,
      type: isError ? "error" : "alert",
      title,
      content: body,
      time: "Maintenant",
      read: false
    }, ...prev]);

    if (isError) {
      setGlobalError(`${title}: ${body}`);
      setTimeout(() => setGlobalError(null), 4000);
    }

    // 2. Native Browser Notification
    if (!isError && "Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: "/favicon.ico" });
    }
  };

  const loadDeals = async () => {
    setIsLoadingDeals(true);
    setGlobalError(null);
    try {
      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.05) resolve(true); // 95% success
          else reject(new Error("Erreur de synchronisation avec le serveur."));
        }, 1200);
      });
      setIsLoadingDeals(false);
    } catch (err: any) {
      setIsLoadingDeals(false);
      setGlobalError(err.message);
    }
  };

  const requestNotifPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        notify("Notifications Activées !", "Vous recevrez désormais les alertes de BOLÉ JËND.");
      }
    }
  };

  useEffect(() => {
    loadDeals();
    // Show welcome message on first load
    setShowWelcome(true);
    const welcomeTimer = setTimeout(() => setShowWelcome(false), 5000);
    
    return () => {
      clearTimeout(welcomeTimer);
    };
  }, []);

  // Simulation of incoming notifications based on settings
  useEffect(() => {
    const newDealTimer = setTimeout(() => {
      if (notifSettings.newDeals && notifSettings.newDealsCategories.includes("Légumes")) {
        notify("🔥 Nouveau Deal !", "Le Gombo de Sangalkam est disponible à -40% ! (Légumes)");
      }
    }, 15000);

    return () => clearTimeout(newDealTimer);
  }, [notifSettings.newDeals, notifSettings.newDealsCategories]);

  const timers = useTimers(DEALS);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleJoin = (deal: any, qte: number, hub: any) => {
    // If target reached, go to payment
    if (deal.membres + 1 >= deal.target) {
      if (notifSettings.groupFilled) {
        notify("🎉 Groupe Complété !", `Le groupe pour ${deal.nom} est maintenant complet. Économies validées !`);
      }
      setPaymentInfo({ deal, qte, hub });
      setPage("payment");
      setSelectedDeal(null);
    } else {
      // Normal join
      notify("🤝 Inscription réussie", `Vous avez rejoint le groupe pour ${deal.nom}.`);
      const newG = {
        id: Date.now(),
        deal: deal,
        membres: deal.membres + 1,
        target: deal.target,
        expireIn: timers[deal.id] || deal.expireIn,
        statut: "ouvert",
        montant: deal.prixGroupe * qte,
        role: "membre",
        hub: hub || HUBS[0],
        paymentMethod: "wave" // Default or selected
      };
      setGroups([newG, ...groups]);
      setPage("commandes");
      setSelectedDeal(null);
    }
  };

  const confirmPayment = (method: string) => {
    const { deal, qte } = paymentInfo;
    const hub = HUBS[Math.floor(Math.random() * HUBS.length)];
    
    notify("✅ Paiement Confirmé", `Votre commande de ${deal.nom} est validée.`);
    
    const newG = {
      id: Date.now(),
      deal: deal,
      membres: deal.target,
      target: deal.target,
      expireIn: 0,
      statut: "complet",
      montant: deal.prixGroupe * qte,
      role: "membre",
      paymentMethod: method,
      hub: hub
    };
    
    setGroups([newG, ...groups]);
    setPaymentInfo(null);
    
    // Show success overlay instead of alert
    const SuccessOverlay = () => (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      >
        <motion.div 
          initial={{ scale: 0.8, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 32, padding: 32, width: "100%", maxWidth: 360, textAlign: "center" }}
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
            style={{ width: 80, height: 80, borderRadius: "50%", background: T.green, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 0 30px ${T.green}40` }}
          >
            <Check size={40} color="#fff" />
          </motion.div>
          
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 8 }}>Paiement Réussi !</h2>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 24 }}>Votre commande groupée pour <b>{deal.nom}</b> est confirmée.</p>
          
          <div style={{ background: T.surface, borderRadius: 20, padding: 16, marginBottom: 24, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, borderBottom: `1px solid ${T.border}`, paddingBottom: 12 }}>
              <span style={{ fontSize: 12, color: T.muted }}>Méthode</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {method === 'wave' ? (
                   <img src="https://play-lh.googleusercontent.com/I-Y9S_E9k_939Xf-SfsatC8S__288jSnt6yM9VvC7s927H6mX_Yf88F-Lp7H1mX_30E" style={{ width: 16, height: 16, borderRadius: 4 }} alt="Wave" />
                ) : (
                   <div style={{ width: 16, height: 16, borderRadius: 4, background: "#FF7900", fontSize: 8, fontWeight: 900, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>OM</div>
                )}
                <span style={{ fontSize: 13, fontWeight: 800 }}>{method === 'wave' ? 'Wave Senegal' : 'Orange Money'}</span>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: T.muted }}>Point de relais</span>
              <span style={{ fontSize: 13, fontWeight: 800, textAlign: "right" }}>{hub.nom}</span>
            </div>
          </div>
          
          <button 
            onClick={() => setPage("commandes")}
            style={{ width: "100%", padding: "16px", borderRadius: 16, background: T.green, border: "none", color: "#fff", fontWeight: 900, cursor: "pointer" }}
          >
            Ma progression
          </button>
        </motion.div>
      </motion.div>
    );

    // Using state to show overlay
    setGlobalSuccessOverlay(<SuccessOverlay />);
  };

  const rootStyle: any = {
    minHeight: "100vh",
    background: T.bg,
    maxWidth: 768,
    margin: "0 auto",
    position: "relative",
    fontFamily: "system-ui,sans-serif",
    color: T.text,
  };

  const [allDeals, setAllDeals] = useState<any[]>(DEALS);

  const handleAddProduct = (newDeal: any) => {
    setAllDeals(prev => [newDeal, ...prev]);
    setShowAddProduct(false);
    notify("Succès", "Votre produit est maintenant en ligne !");
  };

  const handleProducerComplete = (data: any) => {
    setProducerData(data);
    setIsProducerVerified(true);
    notify("Félicitations", "Votre compte producteur est maintenant actif.");
  };

  if (isProducerMode) {
    if (!isProducerVerified) {
       return <div style={rootStyle}><ProducerOnboarding onComplete={handleProducerComplete} onCancel={() => setIsProducerMode(false)} /></div>;
    }
    return (
      <div style={rootStyle}>
        <ProducerDashboard 
          producerData={producerData} 
          deals={allDeals} 
          onAddProduct={() => setShowAddProduct(true)}
          onExit={() => setIsProducerMode(false)} 
          onSocial={setSelectedSocialPage}
        />
        {showAddProduct && <AddProductForm onAdd={handleAddProduct} onCancel={() => setShowAddProduct(false)} />}
      </div>
    );
  }

  if (showNotifs) return <div style={rootStyle}><NotificationPanel onBack={() => setShowNotifs(false)} notifications={notifications} /></div>;
  if (page === "payment" && paymentInfo) return <div style={rootStyle}><PaymentScreen dealName={paymentInfo.deal.nom} amount={paymentInfo.deal.prixGroupe * paymentInfo.qte} hubNom={paymentInfo.hub?.nom} onConfirm={confirmPayment} onCancel={() => setPage("home")} /></div>;
  if (selectedProducer) return <div style={rootStyle}><ProducerDetail producer={selectedProducer} onBack={() => setSelectedProducer(null)} onSocial={setSelectedSocialPage} /></div>;
  if (selectedDeal) return <div style={rootStyle}><DealDetail deal={selectedDeal} timer={timers[selectedDeal.id]} onBack={() => setSelectedDeal(null)} onJoin={handleJoin} isFavorite={favorites.includes(selectedDeal.id)} onToggleFavorite={toggleFavorite} onDeal={setSelectedDeal} deals={allDeals} onShowProducer={(pName: string) => {
    const p = PRODUCERS.find(x => x.nom === pName) || PRODUCERS[0];
    setSelectedProducer(p);
  }} /></div>;

  return (
    <div style={rootStyle}>
      <AnimatePresence>
        {selectedSocialPage && <SocialPage network={selectedSocialPage} onBack={() => setSelectedSocialPage(null)} />}
      </AnimatePresence>

      <AnimatePresence>
        {globalSuccessOverlay}
      </AnimatePresence>

      <AnimatePresence>
        {isLoadingDeals && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: T.bg, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 20
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: 40, height: 40, border: `4px solid ${T.green}30`, borderTopColor: T.green, borderRadius: "50%" }}
            />
            <div style={{ color: T.text, fontWeight: 700 }}>Chargement de BOLÉ JËND...</div>
          </motion.div>
        )}

        {globalError && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            style={{
              position: "fixed", bottom: 100, left: 16, right: 16, zIndex: 1100,
              background: T.red, color: "#fff", padding: "12px 16px", borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)", display: "flex", gap: 12, alignItems: "center"
            }}
          >
            <div style={{ fontSize: 20 }}>🛑</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13 }}>Erreur</div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>{globalError}</div>
            </div>
            {isLoadingDeals === false && (
              <button 
                onClick={loadDeals}
                style={{ background: "#fff", border: "none", borderRadius: 8, padding: "6px 10px", color: T.red, fontSize: 10, fontWeight: 800, cursor: "pointer" }}
              >Réessayer</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 12, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            onClick={() => setShowWelcome(false)}
            style={{
              position: "fixed",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              width: "85%",
              maxWidth: 280,
              background: `linear-gradient(135deg, ${T.green}, ${T.greenMd})`,
              padding: "8px 12px",
              borderRadius: 16,
              color: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            <div style={{ fontSize: 18 }}>👋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 900, fontSize: 11 }}>Bienvenue sur BOLÉ JËND !</div>
              <div style={{ fontSize: 10, opacity: 0.9, fontWeight: 500 }}>Économisez ensemble dès maintenant.</div>
            </div>
            <X size={14} />
          </motion.div>
        )}
      </AnimatePresence>
      {page === "home" && <HomeScreen timers={timers} onDeal={setSelectedDeal} onShowNotifs={() => setShowNotifs(true)} cart={cart} setPage={setPage} notifications={notifications} deals={allDeals} />}
      {page === "admin" && <Admin />}
      {page === "profil" && (
        <div style={{ padding: "16px 16px 120px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>
              👤
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: T.text, margin: 0 }}>Mon Profil</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 4, color: T.muted, fontSize: 13, marginTop: 4 }}>
                <MapPin size={14} /> Yoff Centre, Dakar
              </div>
            </div>
          </div>

          {/* Savings visualization */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: T.green, textTransform: "uppercase", letterSpacing: 1 }}>Mes économies totales</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: T.text, marginTop: 4 }}>{fmt(15300)}</div>
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingUp size={20} color={T.green} />
              </div>
            </div>

            <div style={{ height: 180, width: "100%", marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={USER_SAVINGS_HISTORY}>
                  <defs>
                    <linearGradient id="userEco" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.green} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="p" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 11 }}
                    itemStyle={{ color: T.green }}
                    labelStyle={{ color: T.muted, marginBottom: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="eco"
                    stroke={T.green}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#userEco)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
              <div>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Dernier mois</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.green }}>+2 900 F</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: T.muted, marginBottom: 4 }}>Moy. par achat</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: T.text }}>850 F</div>
              </div>
            </div>
          </div>

          {/* WagPoints & Referral */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
             {/* Loyalty Points */}
             <div style={{ background: `linear-gradient(135deg, ${T.card}, ${T.card2})`, border: `1px solid ${T.border}`, borderRadius: 24, padding: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.gold}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Award size={18} color={T.gold} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase" }}>WagPoints</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: T.gold, marginTop: 2 }}>1,240</div>
                <div style={{ fontSize: 9, color: T.muted, marginTop: 4 }}>= 1,240 F de réduction</div>
             </div>

             {/* Referral Code */}
             <div style={{ background: `linear-gradient(135deg, ${T.card}, ${T.card2})`, border: `1px solid ${T.border}`, borderRadius: 24, padding: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${T.blue}20`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Share2 size={18} color={T.blue} />
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: T.muted, textTransform: "uppercase" }}>Parrainage</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: T.text }}>BOLE-XP42</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText("BOLE-XP42");
                      setGlobalSuccessOverlay(
                        <motion.div 
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 2000, background: T.green, color: "#fff", padding: "12px 24px", borderRadius: 16, fontWeight: 800, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}
                        >
                          Code parrainage copié !
                        </motion.div>
                      );
                      setTimeout(() => setGlobalSuccessOverlay(null), 2000);
                    }}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: T.blue }}
                  >
                    <Plus size={14} style={{ rotate: "45deg" }} />
                  </button>
                </div>
                <div style={{ fontSize: 9, color: T.blue, fontWeight: 700, marginTop: 4 }}>Gagnez 500 F / ami</div>
             </div>
          </div>

          {!isProducerVerified && (
            <div 
              onClick={() => setIsProducerMode(true)}
              style={{ background: `linear-gradient(135deg, ${T.green}, ${T.greenMd})`, borderRadius: 24, padding: 20, marginBottom: 16, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: "#fff", margin: 0 }}>Vendre mes produits</h3>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Rejoignez notre réseau de producteurs locaux</div>
                </div>
                <ChevronRight size={20} color="#fff" />
              </div>
            </div>
          )}

          {isProducerVerified && (
            <div 
              onClick={() => setIsProducerMode(true)}
              style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16, cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.green}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Package size={24} color={T.green} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: T.text, margin: 0 }}>Tableau de bord Producteur</h3>
                  <div style={{ fontSize: 11, color: T.muted }}>Gérer mes ventes et mes deals</div>
                </div>
                <ChevronRight size={20} color={T.muted} />
              </div>
            </div>
          )}

          {/* Mes Commandes */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.gold}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={18} color={T.gold} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: T.text, margin: 0 }}>Mes Commandes</h3>
                <div style={{ fontSize: 10, color: T.muted }}>Suivi de vos achats récents</div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MES_COMMANDES.map((c, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: idx === MES_COMMANDES.length - 1 ? "none" : `1px solid ${T.border}50` }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.text }}>{c.deal.nom}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{c.date} • {c.montant.toLocaleString()} FCFA</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: c.statut === "en cours" || c.statut === "en transit" ? T.blue : T.green, background: `${c.statut === "en cours" || c.statut === "en transit" ? T.blue : T.green}15`, padding: "2px 8px", borderRadius: 6 }}>
                      {c.statut}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button style={{ width: "100%", marginTop: 16, padding: "12px", borderRadius: 14, background: T.surface, color: T.text, border: `1px solid ${T.border}`, fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
              Voir tout l'historique
            </button>
          </div>

          {/* Impact Communautaire */}
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${T.green}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Users size={18} color={T.green} />
              </div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 900, color: T.text, margin: 0 }}>Impact Communautaire</h3>
                <div style={{ fontSize: 10, color: T.muted }}>Économies via achats groupés (6 mois)</div>
              </div>
            </div>

            <div style={{ height: 160, width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={USER_COMMUNITY_IMPACT}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false} />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: T.muted }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: T.border, opacity: 0.1 }}
                    contentStyle={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 11 }}
                  />
                  <Bar dataKey="eco" fill={T.green} radius={[4, 4, 0, 0]} name="Économies" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ marginTop: 12, padding: "10px 14px", background: `${T.green}05`, borderRadius: 12, border: `1px solid ${T.green}15` }}>
              <div style={{ fontSize: 11, color: T.text, lineHeight: 1.4 }}>
                <span style={{ color: T.green, fontWeight: 800 }}>Merveilleux !</span> Vos participations ont permis à la communauté d'économiser ensemble.
              </div>
            </div>
          </div>

          {/* Mes favoris */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Heart size={18} fill={T.red} color={T.red} /> Mes favoris
            </div>
            {favorites.length === 0 ? (
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 24, textAlign: "center" }}>
                <p style={{ fontSize: 13, color: T.muted, margin: 0 }}>Aucun favori pour le moment.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {favorites.map(fid => {
                  const d = DEALS.find(x => x.id === fid);
                  if (!d) return null;
                  return (
                    <div 
                      key={fid}
                      onClick={() => { setSelectedDeal(d); setPage("home"); window.scrollTo(0, 0); }}
                      style={{ 
                        background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, 
                        padding: 12, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" 
                      }}
                    >
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                        {d.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{d.nom}</div>
                        <div style={{ fontSize: 11, color: T.muted }}>{d.producteur}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: T.green }}>{fmt(d.prixGroupe)}</div>
                        <div style={{ fontSize: 10, color: T.muted }}>Prix groupé</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Mes Commandes Passées */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: T.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={18} color={T.blue} /> Mes Commandes Passées
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {MES_COMMANDES.map(cmd => (
                <div key={cmd.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: T.muted }}>#{cmd.id}</div>
                    <div style={{ 
                      fontSize: 9, fontWeight: 900, padding: "3px 8px", borderRadius: 6,
                      background: cmd.statut === 'livrée' ? `${T.green}20` : `${T.blue}20`,
                      color: cmd.statut === 'livrée' ? T.green : T.blue,
                      textTransform: "uppercase"
                    }}>{cmd.statut}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: T.surface, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {cmd.deal.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{cmd.deal.nom}</div>
                      <div style={{ fontSize: 11, color: T.muted }}>{cmd.date} • {cmd.qte} {cmd.deal.unite}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: T.text }}>{fmt(cmd.montant)}</div>
                    </div>
                  </div>
                  <button 
                    style={{ 
                      marginTop: 12, width: "100%", padding: "10px", borderRadius: 12, 
                      background: T.surface, border: `1px solid ${T.border}`, 
                      color: T.text, fontSize: 11, fontWeight: 800, 
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" 
                    }}
                  >
                    <FileText size={14} /> Voir détails et reçu
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={18} color={T.green} /> Paramètres de Notifications
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "groupFilled", label: "Groupes complétés", desc: "Soyez alerté quand un de vos groupes est plein." },
                { key: "newDeals", label: "Nouveaux deals", desc: "Alertes sur les produits de vos catégories favorites." },
                { key: "reminders", label: "Rappels d'expiration", desc: "Dernière chance avant la fin d'un deal." },
                { key: "soundEnabled", label: "Alertes sonores", desc: "Jouer un son à chaque nouvelle notification." }
              ].map((item) => (
                <div key={item.key}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{item.label}</div>
                      <div style={{ fontSize: 10, color: T.muted }}>{item.desc}</div>
                    </div>
                    <button 
                      onClick={() => {
                        setNotifSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifSettings] }));
                        if (!("Notification" in window) || Notification.permission !== "granted") {
                          requestNotifPermission();
                        }
                      }}
                      style={{ 
                        width: 44, height: 24, borderRadius: 12, 
                        background: notifSettings[item.key as keyof typeof notifSettings] ? T.green : T.surface,
                        border: `1px solid ${T.border}`, position: "relative", cursor: "pointer", transition: "0.3s"
                      }}
                    >
                      <div style={{ 
                        width: 18, height: 18, borderRadius: "50%", background: "#fff", 
                        position: "absolute", top: 2, left: notifSettings[item.key as keyof typeof notifSettings] ? 22 : 2,
                        transition: "0.3s", boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                      }} />
                    </button>
                  </div>

                  {item.key === "newDeals" && notifSettings.newDeals && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      style={{ overflow: "hidden", marginTop: 12, paddingLeft: 12, borderLeft: `2px solid ${T.border}` }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 700, color: T.muted, marginBottom: 8 }}>CATÉGORIES SUIVIES</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {["Légumes", "Céréales", "Huiles", "Fruits Locaux", "Produits Mer", "Boissons", "Snacks"].map(cat => {
                          const active = notifSettings.newDealsCategories.includes(cat);
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setNotifSettings(prev => ({
                                  ...prev,
                                  newDealsCategories: active 
                                    ? prev.newDealsCategories.filter(c => c !== cat)
                                    : [...prev.newDealsCategories, cat]
                                }));
                              }}
                              style={{ 
                                padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                                background: active ? `${T.green}20` : T.surface,
                                border: `1px solid ${active ? T.green : T.border}`,
                                color: active ? T.green : T.muted, cursor: "pointer"
                              }}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={requestNotifPermission}
              style={{ 
                marginTop: 20, width: "100%", padding: "12px", borderRadius: 14,
                background: T.surface, border: `1px solid ${T.border}`,
                color: T.green, fontSize: 12, fontWeight: 800, cursor: "pointer"
              }}
            >
              Tester l'autorisation Browser
            </button>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 20, marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: T.text, marginBottom: 16 }}>Suivez-nous sur les réseaux</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { id: "tiktok", icon: "📱", label: "TikTok", color: "#000" },
                { id: "facebook", icon: <Share2 size={18} />, label: "Facebook", color: "#1877F2" },
                { id: "whatsapp", icon: <MessageCircle size={18} />, label: "WhatsApp", color: "#25D366" },
                { id: "twitter", icon: "𝕏", label: "X", color: "#000" },
                { id: "instagram", icon: <Heart size={18} />, label: "Insta", color: "#E4405F" },
                { id: "youtube", icon: "▶️", label: "YouTube", color: "#FF0000" },
                { id: "linkedin", icon: "💼", label: "LinkedIn", color: "#0A66C2" },
              ].map(soc => (
                <div 
                  key={soc.id}
                  onClick={() => setSelectedSocialPage(soc.id)}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${soc.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: soc.color }}>
                    {soc.icon}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: T.muted }}>{soc.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, overflow: "hidden" }}>
             {[
               { icon: Settings, label: "Paramètres du compte" },
               { icon: Bell, label: "Préférences notifications" },
               { icon: HelpCircle, label: "Aide & Support" },
               { icon: AlertCircle, label: "Réclamation", color: T.gold },
               { icon: LogOut, label: "Se déconnecter", color: T.red },
             ].map((item, i, arr) => (
               <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: i < arr.length - 1 ? `1px solid ${T.border}` : "none", cursor: "pointer" }}>
                 <item.icon size={18} color={item.color || T.muted} />
                 <span style={{ fontSize: 14, fontWeight: 600, color: item.color || T.text }}>{item.label}</span>
                 <ChevronRight size={16} color={T.muted} style={{ marginLeft: "auto" }} />
               </div>
             ))}
          </div>
        </div>
      ) }
      {page === "commandes" && (
        <div style={{ padding: "16px 16px 120px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.text, marginBottom: 20 }}>Mes Achats Groupés</h2>
          
          {groups.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🛒</div>
              <p style={{ color: T.muted, fontSize: 14 }}>Vous n'avez pas encore rejoint de groupe d'achat.</p>
              <button onClick={() => setPage("home")} style={{ marginTop: 20, padding: "12px 24px", borderRadius: 12, background: T.green, color: "#fff", border: "none", fontWeight: 700 }}>Découvrir les deals</button>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {groups.map((g) => (
              <div key={g.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 24, padding: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: T.green, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 4 }}>
                    {g.statut === 'complet' ? (
                      <><CheckCircle size={12} /> COMMANDE VALIDÉE</>
                    ) : (
                      <><Clock size={12} /> EN ATTENTE DE MEMBRES</>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: T.muted }}>Réf: BJ-{g.id.toString().slice(-4)}</div>
                </div>
                
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: T.surface, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)" }}>
                    {g.deal.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: T.text }}>{g.deal.nom}</div>
                    <div style={{ fontSize: 12, color: T.muted, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <User size={12} /> {g.deal.producteur}
                    </div>
                  </div>
                  
                  {/* Payment Indicator Icon */}
                  <div style={{ alignSelf: "flex-start" }}>
                    {g.paymentMethod === 'wave' ? (
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1BA2FF", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                        <img src="https://play-lh.googleusercontent.com/I-Y9S_E9k_939Xf-SfsatC8S__288jSnt6yM9VvC7s927H6mX_Yf88F-Lp7H1mX_30E" style={{ width: "80%" }} alt="Wave" />
                      </div>
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FF7900", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 12 }}>
                        OM
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: T.surface, borderRadius: 16, padding: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div style={{ borderRight: `1px solid ${T.border}` }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: T.muted, textTransform: "uppercase" }}>Montant Payé</div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: T.green }}>{fmt(g.montant)}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: T.muted, textTransform: "uppercase" }}>Progression</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: T.text }}>{g.membres}/{g.target} <span style={{ fontSize: 10, fontWeight: 600 }}>membres</span></div>
                    <div style={{ width: "100%", height: 5, background: `${T.border}`, borderRadius: 10, marginTop: 6, overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (g.membres / g.target) * 100)}%` }}
                        style={{ height: "100%", background: T.green }} 
                      />
                    </div>
                  </div>
                </div>

                {/* Hub Information Section */}
                <div style={{ marginTop: 12, padding: "10px 12px", background: `${T.gold}10`, border: `1px solid ${T.gold}30`, borderRadius: 14, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: T.gold, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MapPin size={16} color="#fff" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: T.gold, textTransform: "uppercase" }}>Point de Relais (Hub)</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T.text }}>{g.hub?.nom || "Hub Yoff Centre"}</div>
                    <div style={{ fontSize: 10, color: T.muted }}>{g.hub?.adresse || "Dakar, Sénégal"}</div>
                  </div>
                </div>

                {g.statut === 'ouvert' && (
                  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: T.muted }}>
                      <span>Complétion du groupe</span>
                      <span>{Math.round((g.membres/g.target)*100)}%</span>
                    </div>
                    <div style={{ height: 6, width: "100%", background: T.border, borderRadius: 3, overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(g.membres/g.target)*100}%` }}
                        style={{ height: "100%", background: T.green }} 
                      />
                    </div>
                  </div>
                )}
                
                {g.statut === 'complet' && (
                  <button style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 12, background: T.surface, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <FileText size={14} /> Voir le reçu de paiement
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PARTNERS BANNER */}
      <div style={{ 
        width: "100%", 
        overflow: "hidden", 
        background: `${T.surface}80`, 
        borderTop: `1px solid ${T.border}`,
        padding: "16px 0",
        marginTop: 40
      }}>
        <div style={{ textAlign: "center", fontSize: 10, fontWeight: 800, color: T.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          Nos Partenaires de Confiance
        </div>
        <div style={{ display: "flex", width: "fit-content" }}>
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ display: "flex", gap: 60, paddingRight: 60, whiteSpace: "nowrap" }}
          >
            {["MASAE", "MCTN", "ANSD", "WAVE", "ORANGE MONEY", "UNCAS", "COOPPASEN", "CAC"].map((p, i) => (
              <span key={i} style={{ fontSize: 12, fontWeight: 900, color: T.muted, opacity: 0.6 }}>{p}</span>
            ))}
            {/* Duplicated for seamless loop */}
            {["MASAE", "MCTN", "ANSD", "WAVE", "ORANGE MONEY", "UNCAS", "COOPPASEN", "CAC"].map((p, i) => (
              <span key={`dup-${i}`} style={{ fontSize: 12, fontWeight: 900, color: T.muted, opacity: 0.6 }}>{p}</span>
            ))}
            {/* Third duplicate for extra width coverage */}
            {["MASAE", "MCTN", "ANSD", "WAVE", "ORANGE MONEY", "UNCAS", "COOPPASEN", "CAC"].map((p, i) => (
              <span key={`dup2-${i}`} style={{ fontSize: 12, fontWeight: 900, color: T.muted, opacity: 0.6 }}>{p}</span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ 
        padding: "40px 16px 140px", textAlign: "center", borderTop: `1px solid ${T.border}`,
        background: `${T.surface}50`
      }}>
        <div style={{ fontSize: 18, fontWeight: 900, color: T.text, marginBottom: 8, letterSpacing: 0.5 }}>BOLÉ JËND</div>
        <div style={{ fontSize: 11, color: T.muted, marginBottom: 24 }}>L'Union Fait Le Prix • Consommez Local</div>
        
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 24 }}>
          {["Aide", "Confidentialité", "Conditions", "Contact"].map(link => (
            <span key={link} style={{ fontSize: 11, color: T.muted, fontWeight: 600, cursor: "pointer" }}>{link}</span>
          ))}
        </div>
        
        <div style={{ fontSize: 10, color: T.muted2, fontWeight: 500 }}>
          © 2026 BOLÉ JËND Sénégal. Tous droits réservés.
          <br />
          Fait avec ❤️ pour la communauté.
        </div>
      </footer>

      {/* BOTTOM NAV */}
      <div style={{ position:"fixed",bottom:10,left:10,right:10,maxWidth:460,margin:"0 auto",background:T.surface,border:`1px solid ${T.border}`,borderRadius:20,display:"flex",justifyContent:"space-around",padding:"10px 5px",boxShadow:"0 10px 30px rgba(0,0,0,0.5)" }}>
        {[
          {id:"home", icon:Home, label:"Accueil"},
          {id:"commandes", icon:ShoppingCart, label:"Paniers"},
          {id:"admin", icon:BarChart2, label:"Admin"},
          {id:"profil", icon:User, label:"Profil"},
        ].map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",color:page===item.id?T.green:T.muted }}>
            <item.icon size={20} />
            <span style={{ fontSize:9, fontWeight:700 }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
