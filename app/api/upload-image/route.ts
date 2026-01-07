export async function POST(request: Request) {
    return Response.json({ message: "This route is deprecated. Client-side upload is now used." }, { status: 200 });
}
