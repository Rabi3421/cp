import { NextResponse } from 'next/server'

import { HeaderItem } from '@/app/types/menu'
import { aboutdata } from '@/app/types/aboutdata'
import { workdata } from '@/app/types/workdata'
import { featureddata } from '@/app/types/featureddata'
import { testimonials } from '@/app/types/testimonials'
import { articles } from '@/app/types/articles'
import { footerlinks } from '@/app/types/footerlinks'
import { Celebrity } from '@/app/types/celebrity'
import { Outfit } from '@/app/types/outfit'
import { News } from '@/app/types/news'
import { Movie } from '@/app/types/movie'
import { Blog } from '@/app/types/blog'

// header nav-links data
const headerData: HeaderItem[] = [
  {
    label: 'Celebrities',
    href: '/celebrities',
  },
  {
    label: 'Outfit Decode',
    href: '/outfits',
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'Blogs',
    href: '/blogs',
  },
  {
    label: 'Movies',
    href: '/movies',
  }

]

// about data
const Aboutdata: aboutdata[] = [
  {
    heading: 'About us.',
    imgSrc: '/images/aboutus/imgOne.svg',
    paragraph:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem',
    link: 'Learn more',
  },
  {
    heading: 'Services.',
    imgSrc: '/images/aboutus/imgTwo.svg',
    paragraph:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem',
    link: 'Learn more',
  },
  {
    heading: 'Our Works.',
    imgSrc: '/images/aboutus/imgThree.svg',
    paragraph:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem',
    link: 'Learn more',
  },
]

// work-data
const WorkData: workdata[] = [
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar.svg',
  },
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar3.svg',
  },
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar4.svg',
  },
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar.svg',
  },
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar3.svg',
  },
  {
    profession: 'Co-founder',
    name: 'John Doe',
    imgSrc: '/images/wework/avatar4.svg',
  },
]

// featured data
const FeaturedData: featureddata[] = [
  {
    heading: 'Brand design for a computer brand.',
    imgSrc: '/images/featured/feat1.jpg',
  },
  {
    heading: 'Mobile app 3d wallpaper.',
    imgSrc: '/images/featured/feat2.jpg',
  },
  {
    heading: 'Brand design for a computer brand.',
    imgSrc: '/images/featured/feat1.jpg',
  },
  {
    heading: 'Mobile app 3d wallpaper.',
    imgSrc: '/images/featured/feat2.jpg',
  },
]

// plans data
const PlansData = [
  {
    heading: 'Startup',
    price: {
      monthly: 19,
      yearly: 190,
    },
    user: 'per user',
    features: {
      profiles: '5 Social Profiles',
      posts: '5 Scheduled Posts Per Profile',
      templates: '400+ Templated',
      view: 'Calendar View',
      support: '24/7 Support',
    },
  },
  {
    heading: 'Business',
    price: {
      monthly: 29,
      yearly: 290,
    },
    user: 'per user',
    features: {
      profiles: '10 Social Profiles',
      posts: '5 Scheduled Posts Per Profile',
      templates: '600+ Templated',
      view: 'Calendar View',
      support: '24/7 VIP Support',
    },
  },
  {
    heading: 'Agency',
    price: {
      monthly: 59,
      yearly: 590,
    },
    user: 'per user',
    features: {
      profiles: '100 Social Profiles',
      posts: '100 Scheduled Posts Per Profile',
      templates: '800+ Templated',
      view: 'Calendar View',
      support: '24/7 VIP Support',
    },
  },
]

// testimonial data
const TestimonialsData: testimonials[] = [
  {
    name: 'Robert Fox',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user1.svg',
    rating: 5,
  },
  {
    name: 'Leslie Alexander',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user2.svg',
    rating: 4,
  },
  {
    name: 'Cody Fisher',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user3.svg',
    rating: 4,
  },
  {
    name: 'Robert Fox',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user1.svg',
    rating: 4,
  },
  {
    name: 'Leslie Alexander',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user2.svg',
    rating: 4,
  },
  {
    name: 'Cody Fisher',
    profession: 'CEO, Parkview Int.Ltd',
    comment:
      'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
    imgSrc: '/images/testimonial/user3.svg',
    rating: 4,
  },
]

