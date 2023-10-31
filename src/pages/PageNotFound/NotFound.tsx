import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className='h-screen w-full flex flex-col justify-center items-center'>
      <h1 className='text-9xl font-extrabold  tracking-widest text-gray-900'>404</h1>
      <div className='bg-orange px-2 text-sm rounded text-white rotate-12 absolute '>Page Not Found</div>
      <button className='mt-5'>
        <Link
          to='/'
          className='relative inline-block text-sm font-medium text-white group active:text-orange-500 focus:outline-none focus:ring'
        >
          <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0' />
          <span className='relative block px-8 py-3 bg-orange border border-current'>
            <span>Go Home</span>
          </span>
        </Link>
      </button>
    </main>
  )
}
