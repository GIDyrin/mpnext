import Image from 'next/image'
import logo from '@/public/logo.png'

export const Logo = () => (
  <Image 
    src={logo} 
    alt="Logo" 
    width={180}  
    height={60}   
    className="h-12 w-auto" 
    priority     
  />
)