// artical data
const ArticlesData: articles[] = [
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article.png',
  },
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article2.png',
  },
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article3.png',
  },
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article.png',
  },
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article2.png',
  },
  {
    time: '5 min',
    heading: 'We Launch Delia',
    heading2: 'Webflow this Week!',
    name: 'Published on Startupon',
    date: 'february 19, 2025',
    imgSrc: '/images/articles/article3.png',
  },
]

// footer links data
const FooterLinksData: footerlinks[] = [
  {
    section: 'Menu',
    links: [
      { label: 'About Us', href: '#About' },
      { label: 'Team', href: '#Team' },
      { label: 'FAQ', href: '#FAQ' },
      { label: 'Blog', href: '#Blog' },
    ],
  },
  {
    section: 'Category',
    links: [
      { label: 'Design', href: '/' },
      { label: 'Mockup', href: '/' },
      { label: 'View all', href: '/' },
      { label: 'Log In', href: '/' },
    ],
  },
  {
    section: 'Pages',
    links: [
      { label: '404', href: '/' },
      { label: 'Instructions', href: '/' },
      { label: 'License', href: '/' },
    ],
  },
  {
    section: 'Others',
    links: [
      { label: 'Styleguide', href: '/' },
      { label: 'Changelog', href: '/' },
    ],
  },
]

