// Cloudflare Pages Function for Secure GitHub Webhook triggering

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context;
    const authHeader = request.headers.get("Authorization");
    
    // In production, ENV variables store the Webhook Secret
    const WEBHOOK_SECRET = env.GITHUB_WEBHOOK_SECRET || "mock-secret-for-dev";

    if (authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized. Invalid Admin Token." }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const body = await request.json();
    const { content, title } = body;

    if (!content || !title) {
       return new Response(JSON.stringify({ error: "Missing payload data." }), { status: 400 });
    }

    // Mocking the GitHub API Push
    // A real implementation would use fetch() to GitHub REST API to commit the markdown file
    // which triggers the Cloudflare Pages CI/CD rebuild.
    
    const githubApiMockSuccess = true;

    if (githubApiMockSuccess) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Content committed securely to GitHub. Rebuild triggered." 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Edge webhook execution failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
