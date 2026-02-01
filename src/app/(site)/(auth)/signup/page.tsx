import SignUp from '@/app/components/Auth/SignUp'
import Breadcrumb from '@/app/components/Common/Breadcrumb'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | CelebrityPersona',
}

const SignupPage = () => {
  return (
    <>
      <Breadcrumb pageName='Sign Up' />

      <SignUp />
    </>
  )
}

export default SignupPage