// celebrities data
const CelebritiesData: Celebrity[] = [
  {
    id: 'emma-watson',
    name: 'Emma Watson',
    image: '/images/wework/avatar.svg',
    category: 'Actor',
    occupation: 'Actress, Activist',
    birthDate: 'April 15, 1990',
    birthPlace: 'Paris, France',
    height: '5\'5" (165 cm)',
    nationality: 'British',
    biography: 'Emma Charlotte Duerre Watson is an English actress and activist. Known for her roles in both blockbusters and independent films, she has received various awards and nominations.',
    earlyLife: 'Born in Paris and raised in Oxfordshire, Watson attended the Dragon School and trained in acting at the Oxford branch of Stagecoach Theatre Arts. As a child, she rose to prominence with her first professional acting role as Hermione Granger in the Harry Potter film series, having acted only in school plays previously.',
    career: 'Watson gained recognition for her starring role as Hermione Granger in the Harry Potter film series (2001–2011), earning worldwide fame, critical accolades, and around $60 million. After the series, she moved to more diverse roles including The Perks of Being a Wallflower (2012), The Bling Ring (2013), Noah (2014), and as Belle in the live-action Beauty and the Beast (2017).',
    personalLife: 'From 2011 to 2014, Watson split her time between working on films and continuing her education, graduating from Brown University with a bachelor\'s degree in English literature. She is a prominent activist for women\'s rights and was appointed UN Women Goodwill Ambassador in 2014.',
    awards: [
      { year: '2014', title: 'British Artist of the Year', category: 'Achievement Award' },
      { year: '2017', title: 'MTV Movie Awards', category: 'Best Actor', work: 'Beauty and the Beast' },
      { year: '2001', title: 'Young Artist Award', category: 'Leading Young Actress', work: 'Harry Potter' },
    ],
    filmography: [
      { year: '2001-2011', title: 'Harry Potter Series', role: 'Hermione Granger', type: 'Movie' },
      { year: '2012', title: 'The Perks of Being a Wallflower', role: 'Sam', type: 'Movie' },
      { year: '2013', title: 'The Bling Ring', role: 'Nicki', type: 'Movie' },
      { year: '2017', title: 'Beauty and the Beast', role: 'Belle', type: 'Movie' },
      { year: '2019', title: 'Little Women', role: 'Meg March', type: 'Movie' },
    ],
    socialMedia: {
      instagram: 'https://instagram.com/emmawatson',
      twitter: 'https://twitter.com/EmmaWatson',
    },
  },
  {
    id: 'tom-holland',
    name: 'Tom Holland',
    image: '/images/wework/avatar3.svg',
    category: 'Actor',
    occupation: 'Actor, Producer',
    birthDate: 'June 1, 1996',
    birthPlace: 'Kingston upon Thames, England',
    height: '5\'8" (173 cm)',
    nationality: 'British',
    biography: 'Thomas Stanley Holland is an English actor. His accolades include a British Academy Film Award and three Saturn Awards.',
    earlyLife: 'Holland was born and raised in Kingston upon Thames, London. He attended Donhead Prep School, followed by Wimbledon College. At age 12, he made his West End debut in Billy Elliot the Musical.',
    career: 'Holland began his acting career on stage in the title role of Billy Elliot the Musical in London\'s West End from 2008 to 2010. He gained international recognition for playing Spider-Man/Peter Parker in the Marvel Cinematic Universe, appearing in Captain America: Civil War (2016), Spider-Man: Homecoming (2017), Avengers: Infinity War (2018), Avengers: Endgame (2019), Spider-Man: Far From Home (2019), and Spider-Man: No Way Home (2021).',
    personalLife: 'Holland is known for his dedication to his roles and performing his own stunts. He is an ambassador for The Brothers Trust, a charity founded by his family.',
    awards: [
      { year: '2017', title: 'BAFTA Rising Star Award', category: 'Rising Star' },
      { year: '2021', title: 'Saturn Award', category: 'Best Actor', work: 'Spider-Man: No Way Home' },
      { year: '2022', title: 'MTV Movie Awards', category: 'Best Performance', work: 'Spider-Man: No Way Home' },
    ],
    filmography: [
      { year: '2016', title: 'Captain America: Civil War', role: 'Spider-Man/Peter Parker', type: 'Movie' },
      { year: '2017', title: 'Spider-Man: Homecoming', role: 'Spider-Man/Peter Parker', type: 'Movie' },
      { year: '2019', title: 'Spider-Man: Far From Home', role: 'Spider-Man/Peter Parker', type: 'Movie' },
      { year: '2021', title: 'Spider-Man: No Way Home', role: 'Spider-Man/Peter Parker', type: 'Movie' },
      { year: '2022', title: 'Uncharted', role: 'Nathan Drake', type: 'Movie' },
    ],
    socialMedia: {
      instagram: 'https://instagram.com/tomholland2013',
      twitter: 'https://twitter.com/TomHolland1996',
    },
  },
  {
    id: 'zendaya',
    name: 'Zendaya',
    image: '/images/wework/avatar4.svg',
    category: 'Actor',
    occupation: 'Actress, Singer, Producer',
    birthDate: 'September 1, 1996',
    birthPlace: 'Oakland, California, USA',
    height: '5\'10" (178 cm)',
    nationality: 'American',
    biography: 'Zendaya Maree Stoermer Coleman is an American actress and singer. She has received various accolades, including two Primetime Emmy Awards.',
    earlyLife: 'Zendaya was born and raised in Oakland, California. Her stage name, "Zendaya", is derived from the Shona name Tendai. She began her career appearing in stage productions and playing Rocky Blue on Disney Channel\'s Shake It Up (2010–2013).',
    career: 'Zendaya has starred in the superhero film Spider-Man: Homecoming (2017) and its sequels. Her role as Rue Bennett in the HBO teen drama series Euphoria (2019–present) made her the youngest recipient of the Primetime Emmy Award for Outstanding Lead Actress in a Drama Series. She has also starred in the musical films The Greatest Showman (2017) and Malcolm & Marie (2021), and the science fiction film Dune (2021) and its sequel Dune: Part Two (2024).',
    personalLife: 'Time magazine named her one of the 100 most influential people in the world on its annual list in 2022. She is known for her fashion sense and has collaborated with Tommy Hilfiger.',
    awards: [
      { year: '2020', title: 'Primetime Emmy Award', category: 'Outstanding Lead Actress', work: 'Euphoria' },
      { year: '2022', title: 'Primetime Emmy Award', category: 'Outstanding Lead Actress', work: 'Euphoria' },
      { year: '2021', title: 'Critics Choice Award', category: 'Best Actress', work: 'Euphoria' },
    ],
    filmography: [
      { year: '2017', title: 'Spider-Man: Homecoming', role: 'MJ', type: 'Movie' },
      { year: '2017', title: 'The Greatest Showman', role: 'Anne Wheeler', type: 'Movie' },
      { year: '2019-Present', title: 'Euphoria', role: 'Rue Bennett', type: 'TV Show' },
      { year: '2021', title: 'Dune', role: 'Chani', type: 'Movie' },
      { year: '2024', title: 'Dune: Part Two', role: 'Chani', type: 'Movie' },
    ],
    socialMedia: {
      instagram: 'https://instagram.com/zendaya',
      twitter: 'https://twitter.com/Zendaya',
    },
  },
]

