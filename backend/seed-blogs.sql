-- Clear the existing blogs
TRUNCATE TABLE blogs RESTART IDENTITY CASCADE;

INSERT INTO blogs (title, category, excerpt, content, image_url, read_time, published) VALUES

-- 1. MASAI MARA NATIONAL RESERVE
(
  'Best Time to Visit Masai Mara: A Month-by-Month Guide',
  'Masai Mara',
  'Deciding when to visit the Masai Mara depends entirely on what you want to see. From the Great Migration to quiet calving seasons, here is your definitive guide.',
  '<p>The Masai Mara is phenomenal year-round, but your experience will change dramatically depending on the month you choose to visit. Whether you are chasing the dramatic river crossings of the Great Migration or prefer the quiet intimacy of the green season, this guide will help you plan the perfect trip.</p>',
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1400&q=85',
  '7 min read',
  true
),
(
  'The Great Migration Explained: Witnessing Nature''s Greatest Spectacle',
  'Masai Mara',
  'It is known as the greatest wildlife show on earth. Discover the science, the routes, and the survival instinct behind the great wildebeest migration.',
  '<p>Every year, over two million animals—wildebeest, zebras, and gazelles—undertake a treacherous 3,000-kilometer circular trek across the Serengeti-Mara ecosystem. Driven by rainfall and the search for fresh grazing, it is an endless cycle of life and death.</p>',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=85',
  '8 min read',
  true
),
(
  'Luxury vs Budget Safaris in Masai Mara: Finding Your Perfect Fit',
  'Masai Mara',
  'From five-star tented suites with private plunge pools to rustic camping under the stars, how do you choose the right safari style for your budget?',
  '<p>A safari in the Masai Mara can cost anywhere from $200 a day to over $2,000 a day. Understanding the difference between luxury and budget options is crucial to setting the right expectations for your dream trip.</p>',
  'https://images.unsplash.com/photo-1549366021-9f761d450615?w=1400&q=85',
  '6 min read',
  true
),

-- 2. SERENGETI NATIONAL PARK
(
  'Serengeti vs Masai Mara: Which Safari is Right for You?',
  'Serengeti',
  'They share the same ecosystem, but offer entirely different experiences. We break down the differences in size, crowds, and wildlife to help you choose.',
  '<p>The Serengeti in Tanzania and the Masai Mara in Kenya are actually part of the exact same continuous ecosystem. The animals don’t know there is a border, but as a traveler, your experience in each park will be quite different.</p>',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&q=85',
  '7 min read',
  true
),
(
  'Top Wildlife in the Serengeti: Beyond the Big Five',
  'Serengeti',
  'Everyone comes for the lion, leopard, rhino, elephant, and buffalo. But the real magic of the Serengeti lies in its lesser-known, extraordinary inhabitants.',
  '<p>While ticking off the "Big Five" is a thrill, the Serengeti is home to over 70 large mammal and 500 bird species. The most memorable safari moments often come from the animals you didn’t even know you were looking for.</p>',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1400&q=85',
  '5 min read',
  true
),
(
  'First-Time Safari Guide: Everything You Need to Know',
  'Serengeti',
  'From what to pack to the unwritten rules of the safari vehicle. Prepare for your first African adventure with our comprehensive beginner’s guide.',
  '<p>Your first safari is a life-changing experience, but the preparation can feel overwhelming. From choosing the right clothing to understanding bush etiquette, here is everything you need to know before you touch down on the dirt airstrip.</p>',
  'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=1400&q=85',
  '9 min read',
  true
),

