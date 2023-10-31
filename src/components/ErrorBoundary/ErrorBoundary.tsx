import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error('Uncaught error: ', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <main className='h-screen w-full flex flex-col justify-center items-center'>
          <h1 className='text-9xl font-extrabold  tracking-widest text-gray-900'>500</h1>
          <div className='bg-orange px-2 text-sm rounded text-white rotate-12 absolute '>Error!</div>
          <button className='mt-5'>
            <a
              href='/'
              className='relative inline-block text-sm font-medium text-white group active:text-orange-500 focus:outline-none focus:ring'
            >
              <span className='absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-[#FF6A3D] group-hover:translate-y-0 group-hover:translate-x-0' />
              <span className='relative block px-8 py-3 bg-orange border border-current'>
                <span>Go Home</span>
              </span>
            </a>
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