// outfits data
const OutfitsData: Outfit[] = [
  {
    id: 'emma-watson-red-carpet-2024',
    title: 'Emma Watson\'s Stunning Red Carpet Look',
    celebrity: 'Emma Watson',
    celebrityId: 'emma-watson',
    image: '/images/featured/feat1.jpg',
    event: 'Met Gala 2024',
    date: 'May 6, 2024',
    description: 'Emma Watson turned heads at the Met Gala 2024 with this breathtaking sustainable fashion ensemble. The outfit perfectly combines elegance with environmental consciousness.',
    items: [
      {
        name: 'Sustainable Evening Gown',
        brand: 'Stella McCartney',
        category: 'Dress',
        price: '$8,500',
        image: '/images/featured/feat1.jpg',
      },
      {
        name: 'Diamond Drop Earrings',
        brand: 'Chopard',
        category: 'Jewelry',
        price: '$12,000',
      },
      {
        name: 'Satin Clutch',
        brand: 'Gucci',
        category: 'Accessories',
        price: '$2,800',
      },
      {
        name: 'Classic Pumps',
        brand: 'Christian Louboutin',
        category: 'Shoes',
        price: '$1,200',
      },
    ],
    totalCost: '$24,500',
    tags: ['Red Carpet', 'Met Gala', 'Sustainable Fashion', 'Evening Wear'],
  },
  {
    id: 'zendaya-street-style',
    title: 'Zendaya\'s Effortless Street Style',
    celebrity: 'Zendaya',
    celebrityId: 'zendaya',
    image: '/images/featured/feat2.jpg',
    event: 'NYC Street Style',
    date: 'March 15, 2024',
    description: 'Zendaya showcases her signature street style with this casual yet chic ensemble perfect for everyday wear.',
    items: [
      {
        name: 'Oversized Blazer',
        brand: 'Valentino',
        category: 'Outerwear',
        price: '$3,200',
      },
      {
        name: 'White T-Shirt',
        brand: 'James Perse',
        category: 'Tops',
        price: '$95',
      },
      {
        name: 'High-Waist Jeans',
        brand: 'Levi\'s',
        category: 'Bottoms',
        price: '$128',
      },
      {
        name: 'Sneakers',
        brand: 'Nike',
        category: 'Shoes',
        price: '$150',
      },
    ],
    totalCost: '$3,573',
    tags: ['Street Style', 'Casual', 'Urban', 'Everyday Wear'],
  },
]

