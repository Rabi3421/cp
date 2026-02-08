import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Celebrity from '@/models/Celebrity'

// GET - Fetch single celebrity by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const celebrity = await Celebrity.findOne({
      slug: slug,
      status: 'published',
      isActive: true,
    })
      .lean()

    // Debug: log the fetched document keys and gallery images for troubleshooting
    console.debug('Fetched celebrity for slug=', slug, {
      id: celebrity?._id?.toString(),
      hasCoverImage: !!celebrity?.coverImage,
      coverImageValue: celebrity?.coverImage || '(empty)',
      hasGalleryImages: !!celebrity?.galleryImages,
      galleryImagesLength: celebrity?.galleryImages?.length || 0,
      galleryImagesValue: celebrity?.galleryImages || '(empty)',
    })

    if (!celebrity) {
      return NextResponse.json(
        { success: false, error: 'Celebrity not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await Celebrity.updateOne(
      { _id: celebrity._id },
      { $inc: { viewCount: 1 } }
    )

    return NextResponse.json({
      success: true,
      data: celebrity,
    })
  } catch (error: any) {
    console.error('Error fetching celebrity:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
