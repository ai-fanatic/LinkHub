import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${session?.user?.id}`;

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Page</h2>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm mb-2">Your public page URL:</p>
              <code className="block bg-background p-2 rounded">
                {pageUrl}
              </code>
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => router.push("/settings")}>
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/${session?.user?.id}`)}
            >
              View Page
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