-- 3. MOUNT KILIMANJARO
(
  'How to Climb Kilimanjaro: A Beginner''s Guide to the Summit',
  'Kilimanjaro',
  'Standing at 5,895 meters, the Roof of Africa is the highest free-standing mountain in the world. Here is how ordinary people achieve this extraordinary feat.',
  '<p>Mount Kilimanjaro is unique among the Seven Summits because it is a "walk-up" mountain. It requires no technical climbing skills, no ropes, and no crampons. However, do not let that fool you—the extreme altitude makes it a grueling physical and mental battle.</p>',
  'https://images.unsplash.com/photo-1621414050347-e93f8e575f37?w=1400&q=85',
  '10 min read',
  true
),
(
  'The Ultimate Kilimanjaro Packing List: Don''t Forget These Essentials',
  'Kilimanjaro',
  'You will hike through five distinct climate zones—from tropical rainforest to arctic summit. Packing correctly is a matter of safety and success.',
  '<p>Packing for Kilimanjaro is an exercise in extremes. You will start your trek in a humid 25°C rainforest and summit in a bone-chilling -20°C arctic zone. The secret to surviving these drastic changes? Layers.</p>',
  'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1400&q=85',
  '8 min read',
  true
),
(
  'Best Routes to the Summit: Machame vs Lemosho vs Marangu',
  'Kilimanjaro',
  'There are seven main routes up Kilimanjaro, but they are not created equal. We break down the top three routes to help you maximize your chance of reaching the roof of Africa.',
  '<p>Choosing your route up Kilimanjaro is the most important decision you will make. It dictates the scenery, the crowds, and most importantly, your acclimatization profile—which directly impacts your success rate.</p>',
  'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1400&q=85',
  '9 min read',
  true
),

-- 4. NGORONGORO CONSERVATION AREA
(
  'Why Ngorongoro Is Called Africa''s Garden of Eden',
  'Ngorongoro',
  'An intact volcanic caldera teeming with 25,000 large mammals. Discover why the Ngorongoro Crater is a wildlife viewing experience unlike any other on earth.',
  '<p>Formed over two million years ago when a massive volcano erupted and collapsed on itself, the Ngorongoro Crater is the world’s largest inactive, intact volcanic caldera. Today, it acts as a natural enclosure for an incredible concentration of wildlife.</p>',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1400&q=85',
  '6 min read',
  true
),
(
  'Animals You Can See in the Ngorongoro Crater',
  'Ngorongoro',
  'From the dense populations of lions to the critically endangered black rhino, here is a guide to the incredible species you will encounter on the crater floor.',
  '<p>Because the crater provides year-round water and grazing, most of its animal residents do not migrate. This means you are virtually guaranteed to see a spectacular array of wildlife on a single game drive.</p>',
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1400&q=85',
  '5 min read',
  true
),

-- 5. AMBOSELI NATIONAL PARK
(
  'Best Views of Kilimanjaro: Why Amboseli is Photographer''s Paradise',
  'Amboseli',
  'Dusty plains, massive herds of elephants, and the snow-capped peak of Mount Kilimanjaro towering in the background. Amboseli offers the most iconic backdrop in Africa.',
  '<p>Amboseli National Park is famous for two things: its massive elephant population and its unrivaled views of Mount Kilimanjaro. Located just across the border from Tanzania, the park offers a direct, unobstructed view of the highest mountain in Africa.</p>',
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1400&q=85',
  '5 min read',
  true
),
(
  'Elephant Safaris in Amboseli: Getting Up Close with Giants',
  'Amboseli',
  'Amboseli is home to some of the largest tuskers left on the continent. Learn why this park is the premier destination in East Africa for elephant conservation and viewing.',
  '<p>The elephants of Amboseli are world-famous, largely thanks to the Amboseli Elephant Research Project, which has been studying these herds for over four decades. Because they have been protected and studied for so long, they are incredibly relaxed around vehicles.</p>',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1400&q=85',
  '6 min read',
  true
),

-- 6. LAKE NAKURU NATIONAL PARK
(
  'Rhino Tracking in Kenya: The Success Story of Lake Nakuru',
  'Lake Nakuru',
  'Lake Nakuru is one of the best places in East Africa to see both black and white rhinos in the wild. Discover the conservation efforts that saved these majestic creatures.',
  '<p>While it was originally famous for its millions of flamingos, Lake Nakuru National Park is now celebrated as one of Kenya’s most successful rhino sanctuaries. The park is heavily fenced and guarded to protect these critically endangered animals from poachers.</p>',
  'https://images.unsplash.com/photo-1504601428907-6a2e5e37ce34?w=1400&q=85',
  '7 min read',
  true
),
(
  'Birdwatching at Lake Nakuru: A Guide to the Rift Valley Lakes',
  'Lake Nakuru',
  'From the iconic lesser flamingos to over 400 other bird species, Lake Nakuru is a paradise for ornithologists and casual birdwatchers alike.',
  '<p>The shallow, alkaline waters of Lake Nakuru create the perfect environment for spirulina algae, which is the primary food source for lesser flamingos. When conditions are right, the lake turns fluorescent pink as millions of birds descend upon it.</p>',
  'https://images.unsplash.com/photo-1504601428907-6a2e5e37ce34?w=1400&q=85',
  '5 min read',
  true
),

