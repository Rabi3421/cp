import Image from 'next/image'
import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link href='/' className='inline-flex items-center'>
      <Image
        src='/images/logo/logo.png'
        alt='CelebrityPersona'
        width={220}
        height={30}
        priority
      />
    </Link>
  )
}

export default Logo
