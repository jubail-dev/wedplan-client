
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const multipleImages = formData.getAll("images");
    const singleImage = formData.get("image");

    const rawImages =
      multipleImages.length > 0
        ? multipleImages
        : singleImage
          ? [singleImage]
          : [];

    if (
      rawImages.length === 0 ||
      !rawImages.every((image): image is File => image instanceof File)
    ) {
      return NextResponse.json(
        { message: "At least one valid image is required." },
        { status: 400 },
      );
    }

    const images: File[] = rawImages;

    for (const image of images) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Only image files are allowed." },
          { status: 400 },
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "Each image must be less than 5MB." },
          { status: 400 },
        );
      }
    }

    const apiKey = process.env.IMGBB_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { message: "Image upload configuration is missing." },
        { status: 500 },
      );
    }

    const imageUrls: string[] = [];

    for (const image of images) {
      const uploadData = new FormData();
      uploadData.append("image", image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: uploadData,
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return NextResponse.json(
          { message: "Image upload failed." },
          { status: 502 },
        );
      }

      imageUrls.push(result.data.display_url);
    }

    return NextResponse.json({
      success: true,
      imageUrls,
      imageUrl: imageUrls[0],
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong during image upload." },
      { status: 500 },
    );
  }
}
