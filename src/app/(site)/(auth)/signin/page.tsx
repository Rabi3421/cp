import Signin from '@/app/components/Auth/SignIn'
import Breadcrumb from '@/app/components/Common/Breadcrumb'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In | CelebrityPersona',
}

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName='Sign In' />

      <Signin />
    </>
  )
}

export default SigninPage
