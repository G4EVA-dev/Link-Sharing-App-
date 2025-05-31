# Link Sharing Platform

A modern web application for sharing and managing social media links, built with Next.js, TypeScript, and Firebase.

## Features

- 🔐 Secure user authentication
- 🔗 Link management with real-time updates
- 📱 Responsive design for all devices
- 🎨 Modern and clean UI
- 🔄 Real-time data synchronization
- 🛡️ Error handling and loading states
- ♿ Accessibility support

## Tech Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Icons**: React Icons
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Firebase account

### Environment Setup

1. Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/link-sharing.git
cd link-sharing
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
link-sharing/
├── app/                    # Next.js app directory
│   ├── login/             # Login page
│   ├── createAccount/     # Account creation
│   ├── link/             # Link management
│   ├── profile/          # User profile
│   └── preview/          # Link preview
├── components/            # Reusable components
├── services/             # API and service functions
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── styles/              # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All Firebase configuration is stored in environment variables
- Authentication is handled securely through Firebase Auth
- Data is validated both client and server-side
- Proper error handling and user feedback
- Rate limiting on authentication attempts

## Performance

- Code splitting for better load times
- Image optimization
- Proper caching strategies
- Lazy loading of components
- Efficient state management

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Color contrast compliance

## Testing

- Unit tests for components
- Integration tests for features
- End-to-end testing
- Error boundary testing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Firebase team for the backend services
- Tailwind CSS for the styling solution
- React Icons for the icon library

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