// news data
const NewsData: News[] = [
  {
    id: 'emma-watson-new-project',
    title: 'Emma Watson Announces New Environmental Documentary',
    excerpt: 'The actress and activist reveals her upcoming project focused on sustainable fashion and climate change.',
    content: 'Emma Watson has announced her involvement in a groundbreaking documentary series exploring the intersection of fashion and environmental sustainability. The project, set to premiere next year, will take viewers behind the scenes of the fashion industry while highlighting innovative solutions for a more sustainable future. Watson, known for her advocacy work, will serve as both narrator and executive producer.',
    image: '/images/articles/article.png',
    category: 'Celebrity News',
    author: 'Sarah Johnson',
    publishDate: 'January 28, 2026',
    readTime: '5 min',
    tags: ['Emma Watson', 'Documentary', 'Sustainability', 'Fashion'],
  },
  {
    id: 'tom-holland-spider-man-4',
    title: 'Tom Holland Confirms Spider-Man 4 in Development',
    excerpt: 'The actor gives fans exciting news about the next installment in the Marvel franchise.',
    content: 'In a recent interview, Tom Holland confirmed that Spider-Man 4 is officially in development at Marvel Studios. While details remain under wraps, Holland expressed excitement about returning to the iconic role and hinted at a more mature storyline for Peter Parker. Fans can expect the film to hit theaters in late 2027.',
    image: '/images/articles/article2.png',
    category: 'Movie News',
    author: 'Michael Chen',
    publishDate: 'January 25, 2026',
    readTime: '4 min',
    tags: ['Tom Holland', 'Spider-Man', 'Marvel', 'Movies'],
  },
  {
    id: 'zendaya-emmy-nomination',
    title: 'Zendaya Receives Third Emmy Nomination for Euphoria',
    excerpt: 'The actress continues her award-winning streak with another nomination for her role as Rue Bennett.',
    content: 'Zendaya has received her third consecutive Emmy nomination for Outstanding Lead Actress in a Drama Series for her powerful performance in Euphoria Season 3. The actress, who made history as the youngest actress to win the award, continues to captivate audiences with her nuanced portrayal of addiction and recovery.',
    image: '/images/articles/article3.png',
    category: 'Awards',
    author: 'Emily Rodriguez',
    publishDate: 'January 20, 2026',
    readTime: '3 min',
    tags: ['Zendaya', 'Emmy', 'Euphoria', 'Awards'],
  },
]

// movies data
const MoviesData: Movie[] = [
  {
    id: 'spider-man-no-way-home',
    title: 'Spider-Man: No Way Home',
    poster: '/images/featured/feat1.jpg',
    releaseDate: 'December 17, 2021',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    rating: 8.7,
    runtime: '2h 28min',
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch'],
    synopsis: 'With Spider-Man\'s identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.',
    boxOffice: '$1.9 billion',
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    poster: '/images/featured/feat2.jpg',
    releaseDate: 'March 1, 2024',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: 8.9,
    runtime: '2h 46min',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future.',
    boxOffice: '$711 million',
  },
  {
    id: 'little-women',
    title: 'Little Women',
    poster: '/images/featured/feat1.jpg',
    releaseDate: 'December 25, 2019',
    genre: ['Drama', 'Romance'],
    rating: 7.8,
    runtime: '2h 15min',
    director: 'Greta Gerwig',
    cast: ['Saoirse Ronan', 'Emma Watson', 'Florence Pugh'],
    synopsis: 'In the years after the Civil War, Jo March and her two sisters return home when shy sister Beth develops a devastating illness. As they face romantic and personal challenges, the sisters bond together.',
    boxOffice: '$218 million',
  },
]

