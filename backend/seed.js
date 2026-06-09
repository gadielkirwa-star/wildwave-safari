/**
 * WildWave Safaris — Database Seed Script
 * Run: node backend/seed.js
 *
 * Seeds destinations, packages, blogs, and partners into the production database.
 * Safe to run multiple times — skips existing records by name.
 */

import pg from 'pg';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false,
});

// ─── DESTINATIONS ─────────────────────────────────────────────────────────────
const destinations = [
  { name: "Maasai Mara National Reserve", country: "Kenya", tags: "Luxury,Photo Safaris,Family Safaris", image_url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80", description: "Iconic for the Great Wildebeest Migration and Big Five safaris across vast, open plains.", best_months: "July–October" },
  { name: "Amboseli National Park", country: "Kenya", tags: "Photo Safaris,Family Safaris", image_url: "https://i.pinimg.com/736x/83/92/b9/8392b9d2e1ea92477d406a0575ad9f07.jpg", description: "Famous for massive elephant herds wandering with the dramatic backdrop of Mount Kilimanjaro.", best_months: "June–October" },
  { name: "Tsavo National Parks", country: "Kenya", tags: "Budget,Family Safaris", image_url: "https://i.pinimg.com/736x/63/cb/b1/63cbb1797844c13a7a7328bc85e78319.jpg", description: "Kenya's largest park, known for its distinct red elephants, ancient lava flows, and diverse landscapes.", best_months: "June–October" },
  { name: "Samburu National Reserve", country: "Kenya", tags: "Luxury,Photo Safaris", image_url: "https://i.pinimg.com/736x/7e/79/de/7e79deb6810782c118dae6d768c81744.jpg", description: "An arid, rugged sanctuary home to rare species like Grevy's zebra and the reticulated giraffe.", best_months: "June–September" },
  { name: "Lake Nakuru National Park", country: "Kenya", tags: "Photo Safaris,Budget", image_url: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg", description: "A breathtaking flamingo paradise and highly successful rhinoceros sanctuary in the Great Rift Valley.", best_months: "Year-round" },
  { name: "Aberdare National Park", country: "Kenya", tags: "Luxury,Family Safaris", image_url: "https://i.pinimg.com/736x/be/39/6c/be396c7c01e9de5a9035311833c362b8.jpg", description: "Lush, mountainous forests featuring cascading waterfalls and unique tree-hotel lodges for wildlife viewing.", best_months: "June–September" },
  { name: "Serengeti National Park", country: "Tanzania", tags: "Luxury,Photo Safaris", image_url: "https://i.pinimg.com/736x/09/82/4b/09824b60ea14e9e5d5309b065b994bad.jpg", description: "World-famous for the Great Migration and seemingly endless, wildlife-rich savannahs.", best_months: "June–October" },
  { name: "Ngorongoro Crater", country: "Tanzania", tags: "Luxury,Family Safaris", image_url: "https://i.pinimg.com/736x/1a/11/b2/1a11b26d1e6bad68aa1e29b6fe58004e.jpg", description: "A UNESCO-listed volcanic caldera boasting the highest density of wildlife in all of Africa.", best_months: "Year-round" },
  { name: "Kilimanjaro National Park", country: "Tanzania", tags: "Budget,Family Safaris", image_url: "https://i.pinimg.com/736x/16/47/e6/1647e614f383056cdc4a411706a4adc9.jpg", description: "Home to Africa's highest peak (5,895m), offering spectacular trekking and eco-tourism adventures.", best_months: "June–October" },
  { name: "Tarangire National Park", country: "Tanzania", tags: "Photo Safaris,Budget", image_url: "https://i.pinimg.com/736x/f9/b1/70/f9b1709e702b254ce5861e034f24dd82.jpg", description: "Famed for its surreal landscape dotted with ancient baobab trees and massive elephant herds.", best_months: "July–October" },
  { name: "Selous Game Reserve", country: "Tanzania", tags: "Luxury,Photo Safaris", image_url: "https://i.pinimg.com/736x/30/e6/f8/30e6f8b08b6a587287a34b88e0d19e90.jpg", description: "One of Africa's largest protected areas, offering untamed wilderness and incredible boat safaris.", best_months: "June–October" },
  { name: "Zanzibar Archipelago", country: "Tanzania", tags: "Luxury,Family Safaris", image_url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=800&q=80", description: "A tropical haven of pristine white beaches, aromatic spice tours, and the historic charm of Stone Town.", best_months: "June–October" },
  { name: "Bwindi Impenetrable Forest", country: "Uganda", tags: "Luxury,Photo Safaris", image_url: "https://i.pinimg.com/736x/d9/fb/0a/d9fb0a03afdc6276c1a2e4af736fc9e9.jpg", description: "A mystical, dense rainforest offering the ultimate gorilla trekking experience.", best_months: "June–August" },
  { name: "Queen Elizabeth National Park", country: "Uganda", tags: "Family Safaris,Budget", image_url: "https://i.pinimg.com/736x/dc/1f/0d/dc1f0d156668bb85ac7c670d77e0b1fd.jpg", description: "Famed for chimpanzee tracking, rare tree-climbing lions, and wildlife boat cruises along the Kazinga Channel.", best_months: "June–September" },
  { name: "Murchison Falls National Park", country: "Uganda", tags: "Photo Safaris,Budget", image_url: "https://i.pinimg.com/736x/e5/bf/af/e5bfaf21dff54ba754e8fd495da0b6e4.jpg", description: "Home to the world's most powerful waterfalls and spectacular Nile River boat safaris.", best_months: "December–February" },
  { name: "Volcanoes National Park", country: "Rwanda", tags: "Luxury,Photo Safaris", image_url: "https://i.pinimg.com/736x/d6/3b/6f/d63b6f9b1d41085544c59588f6970fbc.jpg", description: "Famous for Dian Fossey's work, offering unparalleled mountain gorilla trekking and rare golden monkeys.", best_months: "June–September" },
];

// ─── SAFARI PACKAGES ──────────────────────────────────────────────────────────
const packages = [
  {
    name: "Coastal Kenya Package (Mombasa – Diani – Watamu)",
    duration: "6 Days / 5 Nights",
    type: "Beach & Culture",
    tag: "Coastal",
    image_url: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1600&q=80",
    description: "A coastal escape combining white sand beaches, Swahili culture, coral reefs, and marine parks.",
    itinerary_json: JSON.stringify([
      { day: 1, title: "Arrival – Mombasa", description: "Pickup from airport/train station. Check-in at beach resort (Nyali or Diani). Evening: Old Town walk + Fort Jesus sunset view" },
      { day: 2, title: "Mombasa Culture Day", description: "Fort Jesus Museum tour. Old Town spice markets. Mama Ngina waterfront. Sunset dhow cruise" },
      { day: 3, title: "Transfer to Diani Beach", description: "Drive via Likoni ferry. Beach resort check-in. Afternoon: relaxation + swimming" },
      { day: 4, title: "Diani Adventure Day", description: "Snorkeling / scuba diving. Optional: Skydiving (Diani is East Africa's top drop zone). Camel ride along the beach" },
      { day: 5, title: "Watamu / Marine Experience", description: "Visit Watamu Marine National Park. Glass-bottom boat ride. Dolphin spotting (seasonal)" },
      { day: 6, title: "Departure", description: "Leisure morning. Transfer to airport" },
    ]),
    includes: "Transfers (optional package), Marine park fees (partial), Guided tours",
    excludes: "Flights, Alcohol, personal expenses, Premium water sports",
    published: true,
  },
  {
    name: "Masai Mara Safari Package",
    duration: "4 Days / 3 Nights",
    type: "Wildlife Safari",
    tag: "Big Five",
    image_url: "https://i.pinimg.com/736x/7c/36/c7/7c36c75a936387454868a452885be536.jpg",
    description: "The iconic Maasai Mara experience featuring Big Five safaris and Great Migration season crossings.",
    itinerary_json: JSON.stringify([
      { day: 1, title: "Nairobi – Maasai Mara", description: "Departure from Nairobi (morning). Stop at Great Rift Valley viewpoint. Arrival + evening game drive" },
      { day: 2, title: "Full Game Drive", description: "Morning game drive (Big Cats focus). Picnic lunch inside the reserve. Afternoon drive near Mara River" },
      { day: 3, title: "Cultural Experience + Game Drive", description: "Visit Maasai village. Learn Maasai culture, dances, and traditions. Afternoon game drive" },
      { day: 4, title: "Return to Nairobi", description: "Early breakfast. Short game drive exit route. Return to Nairobi" },
    ]),
    highlights: JSON.stringify(["Lions, elephants, leopards, buffalo, rhino (Big Five)", "Wildebeest migration (July–October)", "Hot air balloon safari (optional premium add-on)"]),
    addons: JSON.stringify(["Balloon safari (~$380–$500)", "Night photography drive (selected camps only)", "Professional wildlife photography guide"]),
    includes: "Park fees, game drives, accommodation, meals",
    excludes: "Flights, alcohol, personal expenses",
    published: true,
  },
  {
    name: "Lake Nakuru Safari Package",
    duration: "2 Days / 1 Night",
    type: "Conservation Safari",
    tag: "Flamingos & Rhinos",
    image_url: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg",
    description: "A compact but incredibly productive safari focusing on rhino conservation and the spectacular flamingo flocks of Lake Nakuru.",
    itinerary_json: JSON.stringify([
      { day: 1, title: "Nairobi – Lake Nakuru", description: "Morning departure. Scenic stop at Rift Valley viewpoint. Afternoon game drive focusing on White & black rhinos, Rothschild giraffes, Flamingos & buffalo. Evening: Check-in at lodge" },
      { day: 2, title: "Morning Game Drive – Return", description: "Sunrise game drive (best wildlife activity time). Birdwatching (over 400 species recorded). Exit park and return to Nairobi" },
    ]),
    highlights: JSON.stringify(["Rhino sanctuary core zone", "Lake scenery + bird migration patterns", "Compact but highly productive safari"]),
    includes: "Park fees, game drives, accommodation, meals",
    excludes: "Flights, personal expenses",
    published: true,
  },
  {
    name: "The Ultimate Tourism Funnel: Beach to Bush",
    duration: "12 Days / 11 Nights",
    type: "Multi-Destination",
    tag: "Premium",
    image_url: "https://i.pinimg.com/1200x/f3/51/6e/f3516e0e1da6e7d82e4cb6e07f9585d6.jpg",
    description: "The ultimate journey merging Coastal relaxation, the wild Maasai Mara, and the beautiful Lake Nakuru — a full tourism funnel: beach → wildlife → conservation ecosystem → culture.",
    itinerary_json: JSON.stringify([
      { day: 1, title: "Phase 1: Coastal Recovery (Days 1-6)", description: "Arrive in Mombasa, explore Fort Jesus & Old Town. Relax on the pristine white sands of Diani Beach. Marine excursions in Watamu" },
      { day: 7, title: "Phase 2: The Great Migration (Days 7-10)", description: "Fly or drive to the legendary Maasai Mara. Extensive Big Five game drives & Mara River crossings. Maasai cultural immersion" },
      { day: 11, title: "Phase 3: Conservation Ecosystem (Days 11-12)", description: "Travel to Lake Nakuru National Park. Focus on Rhino conservation and Flamingo flocks. Return to Nairobi for departure" },
    ]),
    includes: "All domestic transfers between coast and parks, All park entry and marine fees, Guided tours and game drives",
    excludes: "International flights, Premium add-ons (Balloon safaris, Skydiving)",
    published: true,
  },
];

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────
const blogs = [
  {
    title: "The Great Wildebeest Migration: Nature's Greatest Wildlife Spectacle",
    category: "Wildlife",
    excerpt: "Every year, East Africa hosts one of the most breathtaking wildlife events on the planet—the Great Wildebeest Migration.",
    content: `Every year, East Africa hosts one of the most breathtaking wildlife events on the planet—the Great Wildebeest Migration. More than 1.5 million wildebeest, accompanied by hundreds of thousands of zebras and gazelles, embark on an epic journey across the vast plains of Tanzania and Kenya in search of fresh grazing land and water.

The migration begins in the southern Serengeti, where thousands of calves are born during the calving season. As the dry season approaches, the herds move north through the Serengeti and into Kenya's Masai Mara, covering hundreds of kilometers along the way.

One of the most dramatic moments occurs at the Mara River crossings. Here, the animals must brave strong currents and lurking crocodiles as they fight to reach greener pastures. These crossings provide some of the most thrilling wildlife encounters in Africa and attract photographers and safari enthusiasts from around the world.

The best time to witness the migration in the Masai Mara is typically from July to October, while different stages of the migration can be viewed throughout the year in the Serengeti.`,
    image_url: "https://i.pinimg.com/736x/dd/c5/a4/ddc5a4a182a6a00a24374c0186b6b58a.jpg",
    read_time: "8 Min Read",
    published: true,
  },
  {
    title: "Diani Beach: The Crown Jewel of Kenya's Coast",
    category: "Coastal",
    excerpt: "Diani Beach is frequently voted as one of Africa's leading beach destinations, and for good reason.",
    content: `Diani Beach is frequently voted as one of Africa's leading beach destinations, and for good reason. With its flawless stretch of white powdery sand set against the vivid turquoise waters of the Indian Ocean, Diani offers a spectacular tropical retreat.

Beyond the pristine sands, Diani is a hub for adventure. Visitors can try world-class kitesurfing, dive into vibrant coral reefs, or take a traditional wooden dhow cruise at sunset. The surrounding lush forests are also home to the rare Colobus monkeys, adding a unique touch of wildlife to your coastal escape.`,
    image_url: "https://i.pinimg.com/736x/1c/0c/6d/1c0c6d937843c47da0cc438056c679c8.jpg",
    read_time: "6 Min Read",
    published: true,
  },
  {
    title: "Tsavo National Park: The Land of Red Elephants",
    category: "Adventure",
    excerpt: "As Kenya's largest national park, Tsavo offers a raw and untamed safari experience.",
    content: `As Kenya's largest national park, Tsavo offers a raw and untamed safari experience that feels worlds away from the crowded tourist trails. Divided into Tsavo East and Tsavo West, this vast wilderness is characterized by its stark, rugged landscapes, baobab trees, and ancient lava flows.

Tsavo is perhaps most famous for its 'red elephants'—massive herds that dust themselves in the region's rich, iron-oxide soil, giving them a distinct and beautiful rust-colored appearance against the savanna.`,
    image_url: "https://i.pinimg.com/736x/63/cb/b1/63cbb1797844c13a7a7328bc85e78319.jpg",
    read_time: "7 Min Read",
    published: true,
  },
  {
    title: "Gorilla Trekking in Bwindi Forest",
    category: "Adventure",
    excerpt: "Deep in the misty mountains of Uganda lies one of the most incredible wildlife encounters on earth.",
    content: "Deep in the misty mountains of Uganda lies one of the most incredible wildlife encounters on earth. Coming face-to-face with a silverback mountain gorilla is a humbling, emotional experience that you will never forget. Learn exactly what to pack, how to prepare physically, and what to expect during your trek.",
    image_url: "https://i.pinimg.com/736x/d9/fb/0a/d9fb0a03afdc6276c1a2e4af736fc9e9.jpg",
    read_time: "6 Min Read",
    published: true,
  },
  {
    title: "Conquering Mount Kilimanjaro",
    category: "Expedition",
    excerpt: "Rising majestically above the African plains, Mount Kilimanjaro is the highest peak on the continent.",
    content: `Rising majestically above the African plains, Mount Kilimanjaro is the highest peak on the continent and the tallest free-standing mountain in the world. Scaling its snow-capped summit is a bucket-list adventure for trekkers across the globe.

Unlike many of the world's highest peaks, reaching the summit of Kilimanjaro does not require technical mountaineering skills, making it an accessible challenge for determined adventurers. The journey takes you through five distinct climate zones, from lush rainforests at the base to the arctic conditions at Uhuru Peak.`,
    image_url: "https://i.pinimg.com/736x/16/47/e6/1647e614f383056cdc4a411706a4adc9.jpg",
    read_time: "9 Min Read",
    published: true,
  },
  {
    title: "Lake Nakuru: A Haven for Flamingos and Rhinos",
    category: "Wildlife",
    excerpt: "Nestled deep within the Great Rift Valley, Lake Nakuru National Park is a breathtaking spectacle of nature.",
    content: `Nestled deep within the Great Rift Valley, Lake Nakuru National Park is a breathtaking spectacle of nature, most famous for the vast flocks of bright pink flamingos that line its shores. The vibrant colors reflecting off the alkaline waters create a photographer's dream.

Beyond the iconic birds, Lake Nakuru is also one of Kenya's most successful rhinoceros sanctuaries. Here, visitors have an incredibly high chance of spotting both the endangered black rhino and the white rhino wandering freely through the acacia woodlands.`,
    image_url: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg",
    read_time: "5 Min Read",
    published: true,
  },
];

// ─── PARTNERS ─────────────────────────────────────────────────────────────────
const partners = [
  { name: "TripAdvisor", logo_url: "https://static.tacdn.com/img2/brand_refresh_2025/logos/wordmark.svg", is_active: true, display_order: 1 },
  { name: "Safari Bookings", logo_url: "https://cfstatic.safaribookings.com/img/logos/logo-240x35.png", is_active: true, display_order: 2 },
  { name: "TOSK", logo_url: "https://staging.toskenya.org/wp-content/uploads/2024/03/tosk_logo_v2.webp", is_active: true, display_order: 3 },
  { name: "Serena Hotels", logo_url: "https://image-tc.galaxy.tf/wisvg-2kxzoagrzpaii22pmbq9rz11m/serena-hotel-logo.svg?width=128&height=80", is_active: true, display_order: 4 },
  { name: "Sopa Lodges", logo_url: "https://www.sopalodges.com/images/logos/sopalodges-logo.png", is_active: true, display_order: 5 },
  { name: "Mombasa Air Safari", logo_url: "https://storage.aerocrs.com/99/system/logo.png", is_active: true, display_order: 6 },
];

async function seed() {
  console.log('🌍 WildWave Safaris — Database Seeding Started\n');

  // Ensure partners table exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS partners (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      logo_url TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `).catch(e => console.log('partners table:', e.message));

  // Ensure JSONB columns exist on packages
  await pool.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS itinerary_json JSONB`).catch(() => {});
  await pool.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS highlights JSONB`).catch(() => {});
  await pool.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS inclusions JSONB`).catch(() => {});
  await pool.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS accommodations JSONB`).catch(() => {});
  await pool.query(`ALTER TABLE packages ADD COLUMN IF NOT EXISTS addons JSONB`).catch(() => {});

  // ─── Seed Destinations ────────────────────────────────────────────────────
  console.log('📍 Seeding destinations...');
  let destInserted = 0;
  for (const d of destinations) {
    const exists = await pool.query('SELECT id FROM destinations WHERE name = $1', [d.name]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO destinations (name, country, category, tags, image_url, description, best_months, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true)`,
        [d.name, d.country, d.country, d.tags, d.image_url, d.description, d.best_months]
      );
      destInserted++;
    } else {
      // Update existing destinations to ensure category matches country
      await pool.query(
        `UPDATE destinations SET category = COALESCE(category, country), country = COALESCE(country, category) WHERE name = $1`,
        [d.name]
      );
    }
  }
  console.log(`   ✅ ${destInserted} new destinations inserted (${destinations.length - destInserted} already existed)\n`);

  // ─── Seed Packages ────────────────────────────────────────────────────────
  console.log('🧳 Seeding safari packages...');
  let pkgInserted = 0;
  for (const p of packages) {
    const exists = await pool.query('SELECT id FROM packages WHERE name = $1', [p.name]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO packages (name, duration, type, tag, image_url, description, itinerary_json, highlights, includes, excludes, addons, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [p.name, p.duration, p.type, p.tag, p.image_url, p.description,
         p.itinerary_json, p.highlights || null, p.includes, p.excludes, p.addons || null, p.published]
      );
      pkgInserted++;
    }
  }
  console.log(`   ✅ ${pkgInserted} new packages inserted (${packages.length - pkgInserted} already existed)\n`);

  // ─── Seed Blog Posts ──────────────────────────────────────────────────────
  console.log('📝 Seeding blog posts...');
  let blogInserted = 0;
  for (const b of blogs) {
    const exists = await pool.query('SELECT id FROM blogs WHERE title = $1', [b.title]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO blogs (title, category, excerpt, content, image_url, read_time, published)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [b.title, b.category, b.excerpt, b.content, b.image_url, b.read_time, b.published]
      );
      blogInserted++;
    }
  }
  console.log(`   ✅ ${blogInserted} new blog posts inserted (${blogs.length - blogInserted} already existed)\n`);

  // ─── Seed Partners ────────────────────────────────────────────────────────
  console.log('🤝 Seeding partners...');
  let partnerInserted = 0;
  for (const p of partners) {
    const exists = await pool.query('SELECT id FROM partners WHERE name = $1', [p.name]);
    if (exists.rows.length === 0) {
      await pool.query(
        `INSERT INTO partners (name, logo_url, is_active, display_order) VALUES ($1, $2, $3, $4)`,
        [p.name, p.logo_url, p.is_active, p.display_order]
      );
      partnerInserted++;
    }
  }
  console.log(`   ✅ ${partnerInserted} new partners inserted (${partners.length - partnerInserted} already existed)\n`);

  console.log('🎉 Seeding complete! Database is now fully populated.\n');
  await pool.end();
}

seed().catch(err => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