-- 7. BWINDI IMPENETRABLE NATIONAL PARK
(
  'Uganda Gorilla Trekking Guide: Everything You Need to Know',
  'Bwindi',
  'Bwindi Impenetrable Forest is home to nearly half the world’s remaining mountain gorillas. Here is how to plan the trek of a lifetime.',
  '<p>Trekking to see mountain gorillas in their natural habitat is one of the most profound wildlife experiences on the planet. Unlike a traditional jeep safari, gorilla trekking requires you to hike through dense, humid jungle on foot.</p>',
  'https://images.unsplash.com/photo-1594803294810-c860e5d29e07?w=1400&q=85',
  '8 min read',
  true
),
(
  'What to Expect During a Gorilla Trek in Bwindi',
  'Bwindi',
  'The hike is tough, the jungle is thick, but the moment you lock eyes with a silverback makes every drop of sweat worth it. Here is a step-by-step walkthrough of the day.',
  '<p>Your day begins at 7:00 AM at the park headquarters for a safety briefing. You are assigned to a habituated gorilla family and introduced to your rangers. The hike can take anywhere from 1 to 6 hours, depending on where the gorillas are nesting that day.</p>',
  'https://images.unsplash.com/photo-1594803294810-c860e5d29e07?w=1400&q=85',
  '6 min read',
  true
),

-- 8. VOLCANOES NATIONAL PARK
(
  'Gorilla Trekking in Rwanda: Luxury and Conservation',
  'Volcanoes NP',
  'Rwanda offers the most accessible and luxurious gorilla trekking experience in Africa. Discover the high-end lodges and conservation models protecting these primates.',
  '<p>Rwanda has positioned itself as the premium destination for gorilla trekking. The permits are more expensive than in Uganda, but the infrastructure is incredibly refined. The drive from the capital, Kigali, to Volcanoes National Park is just two hours on paved roads.</p>',
  'https://images.unsplash.com/photo-1594803294810-c860e5d29e07?w=1400&q=85',
  '7 min read',
  true
),
(
  'Rwanda Safari Travel Guide: The Land of a Thousand Hills',
  'Volcanoes NP',
  'Beyond the gorillas, Rwanda offers stunning scenery, chimpanzee trekking in Nyungwe, and classic game drives in Akagera. Here is how to explore it all.',
  '<p>Rwanda is small but mighty. Nicknamed "The Land of a Thousand Hills," its dramatic, misty landscapes are breathtaking. While Volcanoes National Park draws the crowds, smart travelers stay longer to explore the rest of the country.</p>',
  'https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=1400&q=85',
  '6 min read',
  true
),

-- 9. DIANI BEACH
(
  'Is Diani the Best Beach in Africa?',
  'Diani Beach',
  'With 17 kilometers of flawless white sand and warm turquoise waters, Diani Beach continually ranks as Africa''s leading beach destination. Here is why.',
  '<p>Located just south of Mombasa, Diani Beach is the crown jewel of the Kenyan coast. The sand is incredibly fine and bright white, bordered by lush palm forests and the warm, clear waters of the Indian Ocean.</p>',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85',
  '5 min read',
  true
),
(
  'Things to Do in Diani: From Kitesurfing to Camel Rides',
  'Diani Beach',
  'While relaxing on the sand is highly recommended, Diani offers incredible water sports, reef snorkeling, and cultural tours. Plan your coastal itinerary here.',
  '<p>Diani is a hub for adventure. The consistent trade winds make it one of the best kite surfing destinations in the world. For underwater enthusiasts, the nearby Kisite-Mpunguti Marine National Park offers world-class snorkeling and diving with dolphins and sea turtles.</p>',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85',
  '6 min read',
  true
),

