import { useState } from "react";
import { motion } from "framer-motion";
import { useSEO } from "@/hooks/use-seo";
import { Calendar, Clock, MessageCircle, Phone } from "lucide-react";

// Expanded Mock Data to show how long content behaves
const BLOGS = [
  {
    id: 1,
    theme: "The Ultimate Guide to",
    title: "The Great Wildebeest Migration: Nature's Greatest Wildlife Spectacle",
    category: "Wildlife",
    date: "July 12, 2026",
    readTime: "8 Min Read",
    image: "https://i.pinimg.com/736x/dd/c5/a4/ddc5a4a182a6a00a24374c0186b6b58a.jpg",
    excerpt: `Every year, East Africa hosts one of the most breathtaking wildlife events on the planet—the Great Wildebeest Migration. More than 1.5 million wildebeest, accompanied by hundreds of thousands of zebras and gazelles, embark on an epic journey across the vast plains of Tanzania and Kenya in search of fresh grazing land and water.

The migration begins in the southern Serengeti, where thousands of calves are born during the calving season. As the dry season approaches, the herds move north through the Serengeti and into Kenya's Masai Mara, covering hundreds of kilometers along the way.

One of the most dramatic moments occurs at the Mara River crossings. Here, the animals must brave strong currents and lurking crocodiles as they fight to reach greener pastures. These crossings provide some of the most thrilling wildlife encounters in Africa and attract photographers and safari enthusiasts from around the world.

Beyond the river crossings, the migration supports an entire ecosystem. Lions, cheetahs, leopards, hyenas, and other predators follow the herds, creating a remarkable display of nature's balance and survival.

The best time to witness the migration in the Masai Mara is typically from July to October, while different stages of the migration can be viewed throughout the year in the Serengeti.

The Great Wildebeest Migration is more than a safari experience—it's a powerful reminder of the raw beauty, resilience, and wonder of the natural world. For many travelers, witnessing this incredible journey is the highlight of a lifetime adventure in East Africa.`

  },
  {
    id: 2,
    theme: "Coastal Paradise",
    title: "Diani Beach: The Crown Jewel of Kenya's Coast",
    category: "Coastal",
    date: "August 05, 2026",
    readTime: "6 Min Read",
    image: "https://i.pinimg.com/736x/1c/0c/6d/1c0c6d937843c47da0cc438056c679c8.jpg",
    excerpt: `Diani Beach is frequently voted as one of Africa's leading beach destinations, and for good reason. With its flawless stretch of white powdery sand set against the vivid turquoise waters of the Indian Ocean, Diani offers a spectacular tropical retreat.

Beyond the pristine sands, Diani is a hub for adventure. Visitors can try world-class kitesurfing, dive into vibrant coral reefs, or take a traditional wooden dhow cruise at sunset. The surrounding lush forests are also home to the rare Colobus monkeys, adding a unique touch of wildlife to your coastal escape.

Whether you are looking to unwind in a luxury beachfront resort after an exhilarating safari, or seeking marine adventures along the beautiful Kenyan coastline, Diani Beach is the ultimate finale to your East African journey.`
  },
  {
    id: 3,
    theme: "Untamed Wilderness",
    title: "Tsavo National Park: The Land of Red Elephants",
    category: "Adventure",
    date: "September 10, 2026",
    readTime: "7 Min Read",
    image: "https://i.pinimg.com/736x/63/cb/b1/63cbb1797844c13a7a7328bc85e78319.jpg",
    excerpt: `As Kenya's largest national park, Tsavo offers a raw and untamed safari experience that feels worlds away from the crowded tourist trails. Divided into Tsavo East and Tsavo West, this vast wilderness is characterized by its stark, rugged landscapes, baobab trees, and ancient lava flows.

Tsavo is perhaps most famous for its 'red elephants'—massive herds that dust themselves in the region's rich, iron-oxide soil, giving them a distinct and beautiful rust-colored appearance against the savanna. 

Whether you are exploring the volcanic terrain of the Yatta Plateau, marveling at the crystal-clear waters of Mzima Springs, or tracking the legendary descendants of the Tsavo lions, this park delivers an authentic and rugged East African adventure.`
  },
  {
    id: 4,
    theme: "Into the Wild",
    title: "Gorilla Trekking in Bwindi Forest",
    category: "Adventure",
    date: "April 02, 2026",
    readTime: "6 Min Read",
    image: "https://i.pinimg.com/736x/d9/fb/0a/d9fb0a03afdc6276c1a2e4af736fc9e9.jpg",
    excerpt: "Deep in the misty mountains of Uganda lies one of the most incredible wildlife encounters on earth. Coming face-to-face with a silverback mountain gorilla is a humbling, emotional experience that you will never forget. Learn exactly what to pack, how to prepare physically, and what to expect during your trek."
  },
  {
    id: 5,
    theme: "The Roof of Africa",
    title: "Conquering Mount Kilimanjaro",
    category: "Expedition",
    date: "October 18, 2026",
    readTime: "9 Min Read",
    image: "https://i.pinimg.com/736x/16/47/e6/1647e614f383056cdc4a411706a4adc9.jpg",
    excerpt: `Rising majestically above the African plains, Mount Kilimanjaro is the highest peak on the continent and the tallest free-standing mountain in the world. Scaling its snow-capped summit is a bucket-list adventure for trekkers across the globe.

Unlike many of the world's highest peaks, reaching the summit of Kilimanjaro does not require technical mountaineering skills, making it an accessible challenge for determined adventurers. The journey takes you through five distinct climate zones, from lush rainforests at the base to the arctic conditions at Uhuru Peak.

Whether you choose the popular Machame route or the scenic Lemosho trek, standing at the Roof of Africa as the sun rises over the vast savanna below is an unforgettable, life-changing achievement.`
  },
  {
    id: 6,
    theme: "The Pink Lake",
    title: "Lake Nakuru: A Haven for Flamingos and Rhinos",
    category: "Wildlife",
    date: "November 05, 2026",
    readTime: "5 Min Read",
    image: "https://i.pinimg.com/736x/f7/4a/b1/f74ab14e065ee7d5e92abff620df7fd0.jpg",
    excerpt: `Nestled deep within the Great Rift Valley, Lake Nakuru National Park is a breathtaking spectacle of nature, most famous for the vast flocks of bright pink flamingos that line its shores. The vibrant colors reflecting off the alkaline waters create a photographer's dream.

Beyond the iconic birds, Lake Nakuru is also one of Kenya's most successful rhinoceros sanctuaries. Here, visitors have an incredibly high chance of spotting both the endangered black rhino and the white rhino wandering freely through the acacia woodlands.

With its dramatic landscapes ranging from sweeping grasslands to rocky escarpments, Lake Nakuru offers a compact but incredibly dense wildlife viewing experience that is unlike any other park in East Africa.`
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const Blog = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useSEO({
    title: "Stories from the Wild | WildWave Safaris",
    description: "Read our latest luxury travel guides and safari stories.",
    path: "/blog",
  });

  return (
    <div className="min-h-screen bg-[#F7F3EE] font-['DM_Sans',sans-serif] selection:bg-[#D4A84B] selection:text-[#1A1208] pt-32 pb-0">
      
      {/* PAGE HEADER */}
      <section className="px-4 mb-16">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="container mx-auto max-w-6xl text-center"
        >
          <p className="text-[#C1440E] font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold mb-4">Our Journal</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-['Playfair_Display',serif] font-bold text-[#1A1208] leading-[1.15] mb-8">
            Stories from the <span className="italic text-[#D4A84B]">Wild</span>
          </h1>
          <hr className="w-16 h-0.5 bg-[#D4A84B] border-none mx-auto" />
        </motion.div>
      </section>

      {/* MAGAZINE STYLE BLOG LISTING */}
      <section className="px-4 xl:px-8 pb-32">
        <div className="container mx-auto max-w-[1600px]">
          <motion.div 
            initial="hidden" animate="visible" variants={fadeUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16"
          >
            {BLOGS.map((blog) => (
              <article 
                key={blog.id} 
                className="group flex flex-col bg-transparent rounded-none border-none hover:-translate-y-1 transition-transform duration-500 cursor-pointer w-full h-full"
              >
                {/* FULL WIDTH TITLE SECTION ON TOP */}
                <div className="w-full mb-6 px-1">
                  <span className="block text-[#C1440E] italic text-lg xl:text-xl font-normal mb-2 tracking-wide font-['Playfair_Display',serif]">
                    {blog.theme}
                  </span>
                  <h4 className="text-3xl md:text-4xl xl:text-5xl font-['Playfair_Display',serif] font-bold text-[#1A1208] group-hover:text-[#D4A84B] transition-colors leading-[1.2]">
                    {blog.title}
                  </h4>
                </div>

                {/* CONTENT BLOCK WITH FLOATED IMAGE */}
                <div className="relative w-full text-left block after:content-[''] after:table after:clear-both">
                  {/* FLOATED DOMINANT IMAGE SECTION */}
                  <div className="float-left w-[100%] md:w-[50%] lg:w-[55%] xl:w-[60%] mr-6 md:mr-8 mb-6 mt-2 shrink-0">
                    {/* Premium Frame: warm off-white matte with gold accent bottom */}
                    <div className="bg-[#FDFBF7] p-3 md:p-4 rounded-2xl border border-[#E5DFD3] shadow-md group-hover:shadow-xl transition-all duration-500 border-b-4 border-b-[#D4A84B]">
                      {/* Image with fixed aspect ratio — no collapse */}
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
                        <img
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        />
                        {/* Cinematic bottom gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category pill floating above gradient */}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-white/90 backdrop-blur-sm text-[#8C6B4A] font-['Space_Mono',monospace] text-[10px] tracking-widest px-3 py-1.5 rounded-full uppercase font-bold shadow-sm border border-white/50">
                            {blog.category}
                          </span>
                        </div>

                        {/* Bottom reading-time strip */}
                        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 z-10 flex items-center justify-between">
                          <span className="text-white/80 text-xs font-['Space_Mono',monospace] tracking-wider flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" /> {blog.readTime}
                          </span>
                          <span className="text-white/80 text-xs font-['Space_Mono',monospace] tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" /> {blog.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* EXCERPT TEXT FLOWING AROUND IMAGE */}
                  <div className="text-[#4A3D30] leading-relaxed text-base xl:text-lg font-light whitespace-pre-line text-justify md:text-left transition-all duration-500">
                    <div className={`transition-all duration-500 ${expandedId === blog.id ? '' : 'line-clamp-[10] md:line-clamp-[12] xl:line-clamp-[14]'}`}>
                      {blog.excerpt}
                    </div>
                  </div>

                  {/* INLINE ACTION BUTTON */}
                  <div className="mt-6 block clear-both">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedId(expandedId === blog.id ? null : blog.id);
                      }}
                      className="group/btn inline-flex items-center gap-2 text-[#1A1208] font-bold border-b-2 border-[#D4A84B] pb-1 hover:text-[#D4A84B] hover:border-[#1A1208] transition-all text-xs xl:text-sm uppercase tracking-widest font-['Space_Mono',monospace]"
                    >
                      {expandedId === blog.id ? 'Show Less' : 'Read Story'} 
                      <span className="transition-transform group-hover/btn:translate-x-1">
                        {expandedId === blog.id ? '↑' : '→'}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* BOOKING CTA */}
      <section className="bg-[#1A1208] text-white py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1600')] bg-cover bg-center" />
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="container mx-auto max-w-4xl text-center relative z-10"
        >
          <p className="text-[#D4A84B] font-['Space_Mono',monospace] text-xs uppercase tracking-widest font-semibold mb-4">Plan Your Journey</p>
          <h2 className="text-4xl md:text-6xl font-['Playfair_Display',serif] font-bold mb-10 leading-tight">
            Ready to Explore East Africa?
          </h2>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-[#D4A84B] text-[#1A1208] px-8 py-4 rounded font-bold hover:bg-white transition-colors text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              Book Safari
            </button>
            <button className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 rounded font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button className="w-full sm:w-auto border border-white/30 text-white px-8 py-4 rounded font-bold hover:bg-white hover:text-[#1A1208] transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-widest font-['Space_Mono',monospace]">
              <Phone className="w-4 h-4" /> Contact
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Blog;