const BlogsData: Blog[] = [
  {
    id: '1',
    title: 'Top 10 Celebrity Style Icons of 2024',
    excerpt: 'Discover the celebrities who defined fashion this year with their impeccable style choices and trendsetting looks.',
    content: `This year has been exceptional for celebrity fashion. From red carpet glamour to street style excellence, these icons have consistently impressed us with their wardrobe choices.

Our top pick goes to the ever-stylish Zendaya, whose ability to blend haute couture with everyday wear has made her a true fashion chameleon. Her stylist Law Roach has helped craft looks that are both daring and sophisticated.

Timothée Chalamet continues to push boundaries in men's fashion, embracing bold colors and unconventional silhouettes that challenge traditional menswear norms. His collaboration with designers like Haider Ackermann has resulted in memorable red carpet moments.

Other notable mentions include Florence Pugh's fearless approach to fashion, always choosing pieces that express her personality rather than following trends. Harry Styles remains a fashion force, his gender-fluid style inspiring a new generation of fashion enthusiasts.

The common thread among these style icons? Authenticity. They wear what makes them feel confident and comfortable, which is the ultimate secret to great style.`,
    image: '/images/featured/featuredOne.svg',
    author: 'Sarah Mitchell',
    authorAvatar: '/images/team/user1.svg',
    publishDate: 'December 15, 2024',
    readTime: '8 min read',
    category: 'Fashion',
    tags: ['style', 'fashion', 'trends', 'celebrities', 'red carpet'],
    featured: true,
  },
  {
    id: '2',
    title: 'Behind the Scenes: How Celebrity Stylists Work',
    excerpt: 'An insider look into the world of celebrity styling and the creative process behind iconic looks.',
    content: `Ever wondered how celebrities always look perfect? The secret lies in their collaboration with professional stylists who work tirelessly behind the scenes.

A celebrity stylist's day often starts months before an event. They research designers, attend fashion shows, and build relationships with luxury brands. When a major event approaches, they might pull dozens of looks for their client to try.

The fitting process is where magic happens. It's not just about finding a beautiful dress; it's about understanding the celebrity's body, personality, and the message they want to convey. Alterations are common, with pieces often customized to fit perfectly.

On event day, stylists arrive hours early to ensure every detail is perfect. From the way a jacket sits on the shoulders to the length of a hem, nothing is left to chance. They work closely with hair and makeup teams to create a cohesive look.

The relationship between stylist and celebrity is built on trust. Many partnerships last decades, with stylists becoming integral members of their client's team. This trust allows for creative risks that often result in fashion history.`,
    image: '/images/featured/featuredTwo.svg',
    author: 'Michael Chen',
    authorAvatar: '/images/team/user2.svg',
    publishDate: 'December 10, 2024',
    readTime: '6 min read',
    category: 'Industry',
    tags: ['styling', 'fashion', 'celebrity', 'behind the scenes'],
    featured: false,
  },
  {
    id: '3',
    title: 'Sustainable Fashion in Hollywood',
    excerpt: 'How celebrities are embracing eco-friendly fashion choices and promoting sustainability in the industry.',
    content: `Hollywood is increasingly embracing sustainable fashion, with celebrities using their platforms to promote environmental consciousness in the fashion industry.

Emma Watson has been a pioneer in this movement, exclusively wearing sustainable brands on red carpets and using the #GreenCarpetChallenge. Her commitment has inspired other celebrities to consider the environmental impact of their fashion choices.

Many stars are now rewearing outfits, challenging the expectation that celebrities should always appear in something new. Kate Middleton has famously reworn outfits dozens of times, helping normalize outfit repetition among high-profile figures.

Vintage fashion has also seen a resurgence. Stars like Zendaya and Cate Blanchett frequently choose archival pieces from fashion houses, giving new life to vintage designs while reducing demand for new production.

Sustainable brands are gaining celebrity endorsements, with designers creating beautiful pieces from recycled materials and using ethical production methods. This shift is proving that sustainable fashion can be just as glamorous and desirable as traditional luxury fashion.

The impact of these celebrity choices extends beyond the red carpet, influencing millions of fans to consider sustainability in their own fashion decisions.`,
    image: '/images/featured/featuredThree.svg',
    author: 'Emma Rodriguez',
    authorAvatar: '/images/team/user3.svg',
    publishDate: 'December 8, 2024',
    readTime: '7 min read',
    category: 'Sustainability',
    tags: ['sustainable fashion', 'eco-friendly', 'green carpet', 'vintage'],
    featured: false,
  },
]

export const GET = () => {
  return NextResponse.json({
    headerData,
    Aboutdata,
    WorkData,
    FeaturedData,
    PlansData,
    TestimonialsData,
    ArticlesData,
    FooterLinksData,
    CelebritiesData,
    OutfitsData,
    NewsData,
    BlogsData,
    MoviesData,
  })
}
