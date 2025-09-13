# Sniply Blog Starter

A minimal, fast, and beautiful blog starter built with Next.js 15, designed for sharing bite-sized tech tips and insights. Perfect for developers who want to quickly publish short, focused content.

## ✨ Features

### Core Technology Stack

- **Next.js 15** with App Router for optimal performance
- **React 19** with the latest features
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **MDX** for rich content authoring

### Content Management

- **File-based content** - Write posts as `.mdx` files in the `docs/` directory
- **Frontmatter support** - Rich metadata with title, summary, tags, and publish dates
- **Automatic routing** - Posts automatically become routes at `/blog/[slug]`
- **Tag filtering** - Built-in tag system for content organization

### Developer Experience

- **Fast refresh** with Next.js development server
- **Type safety** throughout the application
- **ESLint & Biome** for code quality and formatting
- **Hot reload** for instant development feedback

### User Experience

- **Dark/Light theme** with system preference detection
- **Responsive design** - Works perfectly on all devices
- **SEO optimized** - Meta tags, Open Graph, and Twitter cards
- **RSS feed** - Automatically generated at `/rss.xml`
- **Sitemap** - Auto-generated for search engines
- **Minimal, clean design** - Focus on content readability

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun (recommended)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/mohsenfallahnjd/sniply.git
   cd sniply
   ```

2. **Install dependencies**

   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

3. **Start the development server**

   ```bash
   # Using Bun
   bun dev
   
   # Or using npm
   npm run dev
   
   # Or using yarn
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Writing Posts

### Creating a New Post

1. Create a new `.mdx` file in the `docs/` directory
2. Add frontmatter with metadata
3. Write your content using Markdown and JSX

### Example Post Structure

```mdx
---
title: "Your Post Title"
summary: "A brief description of your post"
publishedTime: "2025-01-20"
tags: ["javascript", "react", "tips"]
---

# Your Post Title

Your content here. You can use:

- **Markdown** formatting
- `code blocks`
- [Links](https://example.com)
- JSX components (if needed)

## Code Examples

```javascript
const example = "Hello, world!";
console.log(example);
```

That's it! Your post will automatically appear at `/blog/your-slug`.

```

### Frontmatter Fields

- `title` - The post title (required)
- `summary` - Brief description for listings (optional)
- `publishedTime` - Publication date in YYYY-MM-DD format (optional)
- `tags` - Array of tags for categorization (optional)

## 🛠️ Development

### Available Scripts

```bash
# Development
bun dev          # Start development server

# Building
bun build        # Build for production
bun start        # Start production server

# Code Quality
bun format       # Format code with Biome
bun lint:fix     # Fix linting issues
bun check        # Run all checks (format + lint)
bun typegen      # Generate Next.js types
```

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── blog/              # Blog pages
│   │   ├── [...slug]/     # Dynamic blog post routes
│   │   └── page.tsx       # Blog listing page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── rss.xml/           # RSS feed route
│   └── sitemap.ts         # Sitemap generation
├── components/            # React components
│   ├── Header.tsx         # Site header
│   ├── Footer.tsx         # Site footer
│   ├── PostCard.tsx       # Blog post preview
│   ├── PostMeta.tsx       # Post metadata
│   └── ThemeToggle.tsx    # Dark/light theme toggle
├── docs/                  # MDX blog posts
│   ├── docker-in-2-minutes.mdx
│   └── solid-principles.mdx
├── lib/                   # Utility functions
│   └── mdSource.ts        # MDX processing utilities
└── public/                # Static assets
    └── favicon.svg
```

## 🎨 Customization

### Styling

- Modify `app/globals.css` for global styles
- Use Tailwind classes throughout components
- Customize the color scheme in `tailwind.config.js`

### Theme

- The theme toggle is located in the header
- Supports light, dark, and system preference modes
- Theme preference is persisted in localStorage

### Content

- Add your own posts to the `docs/` directory
- Customize the home page in `app/page.tsx`
- Modify the blog listing in `app/blog/page.tsx`

### Metadata

- Update site metadata in `app/layout.tsx`
- Modify the RSS feed in `app/rss.xml/route.ts`
- Customize the sitemap in `app/sitemap.ts`

## 📦 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Other Platforms

The project can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

### Build Command

```bash
bun build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Content powered by [MDX](https://mdxjs.com/)
- Icons from [Heroicons](https://heroicons.com/)

---

**Happy blogging!** 🚀

For questions or support, please open an issue on GitHub.
