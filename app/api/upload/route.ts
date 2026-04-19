import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await new Promise((r) => setTimeout(r, 1500 + Math.random() * 1000));

  const formData = await req.formData().catch(() => null);
  const stemType = formData?.get("stemType")?.toString() ?? "vocals";

  const stems =
    stemType === "full"
      ? [
          { name: "Vocals", type: "vocal", url: "/samples/sample.mp3" },
          { name: "Drums", type: "drums", url: "/samples/sample.mp3" },
          { name: "Bass", type: "bass", url: "/samples/sample.mp3" },
          { name: "Other", type: "other", url: "/samples/sample.mp3" },
        ]
      : [
          { name: stemType.charAt(0).toUpperCase() + stemType.slice(1), type: "vocal", url: "/samples/sample.mp3" },
          { name: "Instrumental", type: "instrumental", url: "/samples/sample.mp3" },
        ];

  return NextResponse.json({ success: true, stems });
}
