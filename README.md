# Civil Rights Hub

**Empowering Citizens with Legal Knowledge and Resources**

## About the Project

Civil Rights Hub is a comprehensive civil rights platform built to help citizens understand and protect their constitutional rights. The platform provides:

- 📚 **Legal Resources** - Comprehensive federal and state-specific civil rights laws
- 👨‍⚖️ **Attorney Directory** - Searchable database of civil rights attorneys
- 📝 **Violation Reporting** - Report and track civil rights violations
- 🔍 **Case Search** - AI-powered legal case research
- 📄 **FOIA Requests** - Template-based Freedom of Information Act request builder
- 📱 **Know Your Rights** - Downloadable pocket guides for constitutional rights
- 💬 **Community Forums** - Discussion boards for civil rights topics
- 📡 **Police Scanners** - Links to live police scanner feeds
- 🗓️ **Court Watch** - Calendar of upcoming civil rights hearings

## Getting Started

### Prerequisites

- Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- Supabase account (for backend services)

### Installation

```sh
# Clone the repository
git clone https://github.com/patriotnewsactivism/act-now-hub.git

# Navigate to project directory
cd act-now-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Setup

Create a `.env` file with your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Maps**: react-simple-maps, topojson-client
- **PDF Generation**: jsPDF
- **AI Integration**: Gemini 2.5 Flash via AI Gateway

## Development

### Available Scripts

- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Commands

- `supabase db push` - Apply migrations
- `supabase gen types typescript --local > src/integrations/supabase/types.ts` - Generate types

## Documentation

- [CLAUDE.md](CLAUDE.md) - Comprehensive project documentation and architecture
- [AGENTS.md](AGENTS.md) - Contributor guidelines and workflows
- [FEATURES.md](FEATURES.md) - Detailed feature documentation
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment instructions

## Contributing

We welcome contributions! Please see [AGENTS.md](AGENTS.md) for contributor best practices and required workflows.

## License

This project is open source and available for public use to promote civil rights awareness and education.

## Support

For questions or issues, please open an issue on GitHub or contact support@civilrightshub.org
