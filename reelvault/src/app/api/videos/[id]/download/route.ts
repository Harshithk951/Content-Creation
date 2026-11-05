import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { generateDownloadFilename } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const supabase = await createServerSupabaseClient();
    
    // 1. Fetch video record
    const { data: video, error } = await supabase
      .from("videos")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !video) {
      // If it's the local sample ep01 video
      if (id === "ep-01-local-kokoro") {
        const redirectUrl = new URL("/sample-ep01.mp4", request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    const downloadFilename = generateDownloadFilename(
      video.episode_number,
      video.title,
      "mp4"
    );

    // 2. Generate signed download URL from Supabase Storage with download filename header
    const { data: signedData, error: signError } = await supabase.storage
      .from("reel-videos")
      .createSignedUrl(video.storage_path, 3600, {
        download: downloadFilename,
      });

    if (signError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: "Could not generate download URL" },
        { status: 500 }
      );
    }

    // Redirect user to the authenticated Supabase Storage download link
    return NextResponse.redirect(signedData.signedUrl);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