-- 10. ZANZIBAR
(
  'Ultimate Zanzibar Travel Guide: Spice, Sand, and Stone Town',
  'Zanzibar',
  'A melting pot of Arabic, Indian, and African cultures. Discover the rich history of Stone Town and the pristine beauty of the island''s eastern beaches.',
  '<p>Zanzibar is not just a beach destination; it is an island dripping with history and culture. From the narrow, winding alleys of Stone Town (a UNESCO World Heritage Site) to the fragrant spice plantations, there is so much to explore beyond the resorts.</p>',
  'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1400&q=85',
  '8 min read',
  true
),
(
  'Top Beaches in Zanzibar: Nungwi vs Kendwa vs Paje',
  'Zanzibar',
  'Zanzibar has a dramatic tidal shift. Choosing the right beach is critical for your vacation. We break down the differences between the north, east, and south coasts.',
  '<p>The beaches in Zanzibar are stunning, but they behave very differently. The northern beaches (Nungwi and Kendwa) have very little tidal shift, meaning you can swim all day. The eastern beaches (Paje, Jambiani) experience massive tides—at low tide, the ocean retreats for over a kilometer, making it perfect for kite surfing but challenging for swimming.</p>',
  'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1400&q=85',
  '6 min read',
  true
),
(
  'Zanzibar Honeymoon Guide: Romantic Escapes in the Indian Ocean',
  'Zanzibar',
  'Private dhow cruises at sunset, luxury beachfront villas, and intimate spice tours. Why Zanzibar is the ultimate post-safari honeymoon destination.',
  '<p>After the early mornings and dusty roads of a safari, Zanzibar provides the ultimate romantic relaxation. It is the perfect add-on to a Tanzania or Kenya itinerary. For honeymooners, we recommend seeking out boutique lodges on the quieter northeast coast or ultra-luxury resorts in Nungwi.</p>',
  'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=1400&q=85',
  '5 min read',
  true
),

-- 11. SAMBURU NATIONAL RESERVE
(
  'Unique Wildlife of Northern Kenya: The Samburu Special Five',
  'Samburu',
  'Forget the Big Five. In Samburu, you come to see the reticulated giraffe, Grevy’s zebra, Beisa oryx, Somali ostrich, and gerenuk. Meet the arid-adapted wildlife of the north.',
  '<p>Samburu National Reserve, located in the dry, rugged northern region of Kenya, feels like a completely different world compared to the lush Masai Mara. The wildlife here has uniquely adapted to the harsh, arid environment.</p>',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1400&q=85',
  '6 min read',
  true
),
(
  'The Samburu Safari Experience: Rugged, Remote, and Rewarding',
  'Samburu',
  'If you want to escape the crowds and experience a truly wild frontier, Samburu is the answer. Follow the Ewaso Ng''iro river for incredible predator sightings.',
  '<p>The lifeblood of Samburu is the Ewaso Ng’iro River. Because the surrounding landscape is so dry, all wildlife must eventually come to the river to drink. This makes game viewing incredibly concentrated and predictable. It is also one of the best places in Kenya to spot leopards.</p>',
  'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=1400&q=85',
  '7 min read',
  true
),

-- 12. MURCHISON FALLS NATIONAL PARK
(
  'Uganda''s Most Spectacular Waterfall: The Power of Murchison Falls',
  'Murchison Falls',
  'Watch the entire Nile River squeeze through a 7-meter gorge and plunge 43 meters below. The sheer power of Murchison Falls will leave you breathless.',
  '<p>Murchison Falls National Park is Uganda’s largest and oldest conservation area. The centerpiece of the park is the falls themselves, where the mighty Victoria Nile is forced through a narrow gap in the rocks, creating a deafening roar and a perpetual rainbow.</p>',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1400&q=85',
  '5 min read',
  true
),
(
  'Wildlife and Boat Safaris in Murchison Falls',
  'Murchison Falls',
  'Combine traditional game drives on the savanna with incredibly relaxing boat safaris up the Nile. Expect hippos, crocodiles, and massive herds of Rothschild’s giraffes.',
  '<p>A safari in Murchison Falls is unique because it is split between land and water. The northern bank of the river is classic savanna, teeming with elephants, buffalo, lions, and the endangered Rothschild’s giraffe. In the afternoon, a boat cruise up the Nile towards the falls offers unparalleled views of massive crocodiles and pods of hippos.</p>',
  'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=1400&q=85',
  '6 min read',
  true
);
