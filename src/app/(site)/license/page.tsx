'use client'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const LicensePage = () => {
  return (
    <main className='bg-grey'>
      <section className='pt-32 pb-20'>
        <div className='container mx-auto max-w-4xl px-4'>
          <Link 
            href='/'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-primary transition mb-8'>
            <Icon icon='tabler:arrow-left' width='20' height='20' />
            <span>Back to Home</span>
          </Link>

          <div className='bg-white rounded-3xl p-8 md:p-12 shadow-xl'>
            <div className='text-center mb-12'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <Icon icon='mdi:file-certificate' width='32' height='32' className='text-white' />
              </div>
              <h1 className='text-4xl font-bold mb-4'>Terms & License</h1>
              <p className='text-lg text-gray-600'>
                Please read these terms carefully before using CelebrityPersona
              </p>
            </div>

            <div className='prose prose-lg max-w-none space-y-8'>
              <div>
                <h2 className='text-2xl font-bold mb-4'>1. License Grant</h2>
                <p className='text-gray-700 leading-relaxed'>
                  CelebrityPersona grants you a non-exclusive, non-transferable license to use this website for personal, non-commercial purposes. You may browse, search, and view content on the platform subject to these terms.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>2. Intellectual Property</h2>
                <p className='text-gray-700 leading-relaxed mb-4'>
                  All content on CelebrityPersona, including but not limited to text, images, graphics, logos, and software, is the property of CelebrityPersona or its content suppliers and is protected by international copyright laws.
                </p>
                <ul className='list-disc pl-6 text-gray-700 space-y-2'>
                  <li>Celebrity images and information are used for editorial purposes</li>
                  <li>Fashion brand names and logos are trademarks of their respective owners</li>
                  <li>Original articles and outfit breakdowns are copyrighted material</li>
                </ul>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>3. Permitted Use</h2>
                <p className='text-gray-700 leading-relaxed'>
                  You may use CelebrityPersona to:
                </p>
                <ul className='list-disc pl-6 text-gray-700 space-y-2 mt-4'>
                  <li>Browse and read articles, news, and blog posts</li>
                  <li>View celebrity profiles and outfit breakdowns</li>
                  <li>Share content on social media platforms</li>
                  <li>Save articles for personal reference</li>
                </ul>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>4. Prohibited Activities</h2>
                <p className='text-gray-700 leading-relaxed'>
                  You may NOT:
                </p>
                <ul className='list-disc pl-6 text-gray-700 space-y-2 mt-4'>
                  <li>Copy, reproduce, or redistribute content for commercial purposes</li>
                  <li>Scrape, crawl, or automatically extract data from the website</li>
                  <li>Modify, reverse engineer, or create derivative works</li>
                  <li>Remove copyright notices or attribution</li>
                  <li>Use content to train AI models without permission</li>
                </ul>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>5. Third-Party Content</h2>
                <p className='text-gray-700 leading-relaxed'>
                  CelebrityPersona may contain links to third-party websites and references to third-party products. We are not responsible for the content, accuracy, or practices of these external sites. Product prices and availability are subject to change by retailers.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>6. Disclaimer</h2>
                <p className='text-gray-700 leading-relaxed'>
                  Content on CelebrityPersona is provided "as is" for informational purposes. While we strive for accuracy, we make no warranties about the completeness, reliability, or accuracy of information. Fashion prices, product availability, and celebrity information may change without notice.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>7. Limitation of Liability</h2>
                <p className='text-gray-700 leading-relaxed'>
                  CelebrityPersona shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use this website, including but not limited to damages for loss of profits, data, or other intangible losses.
                </p>
              </div>

              <div>
                <h2 className='text-2xl font-bold mb-4'>8. Changes to Terms</h2>
                <p className='text-gray-700 leading-relaxed'>
                  We reserve the right to modify these terms at any time. Continued use of CelebrityPersona after changes constitutes acceptance of the modified terms. We recommend reviewing these terms periodically.
                </p>
              </div>

              <div className='bg-grey rounded-2xl p-6 mt-8'>
                <h3 className='text-xl font-bold mb-4'>Contact Information</h3>
                <p className='text-gray-700'>
                  For questions about these terms or to request permission for specific uses, please contact us through our social media channels or the contact information provided in the footer.
                </p>
              </div>

              <div className='text-center text-sm text-gray-500 mt-8'>
                Last Updated: December 2024
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default LicensePage
