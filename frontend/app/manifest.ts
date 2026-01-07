import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shikshak - Revolutionizing Education',
    short_name: 'Shikshak',
    description: 'Empowering students and teachers with cutting-edge tools and resources.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#4F46E5',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}
